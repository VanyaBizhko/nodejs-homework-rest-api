const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseModel } = require("../helpers");
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
  name: {
    type: String,
    required: true,
  },
  avatarURL: {
    type: String,
    required: true, 
  },
  verify: {
    type: Boolean,
    default: false,
  },
  veryficationCode: {
    type: String,
    default: ''

  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: String,
  
});
userSchema.post("save", handleMongooseModel);

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});
const emailSchema = Joi.object({
  email: Joi.string().required(),
})


const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const schemas = {
  registerSchema,
  emailSchema,
  loginSchema,
  
};

const User = model("user", userSchema);

module.exports = {
  schemas,
  User,
};