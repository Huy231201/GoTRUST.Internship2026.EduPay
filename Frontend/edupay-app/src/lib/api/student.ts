// src/lib/api/student.ts
import { api } from "@/lib/axios";

export interface Student {
  id: string;
  code: string;
  fullName: string;
  gender: number;
  dateOfBirth: string;
  classId: string;
  className: string;
  type: number;
  status: number;
  branchId: string;
  schoolYearId: string;
  email: string | null;
  phoneNumber: string | null;
}

export interface GetStudentsParams {
  search?: string;
  status?: number;
  classId?: string;
  branchId: string;
  schoolYearId: string;
}

export interface CreateStudentPayload {
  code: string;
  fullName: string;
  gender: number;
  dateOfBirth: string;
  classId: string;
  type: number;
  branchId: string;
  schoolYearId: string;
  email?: string | null;
  phoneNumber?: string | null;
}

export interface UpdateStudentPayload {
  code: string;
  fullName: string;
  gender: number;
  dateOfBirth: string;
  classId: string;
  type: number;
  status: number;
  email?: string | null;
  phoneNumber?: string | null;
}

// ================= GET LIST =================
export const getStudents = async (
  params: GetStudentsParams
): Promise<Student[]> => {
  const res = await api.get("/students", {
    params,
  });

  return res.data.map((item: any) => ({
    id: item.id,
    code: item.code,
    fullName: item.fullName,
    gender: item.gender,
    dateOfBirth: item.dateOfBirth,
    classId: item.classId,
    className: item.className,
    type: item.type,
    status: item.status,
    branchId: item.branchId,
    schoolYearId: item.schoolYearId,
    email: item.email,
    phoneNumber: item.phoneNumber,
  }));
};

// ================= CREATE =================
export const createStudent = async (payload: CreateStudentPayload) => {
  return api.post("/students", payload);
};

// ================= DELETE =================
export const deleteStudent = async (id: string) => {
  return api.delete(`/students/${id}`);
};

// ================= UPDATE =================
export const updateStudent = async (
  id: string,
  payload: UpdateStudentPayload
) => {
  return api.put(`/students/${id}`, payload);
};

// DOWNLOAD TEMPLATE
export const downloadStudentTemplate = async (
  branchId: string,
  schoolYearId: string
): Promise<Blob> => {
  const res = await api.get("/students/import-template", {
    params: {
      branchId,
      schoolYearId,
    },
    responseType: "blob",
  });

  return res.data;
};

// IMPORT STUDENTS FROM FILE
export const importStudents = async (
  file: File,
  branchId: string,
  schoolYearId: string
) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("branchId", branchId);
  formData.append("schoolYearId", schoolYearId);

  const res = await api.post("/students/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};