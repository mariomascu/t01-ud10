"use strict";

import express from "express";
import * as clienteController from "../controllers/ClienteController.js";

const router = express.Router();

// GET /api/clientes - Obtener todos los clientes
router.get('/clientes', clienteController.getClientes);

// GET /api/clientes/:id - Obtener un cliente por ID
router.get('/clientes:id', clienteController.getCliente);

// POST /api/clientes - Crear un nuevo cliente
router.post('/clientes', clienteController.addCliente);

// PUT /api/clientes/:id - Actualizar un cliente
router.put('/clientes:id', clienteController.updateCliente);

// DELETE /api/clientes/:id - Eliminar un cliente
router.delete('/clientes:id', clienteController.deleteCliente);

export default router;