// utils/emailService.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (email, otp, username) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Digital Journal <onboarding@resend.dev>',
      to: [email],
      subject: 'Verify Your Email - Digital Journal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .header { text-align: center; margin-bottom: 30px; }
                .otp-code { font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #7c3aed; margin: 30px 0; }
                .footer { margin-top: 30px; text-align: center; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Digital Journal</h1>
                    <p>Verify Your Email Address</p>
                </div>
                
                <p>Hello ${username},</p>
                
                <p>Thank you for registering with Digital Journal. Use the OTP below to verify your email address:</p>
                
                <div class="otp-code">${otp}</div>
                
                <p>This OTP will expire in 10 minutes.</p>
                
                <p>If you didn't create an account with us, please ignore this email.</p>
                
                <div class="footer">
                    <p>&copy; 2024 Digital Journal. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send email');
    }

    return data;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

const sendPasswordResetEmail = async (email, otp, username) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Digital Journal <onboarding@resend.dev>',
      to: [email],
      subject: 'Reset Your Password - Digital Journal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .header { text-align: center; margin-bottom: 30px; }
                .otp-code { font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #dc2626; margin: 30px 0; }
                .footer { margin-top: 30px; text-align: center; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Digital Journal</h1>
                    <p>Password Reset Request</p>
                </div>
                
                <p>Hello ${username},</p>
                
                <p>We received a request to reset your password. Use the OTP below to verify your identity:</p>
                
                <div class="otp-code">${otp}</div>
                
                <p>This OTP will expire in 10 minutes.</p>
                
                <p>If you didn't request a password reset, please ignore this email.</p>
                
                <div class="footer">
                    <p>&copy; 2024 Digital Journal. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send email');
    }

    return data;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail
};