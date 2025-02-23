import { request } from "@/service/AxiosService.js";



export function saveApproveWarningRespon(id) {
  const url = `/api/v1/survey-warning-respond/approve-survey-audit/${id}`;
  return request("post", url, {}, true);
}

export function saveUpdateSurveyPoliceToApprove(payload) {
  const url = `/api/v1/survey-waiting/update-survey-police-to-approve`;
  return request("put", url, payload, true);
}


export function getCheckPassOrFail(id) {
  const url = `/api/v1/survey-warning-respond/get-survey-status-to-approve/${id}`;
  return request("get", url, {}, true);
}

export function getSurveyWarningRespon(id) {
  const url = `/api/v1/survey-warning-respond/get-all-survey-warning-respond-by-survey-police-id/${id}`;
  return request("get", url, {}, true);
}
