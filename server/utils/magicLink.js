// Send magic link via email (mock implementation)
export const sendMagicLink = async (email, magicLink) => {
  // In production, integrate with email service like SendGrid, AWS SES, etc.
  console.log(`📧 Sending magic link to ${email}: ${magicLink}`);
  
  // Mock email sending
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, messageId: `email_${Date.now()}` });
    }, 1000);
  });
};