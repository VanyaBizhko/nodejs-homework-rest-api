const { User } = require("../models/user");
const bcryptjs = require("bcrypt");
const { cntrlWrapper, HttpError, sendEmail } = require("../helpers");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const {BASE_URL}= process.env

const avatarsDir = path.join(__dirname, "../", 'public', 'avatars');

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "this email is already in use");
  }
  const hashPassword = await bcryptjs.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const veryficationCode = nanoid();

  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, veryficationCode });
  const verifyEmail = {
    to: email, subject: "Verify email",
    text:`<a target='_blank' href="${BASE_URL}/api/users/verify/${veryficationCode}">Click verify email</a>`
  }
  await sendEmail(verifyEmail);

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
};

const verifyEmail = async (req, res) => {
  const { veryficationCode } = req.params;
  const user = await User.findOne({ veryficationCode });
  if (!user) { 
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, { verify: true, veryficationCode: '' });

  res.json({
    message:'Verified'
  })

};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found")
  }
  if (user.verify) {
    throw HttpError(404, "User already verified")
  }
  const verifyEmail = {
    to: email, subject: "Verify email",
    text: `<a target='_blank' href="${BASE_URL}/api/users/verify/${user.veryficationCode}">Click verify email</a>`
  };
  await sendEmail(verifyEmail);
  res.json({
    message: 'Verify email send successfully'
  })
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "email or password invalid");
  }

  if (!user.verify) {
    throw HttpError(404 , "User not found");
  }

  const passwordCompare = await bcryptjs.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
  });
};
const logout = async (req, res) => {
  const { id } = req.user;
  await User.findByIdAndUpdate(id, { token: "" });
  res.json({
    message: "logout success",
  });
};
const getCurrent = async (req, res) => {
  const { email, name } = req.user;
  res.json({
    email, name,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL })
  
  res.json({
    avatarURL,
  })
};
module.exports = {
  register: cntrlWrapper(register),
  verifyEmail: cntrlWrapper(verifyEmail),
  resendVerifyEmail:cntrlWrapper(resendVerifyEmail),
  login: cntrlWrapper(login),
  getCurrent: cntrlWrapper(getCurrent),
  logout: cntrlWrapper(logout),
  updateAvatar:cntrlWrapper(updateAvatar),
};