import api from "./api";

export const getContacts = async () => {
  const response = await api.get(
    "/emergency-contacts"
  );

  return response.data;
};

export const createContact = async (
  contactData
) => {
  const response = await api.post(
    "/emergency-contacts",
    contactData
  );

  return response.data;
};

export const updateContact = async (
  id,
  contactData
) => {
  const response = await api.put(
    `/emergency-contacts/${id}`,
    contactData
  );

  return response.data;
};

export const deleteContact = async (id) => {
  const response = await api.delete(
    `/emergency-contacts/${id}`
  );

  return response.data;
};