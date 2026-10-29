"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, ExternalLink, Newspaper, PhoneCall } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { useDirectorPhoto } from "@/hooks/useDirectorPhoto";
import { ARTICLE_FALLBACK_COVER, formatArticleDate, toParagraphs } from "@/lib/articlesRepo";

export default function ArticlePostClient({ article, related }) {
  const { lang, isRTL } = useLanguage();
  const directorPhoto = useDirectorPhoto();
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const paragraphs = toParagraphs(article.content);
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
          <article className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden" dir="rtl">
            {article.coverImage && (
              <figure className="p-3 md:p-4 pb-0 md:pb-0">
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#F3F4F6]">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                </div>
                {article.source && (
                  <figcaption className="text-[#6B7280] text-xs font-semibold mt-3 px-1">
                    الصورة: {article.source}
                  </figcaption>
                )}
              </figure>
            )}

            <div className="p-8 md:p-12">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "text-[#1F2937] text-lg md:text-xl font-semibold leading-[1.9] mb-7 border-s-4 border-[#D4A843] ps-5"
                      : "text-[#1F2937] text-base md:text-lg leading-[1.95] mb-6 last:mb-0"
                  }
                >
                  {paragraph}
                </p>
              ))}

              {/* Author box */}
              <div className="mt-10 pt-8 border-t border-[rgba(0,0,0,0.08)] flex flex-col sm:flex-row sm:items-center gap-5">
                <Image
                  src={directorPhoto}
                  width={64}
                  height={64}
                  alt={article.author || ""}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#D4A843] flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-[#1F2937] font-black text-base">{article.author}</p>
                  <p className="text-[#4B5563] text-sm mt-1">مؤسس شركة MAN للاستشارات الهندسية</p>
                </div>
                {article.sourceUrl && (
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-[#D4A843]/50 text-[#B8902F] hover:bg-[#D4A843] hover:text-[#1F2937] text-sm font-bold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                  >
                    <ExternalLink size={14} />
                    {article.source ? `المقال في ${article.source}` : "المقال الأصلي"}
                  </a>
                )}
              </div>
            </div>
          </article>

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

      {/* ── Previous Articles ── */}
      {related.length > 0 && (
        <section className="pb-20" style={{ backgroundColor: "var(--background)" }}>
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-2xl font-bold text-white mb-8">
              {lang === "ar" ? "مقالات سابقة" : "Previous Articles"}
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
                    <p className="text-[#4B5563] text-xs font-semibold mt-2">{formatArticleDate(a.date)}</p>
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
