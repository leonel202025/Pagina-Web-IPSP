const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  const { nombre, correo, asunto, mensaje } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Usa una variable de entorno para el email
      pass: process.env.GMAIL_PASS, // Usa una variable de entorno para la contraseña
    },
  });

  const mailOptions = {
    from: `"Consulta Web" <${process.env.GMAIL_USER}>`,
    to: 'leonsosaf9@gmail.com', // Cambia este a tu correo de destino
    subject: `Nuevo mensaje de contacto: ${asunto}`,
    replyTo: correo,
    html: `
      <h2>Formulario de contacto</h2>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Correo:</strong> ${correo}</p>
      <p><strong>Asunto:</strong> ${asunto}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${mensaje}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error);
    res.status(500).json({ message: 'Error al enviar el correo' });
  }
});


module.exports = router;
