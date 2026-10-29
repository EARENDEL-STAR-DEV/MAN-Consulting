"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useDirectorPhoto } from "@/hooks/useDirectorPhoto";
import { toParagraphs } from "@/lib/articlesRepo";

/* Full article (photo + text + author), laid directly on the page background
   (no raised card) for a calm, editorial reading layout. Shared by the
   /articles listing (today's article) and the /articles/[id] page. */
/* Cloudinary uploads can be several thousand px wide — ask Cloudinary for a
   resized, auto-format copy (c_limit never enlarges smaller originals). */
function sizedCover(url) {
  return url.includes("res.cloudinary.com") && url.includes("/upload/")
    ? url.replace("/upload/", "/upload/c_limit,w_1600,q_auto,f_auto/")
    : url;
}

export default function ArticleBody({ article }) {
  const directorPhoto = useDirectorPhoto();
  const paragraphs = toParagraphs(article.content);

  return (
    <article dir="rtl">
      {article.coverImage && (
        <figure className="mb-12 flex flex-col items-center">
          {/* Plain <img> at its natural size: the full photo, never cropped
              and never upscaled past its real resolution (no pixelation);
              large photos shrink to the column width / max height. */}
          <img
            src={sizedCover(article.coverImage)}
            alt={article.title}
            loading="lazy"
            className="block w-auto h-auto max-w-full max-h-[480px] rounded-xl"
          />
          {article.source && (
            <figcaption className="text-white/40 text-xs font-semibold mt-3 text-center">
              الصورة: {article.source}
            </figcaption>
          )}
        </figure>
      )}

      {paragraphs.map((paragraph, i) => (
        <p
          key={i}
          className={
            i === 0
              ? "text-white/90 text-lg md:text-xl font-semibold leading-[2] mb-8 border-s-2 border-[#D4A843]/70 ps-5"
              : "text-white/75 text-base md:text-lg leading-[2.05] mb-7 last:mb-0"
          }
        >
          {paragraph}
        </p>
      ))}

      {/* Author */}
      <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-5">
        <Image
          src={directorPhoto}
          width={56}
          height={56}
          alt={article.author || ""}
          className="w-14 h-14 rounded-full object-cover border border-[#D4A843]/50 flex-shrink-0"
        />
        <div className="flex-1">
          <p className="text-white font-bold text-base">{article.author}</p>
          <p className="text-white/45 text-sm mt-1">مؤسس شركة MAN للاستشارات الهندسية</p>
        </div>
        {article.sourceUrl && (
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#D4A843] hover:text-[#E8C46A] text-sm font-bold transition-colors whitespace-nowrap"
          >
            <ExternalLink size={14} />
            {article.source ? `المقال في ${article.source}` : "المقال الأصلي"}
          </a>
        )}
      </div>
    </article>
  );
}
