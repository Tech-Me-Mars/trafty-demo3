import { request } from "@/service/AxiosService.js";

export function getWarningResponPolice() {
  const url = `/api/v1/survey-warning-respond/get-survey-warning-respond-police`;
  return request("get", url, {}, true);
}

