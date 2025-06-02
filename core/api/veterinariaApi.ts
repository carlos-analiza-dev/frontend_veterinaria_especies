import { SecureStorageAdapter } from "@/helpers/adapters/secure-storage.adaoter";
import axios from "axios";

const STAGE = process.env.EXPO_PUBLIC_STAGE || "dev";

export const API_URL =
  STAGE === "prod"
    ? process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_API_URL_ANDROID;

const veterinariaAPI = axios.create({
  baseURL: API_URL,
});

veterinariaAPI.interceptors.request.use(async (config) => {
  const token = await SecureStorageAdapter.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { veterinariaAPI };
