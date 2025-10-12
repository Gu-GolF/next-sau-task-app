import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[

      {
        protocol: 'https',
        hostname:"upaaclchgcsnkwuueclw.supabase.co",
        port: '',
        pathname: '/storage/v1/object/public/**',
        search: '',
      }
    ],
  },
};

export default nextConfig;
