import { apiClient } from "@/lib/axios";
import {
  ICreateContactRequest,
  IUpdateContactRequest,
  IQueryContactParams,
  IContactResponse,
  IContactsResponse,
} from "./contacts-type";

export const getContacts = async (
  params?: IQueryContactParams
): Promise<IContactsResponse> => {
  const queryParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "null"
    )
  );
  const response = await apiClient.get<IContactsResponse>("/contacts", {
    params: queryParams,
  });
  return response.data;
};

export const getContactById = async (id: string): Promise<IContactResponse> => {
  const response = await apiClient.get<IContactResponse>(`/contacts/${id}`);
  return response.data;
};

export const createContact = async (
  data: ICreateContactRequest
): Promise<IContactResponse> => {
  const response = await apiClient.post<IContactResponse>("/contacts", data);
  return response.data;
};

export const updateContact = async (
  id: string,
  data: IUpdateContactRequest
): Promise<IContactResponse> => {
  const response = await apiClient.patch<IContactResponse>(
    `/contacts/${id}`,
    data
  );
  return response.data;
};

export const deleteContact = async (id: string): Promise<void> => {
  await apiClient.delete(`/contacts/${id}`);
};

