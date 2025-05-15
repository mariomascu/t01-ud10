"use strict";

import express from "express";

//creación del servidor con Express
const app = express();

//configuración del puerto
const PORT = 3000;

app.listen(PORT, () => {
	console.log("Puerto escuchando la solicitud");
});
