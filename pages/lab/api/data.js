import { request } from "@/service/AxiosService.js";

export function geySurveyBuId(id) {
  const url = `/api/v1/survey/get-survey/${id}`;
  return request("get", url, {}, true);
}

export function geyTimeSurvey(id) {
  const url = `/api/v1/survey-police/get-survey-audit-police-by-survey-audit-police-id/${id}`;
  return request("get", url, {}, true);
}