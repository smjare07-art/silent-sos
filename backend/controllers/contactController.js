import EmergencyContact from "../models/EmergencyContact.js";

const MAX_CONTACTS = 5;

/* =========================================
   CREATE CONTACT
========================================= */

export const createContact = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      relationship,
      phone,
      email,
      isPrimary,
    } = req.body;

    const normalizedPhone =
      phone.trim();

    /*
      Maximum contact limit
    */

    const contactCount =
      await EmergencyContact.countDocuments({
        user: req.user._id,
        isActive: true,
      });

    if (
      contactCount >= MAX_CONTACTS
    ) {
      return res.status(400).json({
        success: false,
        message:
          `You can add up to ${MAX_CONTACTS} emergency contacts.`,
      });
    }

    /*
      Duplicate phone check
    */

    const existingContact =
      await EmergencyContact.findOne({
        user: req.user._id,
        phone: normalizedPhone,
      });

    if (existingContact) {
      return res.status(409).json({
        success: false,
        message:
          "This phone number is already in your emergency contacts.",
      });
    }

    /*
      First contact always becomes
      primary.

      Otherwise user may explicitly
      select a new primary.
    */

    const shouldBePrimary =
      contactCount === 0 ||
      isPrimary === true;

    /*
      Remove existing primary when
      creating a new primary.
    */

    if (
      shouldBePrimary &&
      contactCount > 0
    ) {
      await EmergencyContact.updateMany(
        {
          user: req.user._id,
          isPrimary: true,
        },
        {
          $set: {
            isPrimary: false,
          },
        }
      );
    }

    const contact =
      await EmergencyContact.create({
        user: req.user._id,

        name: name.trim(),

        relationship:
          relationship.trim(),

        phone:
          normalizedPhone,

        email:
          email
            ?.trim()
            .toLowerCase() ||
          "",

        isPrimary:
          shouldBePrimary,
      });

    return res.status(201).json({
      success: true,

      message:
        "Emergency contact added successfully.",

      data: {
        contact,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================
   GET CONTACTS
========================================= */

export const getContacts = async (
  req,
  res,
  next
) => {
  try {
    const contacts =
      await EmergencyContact.find({
        user: req.user._id,
        isActive: true,
      }).sort({
        isPrimary: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,

      data: {
        count:
          contacts.length,

        maxContacts:
          MAX_CONTACTS,

        contacts,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================
   GET SINGLE CONTACT
========================================= */

export const getContact = async (
  req,
  res,
  next
) => {
  try {
    const contact =
      await EmergencyContact.findOne({
        _id: req.params.id,
        user: req.user._id,
        isActive: true,
      });

    if (!contact) {
      return res.status(404).json({
        success: false,

        message:
          "Emergency contact not found.",
      });
    }

    return res.status(200).json({
      success: true,

      data: {
        contact,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================
   UPDATE CONTACT
========================================= */

export const updateContact = async (
  req,
  res,
  next
) => {
  try {
    const contact =
      await EmergencyContact.findOne({
        _id: req.params.id,
        user: req.user._id,
        isActive: true,
      });

    if (!contact) {
      return res.status(404).json({
        success: false,

        message:
          "Emergency contact not found.",
      });
    }

    const {
      name,
      relationship,
      phone,
      email,
      isPrimary,
    } = req.body;

    const normalizedPhone =
      phone.trim();

    /*
      Duplicate phone check
    */

    const duplicate =
      await EmergencyContact.findOne({
        user: req.user._id,

        phone:
          normalizedPhone,

        _id: {
          $ne: contact._id,
        },
      });

    if (duplicate) {
      return res.status(409).json({
        success: false,

        message:
          "Another emergency contact already uses this phone number.",
      });
    }

    /*
      If this contact is being
      promoted to primary,
      remove primary status from
      all other contacts.
    */

    if (
      isPrimary === true &&
      !contact.isPrimary
    ) {
      await EmergencyContact.updateMany(
        {
          user: req.user._id,

          _id: {
            $ne: contact._id,
          },

          isPrimary: true,
        },
        {
          $set: {
            isPrimary: false,
          },
        }
      );
    }

    contact.name =
      name.trim();

    contact.relationship =
      relationship.trim();

    contact.phone =
      normalizedPhone;

    contact.email =
      email
        ?.trim()
        .toLowerCase() ||
      "";

    /*
      Primary safety rule:

      Do not allow the current
      primary contact to simply
      become non-primary.

      User must select another
      contact as primary instead.
    */

    if (
      contact.isPrimary &&
      isPrimary === false
    ) {
      const otherContacts =
        await EmergencyContact.countDocuments({
          user: req.user._id,

          _id: {
            $ne: contact._id,
          },

          isActive: true,
        });

      if (
        otherContacts > 0
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Select another contact as primary before removing primary status from this contact.",
        });
      }

      /*
        Only contact remains primary.
      */

      contact.isPrimary =
        true;
    } else {
      contact.isPrimary =
        Boolean(isPrimary);
    }

    await contact.save();

    return res.status(200).json({
      success: true,

      message:
        "Emergency contact updated successfully.",

      data: {
        contact,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================
   DELETE CONTACT
========================================= */

export const deleteContact = async (
  req,
  res,
  next
) => {
  try {
    const contact =
      await EmergencyContact.findOne({
        _id: req.params.id,
        user: req.user._id,
        isActive: true,
      });

    if (!contact) {
      return res.status(404).json({
        success: false,

        message:
          "Emergency contact not found.",
      });
    }

    const wasPrimary =
      contact.isPrimary;

    await contact.deleteOne();

    /*
      If primary was deleted,
      automatically promote
      oldest remaining contact.
    */

    if (wasPrimary) {
      const nextContact =
        await EmergencyContact.findOne({
          user: req.user._id,
          isActive: true,
        }).sort({
          createdAt: 1,
        });

      if (nextContact) {
        nextContact.isPrimary =
          true;

        await nextContact.save();
      }
    }

    return res.status(200).json({
      success: true,

      message:
        "Emergency contact removed successfully.",
    });
  } catch (error) {
    next(error);
  }
};