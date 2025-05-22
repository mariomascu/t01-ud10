"use strict";

import express from "express";
import fs from 'fs/promises';
import db from './database/db.js'; // Importa la conexión a la base de datos


//creación del servidor con Express
const app = express();
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.json()); // Para leer JSON del body

//configuración del puerto para escuchar mysql
const PORT = 3000;

// Ruta del archivo de base de datos
//const ruta_db = path.join(__dirname, 'db.json');
const ruta_db = "db.json";

// Función para leer la base de datos
const leerDB = async () => {
    try {
        const data = await fs.readFile(ruta_db, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Si no existe el archivo, crear uno vacío
        const datosVacios = { clientes: [] };
        await fs.writeFile(ruta_db, JSON.stringify(datosVacios, null, 2));
        return datosVacios;
    }
};

// Función para escribir en la base de datos
const escribirDB = async (datos) => {
    await fs.writeFile(ruta_db, JSON.stringify(datos, null, 2));
};


// RUTAS DE LA API (estas son las que responden a tu controlador frontend)

// GET /clientes - Obtener todos los clientes
app.get('/clientes', async (req, res) => {
    try {
        const db = await leerDB();
        res.json(db.clientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los clientes' });
    }
});

// GET /clientes/:id - Obtener un cliente específico
app.get('/clientes/:id', async (req, res) => {
    try {
        const db = await leerDB();
        const cliente = db.clientes.find(c => c.id === parseInt(req.params.id));
        
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el cliente' });
    }
});

// POST /clientes - Crear un nuevo cliente
app.post('/clientes', async (req, res) => {
    const { nombreCliente, emailCliente, tlfnoCliente, empresaCliente } = req.body;
	try {
		const [result] = await db.query('INSERT INTO clientes (nombreCliente, emailCliente, tlfnoCliente, empresaCliente) VALUES (?,?,?,?)', [nombreCliente, emailCliente, tlfnoCliente, empresaCliente]);
		res.status(201).json({ nombreCliente, emailCliente, tlfnoCliente, empresaCliente});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// PUT /clientes/:id - Actualizar un cliente
app.put('/clientes/:id', async (req, res) => {
    try {
        const db = await leerDB();
        const clienteIndex = db.clientes.findIndex(c => c.id === parseInt(req.params.id));
        
        if (clienteIndex === -1) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        
        const { nombre, email, telefono } = req.body;
        
        // Actualizar solo los campos que llegan
        if (nombre) db.clientes[clienteIndex].nombre = nombre;
        if (email) db.clientes[clienteIndex].email = email;
        if (telefono !== undefined) db.clientes[clienteIndex].telefono = telefono;
        
        await escribirDB(db);
        
        res.json(db.clientes[clienteIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el cliente' });
    }
});

// DELETE /clientes/:id - Eliminar un cliente
app.delete('/clientes/:id', async (req, res) => {
    try {
        const db = await leerDB();
        const clienteIndex = db.clientes.findIndex(c => c.id === parseInt(req.params.id));
        
        if (clienteIndex === -1) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        
        const clienteEliminado = db.clientes.splice(clienteIndex, 1)[0];
        await escribirDB(db);
        
        res.json({ message: 'Cliente eliminado', cliente: clienteEliminado });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el cliente' });
    }
});




app.listen(PORT, () => {
	console.log("Puerto escuchando la solicitud");
});
