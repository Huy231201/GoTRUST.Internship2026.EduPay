import { api } from "../axios";

export const getStatistics = async (params: {
  schoolId: string;
  schoolYearId: string;
}) => {
  const res = await api.get("/statistics", {
    params,
  });

  return res.data;
};