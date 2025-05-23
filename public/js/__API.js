"use strict";

const url = "http://localhost:3000/clientes";

//método para añadir un cliente
export const addCliente = async (cliente) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cliente)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding cliente:', error);
    return { mensaje: "error", error: error.message };
  }
};

// método para mostrar todos los clientes
export const getClientes = async () => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Datos recibidos del servidor:', data);
    return data;
  } catch (error) {
    console.error('Error getting clientes:', error);
    return { data: [], mensaje: "error", error: error.message };
  }
};

// método para obtener un sólo cliente al que le paso el id por parámetro
export const getCliente = async (id) => {
  try {
    const response = await fetch(`${url}/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting cliente:', error);
    return { mensaje: "error", error: error.message };
  }
};

// método para eliminar un cliente
export const deleteCliente = async (id) => {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting cliente:', error);
    return { mensaje: "error", error: error.message };
  }
};

// método con el que actualizo un cliente
export const updateCliente = async (cliente) => {
  try {
    const response = await fetch(`${url}/${cliente.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cliente)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating cliente:', error);
    return { mensaje: "error", error: error.message };
  }
};