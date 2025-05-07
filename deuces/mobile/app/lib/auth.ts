//C:\Users\envas\PurpleMooSocial\deuces\mobile\app\lib\auth.ts
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "deuces_auth_token";
const REFRESH_TOKEN_KEY = "deuces_refresh_token";

export const tokenStorage = {
  async saveTokens(tokens: { accessToken: string; refreshToken: string }) {
    await SecureStore.setItemAsync(TOKEN_KEY, String(tokens.accessToken));
    await SecureStore.setItemAsync(
      REFRESH_TOKEN_KEY,
      String(tokens.refreshToken)
    );
  },

  async getAccessToken() {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  async getRefreshToken() {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async clearTokens() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },

  async isLoggedIn() {
    const token = await this.getAccessToken();
    return !!token;
  },
};

export default function AuthPlaceholder() {
  return null;
}
