// @ts-nocheck
import type { NextConfig } from "next";

const IS_PROD = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "standalone",

  typescript: {
    ignoreBuildErrors: true,
  },

  async rewrites() {
    return [
      {
        source: "/:locale/placehold/:size",
        destination: `https://placehold.co/:size`,
      },
    ];
  },

  webpack(
    config,
    { isServer }
  ) {
    if (!isServer) {
      config.output.filename = (pathData: any) => {
        const name = String(pathData.chunk.name || pathData.chunk.id);
        return `static/chunks/${ name.replace(/@/g, '_') }-[chunkhash].js`;
      };
    }

    config.module
          .rules
          .find(({ oneOf }) => !!oneOf)
          .oneOf
          .filter(({ use }) => JSON.stringify(use)?.includes('css-loader'))
          .reduce((allLoaders, { use }) => allLoaders.concat(use), [])
          .forEach((loader) => {
            if (loader.options && loader.options.modules) {
              loader.options.modules.exportLocalsConvention = 'camelCase';
            }
          });

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
                'prefixIds',
              ],
            },
          },
        },
      ],
    })


    return config;
  },

  compiler: {
    removeConsole: IS_PROD ? { exclude: [ "error" ] } : false,
  }

};

export default nextConfig;
