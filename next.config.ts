// @ts-nocheck
import type { NextConfig } from "next";
import { NextFederationPlugin } from "@module-federation/nextjs-mf";

const IS_PROD = process.env.NODE_ENV === "production";

const KEYSTORE_URL = IS_PROD 
  ? 'https://keystore.web5.fans'
  : 'http://localhost:3001';

const nextConfig: NextConfig = {
  /* config options here */
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
    { nextRuntime, isServer }
  ) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'bbs-fe',
        filename: 'static/chunks/remoteEntry.js',
        remotes: {
          keystore: `keystore@${KEYSTORE_URL}/assets/remoteEntry.js`,
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: false,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: false,
          },
        },
      })
    );

    if (!isServer) {
      config.output.filename = (pathData: any) => {
        // 替换 chunk 文件名中的 @ 为 _
        const name = String(pathData.chunk.name || pathData.chunk.id);
        return `static/chunks/${ name.replace(/@/g, '_') }-[chunkhash].js`;
      };
    }

    // 自动驼峰, .aa-bb => .aa-bb/.aaBb
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

    // Add rule for SVG files
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true, // 启用 SVG 优化
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false, // 保留 viewBox
                    },
                  },
                },
                'prefixIds', // 添加前缀防止 ID 冲突
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
