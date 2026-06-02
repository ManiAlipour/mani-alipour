declare type TCommentUser = {
  _id: string;
  name: string;
  email: string;
};

declare type TCommentPost = {
  _id: string;
  title: string;
  slug: string;
};

declare type TComment = {
  _id: string;
  userId: TCommentUser;
  postId: TCommentPost;
  content: string;
  createdAt: string;
  updatedAt: string;
};

declare type TCommentsMeta = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

declare type TCommentsResponse = {
  message: string;
  data: TComment[];
  meta: TCommentsMeta;
};
