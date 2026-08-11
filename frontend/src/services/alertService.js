import api from "./api";

export const createAlert = async (
  location
) => {
  const response = await api.post(
    "/alerts",
    location
  );

  return response.data;
};

export const getActiveAlert =
  async () => {
    const response =
      await api.get(
        "/alerts/active"
      );

    return response.data;
  };

export const updateAlertLocation =
  async (id, location) => {
    const response =
      await api.patch(
        `/alerts/${id}/location`,
        location
      );

    return response.data;
  };

export const resolveAlert =
  async (id) => {
    const response =
      await api.patch(
        `/alerts/${id}/resolve`
      );

    return response.data;
  };

export const cancelAlert =
  async (id) => {
    const response =
      await api.patch(
        `/alerts/${id}/cancel`
      );

    return response.data;
  };

export const getAlertHistory =
  async () => {
    const response =
      await api.get(
        "/alerts/history"
      );

    return response.data;
  };
  export const getAlertNotifications =
  async (id) => {
    const response = await api.get(
      `/alerts/${id}/notifications`
    );

    return response.data;
  };