// external Libraries
import { create } from "apisauce";
//  Do not change anything above this line if you're not sure about what you're doing.

const domain = "https://www.roskalava.net";
const apiKey = "3b5830fa-62ca-42e7-9c49-8987996d53a9";

const apiRequestTimeOut = 60000; // 60 secs

//  Do not change anything below this line if you're not sure about what you're doing.

const api = create({
  baseURL: domain + "/wp-json/rtcl/v1/",
  headers: {
    Accept: "application/json",
    "X-API-KEY": apiKey,
    "Cache-Control": "no-cache",
  },
  timeout: apiRequestTimeOut,
});

const setAuthToken = (token) =>
  api.setHeader("Authorization", "Bearer " + token);
const removeAuthToken = () => api.deleteHeader("Authorization");
const setMultipartHeader = () =>
  api.setHeader("Content-Type", "multipart/form-data");
const removeMultipartHeader = () => api.deleteHeader("Content-Type");
const setLocale = (lng) => api.setHeader("X-LOCALE", lng);
const setCurrencyLocale = (cur) => api.setHeader("X-LOCALE-CURRENCY", cur);

export default api;
export {
  setAuthToken,
  removeAuthToken,
  setMultipartHeader,
  removeMultipartHeader,
  setLocale,
  apiKey,
  setCurrencyLocale,
};
