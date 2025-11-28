// controllers/documentosController.js
const path = require("path");
const fs = require("fs");

exports.descargarDocumento = (req, res) => {

  const archivo = req.params.archivo;
  const rutaDocumento = path.join(__dirname, "..", "documents", archivo);


  if (!fs.existsSync(rutaDocumento)) {
    return res.status(404).json({ error: "Archivo no encontrado" });
  }

  res.download(rutaDocumento, (err) => {
    if (err) {
      console.error("Error al enviar archivo:", err);
      return res.status(500).json({ error: "Error al descargar el archivo" });
    }
  });
};
