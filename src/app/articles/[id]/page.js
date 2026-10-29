import { notFound } from "next/navigation";
import { getArticleById, getPublishedArticles, toParagraphs } from "@/lib/articlesRepo";
import ArticlePostClient from "./ArticlePostClient";

// New articles are published daily from the admin panel — re-fetch at most
// once a minute instead of freezing the page at build time.
export const revalidate = 60;

async function loadArticle(id) {
  try {
    const article = await getArticleById(id);
    return article?.published ? article : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const article = await loadArticle(id);
  if (!article) return {};
  const description = (article.excerpt || toParagraphs(article.content)[0] || "").slice(0, 160);
  return {
    title: article.title,
    description,
    openGraph: {
      title: article.title,
      description,
      type: "article",
      images: article.coverImage ? [{ url: article.coverImage }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }) {
  const { id } = await params;
  const article = await loadArticle(id);
  if (!article) notFound();

  let related = [];
  try {
    related = (await getPublishedArticles()).filter((a) => a.id !== id).slice(0, 3);
  } catch {
    related = [];
  }

  // Firestore Timestamps aren't serializable across the server→client boundary.
  const strip = ({ updatedAt, ...rest }) => rest;
  return <ArticlePostClient article={strip(article)} related={related.map(strip)} />;
}
