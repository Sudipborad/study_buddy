import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
   webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    // Required for pdf-parse
    config.module.rules.push({
      test: /pdf-parse\/lib\/pdf.js\/v1.10.100\/build\/pdf.js$/,
      loader: 'string-replace-loader',
      options: {
        search: 'fs.readFileSync(path.resolve( __dirname, "cmap_info.json"))',
        replace: 'require("./cmap_info.json")',
      },
    });

    return config;
  },
};

export default nextConfig;
