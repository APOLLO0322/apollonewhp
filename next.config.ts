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

  /* 旧サイト（WordPress）のURLの引き取り。

     本ドメインを新サイトに向けると、検索結果や名刺・SNSに残っている
     旧URLが全て404になる。固定ページはここで、実績記事
     （/archive/<slug>/）は app/archive/[slug] で受ける。

     恒久リダイレクト（301）なので、検索エンジンの評価も移る。 */
  async redirects() {
    return [
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      // 会社紹介・代表メッセージ・事業内容は、いずれもTOPのパネルに集約した
      { source: "/aboutus", destination: "/", permanent: true },
      { source: "/message", destination: "/", permanent: true },
      // 事業内容は APPROACH パネルに集約した
      { source: "/service", destination: "/?panel=approach", permanent: true },
      { source: "/news", destination: "/works", permanent: true },
    ];
  },
};

export default nextConfig;
