"use strict";

import { addCliente, deleteCliente, getClientes, getCliente, updateCliente } from "./__API.js";
import { mensaje } from "./funciones.js";

let id; // Guardo el ID del cliente cuando voy a editarlo

document.addEventListener("DOMContentLoaded", () => {
  confFormulario();
  mostrarClientes();
  
  $(".addCliente").on("click", () => {
    // Configuración de la ventana modal para añadir
    document.querySelector(".modal-title").innerText = "Añadir Cliente";
    document.querySelector(".submit").innerText = "Insertar";
    $("#frmModal").modal("show");
  });

  // Limpieza  del formulario cuando se cierra el modal
  $("#frmModal").on("hidden.bs.modal", () => {
    $("input").val("");
  });
});

const confFormulario = () => {
  $(".frmClientes").validate({
    errorElement: "em",
    errorPlacement: function (error, element) {
      error.addClass("invalid-feedback");
      if (element.prop("type") === "radio") {
        error.insertAfter(element.parent("div"));
      } else {
        error.insertAfter(element);
      }
    },
    errorClass: "is-invalid",
    validClass: "is-valid",
    highlight: function (element, errorClass, validClass) {
      $(element).addClass(errorClass).removeClass(validClass);
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).addClass(validClass).removeClass(errorClass);
    },
    rules: {
      nombreCliente: "required",
      emailCliente: { required: true, email: true },
      tlfnoCliente: { required: true, minlength: 9 },
      empresaCliente: "required"
    },
    submitHandler: (form) => {
    
      if (document.querySelector(".submit").innerText == "Insertar") {
        add();
      } else {
        grabarActCliente();
      }
    }
  });
};

// añade un cliente a la base de datos
const add = async () => {
  let cliente = {
    nombreCliente: document.querySelector("#nombreCliente").value,
    emailCliente: document.querySelector("#emailCliente").value,
    tlfnoCliente: document.querySelector("#tlfnoCliente").value,
    empresaCliente: document.querySelector("#empresaCliente").value
  };
  
  const data = await addCliente(cliente);

  // Limpieza y cierre del formulario
  $("input").val("");
  $("#frmModal").modal("hide");
  
  if (data.mensaje == "insertado") {
    mensaje("Cliente grabado", "success");
    mostrarClientes();
  } else {
    mensaje("Cliente NO grabado", "error");
  }
};

const mostrarClientes = async () => {
  const botAcc = `<button type='button' class='edit btn btn-success'><i class="fa-regular fa-pen-to-square"></i></button><button type='button' class='del btn btn-danger ms-2'><i class="fa-solid fa-trash"></i></button>`;
  
  $(".table tbody").empty();
  
  try {
    const clientes = await getClientes();
    
    // Manejo de diferentes estructuras de respuesta de la API
    let clientesArray;
    if (clientes.data && Array.isArray(clientes.data.data)) {
      clientesArray = clientes.data.data;
    } else if (clientes.data && Array.isArray(clientes.data)) {
      clientesArray = clientes.data;
    } else if (Array.isArray(clientes)) {
      clientesArray = clientes;
    } else {
      clientesArray = [];
    }
    
    if (clientesArray.length > 0) {
      // carga cada cliente en la tabla
      clientesArray.forEach((cliente) => {
        $(".table tbody").append(
          `<tr><td>${cliente.id}</td><td>${cliente.nombreCliente}</td><td>${cliente.emailCliente}</td><td>${cliente.tlfnoCliente}</td><td>${cliente.empresaCliente}</td><td>${botAcc}</td></tr>`
        );
      });
      
      // Asigno los eventos a los botones que acabo de crear
      $(".del").on("click", eliminarCliente);
      $(".edit").on("click", actualizarCliente);
    } else {
      $(".table tbody").append(
        `<tr><td colspan=6 class="text-center">No hay registros</td></tr>`
      );
    }
  } catch (error) {
    console.error("Error al cargar clientes:", error);
    $(".table tbody").append(
      `<tr><td colspan=6 class="text-center">Error al cargar los datos</td></tr>`
    );
  }
};

const eliminarCliente = function() {
  // Obtengo el ID de la primera columna de la fila
  const id = this.parentNode.parentNode.firstChild.innerText;
  
  // Confirmación del SweetAlert para eliminar al cliente seleccionado
  Swal.fire({
    title: "¿Desea eliminar el cliente?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    focusCancel: true
  }).then(async (result) => {
    if (result.isConfirmed) {
      const datos = await deleteCliente(id);
      
      if (datos.mensaje === "eliminado") {
        mensaje("Cliente eliminado", "success");
      } else {
        mensaje("Error al eliminar cliente", "error");
      }
      mostrarClientes();
    }
  });
};

const actualizarCliente = async function() {
  
  id = this.parentNode.parentNode.firstChild.innerText;

  const datos = await getCliente(id);
  
  // Muestro el modal y cargo los datos
  $("#frmModal").modal("show");
  document.querySelector("#nombreCliente").value = datos.nombreCliente;
  document.querySelector("#emailCliente").value = datos.emailCliente;
  document.querySelector("#tlfnoCliente").value = datos.tlfnoCliente;
  document.querySelector("#empresaCliente").value = datos.empresaCliente;
  
  // textos del modal
  document.querySelector(".modal-title").innerText = "Modificar Cliente";
  document.querySelector(".submit").innerText = "Modificar";
};

const grabarActCliente = async () => {
  // Construcción del objeto cliente con todos los datos
  const cliente = {
    'id': id,
    'nombreCliente': document.querySelector("#nombreCliente").value,
    'emailCliente': document.querySelector("#emailCliente").value,
    'tlfnoCliente': document.querySelector("#tlfnoCliente").value,
    'empresaCliente': document.querySelector("#empresaCliente").value
  };
   
  const datos = await updateCliente(cliente);
   
  if (datos.mensaje == "actualizado") {
    mensaje("Cliente actualizado", "success");
    mostrarClientes();
  } else {
    mensaje("Cliente No actualizado", "error");
  }
  
  // Limpieza y cierre del formulario
  $("input").val("");
  $("#frmModal").modal("hide");
};