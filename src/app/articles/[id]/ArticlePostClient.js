"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, ExternalLink, PenLine, PhoneCall } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { ARTICLE_FALLBACK_COVER, toParagraphs } from "@/lib/articlesRepo";

export default function ArticlePostClient({ article, related }) {
  const { lang, isRTL } = useLanguage();
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const cover = article.coverImage || ARTICLE_FALLBACK_COVER;

  return (
    <main className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="image-hero relative min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={cover}
            alt={article.title}
            fill
            className="object-contain object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#070d1a]" />
        </div>
        <div className="relative z-10 container mx-auto px-6 max-w-3xl pt-32 pb-14">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-white/70 hover:text-[#D4A843] text-sm font-semibold mb-6 transition-colors"
          >
            <BackArrow size={15} />
            {lang === "ar" ? "الرجوع إلى المقالات" : "Back to Articles"}
          </Link>
          <div dir="rtl">
            {article.source && (
              <span className="inline-block bg-[#D4A843] text-[#1F2937] text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-4">
                {article.source}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-black leading-[1.15] text-white mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/60 text-sm font-semibold">
              {article.author && (
                <span className="inline-flex items-center gap-2">
                  <PenLine size={14} />
                  {article.author}
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={14} />
                {article.date}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Article Body ── */}
      <section className="py-16" style={{ backgroundColor: "var(--background)" }}>
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-8 md:p-12" dir="rtl">
            {toParagraphs(article.content).map((paragraph, i) => (
              <p key={i} className="text-[#1F2937] text-base md:text-lg leading-relaxed mb-6 last:mb-0">
                {paragraph}
              </p>
            ))}

            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 pt-6 border-t border-[rgba(0,0,0,0.08)] flex items-center gap-2 text-[#D4A843] hover:text-[#B8902F] text-sm font-bold transition-colors"
              >
                <ExternalLink size={14} />
                {article.source ? `اقرأ المقال في ${article.source}` : "رابط المقال الأصلي"}
              </a>
            )}
          </div>

          {/* CTA */}
          <div className="mt-10 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-8 flex flex-col sm:flex-row items-center justify-between gap-5 border-t-4 border-[#D4A843]">
            <p className="text-[#1F2937] font-bold text-lg text-center sm:text-start">
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

      {/* ── More Articles ── */}
      {related.length > 0 && (
        <section className="pb-20" style={{ backgroundColor: "var(--background)" }}>
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-2xl font-bold text-white mb-8">
              {lang === "ar" ? "مقالات أخرى" : "More Articles"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((a) => (
                <Link
                  key={a.id}
                  href={`/articles/${a.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-[rgba(0,0,0,0.06)] shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)] transition-all duration-300"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={a.coverImage || ARTICLE_FALLBACK_COVER}
                      alt={a.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5" dir="rtl">
                    <h3 className="text-sm font-bold text-[#1F2937] leading-snug group-hover:text-[#D4A843] transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-[#4B5563] text-xs font-semibold mt-2">{a.date}</p>
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
