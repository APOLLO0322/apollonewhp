import { permanentRedirect } from "next/navigation";
import { getWork } from "@/lib/works";

/* 旧サイト（WordPress）の実績記事 /archive/<slug>/ の引き取り。

   スラッグが新旧で一致するものはその実績の詳細へ、変わっているものは
   一覧へ送る。対応表を手で書くと取り違えたときに別の案件へ飛ばすことに
   なるので、実データに存在するかどうかだけで判定する。

   next.config.ts の redirects は静的にしか書けず、実績は microCMS から
   実行時に取ってくるため、ここはページとして受ける。 */
export const revalidate = 60;

export default async function ArchiveRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await getWork(slug);

  permanentRedirect(work ? `/works/${work.slug}` : "/works");
}
