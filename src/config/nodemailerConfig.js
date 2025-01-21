const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter with Gmail using App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Your Gmail address
    pass: process.env.EMAIL_PASS,  // Your App Password
  },
});

// Function to send email with OTP
const sendEmailForOtp = async (to, subject, otp) => {
    // HTML Template with inline CSS for the OTP email
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset OTP</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  color: #333;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 10px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                  text-align: center;
                  padding-bottom: 20px;
              }
              .header h1 {
                  color: #38a169; /* Green color */
                  font-size: 36px;
                  margin: 0;
              }
              .otp {
                  font-size: 36px;
                  font-weight: bold;
                  color: #38a169; /* Green color */
                  background-color: #f4fdf1;
                  padding: 20px;
                  border-radius: 8px;
                  text-align: center;
                  margin-top: 20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border: 2px solid #38a169;
              }
              .otp span {
                  margin-left: 10px;
                  font-size: 24px;
              }
              .lock-icon {
                  font-size: 36px;
                  color: #38a169;
                  margin-right: 10px;
              }
              .copy-btn {
                  display: inline-block;
                  padding: 12px 25px;
                  background-color: #38a169;
                  color: white;
                  font-weight: bold;
                  border-radius: 5px;
                  margin-top: 20px;
                  cursor: pointer;
                  text-decoration: none;
                  text-align: center;
                  width: 100%;
                  font-size: 16px;
              }
              .footer {
                  text-align: center;
                  font-size: 14px;
                  color: #777;
                  padding-top: 20px;
              }
              .footer a {
                  color: #38a169; /* Green color */
                  text-decoration: none;
              }
              .message {
                  text-align: center;
                  font-size: 16px;
                  color: #555;
                  padding: 20px 0;
              }
              .footer p {
                  font-size: 12px;
                  color: #888;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Password Reset OTP</h1>
              </div>
              <div class="message">
                  <p>Hello,</p>
                  <p>You requested to reset your password. Please use the following OTP:</p>
              </div>
              <div class="otp">
                  <span class="lock-icon">🔒</span>
                  <span>${otp}</span>
              </div>
              <div class="message">
                  <p>This OTP is valid for 40 seconds.</p>
              </div>
              <div class="footer">
                  <p>If you did not request this, please ignore this email.</p>
                  <p>&copy; 2025 Your Company Name. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `;
  
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlTemplate, // Use HTML instead of plain text
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  
const sendEmailForRegister = async (to, subject, username) => {
    // HTML Template with inline CSS for the Registration Confirmation email
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Congratulations on Your Registration</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  color: #333;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 10px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                  text-align: center;
                  padding-bottom: 20px;
              }
              .header h1 {
                  color: #38a169; /* Green color */
                  font-size: 36px;
                  margin: 0;
              }
              .message {
                  text-align: center;
                  font-size: 18px;
                  color: #555;
                  padding: 20px 0;
              }
              .congratulations {
                  font-size: 36px;
                  font-weight: bold;
                  color: #38a169; /* Green color */
                  background-color: #f4fdf1;
                  padding: 20px;
                  border-radius: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-top: 20px;
                  border: 2px solid #38a169;
              }
              .congratulations span {
                  margin-left: 10px;
                  font-size: 24px;
              }
              .emoji {
                  font-size: 36px;
                  color: #38a169;
                  margin-right: 10px;
              }
              .footer {
                  text-align: center;
                  font-size: 14px;
                  color: #777;
                  padding-top: 20px;
              }
              .footer a {
                  color: #38a169; /* Green color */
                  text-decoration: none;
              }
              .cta-btn {
                  display: inline-block;
                  padding: 12px 25px;
                  background-color: #38a169;
                  color: white;
                  font-weight: bold;
                  border-radius: 5px;
                  margin-top: 20px;
                  cursor: pointer;
                  text-decoration: none;
                  width: 100%;
                  font-size: 16px;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Congratulations, ${username}!</h1>
              </div>
              <div class="message">
                  <p>We’re excited to have you join our community!</p>
                  <p>Your registration was successful, and you’re all set to get started.</p>
              </div>
              <div class="congratulations">
                  <span class="emoji">🎉</span>
                  <span>Welcome to the team!</span>
              </div>
              <div class="message">
                  <p>If you need any help getting started, feel free to reach out to our support team!</p>
                  <a href="https://yourwebsite.com/dashboard" class="cta-btn">Go to Dashboard</a>
              </div>
              <div class="footer">
                  <p>Thank you for registering with us. We’re happy to have you on board.</p>
                  <p>&copy; 2025 Your Company Name. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `;
  
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlTemplate, // Use HTML instead of plain text
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  
  
  

module.exports = {
    sendEmailForOtp,
    sendEmailForRegister
};
