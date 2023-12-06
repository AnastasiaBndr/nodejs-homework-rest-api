const express = require("express");
const { favoriteSchema, contactsSchema } = require("../../schema/contact");

const contacts = require("../../controllers/contacts.js");
const router = express.Router();

router.get("/", async (req, res, next) => {
  res.status(200).json(await contacts.listContacts());
});

router.get("/:contactId", async (req, res, next) => {
  const contact = await contacts.getContactById(req.params.contactId);
  if (contact) res.status(200).json(contact);
  else {
    res.status(404).json({ message: "Not Found!" });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = req.body;
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      const result = await contacts.addContact(req.body, res);
      if (result !== null) res.status(201).json(result);
      else res.status(404).json({ message: "Missing fields!" });
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const contact = await contacts.removeContact(req.params.contactId);
  if (contact) res.status(200).json({ message: "contact deleted!" });
  else {
    res.status(404).json({ message: "Not Found!" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = req.body;
    console.log(error);
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      const result = await contacts.updateContact(
        req.params.contactId,
        req.body
      );
      if (result !== null) res.status(200).json(result);
      else res.status(404).json({ message: "Not found!" });
    }
  } catch (err) {
    next(err);
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  try {
    const { error } = favoriteSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      const result = await contacts.updateStatusContact(
        req.params.contactId,
        req.body
      );
      if (Object.keys(result).length !== 0) res.status(200).json(result);
      else res.status(404).json({ message: "Not found!" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
