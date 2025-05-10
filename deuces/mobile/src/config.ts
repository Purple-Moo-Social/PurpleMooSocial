// deuces\mobile\src\config.ts
import Constants from "expo-constants";

type AppConfig = {
  apiUrl: string;
  env: "development" | "production" | "test";
};

const validateConfig = (config: Partial<AppConfig>): AppConfig => {
  if (!config.apiUrl) {
    throw new Error("Missing API_URL in environment variables");
  }

  return {
    apiUrl: config.apiUrl,
    env: config.env || "development",
  };
};

export const CONFIG = validateConfig(
  Constants.expoConfig?.extra as Partial<AppConfig>
);
