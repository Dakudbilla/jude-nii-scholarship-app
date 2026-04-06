export const API_ENDPOINTS = {
  years: {
    list: () => "/api/years",
    create: () => "/api/years",
    byId: (id: string) => `/api/years/${id}`,
  },
  wings: {
    list: (yearId: string) => `/api/years/${yearId}/wings`,
    create: (yearId: string) => `/api/years/${yearId}/wings`,
  },
  applications: {
    list: (yearId: string) => `/api/years/${yearId}/applications`,
    byId: (id: string) => `/api/applications/${id}`,
    submit: () => "/api/applications/submit",
    updateStatus: (id: string) => `/api/applications/${id}/status`,
  },
  endorsements: {
    list: (yearId: string) => `/api/years/${yearId}/endorsements`,
    submit: (token: string) => `/api/endorse/${token}`,
  },
  awards: {
    publish: (id: string) => `/api/awards/${id}/publish`,
    accept: (token: string) => `/api/accept/${token}`,
  },
};
