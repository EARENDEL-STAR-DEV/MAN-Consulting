"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Loader2, Newspaper, PenLine } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { ARTICLE_FALLBACK_COVER, formatArticleDate, subscribePublishedArticles, toParagraphs } from "@/lib/articlesRepo";

export default function ArticlesPageClient() {
  const { lang, isRTL } = useLanguage();
  const [articles, setArticles] = useState(null);
  const [latest, ...archive] = articles || [];

  useEffect(() => subscribePublishedArticles(setArticles), []);

  return (
    <main className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="image-hero relative min-h-[55vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={ARTICLE_FALLBACK_COVER}
            alt="Eng. Marwan Ahmed Nazer — Articles"
            fill
            className="object-contain object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-[#070d1a]/97" />
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl pt-32 pb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#D4A843]/40 bg-[#D4A843]/10 text-[#D4A843] text-xs font-bold uppercase tracking-[3px] mb-8" data-aos="fade-down">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843] animate-pulse" />
            {lang === "ar" ? "المقالات" : "Articles"}
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-[1.1] mb-6 text-white" data-aos="fade-up" data-aos-delay="100">
            {lang === "ar" ? "مقالات م. مروان أحمد ناظر" : "Articles by Eng. Marwan Ahmed Nazer"}
          </h1>
          <p className="text-white/65 text-lg leading-relaxed max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            {lang === "ar"
              ? "مقالات الرأي التي يكتبها المهندس مروان أحمد ناظر، مؤسس شركة MAN للاستشارات الهندسية، في الصحف السعودية."
              : "Opinion columns written by Eng. Marwan Ahmed Nazer, founder of MAN Engineering Consultancy, in Saudi newspapers."}
          </p>
        </div>
      </section>

      {/* ── Articles Grid ── */}
      <section className="py-20" style={{ backgroundColor: "var(--background)" }}>
        <div className="container mx-auto px-6 max-w-6xl">
          {articles === null ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={26} className="animate-spin text-[#D4A843]/60" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 text-white/50">
              <PenLine size={30} className="mx-auto mb-3 text-[#D4A843]/50" />
              {lang === "ar" ? "لا توجد مقالات منشورة حالياً." : "No articles published yet."}
            </div>
          ) : (
            <>
              {/* Latest article — featured */}
              <Link
                href={`/articles/${latest.id}`}
                className="group grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl overflow-hidden border border-[rgba(0,0,0,0.06)] shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)] transition-all duration-300"
                dir="rtl"
                data-aos="fade-up"
              >
                <div className="relative w-full aspect-[16/10] lg:aspect-auto lg:min-h-[380px] overflow-hidden">
                  <Image
                    src={latest.coverImage || ARTICLE_FALLBACK_COVER}
                    alt={latest.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-4 start-4 inline-flex items-center gap-1.5 bg-[#D4A843] text-[#1F2937] text-[11px] font-bold tracking-wide px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1F2937] animate-pulse" />
                    أحدث مقال
                  </span>
                </div>
                <div className="p-7 md:p-10 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#4B5563] text-xs font-semibold mb-4">
                    {latest.source && (
                      <span className="inline-flex items-center gap-1.5 text-[#B8902F]">
                        <Newspaper size={13} />
                        {latest.source}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={13} />
                      {formatArticleDate(latest.date)}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#1F2937] leading-[1.35] mb-4 group-hover:text-[#B8902F] transition-colors">
                    {latest.title}
                  </h2>
                  <p className="text-[#4B5563] text-base leading-[1.9] mb-6 line-clamp-4">
                    {latest.excerpt || toParagraphs(latest.content)[0]}
                  </p>
                  <div className="flex items-center justify-between gap-4 pt-5 border-t border-[rgba(0,0,0,0.08)]">
                    {latest.author && <span className="text-[#1F2937] text-sm font-bold">{latest.author}</span>}
                    <span className="inline-flex items-center gap-1.5 bg-[#D4A843] group-hover:bg-[#E8C46A] text-[#1F2937] text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
                      اقرأ المقال
                      <ArrowLeft size={14} />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Archive — older articles, newest first */}
              {archive.length > 0 && (
                <div className="mt-16">
                  <h2 className="text-2xl font-bold text-white mb-8">
                    {lang === "ar" ? "أرشيف المقالات" : "Articles Archive"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {archive.map((article) => (
                      <Link
                        key={article.id}
                        href={`/articles/${article.id}`}
                        className="group bg-white rounded-2xl overflow-hidden border border-[rgba(0,0,0,0.06)] shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)] transition-all duration-300 flex flex-col"
                      >
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={article.coverImage || ARTICLE_FALLBACK_COVER}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6 flex flex-col flex-1" dir="rtl">
                          <div className="flex items-center gap-2 text-[#4B5563] text-xs font-semibold mb-3">
                            <CalendarDays size={13} />
                            {formatArticleDate(article.date)}
                            {article.source && <span>· {article.source}</span>}
                          </div>
                          <h3 className="text-lg font-bold text-[#1F2937] leading-snug mb-3 group-hover:text-[#D4A843] transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-[#4B5563] text-sm leading-relaxed mb-5 flex-1 line-clamp-3">
                            {article.excerpt || toParagraphs(article.content)[0]}
                          </p>
                          <span className="inline-flex items-center gap-1.5 text-[#D4A843] text-sm font-bold">
                            اقرأ المقال
                            <ArrowLeft size={14} />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
