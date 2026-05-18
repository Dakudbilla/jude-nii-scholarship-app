/**
 * Single source of truth for all API endpoint URLs.
 * Must match the actual Next.js API route file structure under `src/app/api/`.
 */
export const API_ENDPOINTS = {
  years: {
    list: () => "/api/years",
    byId: (id: string) => `/api/years/${id}`,
    setup: () => "/api/years/setup",
    active: () => "/api/years/active",
  },
  applications: {
    list: (yearId: string) => `/api/applications?yearId=${yearId}`,
    byId: (id: string) => `/api/applications/${id}`,
    submit: () => "/api/applications/submit",
    score: (id: string) => `/api/applications/${id}/score`,
    status: () => "/api/applications/status",
  },
  wings: {
    list: (yearId: string) => `/api/wings?yearId=${yearId}`,
    create: () => "/api/wings",
    byId: (id: string) => `/api/wings/${id}`,
  },
  dashboard: {
    stats: (yearId: string) => `/api/dashboard?yearId=${yearId}`,
  },
  endorsements: {
    byToken: (token: string) => `/api/endorse/${token}`,
  },
  drafts: {
    save: () => "/api/drafts",
  },
};
