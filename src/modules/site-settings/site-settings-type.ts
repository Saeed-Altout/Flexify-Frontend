import { IApiResponse } from "@/types/api-type";

export type ISiteSettingTranslation = {
  id: string;
  siteSettingId: string;
  locale: string;
  value: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type ISiteSetting = {
  id: string;
  key: string;
  value: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  translations?: ISiteSettingTranslation[];
};

// Request/Response Types
export type IUpdateSiteSettingRequest = {
  value?: Record<string, unknown>;
};

export type IUpdateSiteSettingTranslationRequest = {
  locale: string;
  value: Record<string, unknown>;
};

export type ISiteSettingResponse = IApiResponse<{ data: ISiteSetting }>;

export type ISiteSettingsResponse = IApiResponse<{ data: ISiteSetting[] }>;

// Specific setting types
export type IGithubSettings = {
  repoUrl: string;
  followers: number;
};

export type ICVSettings = {
  url: string;
  fileName: string;
};

export type ICVTranslation = {
  label: string;
};

export type IHeroSettings = {
  techIcons: string[];
  ctaLink?: string;
};

export type IHeroTranslation = {
  badge: string;
  title: string;
  description: string;
  cta: string;
};

export type IStatisticItem = {
  id: string;
  value: number;
  suffix?: string;
  icon: string;
  orderIndex?: number;
};

export type IStatisticsSettings = {
  items: IStatisticItem[];
};

export type IStatisticsTranslation = {
  title: string;
  description: string;
  items: {
    [key: string]: {
      label: string;
    };
  };
};

export type IAboutHighlight = {
  id: string;
  icon: string;
};

export type IAboutSettings = {
  highlights: IAboutHighlight[];
  ctaLink?: string;
};

export type IAboutTranslation = {
  title: string;
  description1: string;
  description2: string;
  cta: string;
  highlights: {
    [key: string]: {
      title: string;
      description: string;
    };
  };
};

export type IFooterSocialLink = {
  icon: string;
  href: string;
};

export type IFooterLinkItem = {
  href: string;
  key: string;
};

export type IFooterColumn = {
  key: string;
  links: IFooterLinkItem[];
};

export type IFooterContact = {
  email: string;
  phone: string;
  location: string;
};

export type IFooterSettings = {
  socialLinks: IFooterSocialLink[];
  columns: IFooterColumn[];
  contact: IFooterContact;
};

export type IFooterColumnTranslation = {
  title: string;
  links: {
    [key: string]: string;
  };
};

export type IFooterTranslation = {
  description: string;
  contact: {
    title: string;
  };
  columns: {
    [key: string]: IFooterColumnTranslation;
  };
  copyright: string;
  rights: string;
};
