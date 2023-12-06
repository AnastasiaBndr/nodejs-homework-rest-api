const { Schema, model } = require("mongoose");
const Joi = require("joi");

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phoneRegex = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
    required: [true, "Set email for contact"],
  },
  phone: {
    type: String,
    required: [true, "Set phone for contact"],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const favoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const updateSchema = Joi.object({
  name: Joi.string().required(),
});

const contactsSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

contactSchema.pre("validate", function (next) {
  const contact = this;
  if (contact.email) {
    if (!emailRegex.test(contact.email)) {
      return next(new Error("Please fill a valid email address: aa@gmail.com"));
    }
  }
  if (contact.phone) {
    if (!phoneRegex.test(contact.phone)) {
      return next(new Error("Please write allowed phone: (000)111 1111"));
    }
  }
  next();
});

const Contact = model("contact", contactSchema);

module.exports = { Contact, favoriteSchema, updateSchema, contactsSchema };
