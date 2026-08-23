import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { company } from "@/lib/site-content";

export const runtime = "nodejs";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
// 認証済みドメインの送信元アドレス。未設定なら Resend の共有ドメインを使う。
const CONTACT_FROM = process.env.CONTACT_FROM ?? "APOLLO <onboarding@resend.dev>";
const CONTACT_TO = process.env.CONTACT_TO ?? company.mail;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません。" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "入力内容をご確認ください。";
    return NextResponse.json({ error: first }, { status: 400 });
  }

  const data = parsed.data;

  const lines: [string, string][] = [
    ["お名前", data.name],
    ["会社・団体名", data.organization],
    ["メールアドレス", data.email],
    ["電話番号", data.phone],
    ["ご相談内容", data.topics.join(" / ")],
    ["撮影希望時期", data.schedule],
    ["ご予算", data.budget],
    ["メッセージ", data.message],
  ];

  const text = lines
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}:\n${v}`)
    .join("\n\n");

  const html = lines
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<p style="margin:0 0 16px"><strong style="display:block;font-size:12px;color:#5F6768">${k}</strong>${escapeHtml(
          v,
        ).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");

  if (!RESEND_API_KEY) {
    // 未設定のまま本番に出さないよう、握りつぶさずログに残す
    console.error("[contact] RESEND_API_KEY が未設定のため送信できません:\n", text);
    return NextResponse.json(
      { error: `ただいま送信できません。お手数ですが ${company.mail} まで直接ご連絡ください。` },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: data.email,
      subject: `【サイトお問合せ】${data.name} 様（${data.topics.join(" / ")}）`,
      text,
      html,
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error("[contact] 送信に失敗しました:", err);
    return NextResponse.json(
      { error: `送信に失敗しました。お手数ですが ${company.mail} まで直接ご連絡ください。` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
