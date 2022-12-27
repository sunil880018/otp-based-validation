import { User } from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/badRequest.js";
import otpGenerator from "otp-generator";
import { OTP } from "../models/Otp.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const registerContoller = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      throw new BadRequestError("Please provide name and email");
    }
    const user = await User.create({ name, email });
    // generate otp
    const otp = otpGenerator.generate(6, {
      digits: true,
    });
    // encrypt otp
    const hashOtp = await bcrypt.hash(otp, 10);

    await OTP.create({ userId: user._id, otp: hashOtp });
    // Send the OTP to the user's email
    nodemailer.createTestAccount((error, account) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Test account created:", account);

        // Set up the SMTP server
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });

        // Send a dummy email
        const mailOptions = {
          from: account.user,
          to: email,
          subject: "OTP for login",
          text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
          } else {
            console.log("email sent:" + info.response);
          }
        });
      }
    });

    return res.status(StatusCodes.CREATED).json({ user, otp });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.message, statusCode: error.statusCode });
  }
};

export { registerContoller };
