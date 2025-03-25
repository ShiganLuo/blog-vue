import { http } from "@/utils/http";

type Result = {
  code: number;
  messsage: string;
  result: Array<any>;
};

export const getAsyncRoutes = () => {
  return http.request<Result>("get", "/api/admin/routes/get-async-routes");
};
