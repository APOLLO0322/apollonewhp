# 株式会社APOLLO コーポレートサイト（2026 リニューアル）

`Downloads/design_handoff_apollo_site/` のデザイン正典（`design/*.dc.html`）と
実装指示書（`README.md` / `spec/apollo-site-design-spec-v1.md`）に基づく実装。

- Next.js 16（App Router）/ TypeScript / Tailwind CSS v4
- 制作実績は microCMS（API ID: `works`）。未設定時は `lib/works.ts` の静的データで動く
- お問合せは Resend 経由でメール送信
- デプロイ: Vercel

## 設計の芯

**TOPから動かさない。** 理念 / 会社概要 / 事業内容 / 制作実績 / お問合せは、
すべて TOP 上に右からスライドインするパネルで表示する。ページ遷移で没入感を切らない。

フルページ（`/works` `/works/[slug]` `/about` `/contact`）は SEO と深掘り用の従。
**事業内容の独立ページは作らない。**

他ページのヘッダーから事業内容パネルを開くため、`/?panel=service` の形式で
TOP のパネルを指定して開ける（`panel` は `vision|company|service|works|contact`）。

## 開発

```bash
npm install
cp .env.example .env.local   # 値を埋める
npm run dev
```

## 環境変数

`.env.example` を参照。すべて未設定でもサイトは動く（実績は静的データ、
お問合せは送信時にエラーメッセージを返す）。

| 変数 | 用途 |
|---|---|
| `RESEND_API_KEY` | お問合せメール送信。未設定だと 503 を返す |
| `CONTACT_FROM_EMAIL` / `CONTACT_TO_EMAIL` | 送信元 / 受信先 |
| `MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` | 制作実績。未設定なら静的データ |
| `NEXT_PUBLIC_SITE_URL` | OGP・canonical |

## ヒーロー動画の追加・差し替え

カメラ撮って出しは HEVC（H.265）で、Chrome系に再生できない環境がある。
必ず H.264 に変換してから `public/hero/` に置くこと。macOS標準のSwiftだけで変換できる。

```bash
swift tools/transcode.swift 入力.MP4 public/hero/hero-04.mp4 3500 1080
```

`3500` はkbps、`1080` は最大高さ。音声トラックは落とされる（無音でないと自動再生されない）。
poster は先頭フレームから作る。

```bash
qlmanage -t -s 1600 -o . public/hero/hero-04.mp4
sips -s format jpeg -Z 1280 --setProperty formatOptions 38 hero-04.mp4.png --out public/hero/hero-04.jpg
rm hero-04.mp4.png
```

最後に `components/home-experience.tsx` の `HERO_CLIPS` に1行足す。
1本あたり5MB前後を目安に。大きくなるならリポジトリではなく Vercel Blob に置く。

## microCMS スキーマ（`works`）

`title` `slug` `category`(MOVIE/SNS/BRANDING/PHOTO) `year` `thumbnail` `lead`
`overview` `videoUrl` `stills` `client` `scope` `featured`

一覧は `featured` を先頭、以降 `year` 降順。

## 素材の状況（未確定・要差し替え）

| # | 内容 | 現状 |
|---|---|---|
| 1 | ヒーロー動画 | 支給の3本を変換して `public/hero/hero-01〜03.mp4` に配置。読み込みごとに1本をランダム再生。増減は `components/home-experience.tsx` の `HERO_CLIPS` |
| 2 | ヒーロー静止画 | 動画に置き換えたため廃止。`hero-0N.jpg` は各動画の先頭フレームで、読み込み中の poster としてのみ使う |
| 3 | 時間帯での出し分け | 未実装。`HERO_CLIPS` を朝夕でフィルタすれば足せる |
| 4 | CLIENTS ロゴ | 実ロゴ・社名ともに未確定。`public/clients/01〜07.svg` に番号だけの枠を仮置き。`lib/site-content.ts` の `clients` で件数・社名・パスを差し替える（SVG推奨 / 高さ76px相当） |
| 5 | 実績の動画・詳細本文 | パッションリーダーズ以外は未入稿。詳細ページは OVERVIEW / STILLS が無い場合その枠を出さない |
| 6 | `PLACEHOLDER — 差し替え予定` の表示 | ヒーロー右上。実素材が入ったので `HERO_IS_PLACEHOLDER = false` にして非表示中。仮素材に戻すときは true |

## デザイン正典との差分（実装判断）

1. **`/works` のグリッド** — 正典 `Works.dc.html` は「フィルタ + CLIENTS + 均等3カラム」。
   ハンドオフ README §4 は「編集的グリッド、均等タイル並べは避ける」と書いており矛盾する。
   README 冒頭が `design/` の HTML を正典と定めているため、**正典側（3カラム）を採用**した。
   編集的グリッドに寄せる場合は `components/works-grid.tsx` を差し替える。
2. **フィルタチップ** — 正典では静止表示。実際に絞り込めるよう動作させた。
3. **`/contact` のご相談内容** — 正典 `Contact.dc.html` は4件（WEB制作を含む）だが、
   ハンドオフ README §3.4 と §4 は3件で統一と指示。**3件**に揃えた
   （`lib/contact-schema.ts`）。
4. **`/about` の会社概要テーブル** — 正典は設立「2023年3月」など粗い表記。
   ページ間で数字が食い違わないよう、README §6 の確定データ（`companyRows`）に統一した。
5. **`/about` の画像2枚を外した** — 正典が指定していた旧サイトの素材は
   「理念」「会社概要」の文字が焼き込まれたページ見出し画像で、素材として使えない。
   差し替えが出るまでは写植主体（ラベル左 / 本文右）で組んでいる。
6. **パネル右上の「↗ フルページ」を理念・会社概要にも出した** — 正典は制作実績のみ。
   TOPからしか辿れない情報を作らないため。パネルの内容は初期HTMLに載らないので、
   `/about` を消すと理念・会社概要・代表プロフィールが検索に一切載らなくなる。
7. **モバイル対応** — 正典はデスクトップのみ。ヘッダーナビは 768px 未満で `MENU` に集約し、
   パネルは全幅表示にした。パネル表示中はブラウザの戻る操作で閉じる。
8. **実績詳細の再生時間** — 正典の `02:14` はダミーのため、データが無いものは表示しない。

## ディレクトリ

```
app/
  page.tsx              TOP（HomeExperience を呼ぶだけ）
  works/                実績一覧・詳細
  about/  contact/      フルページ
  api/contact/route.ts  フォーム送信（Resend）
components/
  home-experience.tsx   ヒーロー + ヘッダー + パネル（サイトの中核）
  panels.tsx            各パネルの中身
  contact-form.tsx      パネル / フルページ共用フォーム
  site-header.tsx  site-footer.tsx  page-cta.tsx  works-grid.tsx
lib/
  site-content.ts       掲載コンテンツの正典（文言はここだけを直す）
  works.ts              microCMS + 静的フォールバック
  contact-schema.ts     フォームのバリデーション
```
