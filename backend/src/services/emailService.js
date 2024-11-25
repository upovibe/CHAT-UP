import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other email services like SendGrid, Mailgun, etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send email verification
export const sendEmailVerification = async (email, token) => {
    try {
        const verificationLink = `${process.env.CLIENT_URL}/verify-email/${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Email Address',
            text: `Click on the link to verify your email: ${verificationLink}`,
            html: `<p>Click on the link below to verify your email address:</p><a href="${verificationLink}">Verify Email</a>`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email verification');
    }
};
