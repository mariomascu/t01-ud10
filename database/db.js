import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Para leer variables de .env

const connection = await mysql.createConnection({
  host: "localhost",   
  user: "root",   
  password: "", 
  database: "empresadb", // Cambia esto por el nombre de tu base de datos
  port: 3306     
});

export default connection;
