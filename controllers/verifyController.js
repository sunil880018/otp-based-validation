import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/badRequest.js";
import { NotFoundError } from "../errors/notFound.js";
import { OTP } from "../models/Otp.js";
import bcrypt from "bcrypt";
const verifyController = async (req, res) => {
  try {
    const { id, otp } = req.body;
    if (!id || !otp) {
      throw new BadRequestError("Please provide id and otp.");
    }
    const userOtp = await OTP.findOne({ userId: id });
    if (!userOtp) {
      throw new NotFoundError(`invaid id ${id}`);
    }

    const isValid = await bcrypt.compare(otp, userOtp.otp);
    if (isValid) return res.status(StatusCodes.OK).json({ msg: "Success" });
    else throw new BadRequestError(`${otp} has expired.`);
  } catch (error) {
    if (error.statusCode === 404) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: error.message, statusCode: error.statusCode });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.message, statusCode: error.statusCode });
  }
};

export { verifyController };
