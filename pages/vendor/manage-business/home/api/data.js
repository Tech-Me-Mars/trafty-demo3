import { request } from "@/service/AxiosService.js";

export function geySurveyBuId(id) {
  const url = `/api/v1/survey/get-survey/${id}`;
  return request("get", url, {}, true);
}


export function getNotify(id) {
  const url = `/api/v1/notications/notifications-by-business-id/${id}`;
  return request("get", url, {}, true);
}

export function getComments(id) {
  const url = `/api/v1/business-comment/get-by-business-id/${id}`;
  return request("get", url, {}, true);
}

export function getCheckIsSurvey(id) {
  const url = `/api/v1/business/check-survey-audit/${id}`;
  return request("get", url, {}, true);
}

export function getbusinessAll(id) {
  const url = `/api/v1/business-list/get-business-all/${id}`;
  return request("get", url, {}, true);
}


export function deletebusinessItem(id) {
  const url = `/api/v1/business-list/delect-business-list/${id}`;
  return request("delete", url, {}, true);
}

export function getShopById(id) {
  const url = `/api/v1/business/${id}`;
  return request("get", url, {}, true);
}


export function createBusinessList(payload) {
  const url = `/api/v1/business-list/createb-businessList`;
  return request("post", url, payload, true);
}
export function deleteBusinessList(id) {
  const url = `/api/v1/business-list/delect-business-list/${id}`;
  return request("delete", url, {}, true);
}

export function getNotifyBusiness(id) {
  const url = `/api/v1/notications/update-notifications-by-business-id/${id}`;
  return request("get", url, {}, true);
}
