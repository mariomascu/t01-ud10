"use strict";

//importo las dependencias necesarias
import express from "express";
import cors from "cors";
import db from './database/db.js';

const app = express(); // creo una instancia de express
const PORT = 3000; // Defino el puerto en el que se ejecutará el servidor

// Middleware
app.use(express.json());
app.use(cors()); // Importante para evitar que pete el CORS

// Obtener todos los clientes
app.get('/clientes', async (req, res) => {
    try {
        const [clientes] = await db.query('SELECT * FROM clientes');
        
        res.json({ 
            data: clientes
        });
    } catch (error) {
        res.status(500).json({ 
            data: [],
            error: 'Error al leer los clientes'
        });
    }
});

// obtención de un cliente específico
app.get('/clientes/:id', async (req, res) => {
    const clienteId = parseInt(req.params.id);
    try {
        const [rows] = await db.query('SELECT * FROM clientes WHERE id = ?', [clienteId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        // Devolver directamente el cliente (como espera actualizarCliente)
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el cliente' });
    }
});

// Creación de un nuevo cliente
app.post('/clientes', async (req, res) => {
    const { nombreCliente, emailCliente, tlfnoCliente, empresaCliente } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO clientes (nombreCliente, emailCliente, tlfnoCliente, empresaCliente) VALUES (?,?,?,?)',
            [nombreCliente, emailCliente, tlfnoCliente, empresaCliente]
        );
      
        res.status(201).json({ 
            mensaje: "insertado",
            id: result.insertId, 
            nombreCliente, 
            emailCliente, 
            tlfnoCliente, 
            empresaCliente 
        });
    } catch (error) {
        res.status(500).json({ mensaje: "error", error: error.message });
    }
});

// Actualización un cliente
app.put('/clientes/:id', async (req, res) => {
    const clienteId = parseInt(req.params.id);
    const { nombreCliente, emailCliente, tlfnoCliente, empresaCliente } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE clientes SET nombreCliente = ?, emailCliente = ?, tlfnoCliente = ?, empresaCliente = ? WHERE id = ?',
            [nombreCliente, emailCliente, tlfnoCliente, empresaCliente, clienteId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "error", error: 'Cliente no encontrado' });
        }

        res.json({ mensaje: "actualizado" });
    } catch (error) {
        res.status(500).json({ mensaje: "error", error: 'Error al actualizar el cliente' });
    }
});

// Eliminar un cliente
app.delete('/clientes/:id', async (req, res) => {
    const clienteId = parseInt(req.params.id);
    try {
        const [result] = await db.query('DELETE FROM clientes WHERE id = ?', [clienteId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "error", error: 'Cliente no encontrado' });
        }
      
        res.json({ mensaje: "eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: "error", error: 'Error al eliminar el cliente' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});