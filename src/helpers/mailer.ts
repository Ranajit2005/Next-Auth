import nodemailer from "nodemailer";
import bcriptjs from "bcryptjs";
import User from "@/models/userModel";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    //Here we genarate a hased token whose based salt length is 10
    const hasedToken = await bcriptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {     //Here we set the verifyToken and verifyTokenExpiry
          verifyToken: hasedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {     //Here we set the forgotPasswordToken and forgotPasswordTokenExpiry
          forgotPasswordToken: hasedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
      });
    }

    //We copy it from the nodemailer and replace it by mailtrap code

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "4156391cccf22f",
        pass: "205ec9dbe73526",
      },
    });

    //We copy it from the nodemailer
    const mailOption = {
      from: "18ranajit2005@gmail.com", // sender address
      to: email, // list of receivers
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
      html: `<p>
          Click <a href="${
            process.env.DOMAIN
          }/verifyemail?token=${hasedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }
          or copy and paste the link below in your browser.
          <br>
          ${process.env.DOMAIN}/verifyemail?token=${hasedToken}   
      </p>`,
    };

    const mailResponce = await transporter.sendMail(mailOption);
    return mailResponce;
  } catch (error: any) {
    throw new Error(error.message);
  }
};