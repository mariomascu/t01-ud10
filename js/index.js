"use strict";

import express from "express";

//creación del servidor con createServer
/* const server = http.createServer((req, res) => {
	res.end("Solicitud de respuesta: ");
}); */

//creación del servidor con Express

//const express = require("express"); //express se convierte en la función que recibe del require
const app = express();

//configuración del puerto
const PORT = 3000;

server.listen(PORT, () => {
	console.log("Puerto escuchando la solicitud");
});
