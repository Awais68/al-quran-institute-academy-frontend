/**
 * Page banner for the standalone marketing routes.
 *
 * Each route needs exactly one <h1>; the reused homepage section components
 * only carry <h2>, so this supplies it (and the keyword-bearing intro copy).
 */
export default function PageHero({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-blue-100 bg-gradient-to-b from-blue-50 to-white pt-24 sm:pt-28">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg">
          {description}
        </p>
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  );
}
