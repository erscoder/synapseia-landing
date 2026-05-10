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
// Bump NODE_UI_VERSION whenever the node-ui release files change name
// (Tauri embeds the semver in the filename). The GitHub redirect
// `releases/latest/download/<exact-filename>` only resolves when the
// filename matches a real asset on the latest published tag.

const NODE_UI_VERSION = '0.8.6';
const REPO = 'erscoder/synapseia-node-ui';

const FILES = {
  'mac-arm64': `Synapseia.Node_${NODE_UI_VERSION}_aarch64.dmg`,
  'mac-x64':   `Synapseia.Node_${NODE_UI_VERSION}_x64.dmg`,
  'windows':   `Synapseia.Node_${NODE_UI_VERSION}_x64_en-US.msi`,
  'linux':     `Synapseia.Node_${NODE_UI_VERSION}_amd64.AppImage`,
};

export async function onRequestGet({ params }) {
  const platform = String(params.platform || '').toLowerCase();
  const file = FILES[platform];

  if (!file) {
    return new Response(
      `Unknown platform "${platform}". Supported: ${Object.keys(FILES).join(', ')}`,
      { status: 404, headers: { 'content-type': 'text/plain' } },
    );
  }

  const upstream = await fetch(
    `https://github.com/${REPO}/releases/latest/download/${file}`,
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
