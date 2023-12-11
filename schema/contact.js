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
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
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

  const requiredFields = ["name", "email", "phone"];
  const missingFields = requiredFields.filter((field) => !contact[field]);

  if (missingFields.length > 0) {
    const errorMessage = `Required fields are missing: ${missingFields.join(
      ", "
    )}`;
    return next(new Error(errorMessage));
  }

  if (contact.email && !emailRegex.test(contact.email)) {
    return next(new Error("Please fill a valid email address: aa@gmail.com"));
  }

  if (contact.phone && !phoneRegex.test(contact.phone)) {
    return next(new Error("Please write allowed phone: (000)111 1111"));
  }

  next();
});

const Contact = model("contact", contactSchema);

module.exports = { Contact, favoriteSchema, updateSchema, contactsSchema };
