// enum từ backend
export type BranchLevel = 1 | 2 | 3;

export type BranchType = 1 | 2 | 3;

// 👉 dùng cho GET BY SCHOOL ID list
export interface BranchItem {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string | null;
  isMain: boolean;
  level: BranchLevel | null;
  taxCode: string | null;
  email: string | null;
  type: BranchType | null;
}

// 👉 dùng cho CREATE
export interface CreateBranchRequest {
  name: string;
  code: string;
  address: string;
  level: BranchLevel | null;
  taxCode: string | null;
  email: string | null;
  phone: string | null;
  type: BranchType | null;
}

export interface UpdateBranchRequest {
  name: string;
  code: string;
  address: string;
  level: BranchLevel | null;
  taxCode: string | null;
  email: string | null;
  phone: string | null;
  type: BranchType | null;
}