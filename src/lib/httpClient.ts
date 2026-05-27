import axios, { type AxiosError } from "axios";
import { getApiBaseUrl } from "@/lib/api";
import { getAuthToken } from "@/lib/auth-storage";

type ExpressEnvelope = {
  status?: number;
  message?: string;
  data?: unknown;
};

const httpClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => {
    const body = response.data as ExpressEnvelope | unknown;
    if (
      body &&
      typeof body === "object" &&
      "data" in body &&
      ("status" in body || "message" in body)
    ) {
      response.data = (body as ExpressEnvelope).data;
    }
    return response;
  },
  (error: AxiosError<ExpressEnvelope>) => {
    const payload = error.response?.data;
    if (payload && typeof payload === "object" && payload.message) {
      error.message = payload.message;
    }
    return Promise.reject(error);
  }
);

export default httpClient;
