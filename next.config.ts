import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // google-ads-api is a Node/gRPC library used only from Server Components via
  // a lazy import (src/lib/ads/index.ts). Opt it out of Turbopack's server
  // bundling so it loads via native require instead of being bundled — gRPC
  // libs with protobuf loading are a classic bundling failure mode.
  serverExternalPackages: ["google-ads-api"],
};

export default nextConfig;
