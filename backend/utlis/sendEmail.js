import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text, html = null, attachments = []) => {
  try {
    if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials are missing in environment variables");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
      secure: true,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `"HelpForYou" <${process.env.EMAIL}>`,
      to,
      subject,
      text,
      html: html || text,
    };

    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments;
    }

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully to", to);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};

export default sendEmail;