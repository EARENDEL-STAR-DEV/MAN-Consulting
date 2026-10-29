"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Loader2, Newspaper, PenLine } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ArticleBody from "./ArticleBody";
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
      <section className="image-hero no-mobile-vh relative min-h-[46vh] flex items-center justify-center overflow-hidden">
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

      {/* ── Today's article + archive ── */}
      <section className="py-14" style={{ backgroundColor: "var(--background)" }}>
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
              {/* Latest article — shown in full (one article is published per day) */}
              <div className="max-w-3xl mx-auto">
                <header className="mb-10" dir="rtl">
                  <span className="inline-flex items-center gap-2 text-[#D4A843] text-xs font-bold tracking-wide mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843] animate-pulse" />
                    أحدث مقال
                  </span>
                  <Link href={`/articles/${latest.id}`}>
                    <h2 className="text-3xl md:text-4xl font-black text-white leading-[1.35] mb-5 hover:text-[#D4A843] transition-colors">
                      {latest.title}
                    </h2>
                  </Link>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/50 text-sm font-semibold">
                    {latest.author && <span className="text-white/80 font-bold">{latest.author}</span>}
                    {latest.source && (
                      <span className="inline-flex items-center gap-1.5">
                        <Newspaper size={14} />
                        {latest.source}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={14} />
                      {formatArticleDate(latest.date)}
                    </span>
                  </div>
                </header>
                <ArticleBody article={latest} />
              </div>

              {/* Archive — older articles, newest first */}
              {archive.length > 0 && (
                <div className="mt-16 pt-10 border-t border-white/10 max-w-3xl mx-auto">
                  <h2 className="text-lg font-bold text-white/80 mb-4">
                    {lang === "ar" ? "أرشيف المقالات" : "Articles Archive"}
                  </h2>
                  <div className="divide-y divide-white/10" dir="rtl">
                    {archive.map((article) => (
                      <Link key={article.id} href={`/articles/${article.id}`} className="group flex items-center gap-5 py-5">
                        <Image
                          src={article.coverImage || ARTICLE_FALLBACK_COVER}
                          alt={article.title}
                          width={128}
                          height={84}
                          className="w-32 h-[84px] rounded-lg object-cover flex-shrink-0 opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-white/85 leading-snug mb-1.5 group-hover:text-[#D4A843] transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-white/40 text-xs font-semibold">
                            {formatArticleDate(article.date)}
                            {article.source && <span> · {article.source}</span>}
                          </p>
                          <p className="text-white/55 text-sm leading-relaxed mt-2 line-clamp-2 hidden sm:block">
                            {article.excerpt || toParagraphs(article.content)[0]}
                          </p>
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
