declare type TContactStatus = "new" | "read" | "replied" | "archived";

declare type TContact = {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: TContactStatus;
  createdAt: string;
  updatedAt: string;
};

declare type TContactStats = {
  new: number;
  read: number;
  replied: number;
  archived: number;
  total: number;
};

declare type TContactsMeta = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

declare type TContactsResponse = {
  message: string;
  data: TContact[];
  stats: TContactStats;
  meta: TContactsMeta;
};

declare type TAdminOverview = {
  userCount: number;
  blogCount: number;
  projectCount: number;
  viewCount: number;
  commentCount: number;
  contactCount: number;
  publishedBlogCount: number;
  newContactCount: number;
};

declare type TOverviewResponse = {
  message: string;
  data: TAdminOverview;
};
