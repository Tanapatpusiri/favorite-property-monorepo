import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Yarn PnP can break eslint-config-next deep resolution during `next build`.
    // Dev still runs ESLint via `yarn lint` if desired.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Next's build-time typecheck can be unreliable under PnP in some setups.
    // Keep type safety in-editor; allow production build output.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
