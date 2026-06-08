export const REDIRECT_URI = window.location.origin + window.location.pathname;

function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function initiateSpotifyAuth(): Promise<void> {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  sessionStorage.setItem('spotify_code_verifier', codeVerifier);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: 'user-top-read',
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
  const codeVerifier = sessionStorage.getItem('spotify_code_verifier');

  if (!codeVerifier) throw new Error('No code verifier found');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) throw new Error('Token exchange failed');

  const data = await response.json();
  sessionStorage.removeItem('spotify_code_verifier');
  return data.access_token as string;
}

export interface SpotifyTrack {
  spotify_id: string;
  name: string;
  artist: string;
  album: string;
  album_art: string;
  preview_url: string | null;
  spotify_url: string;
  rank: number;
}

export async function fetchTopTracks(accessToken: string): Promise<SpotifyTrack[]> {
  const response = await fetch(
    'https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=medium_term',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!response.ok) throw new Error('Failed to fetch top tracks');

  const data = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.items as any[]).map((track, index) => ({
    spotify_id: track.id,
    name: track.name,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    artist: track.artists.map((a: any) => a.name).join(', '),
    album: track.album.name,
    album_art: track.album.images[0]?.url ?? '',
    preview_url: track.preview_url ?? null,
    spotify_url: track.external_urls.spotify,
    rank: index + 1,
  }));
}
