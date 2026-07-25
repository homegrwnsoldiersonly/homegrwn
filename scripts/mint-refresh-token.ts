/**
 * One-time helper: mint a Google Ads refresh token via the OAuth consent flow.
 * See docs/google-ads-credentials.md, step 4.
 *
 *   GOOGLE_ADS_CLIENT_ID=... GOOGLE_ADS_CLIENT_SECRET=... \
 *     npx tsx scripts/mint-refresh-token.ts
 *
 * Starts a localhost listener, prints the consent URL for a human to open,
 * captures the OAuth callback, exchanges the code, and prints the refresh
 * token to stdout. Nothing is stored or transmitted anywhere else.
 */

import http from "node:http";
import { URL, URLSearchParams } from "node:url";

const PORT = 9004;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const SCOPE = "https://www.googleapis.com/auth/adwords";

const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error(
    "Set GOOGLE_ADS_CLIENT_ID and GOOGLE_ADS_CLIENT_SECRET in the environment first.",
  );
  process.exit(1);
}

const consentUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline", // required to receive a refresh token
    prompt: "consent", // force a fresh refresh token even if previously granted
  }).toString();

async function exchangeCode(code: string): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId!,
      client_secret: clientSecret!,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });
  const json = (await res.json()) as {
    refresh_token?: string;
    error?: string;
    error_description?: string;
  };
  if (!res.ok || !json.refresh_token) {
    throw new Error(
      `Token exchange failed: ${json.error ?? res.status} ${json.error_description ?? ""}`,
    );
  }
  return json.refresh_token;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", REDIRECT_URI);
  if (url.pathname !== "/oauth2callback") {
    res.writeHead(404).end();
    return;
  }
  const code = url.searchParams.get("code");
  const err = url.searchParams.get("error");
  if (err || !code) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end(`OAuth error: ${err ?? "missing code"}. You can close this tab.`);
    console.error(`\nOAuth error: ${err ?? "missing code"}`);
    server.close();
    process.exit(1);
  }
  try {
    const refreshToken = await exchangeCode(code);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Success — refresh token printed in the terminal. Close this tab.");
    console.log("\nGOOGLE_ADS_REFRESH_TOKEN:\n");
    console.log(refreshToken);
    console.log(
      "\nPut this in .env.local (never commit it), then verify with:\n" +
        "  npx tsx scripts/audit.ts live legal-personal-injury\n",
    );
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Token exchange failed — see terminal.");
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

server.listen(PORT, () => {
  console.log("1. Open this URL in a browser (as the MCC-owning Google account):\n");
  console.log(consentUrl);
  console.log(`\n2. Approve access. Waiting for the callback on ${REDIRECT_URI} ...`);
});
