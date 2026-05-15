// Tiny shared helper for schema.org JSON-LD blocks. Renders a single
// <script type="application/ld+json"> tag with the JSON payload inlined
// via dangerouslySetInnerHTML - the standard React pattern recommended
// by Google's own Search Central docs for structured data. We keep it
// in a server component (no 'use client') so the JSON ships in the
// initial static HTML, which is what Googlebot, Bingbot, and AI
// crawlers actually parse.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify is safe here: schema objects never contain
      // user input, so there's no XSS surface. The </script> escape
      // hatch (.replace(/</g, '\\u003c')) is overkill for our static
      // const inputs but included as defensive hygiene.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
