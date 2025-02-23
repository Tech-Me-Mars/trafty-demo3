import { request } from "@/service/AxiosService.js";

export function getBusinessType() {
  const url = `/api/v1/business-type`;
  return request("get", url, {}, true);
}
export function saveBusinessRegister(payload) {
  const url = `/api/v1/business/business-register`;
  return request("post", url, payload, true);
}


