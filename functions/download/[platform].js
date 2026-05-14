// Cloudflare Pages Function: stream the latest node-ui release binary
// for the requested platform from this origin (synapseia.network) so
// the URL bar stays on synapseia.network during download. Worker
// streams the upstream GitHub release body straight to the client —
// the binary never lands in Worker RAM (ReadableStream pass-through).
//
// Routes:
//   /download/mac-arm64   → Apple Silicon DMG
//   /download/mac-x64     → Intel DMG
//   /download/windows     → Windows MSI
//   /download/linux       → Linux AppImage
//
// Anything else → 404 with the supported list.
//
// Per-platform release tag + filename. The GitHub URL
// `releases/download/<tag>/<exact-filename>` is used (NOT
// `releases/latest/download/...`) so each platform can independently
// point at the most recent release that successfully shipped that
// platform's asset. When a CI build job fails for a single platform,
// the other platforms still upgrade and the failing platform stays
// pinned at its last-good release.

const REPO = 'erscoder/synapseia-node-ui';

const PLATFORM_RELEASES = {
  'mac-arm64': { tag: 'node-ui-v0.8.42', file: 'Synapseia.Node_0.8.42_aarch64.dmg' },
  'mac-x64':   { tag: 'node-ui-v0.8.42', file: 'Synapseia.Node_0.8.42_x64.dmg' },
  'windows':   { tag: 'node-ui-v0.8.42', file: 'Synapseia.Node_0.8.42_x64_en-US.msi' },
  'linux':     { tag: 'node-ui-v0.8.42', file: 'Synapseia.Node_0.8.42_amd64.AppImage' },
};

export async function onRequestGet({ params }) {
  const platform = String(params.platform || '').toLowerCase();
  const release = PLATFORM_RELEASES[platform];

  if (!release) {
    return new Response(
      `Unknown platform "${platform}". Supported: ${Object.keys(PLATFORM_RELEASES).join(', ')}`,
      { status: 404, headers: { 'content-type': 'text/plain' } },
    );
  }

  const { tag, file } = release;
  const upstream = await fetch(
    `https://github.com/${REPO}/releases/download/${tag}/${file}`,
    { redirect: 'follow' },
  );

  if (!upstream.ok) {
    return new Response(
      `Upstream returned ${upstream.status} for ${file}.`,
      { status: 502, headers: { 'content-type': 'text/plain' } },
    );
  }

  // Pass through the body as a stream — no buffering. Override the
  // headers so the browser saves with the original filename and the
  // edge caches the bytes for an hour (the release files are
  // immutable per tag, so cache misses only bite once per node-ui
  // version per region).
  return new Response(upstream.body, {
    status: 200,
    headers: {
      'content-type': upstream.headers.get('content-type') || 'application/octet-stream',
      'content-length': upstream.headers.get('content-length') ?? '',
      'content-disposition': `attachment; filename="${file}"`,
      'cache-control': 'public, max-age=3600, immutable',
      'x-served-by': 'synapseia-landing-functions',
    },
  });
}

// Block other methods explicitly so probes get a clean 405.
export function onRequest({ request }) {
  return new Response(`Method ${request.method} not allowed`, {
    status: 405,
    headers: { allow: 'GET, HEAD' },
  });
}
