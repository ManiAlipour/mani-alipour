import { Metadata } from "next";
import { getBlog } from "./api/blog/get-blog";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlog(params.slug);

  if (!post) return {};

  return {
    title: `${post.title} | مانی علیپور`,

    description: post.excerpt,

    keywords: post.tags.map((t: { name: string }) => t.name),

    alternates: {
      canonical: `https://manialipour.ir/blogs/${post.slug}`,
    },

    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://manialipour.ir/blogs/${post.slug}`,
      type: "article",
      images: [
        {
          url: `https://manialipour.ir${post.cover}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.createdAt ?? undefined,
      modifiedTime: post.updatedAt ?? undefined,
    },
    authors: [{ name: "مانی علیپور", url: "https://manialipour.ir" }],

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [`https://manialipour.ir${post.cover}`],
    },
  };
}
