import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendPasswordEmail = async (to, password) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: "Your Account Password",
        text: `Your temporary password is: ${password}`
    };

    return transporter.sendMail(mailOptions);
};
