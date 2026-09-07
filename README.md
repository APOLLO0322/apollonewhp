# 株式会社APOLLO コーポレートサイト（2026 リニューアル）

`Downloads/design_handoff_apollo_site/` のデザイン正典（`design/*.dc.html`）と
実装指示書（`README.md` / `spec/apollo-site-design-spec-v1.md`）に基づく実装。

- Next.js 16（App Router）/ TypeScript / Tailwind CSS v4
- 和文は **Shippori Mincho**（明朝・ベース字間 0.04em）、欧文ラベルと入力欄などのUIは **IBM Plex Sans JP**
  （`font-display` / `font-body` = 明朝、`font-label` = サンセリフ）
- 制作実績は microCMS（API ID: `works`）。未設定時は `lib/works.ts` の静的データで動く
- お問合せは Resend 経由でメール送信
- デプロイ: Vercel

## 設計の芯

**TOPから動かさない。** 理念 / 会社概要 / 事業内容 / 制作実績 / お問合せは、
すべて TOP 上に右からスライドインするパネルで表示する。ページ遷移で没入感を切らない。

フルページを持つのは **制作実績（`/works` `/works/[slug]`）と `/contact` だけ**。
**事業内容・理念・会社概要の独立ページは作らない**（代表の判断でTOPのパネルに一本化）。
そのぶん理念・会社概要・代表プロフィールは初期HTMLに載らず、検索には出ない。
必要になったらパネルの中身を常時DOMに描画する形に変えれば拾えるようになる。

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

`title` `slug` `category`(movie/sns/photo/event) `year` `thumbnail` `lead`
`overview` `videoUrl` `stills` `client` `scope` `featured` `tags` `summary`

一覧は `featured` を先頭、以降 `year` 降順。

### `summary`（カードの一行説明）

実績カードの3行目に出る短い説明。`lead`（詳細ページの導入文・メタ
ディスクリプション）とは別物で、カード用に短く書く。未入力の場合は
`lead` で代用され、それも無ければ行ごと出ない。カードでは2行で
クランプされるので 40〜60字が目安。

| fieldId | 表示名 | 種類 |
|---|---|---|
| `summary` | 一行説明 | テキストフィールド |

### 絞り込みの2軸

役割が重ならないよう、次のとおり切り分ける。

| フィールド | 意味 | 選択肢 |
|---|---|---|
| `category` | **何を作ったか**（成果物・1つ） | movie / sns / photo / event |
| `tags` | **何のために作ったか**（目的・複数） | ブランディング / プロモーション / 採用 / 広告 / ドキュメンタリー |
| `scope` | **どこを担当したか**（複数） | 企画 / 撮影 / 編集 / アカウント設計 / コンテンツ制作 / 運用 など |

`branding` `promotion` を category から外したのは、これらが目的であって成果物では
ないため（tags 側と重複していた）。`event` だけは category に残す。イベントの企画・運営は
成果物がイベントそのもので、映像やSNSと並ぶ「作ったもの」だから。そのぶん
`イベント` は tags から外して、重複しないようにしている。`スチール` を tags から外したのは
`photo` カテゴリと重複するため。`アカウント設計・戦略` `コンテンツ企画・制作` は
`scope` と役割が同じなので tags から外した。

一覧は `/works?category=SNS` `/works?tag=採用` の形で絞り込める。両方の併用も可。

### `tags`（事業内容パネルとの連動）

事業内容パネルのメニューをクリックすると `/works?tag=<タグ名>` に飛び、
そのタグが付いた実績だけを表示する。**選択肢の文字列は
`lib/site-content.ts` の `services[].menuItems` と完全に一致させること**
（1文字でも違うと拾えない）。現在の一覧は `serviceTags` で確認できる。

| fieldId | 表示名 | 種類 | 選択肢 |
|---|---|---|---|
| `tags` | タグ | 複数選択 | ブランディング / プロモーション / 採用 / 広告 / ドキュメンタリー |

未設定の実績はタグ絞り込みに出ない。フィールド自体が無くてもサイトは
落ちず、タグを押すと「まだ登録されていません」と出る。

## 素材の状況（未確定・要差し替え）

| # | 内容 | 現状 |
|---|---|---|
| 1 | ヒーロー動画 | 支給の3本を変換して `public/hero/hero-01〜03.mp4` に配置。読み込みごとに1本をランダム再生。増減は `components/home-experience.tsx` の `HERO_CLIPS` |
| 2 | ヒーロー静止画 | 動画に置き換えたため廃止。`hero-0N.jpg` は各動画の先頭フレームで、読み込み中の poster としてのみ使う |
| 3 | 時間帯での出し分け | 未実装。`HERO_CLIPS` を朝夕でフィルタすれば足せる |
| 3b | ロゴ | ヒーローは白抜き横組み `logo/whitecoltdlogo.png`（支給の 35562×11931 / 2.4MB を 1800px / 62KB に圧縮）。`apollo-logo-white.png` と黒版2種は未使用 |
| 4 | CLIENTS ロゴ | 実ロゴ・社名ともに未確定。`public/clients/01〜07.svg` に番号だけの枠を仮置き。TOPのヒーロー下部にカルーセルで流している。`lib/site-content.ts` の `clients` で件数・社名・パスを差し替える |

### クライアントロゴの差し替え

`public/clients/` に置いて `lib/site-content.ts` の `clients` を書き換える。
映像の上に重ねるため `brightness(0) invert(1)` で白一色に潰しているので、
**単色のロゴなら色は問わない**（自動で白抜きになる）。
グラデーションや多色のロゴは形が潰れるため、白抜き版を別途もらう。

- 形式: SVG推奨（なければ透過PNG・高さ200px以上）
- 表示: 高さ24px（モバイル）/ 28px（デスクトップ）、不透明度65%
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
4. **`/about` を廃止した** — 正典にはあったが、理念パネル・会社概要パネルと
   内容が重複するため代表の判断で削除。「↗ フルページ」も制作実績のみに戻した。
5. **モバイル対応** — 正典はデスクトップのみ。ヘッダーナビは 768px 未満で `MENU` に集約し、
   パネルは全幅表示にした。パネル表示中はブラウザの戻る操作で閉じる。
6. **実績詳細の再生時間** — 正典の `02:14` はダミーのため、データが無いものは表示しない。

## ディレクトリ

```
app/
  page.tsx              TOP（HomeExperience を呼ぶだけ）
  works/                実績一覧・詳細
  contact/              お問合せフルページ
  api/contact/route.ts  フォーム送信（Resend）
components/
  home-experience.tsx   ヒーロー + ヘッダー + パネル（サイトの中核）
  panels.tsx            各パネルの中身
  contact-form.tsx      パネル / フルページ共用フォーム
  site-header.tsx  site-footer.tsx  page-cta.tsx  works-grid.tsx
lib/
  nav.ts                メニューの順番・表記・遷移先（ここだけを直す）
  site-content.ts       掲載コンテンツの正典（文言はここだけを直す）
  works.ts              microCMS + 静的フォールバック
  contact-schema.ts     フォームのバリデーション
```
