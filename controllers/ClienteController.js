"use strict";
const db = require('../database/db');

const url = "http://localhost:3000/clientes";

//método para añadir un cliente
export const addCliente = async (cliente) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cliente)
  });
  const data = await response.json();
  return data;
};

// método para mostrar todos los clientes
export const getClientes = async () => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// método para obtener un sólo cliente al que le paso el id por parámetro
export const getCliente = async (id) => {
  const response = await fetch(`${url}/${id}`);
  const data = await response.json();
  return data;
};

// método para eliminar un cliente
export const deleteCliente = async (id) => {
  const response = await fetch(`${url}/${id}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  return data;
};

// método con el que actualizo un cliente
export const updateCliente = async (cliente) => {
  const response = await fetch(`${url}/${cliente.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cliente)
  });
  const data = await response.json();
  return data;
};
