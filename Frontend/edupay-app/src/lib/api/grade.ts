import { api } from "@/lib/axios";

export interface Grade {
  id: string;
  name: string;
  description: string | null;
  status: boolean;
  branchId: string;
  schoolYearId: string;
}

export interface GetGradesParams {
  search?: string;
  status?: boolean;
  branchId: string;
  schoolYearId?: string;
}

export interface CreateGradePayload {
  name: string;
  description?: string | null;
  status: boolean;
  branchId: string;
  schoolYearId: string;
}

export interface UpdateGradePayload {
  name: string;
  description?: string | null;
  status: boolean;
}



// GET LIST
export const getGrades = async (
  params: GetGradesParams
): Promise<Grade[]> => {
  const res = await api.get("/grades", {
    params,
  });

  return res.data.map((item: any) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    status: item.status,
    branchId: item.branchId,
    schoolYearId: item.schoolYearId,
  }));
};

// CREATE
export const createGrade = async (payload: CreateGradePayload) => {
  return api.post("/grades", payload);
};

// DELETE
export const deleteGrade = async (id: string) => {
  return api.delete(`/grades/${id}`);
};

// UPDATE
export const updateGrade = async (
  id: string,
  payload: UpdateGradePayload
) => {
  return api.put(`/grades/${id}`, payload);
};