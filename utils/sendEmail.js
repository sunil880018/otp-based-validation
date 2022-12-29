import nodemailer from "nodemailer";
const sendEmail = (otp, email) => {
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
};
export { sendEmail };
