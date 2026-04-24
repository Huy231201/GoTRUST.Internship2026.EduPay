import { api } from "../axios";

export interface SearchRequest {
  search?: string;
  branchId?: string;
  schoolYearId?: string;
}

export interface ClassItem {
  id: string;
  name: string;
}

export interface StudentItem {
  id: string;
  name: string;
  className: string;
}

export interface TeacherItem {
  id: string;
  name: string;
}

export interface SearchResponse {
  classes: ClassItem[];
  students: StudentItem[];
  teachers: TeacherItem[];
}

export const searchApi = async (
  params: SearchRequest
): Promise<SearchResponse> => {
  const res = await api.get("/global-search", { params });
  return res.data;
};