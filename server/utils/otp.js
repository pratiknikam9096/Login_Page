// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS (mock implementation)
export const sendOTP = async (phone, otp) => {
  // In production, integrate with SMS service like Twilio, AWS SNS, etc.
  console.log(`📱 Sending OTP ${otp} to ${phone}`);
  
  // Mock SMS sending
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, messageId: `msg_${Date.now()}` });
    }, 1000);
  });
};