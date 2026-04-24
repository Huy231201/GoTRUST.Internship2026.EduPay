import { api } from "../axios";

export interface SchoolYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string | null;
}

export interface UpdateSchoolYearRequest {
  name: string;
  startDate: string; // yyyy-MM-dd
  endDate: string;
  description?: string | null;
}

export interface CreateSchoolYearRequest {
  name: string;
  startDate: string; // yyyy-MM-dd
  endDate: string;
  description?: string | null;
}

// CREATE
export const createSchoolYear = async (schoolYear: CreateSchoolYearRequest) => {
  const res = await api.post("/school-years", schoolYear);
  return res.data;
};

// GET
export const getSchoolYears = async (
  search?: string
): Promise<SchoolYear[]> => {
  const res = await api.get("/school-years", {
    params: {
      search: search || undefined,
    },
  });

  const data = res.data;

  return data.map((item: any) => ({
    id: item.id,
    name: item.name,
    startDate: item.startDate,
    endDate: item.endDate,
    description: item.description,
  }));
};

// DELETE
export const deleteSchoolYear = async (id: string): Promise<void> => {
  const res = await api.delete(`/school-years/${id}`);
  return res.data;
};

// UPDATE
export const updateSchoolYear = async (
  id: string,
  schoolYear: UpdateSchoolYearRequest
): Promise<void> => {
  const res = await api.put(`/school-years/${id}`, schoolYear);
  return res.data;
};