import api from "./api";

/* ========================================
   ADMIN DASHBOARD OVERVIEW
======================================== */

export const getAdminOverview =
  async () => {
    const response =
      await api.get(
        "/admin/overview"
      );

    return response.data;
  };