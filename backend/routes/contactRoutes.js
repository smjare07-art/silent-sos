import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
} from "../controllers/contactController.js";

import {
  contactValidation,
  contactIdValidation,
  validateContactRequest,
} from "../middleware/validators/contactValidator.js";

const router = express.Router();

/*
  All emergency contact routes require login.
*/

router.use(protect);

router
  .route("/")
  .get(getContacts)
  .post(
    contactValidation,
    validateContactRequest,
    createContact
  );

router
  .route("/:id")
  .get(
    contactIdValidation,
    validateContactRequest,
    getContact
  )
  .put(
    contactIdValidation,
    contactValidation,
    validateContactRequest,
    updateContact
  )
  .delete(
    contactIdValidation,
    validateContactRequest,
    deleteContact
  );

export default router;