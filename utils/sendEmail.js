import nodemailer from "nodemailer";
import { Email_host, Email_password, Email_port, Email_userName,} from "../config/config.js";

export const sendEmail = async(option) => {
  const transporter = nodemailer.createTransport({
    host: Email_host,
    port: Email_port,
    auth: {
      user: Email_userName,
      pass: Email_password,
    },
  });
  // based on service we use configuration is changed, here we use mailTrap service
  const emailOptions = {
    from: "Cineflex support<support@cineflex.com>",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  await transporter.sendMail(emailOptions) 
};
