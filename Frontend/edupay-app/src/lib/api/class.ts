import { api } from "@/lib/axios";

export interface ClassItem {
  id: string;
  name: string;
  code: string;

  gradeId: string;
  gradeName: string;

  branchId: string;
  branchName: string;
  isMain: boolean;

  schoolYearId: string;
}

export interface GetClassesParams {
  schoolYearId?: string;
  branchId: string;
  gradeId?: string;
  search?: string;
}

export interface BulkCreateClassesPayload {
  gradeId: string;
  schoolYearId: string;
  branchId: string;
  startLetter: string;
  endLetter: string;
  startNumber: number;
  endNumber: number;
}


export const getClasses = async (
  params: GetClassesParams
): Promise<ClassItem[]> => {
  const res = await api.get("/classes", {
    params: {
      schoolYearId: params.schoolYearId,
      branchId: params.branchId,
      gradeId: params.gradeId,
      search: params.search,
    },
  });

  return res.data.map((item: any) => ({
    id: item.id,
    name: item.name,
    code: item.code,

    gradeId: item.gradeId,
    gradeName: item.gradeName,

    branchId: item.branchId,
    branchName: item.branchName,
    isMain: item.isMain, // ✅ lấy từ BE

    schoolYearId: item.schoolYearId,
  }));
};


export const bulkCreateClasses = async (
  payload: BulkCreateClassesPayload
): Promise<ClassItem[]> => {
  const res = await api.post("/classes/bulk-create", payload);

  const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];

  return data.map((item: any) => ({
    id: item.id,
    name: item.name,
    code: item.code,

    gradeId: item.gradeId,
    gradeName: item.gradeName,

    branchId: item.branchId,
    branchName: item.branchName,
    isMain: item.isMain,

    schoolYearId: item.schoolYearId,
  }));
};

export const deleteClass = async (id: string): Promise<void> => {
  await api.delete(`/classes/${id}`);
};

export const downloadClassTemplate = async (
  branchId: string,
  schoolYearId: string
): Promise<Blob> => {
  const res = await api.get("/classes/import-template", {
    params: {
      branchId,
      schoolYearId,
    },
    responseType: "blob", // trả về dữ liệu thô (excel,pdf..)
  });

  return res.data;
};


export const importClasses = async (
  file: File,
  branchId: string,
  schoolYearId: string
) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("branchId", branchId);
  formData.append("schoolYearId", schoolYearId);

  const res = await api.post("/classes/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
