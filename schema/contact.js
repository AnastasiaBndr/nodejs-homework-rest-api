const { Schema, model } = require("mongoose");
const Joi = require("joi");

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
});

const favoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const updateSchema = Joi.object({
  name: Joi.string().required(),
});

const Contact = model("contact", contactSchema);

module.exports = { Contact, favoriteSchema, updateSchema };
