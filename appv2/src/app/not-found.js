"use client";
import Link from "next/link";
import { Flame, ArrowLeft } from "lucide-react";
import { useLanguage } from "./context/LanguageContext";
export default function Custom404() {
  const { t } = useLanguage();
  return (
    <section className="not-found">
      <Flame size={54} strokeWidth={1.4} />
      <span className="eyebrow">404</span>
      <h1>{t("notFoundTitle")}</h1>
      <p>{t("notFoundText")}</p>
      <Link href="/" className="primary-button">
        <ArrowLeft size={17} />
        {t("backHome")}
      </Link>
    </section>
  );
}
