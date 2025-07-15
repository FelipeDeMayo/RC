const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const sendPasswordResetEmail = async (to, resetToken) => {
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await resend.emails.send({
    from: 'RC Fitness <onboarding@resend.dev>',
    to,
    subject: 'Redefinição de Senha - RC Fitness',
    html: `<p>Você solicitou uma redefinição de senha. Por favor, clique neste <a href="${resetURL}">link</a> para criar uma nova senha. Este link é válido por 10 minutos.</p>`,
  });
};
module.exports = { sendPasswordResetEmail };
