const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('archivo');

router.post('/', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error al subir archivo:', err);
      return res.status(400).json({ 
        success: false,
        message: err.code === 'LIMIT_FILE_SIZE' 
          ? 'El archivo es demasiado grande (máx 5MB)' 
          : 'Error al procesar el archivo'
      });
    }

    try {
      const { nombre, correo, asunto, mensaje } = req.body;
      const archivo = req.file;

      if (!nombre || !correo || !asunto || !mensaje) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son obligatorios'
        });
      }

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: `"Formulario de Contacto" <${process.env.GMAIL_USER}>`,
        to: 'leonsosaf9@gmail.com',
        subject: `Nuevo mensaje: ${asunto}`,
        replyTo: correo,
        html: `
          <h2>Nuevo contacto</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${correo}</p>
          <p><strong>Asunto:</strong> ${asunto}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${mensaje.replace(/\n/g, '<br>')}</p>
        `,
        attachments: archivo ? [{
          filename: archivo.originalname,
          content: archivo.buffer
        }] : []
      };

      await transporter.sendMail(mailOptions);
      
      res.json({ 
        success: true,
        message: 'Mensaje enviado correctamente' 
      });

    } catch (error) {
      console.error('Error al enviar email:', error);
      res.status(500).json({
        success: false,
        message: 'Error al enviar el mensaje',
        error: error.message
      });
    }
  });
});

module.exports = router;