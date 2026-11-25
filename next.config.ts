import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve Firebase's sign-in handler from our own domain. Mobile browsers
  // (Safari, and Chrome with storage partitioning) block the cross-site
  // storage that the default firebaseapp.com handler relies on, which breaks
  // Google sign-in there. See lib/firebase.ts (authDomain).
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: "https://values-auction-ed09c.firebaseapp.com/__/auth/:path*",
      },
      {
        source: "/__/firebase/:path*",
        destination: "https://values-auction-ed09c.firebaseapp.com/__/firebase/:path*",
      },
    ];
  },
};

export default nextConfig;
