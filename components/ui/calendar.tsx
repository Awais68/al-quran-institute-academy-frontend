"use client";

import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// NOTE: these class keys are react-day-picker v9's. The file previously used
// the v8 names (head_row / head_cell / row / cell / day_selected ...), which v9
// silently ignores — that is why the weekday header and the day grid rendered
// unstyled and misaligned.
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "relative flex flex-col sm:flex-row gap-4",
        month: "w-full space-y-4",
        month_caption: "flex h-7 items-center justify-center px-8",
        caption_label: "text-sm font-medium",
        nav: "absolute inset-x-0 top-0 flex h-7 items-center justify-between px-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        dropdowns: "flex items-center gap-2",
        dropdown_root: "relative",
        dropdown:
          "absolute inset-0 h-full w-full cursor-pointer opacity-0",
        months_dropdown: "",
        years_dropdown: "",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "w-9 rounded-md text-[0.8rem] font-normal text-muted-foreground",
        week: "mt-2 flex w-full",
        day: "relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        range_end: "day-range-end",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        selected:
          "rounded-md bg-primary text-primary-foreground [&>button]:bg-transparent [&>button]:text-primary-foreground [&>button:hover]:bg-transparent [&>button:hover]:text-primary-foreground",
        today: "rounded-md bg-accent text-accent-foreground",
        outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        // v9 replaced IconLeft/IconRight with a single Chevron that also renders
        // the month/year dropdown carets, so every orientation must be handled.
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) => {
          const icons = {
            left: ChevronLeft,
            right: ChevronRight,
            up: ChevronUp,
            down: ChevronDown,
          } as const;
          const Icon = icons[orientation ?? "down"];
          return <Icon className={cn("h-4 w-4", chevronClassName)} {...chevronProps} />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
