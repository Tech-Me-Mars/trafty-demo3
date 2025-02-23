import { request } from "@/service/AxiosService.js";

export function getsurveytouristwaiting() {
  const url = `/api/v1/survey-waiting/surveytouristwaiting`;
  return request("get", url, {}, true);
}

export function getsurveybusinessintouristwaiting() {
  const url = `api/v1/survey-waiting/surveybusinessintouristwaiting`;
  return request("get", url, {}, true);
}
