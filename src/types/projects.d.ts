declare type TProjectStatus = "planned" | "in-progress" | "done" | "archived";

declare type TProject = {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description: string;
  status: TProjectStatus;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  coverImage?: string;
  gallery?: string[];
  featured: boolean;
  order?: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};
