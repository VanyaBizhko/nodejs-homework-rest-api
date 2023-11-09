const nodemailer = require('nodemailer');
require('dotenv').config();
const { META_PASSWORD } = process.env;

const config = {
  host: 'smtp.meta.ua',
  port: 465,
  secure: true,
  auth: {
    user: 'vanya_bizhko@meta.ua',
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);




const sendEmail = async (data) => {
  try {
    const email = {
      ...data,
      from: 'vanya_bizhko@meta.ua',
    };

   
    await transporter.sendMail(email);

    console.log('Лист було успішно надіслано');
    return true;
  } catch (error) {
    console.error('Помилка під час відправки листа:', error);
    return false;
  }
};

module.exports = sendEmail;

