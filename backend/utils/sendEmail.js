// Email sending is disabled. This is a dummy function.
const sendEmail = async (to, subject, html) => {
  console.log('[Email Disabled] Would send email to:', to, 'Subject:', subject);
  return Promise.resolve();
};

module.exports = sendEmail; 