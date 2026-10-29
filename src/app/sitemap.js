import { SERVICES_SLUGS } from "@/lib/servicesData";
import { BLOG_POSTS } from "@/lib/blogData";
import { getPublishedProjects } from "@/lib/projectsRepo";
import { getPublishedArticles } from "@/lib/articlesRepo";

const BASE_URL = "https://marwannazer.com";

export default async function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { url: "/", changeFrequency: "weekly", priority: 1 },
    { url: "/us", changeFrequency: "monthly", priority: 0.8 },
    { url: "/projects", changeFrequency: "weekly", priority: 0.8 },
    { url: "/blog", changeFrequency: "weekly", priority: 0.7 },
    { url: "/articles", changeFrequency: "daily", priority: 0.7 },
    { url: "/careers", changeFrequency: "weekly", priority: 0.6 },
    { url: "/contact", changeFrequency: "monthly", priority: 0.7 },
  ].map((route) => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const serviceRoutes = SERVICES_SLUGS.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  let projectRoutes = [];
  try {
    const projects = await getPublishedProjects();
    projectRoutes = projects.map((project) => ({
      url: `${BASE_URL}/projects/${project.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    projectRoutes = [];
  }

  let articleRoutes = [];
  try {
    const articles = await getPublishedArticles();
    articleRoutes = articles.map((article) => ({
      url: `${BASE_URL}/articles/${article.id}`,
      lastModified: article.date ? new Date(article.date) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    articleRoutes = [];
  }

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes, ...projectRoutes, ...articleRoutes];
}
