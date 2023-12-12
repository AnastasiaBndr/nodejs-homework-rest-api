const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { HandleMongooseError } = require("../helpers");

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: "",
  },
  avatarURL: {
    type: String,
    required: true,
  },
});

const registerSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const authSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const userJoiSchema = Joi.object({
  email: Joi.string().required(),
});

const schemas = {
  registerSchema,
  authSchema,
  userJoiSchema,
};

userSchema.pre("validate", function (next) {
  const contact = this;

  const requiredFields = ["email"];
  const missingFields = requiredFields.filter((field) => !contact[field]);

  if (missingFields.length > 0) {
    const errorMessage = `Required fields are missing: ${missingFields.join(
      ", "
    )}`;
    return next(new Error(errorMessage));
  }
  console.log(emailRegex.test(contact.email));
  if (contact.email && !emailRegex.test(contact.email)) {
    return next(new Error("Please fill a valid email address: aa@gmail.com"));
  }
  next();
});

userSchema.post("save", HandleMongooseError);

const User = model("user", userSchema);

module.exports = { User, schemas };
