import { User } from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/badRequest.js";
import { generateOTP } from "../utils/generateOTP.js";
import { OTP } from "../models/Otp.js";
import bcrypt from "bcrypt";

const registerContoller = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      throw new BadRequestError("Please provide name and email");
    }

    const user = await User.create({ name, email });
    const otp = generateOTP();
    const hashOtp = await bcrypt.hash(otp, 10);
    await OTP.create({ userId: user._id, otp: hashOtp });

    sendEmail(otp, email);
    return res.status(StatusCodes.CREATED).json({ user, otp });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.message, statusCode: error.statusCode });
  }
};

export { registerContoller };
