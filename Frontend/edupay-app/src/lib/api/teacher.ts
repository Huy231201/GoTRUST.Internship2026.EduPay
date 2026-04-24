// src/lib/api/teacher.ts
import { api } from "@/lib/axios";

export interface Teacher {
  id: string;
  code: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  status: number;
  branchId: string;
  schoolYearId: string;
}

export interface GetTeachersParams {
  search?: string;
  status?: number;
  departmentId?: string;
  branchId: string;
  schoolYearId: string;
}

export interface CreateTeacherPayload {
  code: string;
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
  branchId: string;
  schoolYearId: string;
}

export interface UpdateTeacherPayload {
  code: string;
  name: string;
  email: string;
  status: number;
  phoneNumber?: string | null;
}


// ================= GET LIST =================
export const getTeachers = async (
  params: GetTeachersParams
): Promise<Teacher[]> => {
  const res = await api.get("/teachers", {
    params,
  });

  return res.data.map((item: any) => ({
    id: item.id,
    code: item.code,
    name: item.name,
    email: item.email,
    phoneNumber: item.phoneNumber,
    status: item.status,
    branchId: item.branchId,
    schoolYearId: item.schoolYearId,
  }));
};

// ================= CREATE =================
export const createTeacher = async (payload: CreateTeacherPayload) => {
  const res = await api.post("/teachers", payload);
  return res; 
};

// ================= DELETE =================
export const deleteTeacher = async (id: string) => {
  const res = await api.delete(`/teachers/${id}`);
  return res;
};

export const updateTeacher = async (
  id: string,
  payload: UpdateTeacherPayload
) => {
  const res = await api.put(`/teachers/${id}`, payload);
  return res;
};