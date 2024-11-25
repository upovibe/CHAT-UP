import { Vonage } from '@vonage/server-sdk';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize the Vonage client with your API credentials from environment variables
const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

// Function to send SMS verification code
export const sendSMSVerification = async (phoneNumber, code) => {
  const from = process.env.VONAGE_FROM_NUMBER || "Vonage APIs";
  const text = `Your verification code is: ${code}`;

  try {
    // Send SMS using the Vonage API
    const response = await vonage.sms.send({ to: phoneNumber, from: from, text: text });

    if (response.messages[0].status === '0') {
      console.log(`SMS sent to ${phoneNumber}`);
    } else {
      console.error(`Error sending SMS: ${response.messages[0]['error-text']}`);
      throw new Error(`Failed to send SMS verification: ${response.messages[0]['error-text']}`);
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Failed to send SMS verification');
  }
};
