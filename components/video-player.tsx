"use client";

/**
 * A self-hosted <video> wrapped in a YouTube-style shell.
 *
 * Three things it fixes over a bare <video controls>:
 *  1. Nothing is downloaded until the player scrolls near the viewport — the
 *     <source> is only attached once an IntersectionObserver fires, so the
 *     poster is the only network cost for a visitor who never scrolls here.
 *  2. Playback pauses automatically when the player scrolls out of view, so a
 *     video never keeps talking off-screen.
 *  3. Custom controls (scrub bar with buffered range, volume, speed,
 *     fullscreen, keyboard shortcuts) instead of the browser's default chrome.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  Captions,
  CaptionsOff,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type VideoPlayerProps = {
  src: string;
  poster: string;
  /** Used for the accessible label and the title bar shown on hover. */
  title: string;
  /** Optional WebVTT caption file, served from /public. */
  captionsSrc?: string;
  /**
   * Optional written transcript, rendered in a collapsible block underneath the
   * player. Text here is real page content, so search engines index it and
   * screen-reader users can read the video without playing it.
   */
  transcript?: { speaker?: string; text: string }[];
  /** Tailwind aspect-ratio class, e.g. "aspect-video" or "aspect-[9/16]". */
  aspectClassName?: string;
  className?: string;
};

const SPEEDS: number[] = [0.5, 0.75, 1, 1.25, 1.5, 2];

/** 75 -> "1:15", 3675 -> "1:01:15" */
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

export default function VideoPlayer({
  src,
  poster,
  title,
  captionsSrc,
  transcript,
  aspectClassName = "aspect-video",
  className,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trackRef = useRef<HTMLTrackElement>(null);
  // True once the user has pressed play at least once — an out-of-view pause
  // must not be mistaken for "the user never started it".
  const startedRef = useRef(false);

  // `shouldLoad` gates the <source>: no bytes are requested before this flips.
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isScrubbing, setIsScrubbing] = useState(false);
  // Captions default to on. `controls={false}` means the browser draws no CC
  // menu of its own, so without the button below a caption track would be
  // unreachable for anyone who turned it off.
  const [captionsOn, setCaptionsOn] = useState(true);

  /* ---------------------------------------------------------------- lazy load
     rootMargin gives the browser a head start: loading begins a little before
     the player is actually on screen, so play feels instant. */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* --------------------------------------------------- auto-pause off screen
     A separate observer with a low threshold: once less than ~35% of the
     player is visible the video pauses. It does NOT auto-resume — restarting
     audio the user scrolled away from would be worse than stopping it. */
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && startedRef.current) {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoad]);

  /* ------------------------------------------------------------ tab visibility */
  useEffect(() => {
    const onHidden = () => {
      if (document.hidden) videoRef.current?.pause();
    };
    document.addEventListener("visibilitychange", onHidden);
    return () => document.removeEventListener("visibilitychange", onHidden);
  }, []);

  /* ---------------------------------------------------------------- fullscreen */
  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      // Keep the bar up whenever the video is not actually running, otherwise
      // the user loses the play button.
      if (videoRef.current && !videoRef.current.paused) {
        setControlsVisible(false);
      }
    }, 2600);
  }, []);

  useEffect(
    () => () => {
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    },
    []
  );

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setShouldLoad(true);
    if (video.paused) {
      startedRef.current = true;
      void video.play().catch(() => {
        /* autoplay/gesture rejection — leave the poster up */
      });
    } else {
      video.pause();
    }
    showControls();
  }, [showControls]);

  const seekBy = useCallback((delta: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = Math.min(
      Math.max(video.currentTime + delta, 0),
      video.duration
    );
  }, []);

  const changeVolume = useCallback((next: number) => {
    const video = videoRef.current;
    const clamped = Math.min(Math.max(next, 0), 1);
    setVolume(clamped);
    setIsMuted(clamped === 0);
    if (video) {
      video.volume = clamped;
      video.muted = clamped === 0;
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    setIsMuted(next);
    // Un-muting at zero volume would stay silent and look broken.
    if (!next && video.volume === 0) changeVolume(0.6);
  }, [changeVolume]);

  /* The `default` attribute only sets the initial mode; React re-renders do not
     touch it. Drive `mode` explicitly so the CC button actually does something. */
  useEffect(() => {
    const track = trackRef.current?.track;
    if (!track) return;
    track.mode = captionsOn ? "showing" : "hidden";
  }, [captionsOn, captionsSrc, shouldLoad]);

  const toggleCaptions = useCallback(() => setCaptionsOn((on) => !on), []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement === el) {
      void document.exitFullscreen();
    } else {
      void el.requestFullscreen?.().catch(() => {});
    }
  }, []);

  const cycleSpeed = useCallback(() => {
    const video = videoRef.current;
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    if (video) video.playbackRate = next;
  }, [speed]);

  /* ------------------------------------------------------------------ scrubbing */
  const seekToClientX = useCallback(
    (clientX: number, track: HTMLElement) => {
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration) || video.duration === 0)
        return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      video.currentTime = ratio * video.duration;
      setCurrentTime(video.currentTime);
    },
    []
  );

  const onTrackPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = event.currentTarget;
    track.setPointerCapture(event.pointerId);
    setIsScrubbing(true);
    seekToClientX(event.clientX, track);
  };

  const onTrackPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isScrubbing) return;
    seekToClientX(event.clientX, event.currentTarget);
  };

  const endScrub = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isScrubbing) return;
    setIsScrubbing(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  /* ------------------------------------------------------ keyboard shortcuts */
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case " ":
      case "k":
        event.preventDefault();
        togglePlay();
        break;
      case "ArrowRight":
        event.preventDefault();
        seekBy(5);
        break;
      case "ArrowLeft":
        event.preventDefault();
        seekBy(-5);
        break;
      case "ArrowUp":
        event.preventDefault();
        changeVolume(volume + 0.1);
        break;
      case "ArrowDown":
        event.preventDefault();
        changeVolume(volume - 0.1);
        break;
      case "m":
        toggleMute();
        break;
      case "f":
        toggleFullscreen();
        break;
      default:
        return;
    }
    showControls();
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <>
    <div
      ref={containerRef}
      role="group"
      aria-label={title}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerMove={showControls}
      onMouseLeave={() => isPlaying && setControlsVisible(false)}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl bg-black shadow-2xl outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-accent-400",
        aspectClassName,
        className
      )}
    >
      <video
        ref={videoRef}
        poster={poster}
        // No bytes until the observer says the player is close to the viewport.
        preload={shouldLoad ? "metadata" : "none"}
        playsInline
        // The native chrome is replaced by the bar below.
        controls={false}
        className="h-full w-full object-contain"
        onClick={togglePlay}
        onPlay={() => {
          startedRef.current = true;
          setIsPlaying(true);
          showControls();
        }}
        onPause={() => {
          setIsPlaying(false);
          setControlsVisible(true);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setControlsVisible(true);
        }}
        onLoadedMetadata={(event) =>
          setDuration(event.currentTarget.duration || 0)
        }
        onTimeUpdate={(event) => {
          if (!isScrubbing) setCurrentTime(event.currentTarget.currentTime);
        }}
        onProgress={(event) => {
          const video = event.currentTarget;
          if (video.buffered.length > 0) {
            setBuffered(video.buffered.end(video.buffered.length - 1));
          }
        }}
        onVolumeChange={(event) => {
          setVolume(event.currentTarget.volume);
          setIsMuted(event.currentTarget.muted);
        }}
      >
        {shouldLoad ? <source src={src} type="video/mp4" /> : null}
        {captionsSrc ? (
          <track
            ref={trackRef}
            src={captionsSrc}
            kind="captions"
            srcLang="en"
            label="English"
            default
          />
        ) : null}
        Your browser does not support the video tag.
      </video>

      {/* Centre play button — the only affordance before first play. */}
      {!isPlaying ? (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={`Play ${title}`}
          className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors hover:bg-black/35"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-600/90 shadow-lg transition-transform duration-200 hover:scale-110 sm:h-20 sm:w-20">
            <Play className="ml-1 h-7 w-7 text-white sm:h-9 sm:w-9" fill="currentColor" />
          </span>
        </button>
      ) : null}

      {/* Control bar */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-2 pb-2 pt-8 transition-opacity duration-300 sm:px-3 sm:pb-3",
          controlsVisible || !isPlaying
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        {/* Scrub bar */}
        <div
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(currentTime)}
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          tabIndex={0}
          onPointerDown={onTrackPointerDown}
          onPointerMove={onTrackPointerMove}
          onPointerUp={endScrub}
          onPointerCancel={endScrub}
          className="group/track relative h-4 w-full cursor-pointer touch-none select-none"
        >
          <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-white/25">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white/40"
              style={{ width: `${bufferedPercent}%` }}
            />
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-accent-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500 opacity-0 transition-opacity group-hover/track:opacity-100"
            style={{ left: `${progress}%`, opacity: isScrubbing ? 1 : undefined }}
          />
        </div>

        <div className="mt-1 flex items-center gap-1 text-white sm:gap-2">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="rounded p-1.5 hover:bg-white/15"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" />
            ) : (
              <Play className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" />
            )}
          </button>

          <button
            type="button"
            onClick={() => seekBy(-10)}
            aria-label="Rewind 10 seconds"
            className="hidden rounded p-1.5 hover:bg-white/15 sm:block"
          >
            <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            type="button"
            onClick={() => seekBy(10)}
            aria-label="Forward 10 seconds"
            className="hidden rounded p-1.5 hover:bg-white/15 sm:block"
          >
            <RotateCw className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Volume: the slider expands on hover the way YouTube's does. */}
          <div className="group/vol flex items-center">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
              className="rounded p-1.5 hover:bg-white/15"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(event) => changeVolume(Number(event.target.value))}
              aria-label="Volume"
              className="h-1 w-0 cursor-pointer accent-accent-500 opacity-0 transition-all duration-200 group-hover/vol:w-16 group-hover/vol:opacity-100 focus:w-16 focus:opacity-100 sm:group-hover/vol:w-20"
            />
          </div>

          <span className="ml-1 font-mono text-[10px] tabular-nums sm:text-xs">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <span className="ml-auto flex items-center gap-1">
            {captionsSrc ? (
              <button
                type="button"
                onClick={toggleCaptions}
                aria-pressed={captionsOn}
                aria-label={captionsOn ? "Turn captions off" : "Turn captions on"}
                className="rounded p-1.5 hover:bg-white/15"
              >
                {captionsOn ? (
                  <Captions className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <CaptionsOff className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            ) : null}
            <button
              type="button"
              onClick={cycleSpeed}
              aria-label={`Playback speed ${speed}x`}
              className="rounded px-2 py-1 text-[10px] font-semibold hover:bg-white/15 sm:text-xs"
            >
              {speed}x
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              className="rounded p-1.5 hover:bg-white/15"
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Maximize className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </span>
        </div>
      </div>
    </div>

    {transcript && transcript.length > 0 ? (
      <details className="mt-3 rounded-lg border border-primary-100 bg-white/70 px-4 py-3 text-left">
        <summary className="cursor-pointer select-none text-sm font-semibold text-primary-800">
          Transcript — {title}
        </summary>
        <div className="mt-3 space-y-2">
          {transcript.map((line, index) => (
            <p key={index} className="text-sm leading-relaxed text-gray-700">
              {line.speaker ? (
                <span className="font-semibold text-primary-700">
                  {line.speaker}:{" "}
                </span>
              ) : null}
              {line.text}
            </p>
          ))}
        </div>
      </details>
    ) : null}
    </>
  );
}
