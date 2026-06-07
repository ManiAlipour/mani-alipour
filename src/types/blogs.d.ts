declare type TBlog = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: TAuthor;
  readAt: number;
  cover: string;
  isPublished: boolean;
  tags: {
    name: string;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type TAuthor = {
  _id: string;
  name: string;
};

declare type TBlogStats = {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  blogsByAuthor: BlogsByAuthor[];
  monthlyStats: MonthlyStat[];
  latestBlogs: LatestBlog[];
  topViewedBlogs: LatestBlog[];
  averageViews: number;
};

interface LatestBlog {
  _id: string;
  slug: string;
  title: string;
  author: string;
  createdAt: string;
}

interface MonthlyStat {
  _id: Id;
  count: number;
}

interface Id {
  year: number;
  month: number;
}

interface BlogsByAuthor {
  count: number;
  authorId: string;
  authorName: string;
  authorEmail: string;
}
