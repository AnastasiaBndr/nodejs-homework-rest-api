const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { HandleMongooseError } = require("../helpers");

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
  token: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const authSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const schemas = {
  registerSchema,
  authSchema,
};

userSchema.post("save", HandleMongooseError);

const User = model("user", userSchema);

module.exports = { User, schemas };
