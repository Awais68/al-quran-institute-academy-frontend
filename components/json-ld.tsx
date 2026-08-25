/**
 * Renders a schema.org graph as <script type="application/ld+json">.
 *
 * Server Component — the JSON is serialised at render time so it is present in
 * the initial HTML, which is the only version Google's parser and the Rich
 * Results Test read.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  // `<` must be escaped: an unescaped "</script>" inside any string value would
  // close this tag early and break the page.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
