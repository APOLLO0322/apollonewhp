import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 現行サイトの実績画像（microCMS 移行までの仮素材）
      { protocol: "https", hostname: "apollone.jp" },
      // microCMS の画像配信
      { protocol: "https", hostname: "images.microcms-assets.io" },
    ],
  },
};

export default nextConfig;
