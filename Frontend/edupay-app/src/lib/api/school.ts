import { api } from "../axios";

export interface SchoolInfo {
  name: string;
  code: string;
  level: number;
  taxCode: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  principal: string | null;
  address: string | null;
  type: string | null;
}

export const getMainSchool = async (): Promise<SchoolInfo> => {
  const res = await api.get("/schools/main");

  const data = res.data;

  return {
    name: data.name,
    code: data.code,
    level: data.level,
    taxCode: data.taxCode,
    email: data.email,
    phone: data.phone,
    website: data.website,
    principal: data.principal,
    address: data.address,
    type: data.type,
  };
};