"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Newspaper, PhoneCall } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { useDirectorPhoto } from "@/hooks/useDirectorPhoto";
import ArticleBody from "../ArticleBody";
import { ARTICLE_FALLBACK_COVER, formatArticleDate } from "@/lib/articlesRepo";

export default function ArticlePostClient({ article, related }) {
  const { lang, isRTL } = useLanguage();
  const directorPhoto = useDirectorPhoto();
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const date = formatArticleDate(article.date);

  return (
    <main className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      {/* ── Hero ── site background, article title only (the article's own
           photo is shown in full below, inside the article). ── */}
      <section className="image-hero no-mobile-vh relative min-h-[46vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={ARTICLE_FALLBACK_COVER}
            alt="MAN Engineering Consultancy"
            fill
            className="object-contain object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-[#070d1a]" />
        </div>
        <div className="relative z-10 container mx-auto px-6 max-w-3xl pt-32 pb-12">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-white/70 hover:text-[#D4A843] text-sm font-semibold mb-6 transition-colors"
          >
            <BackArrow size={15} />
            {lang === "ar" ? "الرجوع إلى المقالات" : "Back to Articles"}
          </Link>
          <div dir="rtl">
            {article.source && (
              <span className="inline-flex items-center gap-1.5 bg-[#D4A843] text-[#1F2937] text-[11px] font-bold tracking-wide px-3 py-1 rounded-full mb-5">
                <Newspaper size={12} />
                {article.source}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-black leading-[1.25] text-white mb-6" data-aos="fade-up">
              {article.title}
            </h1>
            <div className="flex items-center gap-3">
              <Image
                src={directorPhoto}
                width={44}
                height={44}
                alt={article.author || ""}
                className="w-11 h-11 rounded-full object-cover border-2 border-[#D4A843]/60"
              />
              <div className="text-sm">
                {article.author && <p className="text-white font-bold">{article.author}</p>}
                <p className="text-white/55 font-semibold inline-flex items-center gap-1.5">
                  <CalendarDays size={13} />
                  {date}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Article ── */}
      <section className="py-14" style={{ backgroundColor: "var(--background)" }}>
        <div className="container mx-auto px-6 max-w-3xl">
          <ArticleBody article={article} />

          {/* CTA */}
          <div className="mt-12 py-6 border-y border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5">
            <p className="text-white/80 font-semibold text-base text-center sm:text-start">
              {lang === "ar" ? "هل لديك مشروع تريد مناقشته معنا؟" : "Have a project you'd like to discuss?"}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#D4A843] hover:bg-[#E8C46A] text-[#1F2937] font-bold text-sm px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
            >
              <PhoneCall size={15} />
              {lang === "ar" ? "تواصل معنا" : "Contact Us"}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Previous Articles ── */}
      {related.length > 0 && (
        <section className="pb-20" style={{ backgroundColor: "var(--background)" }}>
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-lg font-bold text-white/80 mb-4">
              {lang === "ar" ? "مقالات سابقة" : "Previous Articles"}
            </h2>
            <div className="divide-y divide-white/10" dir="rtl">
              {related.map((a) => (
                <Link
                  key={a.id}
                  href={`/articles/${a.id}`}
                  className="group flex items-center gap-4 py-4"
                >
                  <Image
                    src={a.coverImage || ARTICLE_FALLBACK_COVER}
                    alt={a.title}
                    width={96}
                    height={64}
                    className="w-24 h-16 rounded-lg object-cover flex-shrink-0 opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm md:text-base font-bold text-white/85 leading-snug group-hover:text-[#D4A843] transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-white/40 text-xs font-semibold mt-1.5">{formatArticleDate(a.date)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
