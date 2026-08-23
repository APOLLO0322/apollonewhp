"use client";

import { useState } from "react";
import { topicOptions, type TopicKey } from "@/lib/contact-schema";
import { company } from "@/lib/site-content";

type Variant = "panel" | "page";

type Status = "idle" | "sending" | "error";

const initial = {
  name: "",
  organization: "",
  email: "",
  phone: "",
  schedule: "",
  budget: "",
  message: "",
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] tracking-[0.06em] text-mist">
        {label}
        {required && <span className="text-blue"> *</span>}
      </span>
      {children}
    </label>
  );
}

export function ContactSent({ variant }: { variant: Variant }) {
  const centred = variant === "page";
  return (
    <div
      className={`flex min-h-[320px] flex-col justify-center ${
        centred ? "items-center text-center" : "items-start"
      }`}
    >
      <div className="font-inter text-[11px] tracking-[0.16em] text-green">
        SENT — ありがとうございます
      </div>
      <div className="mt-[18px] font-serif-jp text-2xl leading-[1.7] font-medium">
        お問合せを受け付けました。
      </div>
      <div className="mt-4 max-w-[420px] text-sm leading-[2] text-mist">
        2〜3営業日以内に、担当者よりご連絡いたします。
      </div>
    </div>
  );
}

export default function ContactForm({ variant = "panel" }: { variant?: Variant }) {
  const [values, setValues] = useState(initial);
  const [topics, setTopics] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPage = variant === "page";

  function set(key: keyof typeof initial) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));
  }

  function toggleTopic(key: TopicKey) {
    setTopics((t) => ({ ...t, [key]: !t[key] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const selected = topicOptions.filter((t) => topics[t.key]).map((t) => t.label);
    if (selected.length === 0) {
      setError("ご相談内容を1つ以上選択してください。");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, topics: selected }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "送信に失敗しました。");
      setSent(true);
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : `送信に失敗しました。お手数ですが ${company.mail} まで直接ご連絡ください。`,
      );
      return;
    }
    setStatus("idle");
  }

  if (sent) return <ContactSent variant={variant} />;

  const gridMax = isPage ? "" : "max-w-[520px]";

  return (
    <form onSubmit={handleSubmit} noValidate>
      {isPage && (
        <div className="mb-10 font-inter text-[11px] tracking-[0.1em] text-mist">
          下記フォームよりお問合せください。<span className="text-blue">*</span> は必須項目です。
        </div>
      )}

      <div className={`grid gap-6 sm:grid-cols-2 sm:gap-x-7 ${gridMax}`}>
        <Field label="お名前" required>
          <input
            className="ap-field"
            type="text"
            name="name"
            autoComplete="name"
            placeholder="山田 太郎"
            required
            value={values.name}
            onChange={set("name")}
          />
        </Field>
        <Field label="会社・団体名">
          <input
            className="ap-field"
            type="text"
            name="organization"
            autoComplete="organization"
            placeholder="株式会社〇〇"
            value={values.organization}
            onChange={set("organization")}
          />
        </Field>
        <Field label="メールアドレス" required>
          <input
            className="ap-field"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={values.email}
            onChange={set("email")}
          />
        </Field>
        <Field label="電話番号">
          <input
            className="ap-field"
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="090-0000-0000"
            value={values.phone}
            onChange={set("phone")}
          />
        </Field>
      </div>

      <fieldset className={`mt-8 border-none p-0 ${gridMax}`}>
        <legend className="mb-2.5 p-0 text-[11px] tracking-[0.06em] text-mist">
          ご相談内容 <span className="text-blue">*</span>
        </legend>
        <div className="flex flex-wrap gap-2.5">
          {topicOptions.map((t) => (
            <button
              key={t.key}
              type="button"
              className="ap-chip"
              aria-pressed={!!topics[t.key]}
              onClick={() => toggleTopic(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className={`mt-8 grid gap-6 sm:grid-cols-2 sm:gap-x-7 ${gridMax}`}>
        <Field label="撮影希望時期">
          <input
            className="ap-field"
            type="text"
            name="schedule"
            placeholder="例：2026年10月ごろ"
            value={values.schedule}
            onChange={set("schedule")}
          />
        </Field>
        <Field label="ご予算">
          <input
            className="ap-field"
            type="text"
            name="budget"
            placeholder="例：30万円前後 / 未定"
            value={values.budget}
            onChange={set("budget")}
          />
        </Field>
      </div>

      <div className={`mt-8 ${gridMax}`}>
        <Field label="メッセージ">
          <textarea
            className="ap-field"
            name="message"
            rows={4}
            placeholder="実現したいことや、いまお困りのことをお聞かせください。"
            value={values.message}
            onChange={set("message")}
          />
        </Field>
      </div>

      {error && (
        <p role="alert" className="mt-6 max-w-[520px] text-[13px] leading-[1.9] text-blue">
          {error}
        </p>
      )}

      <div className="mt-9 flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={status === "sending"}
          className={`font-inter text-[13px] tracking-[0.1em] disabled:opacity-50 ${
            isPage
              ? "bg-blue px-[52px] py-[18px] tracking-[0.14em] text-pale"
              : "bg-ink px-10 py-4 text-pale"
          }`}
        >
          {status === "sending" ? "送信中…" : "送信する →"}
        </button>
        <p className="text-[11px] leading-[1.8] text-mist">
          送信をもって
          <a
            href={company.privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-mist"
          >
            個人情報保護方針
          </a>
          に同意したものとみなします。
        </p>
      </div>
    </form>
  );
}
