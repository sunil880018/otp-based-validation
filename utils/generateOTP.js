import otpGenerator from "otp-generator";
const generateOTP = () => {
  const otp = otpGenerator.generate(6, {
    digits: true,
  });
  return otp;
};
export { generateOTP };
