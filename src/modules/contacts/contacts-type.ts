import { IApiResponse, IPaginationMeta } from "@/types/api-type";

export type ContactStatus = "new" | "read" | "replied" | "archived";

export type IContact = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: ContactStatus;
  inquiryTypeId: string | null;
  createdAt: string;
  updatedAt: string;
  inquiryType?: {
    id: string;
    slug: string;
    translations?: Array<{
      locale: string;
      name: string;
    }>;
  };
};

export type ICreateContactRequest = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status?: ContactStatus;
  inquiryTypeId?: string;
};

export type IUpdateContactRequest = Partial<ICreateContactRequest>;

export type IQueryContactParams = {
  search?: string;
  status?: ContactStatus;
  inquiryTypeId?: string;
  page?: number;
  limit?: number;
  sortBy?: "created_at" | "updated_at" | "name" | "email" | "status";
  sortOrder?: "asc" | "desc";
};

export type IContactResponse = IApiResponse<{ data: IContact }>;

export type IContactsResponse = IApiResponse<{
  data: IContact[];
  meta: IPaginationMeta;
}>;

