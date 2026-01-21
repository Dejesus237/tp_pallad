import { AuthService } from "@/api/services/AuthService";
import { ensureCsrfCookie, resetCsrfState } from "./csrf";

type LoginArgs = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

async function withCsrf<T>(fn: () => Promise<T>): Promise<T> {
  await ensureCsrfCookie();

  try {
    return await fn();
  } catch (err: any) {
    /**
     * Option sécurité: si CSRF invalide/expiré, Django renvoie souvent 403.
     * On refait un csrf puis on retente UNE fois.
     */
    const status = err?.status ?? err?.response?.status;
    if (status === 403) {
      await ensureCsrfCookie(true);
      return await fn();
    }
    throw err;
  }
}

export async function loginAndFetchMe({ email, password, rememberMe = true }: LoginArgs) {
  await withCsrf(() =>
    AuthService.authLogin({
      email,
      password,
      remember_me: rememberMe,
    })
  );

  return AuthService.authMe();
}

export async function fetchMe() {
  return AuthService.authMe();
}

export async function logout() {
  await withCsrf(() => AuthService.authLogout());
  resetCsrfState();
}

export async function logoutEverywhere() {
  await withCsrf(() => AuthService.authLogoutAll());
  resetCsrfState();
}