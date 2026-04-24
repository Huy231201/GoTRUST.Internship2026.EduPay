import { api } from "../../axios";
import type { BranchItem, CreateBranchRequest, UpdateBranchRequest } from "./branch-type";


// GET ALL LIST BY SCHOOL
export const getBranches = async (
  schoolId: string
): Promise<BranchItem[]> => {
  const res = await api.get(`/branches/by-school/${schoolId}`);

  return res.data.map((item: any) => ({
    id: item.id,
    name: item.name,
    address: item.address,
    phone: item.phone,
    code: item.code,
    isMain: item.isMain
  }));
};

export const getBranchById = async (
  branchId: string
): Promise<BranchItem> => {
  const res = await api.get(`/branches/${branchId}`);

  const item = res.data;

  return {
    id: item.id,
    name: item.name,
    code: item.code,
    address: item.address,
    phone: item.phone,
    isMain: item.isMain,
    level: item.level ?? null,
    taxCode: item.taxCode ?? null,
    email: item.email ?? null,
    type: item.type ?? null,
  };
};


// CREATE
export const createBranch = async (branch: CreateBranchRequest) => {
  const res = await api.post("/branches", branch);
  return res.data;
};

// DELETE
export const deleteBranch = async (branchId: string) => {
  const res = await api.delete(`/branches/${branchId}`);
  return res.data;
}

// UPDATE
export const updateBranch = async (branchId: string, branch: UpdateBranchRequest) => {
  const res = await api.put(`/branches/${branchId}`, branch);
  return res.data;
}