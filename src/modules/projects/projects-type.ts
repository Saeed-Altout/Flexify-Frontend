import { IApiResponse, IPaginationMeta } from "@/types/api-type";

// Enums
export type ProjectStatus = "draft" | "in_progress" | "published" | "archived";
export type ProjectType = "personal" | "client" | "open_source";
export type LinkType =
  | "github"
  | "gitlab"
  | "demo"
  | "case_study"
  | "blog"
  | "documentation"
  | "backend_github"
  | "frontend_github"
  | "api_docs"
  | "other";
export type InteractionType = "like" | "share";
export type ProjectSortBy =
  | "created_at"
  | "updated_at"
  | "title"
  | "view_count"
  | "like_count"
  | "order_index"
  | "start_date";
export type SortOrder = "asc" | "desc";

// Main Types
export type IProject = {
  id: string;
  userId: string;
  slug: string;
  thumbnailUrl: string | null;
  projectType: ProjectType;
  status: ProjectStatus;
  orderIndex: number;
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  // Relations
  translations?: IProjectTranslation[];
  images?: IProjectImage[];
  technologies?: ITechnology[];
  categories?: ICategory[];
  links?: IProjectLink[];
};

export type IProjectTranslation = {
  id: string;
  projectId: string;
  locale: string;
  title: string;
  description: string | null;
  shortDescription: string | null;
  content: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
};

export type IProjectImage = {
  id: string;
  projectId: string;
  imageUrl: string;
  altText: string | null;
  orderIndex: number;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ITechnology = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  color: string | null;
  category: string | null;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};

export type ICategory = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  icon: string | null;
  color: string | null;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};

export type IProjectLink = {
  id: string;
  projectId: string;
  linkType: LinkType;
  url: string;
  label: string | null;
  icon: string | null;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};

export type IProjectInteraction = {
  id: string;
  projectId: string;
  userId: string;
  interactionType: InteractionType;
  createdAt: string;
};

export type IProjectComment = {
  id: string;
  projectId: string;
  userId: string;
  parentId: string | null;
  content: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
  };
  replies?: IProjectComment[];
};

// Request Types
export type ICreateProjectTranslationRequest = {
  locale: string;
  title: string;
  description?: string;
  shortDescription?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export type ICreateProjectLinkRequest = {
  linkType: LinkType;
  url: string;
  label?: string;
  icon?: string;
  orderIndex?: number;
};

export type ICreateProjectRequest = {
  slug: string;
  projectType?: ProjectType;
  status?: ProjectStatus;
  orderIndex?: number;
  isFeatured?: boolean;
  startDate?: string;
  endDate?: string;
  translations: ICreateProjectTranslationRequest[];
  technologyIds?: string[];
  categoryIds?: string[];
  links?: ICreateProjectLinkRequest[];
  imageUrls?: string[];
};

export type IUpdateProjectRequest = Partial<
  Omit<ICreateProjectRequest, "slug">
>;

export type IQueryProjectParams = {
  search?: string;
  status?: ProjectStatus;
  projectType?: ProjectType;
  isFeatured?: boolean;
  categoryId?: string;
  technologyId?: string;
  locale?: string;
  page?: number;
  limit?: number;
  sortBy?: ProjectSortBy;
  sortOrder?: SortOrder;
};

export type ICreateCommentRequest = {
  projectId: string;
  content: string;
  parentId?: string;
};

export type ICreateInteractionRequest = {
  projectId: string;
  interactionType: InteractionType;
};

export type IUploadProjectImageRequest = {
  altText?: string;
  orderIndex?: number;
  isPrimary?: boolean;
};

// Response Types
export type IProjectResponse = IApiResponse<{ data: IProject }>;

export type IProjectsResponse = IApiResponse<{
  data: IProject[];
  meta: IPaginationMeta;
}>;

export type IProjectDetailResponse = IApiResponse<{
  data: {
    project: IProject;
    userInteraction?: {
      hasLiked: boolean;
      hasShared: boolean;
    };
  };
}>;

export type ITechnologiesResponse = IApiResponse<{
  data: { technologies: ITechnology[] };
}>;

export type ICategoriesResponse = IApiResponse<{
  data: { categories: ICategory[] };
}>;

export type IProjectCommentsResponse = IApiResponse<{
  data: { comments: IProjectComment[] };
}>;

export type IUploadImageResponse = IApiResponse<{
  data: { imageUrl: string };
}>;

export type IInteractionResponse = IApiResponse<{
  data: { action: "added" | "removed" };
}>;

