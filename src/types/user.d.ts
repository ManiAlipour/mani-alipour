declare type TUserProfile = {
  _id: string;
  name: string;
  email: string;
  role: string;
  likedBlogs?: string[];
  createdAt: string;
  updatedAt?: string;
};

declare type TUserDashboardStats = {
  likesCount: number;
  commentsCount: number;
  savedCount: number;
};

declare type TUserDashboardResponse = {
  message: string;
  data: {
    user: TUserProfile;
    stats: TUserDashboardStats;
    recentLikes: unknown[];
    recentComments: unknown[];
    latestBlogs: TBlogPreview[];
  };
};

declare type TBlogPreview = {
  _id: string;
  title: string;
  slug: string;
  cover?: string;
  excerpt?: string;
  readAt?: number;
  createdAt: string;
};

declare type TUserLikesResponse = {
  message: string;
  data: TUserLike[];
  meta: TCommentsMeta;
};

declare type TUserLike = {
  _id: string;
  postId: TBlogPreview & { author?: { name: string } };
  createdAt: string;
};

declare type TUserCommentsResponse = {
  message: string;
  data: TUserComment[];
  meta: TCommentsMeta;
};

declare type TUserComment = {
  _id: string;
  content: string;
  postId: TBlogPreview;
  createdAt: string;
  updatedAt: string;
};
