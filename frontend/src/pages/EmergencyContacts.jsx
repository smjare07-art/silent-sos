import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  createContact,
  deleteContact,
  getContacts,
  updateContact,
} from "../services/contactService";

import "../styles/contacts.css";

const initialForm = {
  name: "",
  relationship: "",
  phone: "",
  email: "",
  isPrimary: false,
};

function EmergencyContacts() {
  const [contacts, setContacts] =
    useState([]);

  const [formData, setFormData] =
    useState(initialForm);

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const loadContacts = async () => {
    try {
      setError("");

      const response =
        await getContacts();

      setContacts(
        response.data.contacts
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load emergency contacts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await updateContact(
          editingId,
          formData
        );

        setSuccess(
          "Emergency contact updated."
        );
      } else {
        await createContact(formData);

        setSuccess(
          "Emergency contact added."
        );
      }

      resetForm();

      await loadContacts();
    } catch (error) {
      const response =
        error.response?.data;

      if (
        response?.errors &&
        Array.isArray(response.errors)
      ) {
        setError(
          response.errors
            .map((item) => item.message)
            .join(" ")
        );
      } else {
        setError(
          response?.message ||
            "Unable to save contact."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (contact) => {
    setEditingId(contact._id);

    setFormData({
      name: contact.name,
      relationship:
        contact.relationship,
      phone: contact.phone,
      email: contact.email || "",
      isPrimary: contact.isPrimary,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (
    contact
  ) => {
    const confirmed =
      window.confirm(
        `Remove ${contact.name} from your emergency contacts?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteContact(
        contact._id
      );

      setSuccess(
        "Emergency contact removed."
      );

      await loadContacts();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to remove contact."
      );
    }
  };

  return (
    <DashboardLayout>

      <section className="contacts-heading">

        <div>
          <span className="section-eyebrow">
            SAFETY NETWORK
          </span>

          <h1>Emergency Contacts</h1>

          <p>
            Add trusted people who should
            receive your emergency alerts.
          </p>
        </div>

        <div className="contacts-count">
          <i className="bi bi-people"></i>

          <div>
            <strong>
              {contacts.length}
            </strong>

            <span>
              Trusted Contacts
            </span>
          </div>
        </div>

      </section>

      {error && (
        <div className="alert alert-danger mt-4">
          <i className="bi bi-exclamation-circle me-2"></i>

          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success mt-4">
          <i className="bi bi-check-circle me-2"></i>

          {success}
        </div>
      )}

      <div className="row g-4 mt-1">

        {/* FORM */}

        <div className="col-12 col-xl-5">

          <section className="contact-form-card">

            <div className="contact-card-heading">
              <div className="contact-heading-icon">
                <i
                  className={`bi ${
                    editingId
                      ? "bi-pencil"
                      : "bi-person-plus"
                  }`}
                ></i>
              </div>

              <div>
                <h2>
                  {editingId
                    ? "Edit Contact"
                    : "Add Trusted Contact"}
                </h2>

                <p>
                  Emergency alerts can be
                  shared with this person.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
            >

              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Contact's full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Relationship
                </label>

                <select
                  name="relationship"
                  className="form-select contact-select"
                  value={
                    formData.relationship
                  }
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select relationship
                  </option>

                  <option value="Parent">
                    Parent
                  </option>

                  <option value="Brother">
                    Brother
                  </option>

                  <option value="Sister">
                    Sister
                  </option>

                  <option value="Spouse">
                    Spouse
                  </option>

                  <option value="Friend">
                    Friend
                  </option>

                  <option value="Guardian">
                    Guardian
                  </option>

                  <option value="Colleague">
                    Colleague
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Mobile Number
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    +91
                  </span>

                  <input
                    type="tel"
                    name="phone"
                    inputMode="numeric"
                    maxLength="10"
                    className="form-control"
                    placeholder="9876543210"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

              </div>

              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Email
                  <span className="text-muted fw-normal ms-1">
                    (optional)
                  </span>
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="contact@example.com"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="primary-contact-option">

                <div>
                  <strong>
                    Primary Contact
                  </strong>

                  <span>
                    Prioritize this person
                    during an emergency.
                  </span>
                </div>

                <div className="form-check form-switch">

                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    name="isPrimary"
                    checked={
                      formData.isPrimary
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

              </div>

              <button
                type="submit"
                className="btn btn-sos w-100 mt-4"
                disabled={saving}
              >

                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>

                    Saving...
                  </>
                ) : (
                  <>
                    <i
                      className={`bi ${
                        editingId
                          ? "bi-check-lg"
                          : "bi-person-plus"
                      } me-2`}
                    ></i>

                    {editingId
                      ? "Update Contact"
                      : "Add Emergency Contact"}
                  </>
                )}

              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-light w-100 mt-2"
                  onClick={resetForm}
                >
                  Cancel Editing
                </button>
              )}

            </form>

          </section>

        </div>

        {/* CONTACT LIST */}

        <div className="col-12 col-xl-7">

          <section className="contacts-list-card">

            <div className="contacts-list-heading">

              <div>
                <span className="section-eyebrow">
                  TRUSTED PEOPLE
                </span>

                <h2>
                  Your Safety Network
                </h2>
              </div>

            </div>

            {loading ? (
              <div className="contacts-loading">

                <div className="spinner-border text-danger"></div>

                <span>
                  Loading contacts...
                </span>

              </div>
            ) : contacts.length === 0 ? (

              <div className="contacts-empty">

                <div className="empty-contact-icon">
                  <i className="bi bi-person-plus"></i>
                </div>

                <h3>
                  No emergency contacts yet
                </h3>

                <p>
                  Add at least one trusted
                  person before using Silent SOS.
                </p>

              </div>

            ) : (

              <div className="contact-list">

                {contacts.map(
                  (contact) => (
                    <article
                      className="contact-item"
                      key={contact._id}
                    >

                      <div className="contact-avatar">
                        {contact.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="contact-details">

                        <div className="contact-name-row">

                          <strong>
                            {contact.name}
                          </strong>

                          {contact.isPrimary && (
                            <span className="primary-badge">
                              <i className="bi bi-star-fill"></i>
                              Primary
                            </span>
                          )}

                        </div>

                        <span className="relationship">
                          {
                            contact.relationship
                          }
                        </span>

                        <div className="contact-meta">

                          <span>
                            <i className="bi bi-telephone"></i>

                            +91{" "}
                            {contact.phone}
                          </span>

                          {contact.email && (
                            <span>
                              <i className="bi bi-envelope"></i>

                              {
                                contact.email
                              }
                            </span>
                          )}

                        </div>

                      </div>

                      <div className="contact-actions">

                        <button
                          type="button"
                          className="contact-action edit"
                          onClick={() =>
                            handleEdit(
                              contact
                            )
                          }
                          aria-label={`Edit ${contact.name}`}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          type="button"
                          className="contact-action delete"
                          onClick={() =>
                            handleDelete(
                              contact
                            )
                          }
                          aria-label={`Delete ${contact.name}`}
                        >
                          <i className="bi bi-trash"></i>
                        </button>

                      </div>

                    </article>
                  )
                )}

              </div>

            )}

          </section>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default EmergencyContacts;