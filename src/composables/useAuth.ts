import { useNuxtApp } from "#app";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function verifyToken(): boolean {
  const token = getToken();

  if (!token) return false;

  return !isTokenExpired(token);
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function clearAuth() {
  removeToken();
  localStorage.removeItem("loggedUser");
}

export function getLoggedUser() {
  if (!verifyToken()) {
    clearAuth();
    return null;
  }

  const user = localStorage.getItem("loggedUser");
  return user ? JSON.parse(user) : null;
}

export function setLoggedUser(user: any) {
  localStorage.setItem("loggedUser", JSON.stringify(user));
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export async function checkAuth() {
  const token = getToken();
  if (!token) return false;

  try {
    const { $httpClient } = useNuxtApp();
    await $httpClient.auth.Logged();
    return true;
  } catch {
    clearAuth();
    return false;
  }
}