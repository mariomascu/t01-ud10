"use strict";

import { addCliente, deleteCliente, getClientes, getCliente, updateCliente } from "./API.js";
import { mensaje } from "./funciones.js";

let id;//Almacena el ID del cliente de la fila seleccionada cuando se pulsa un botón de acción en la fila

document.addEventListener("DOMContentLoaded", () => {
  confFormulario(); //configurar formulario con restricciones para la validación
  mostrarClientes(); //cargar clientes en la tabla
  $(".addCliente").on("click",() => {
    //llamar a la ventana modal
  //modificar los textos para que se muestre correctamente cuando la ventana modal se muestra
  //para añadir un cliente.
      console.log("Configurando ventana modal para añadir...")
      document.querySelector(".modal-title").innerText="Añadir Cliente";
      document.querySelector(".submit").innerText="Insertar";
      $("#frmModal").modal("show");
  });
  /* document.querySelector(".addCliente").addEventListener("click", () => {
    //llamar a la ventana modal
  //modificar los textos
      document.querySelector(".modal-title").innerText="Añadir Cliente";
      document.querySelector(".submit").innerText="Insertar";

      $("#frmModal").modal("show");
  }); */

   $("#frmModal").on("hidden.bs.modal",()=>{
      $("input").val("");
    })
});

//Función para la validación del formulario con la librería JQuery Validation.
const confFormulario = () => {
  $(".frmClientes").validate({
    errorElement: "em",
    errorPlacement: function (error, element) {
      // Add the `help-block` class to the error element
      error.addClass("invalid-feedback");

      if (element.prop("type") === "radio") {
        error.insertAfter(element.parent("div"));
      } else {
        error.insertAfter(element);
      }
    },
    errorClass:"is-invalid",
    validClass:"is-valid",
    highlight: function (element, errorClass, validClass) {
      $(element).addClass(errorClass).removeClass(validClass);
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).addClass(validClass).removeClass(errorClass);
    },
    rules: {
      nameCliente: "required",

      emailCliente: {
        required: true,
        email: true,
      },
      tlfnoCliente: {
        required: true,
        minlength: 9,
      },

      empresaCliente: "required",
    },

    submitHandler: (form) => {
      if(document.querySelector(".submit").innerText=="Insertar"){
        add(); //añadir cliente
      }else{
        grabarActCliente();//actualizar cliente
      }
     
    },
  });
};

//Función que se ejecutará al hacer click sobre elbotón Insertar de la ventana modal
//cuando esta ha sido configurada para añadir un nuevo cliente.
const add = async () => {

  //recoger los datos del formulario en formato urlencoded
  //En el caso de consumir una API Rest que no trabaje con JSON sino con URL Encoded, 
  //se puede obtener esa cadena con todos los campos del formulario y sus valores utilizando
  //el método serialize()
  //let clienteEncoded = $(".frmClientes").serialize();
  //console.log(clienteEncoded);

  //Creamos el objeto JS para pasarlelo a la función que consume la AAPI Rest
  let cliente={
    nameCliente:document.querySelector("#nameCliente").value,
    emailCliente:document.querySelector("#emailCliente").value,
    tlfnoCliente:document.querySelector("#tlfnoCliente").value,
    empresaCliente:document.querySelector("#empresaCliente").value
  }
  console.log(cliente);
  
  //llamar a addCliente en API.js
  const data = await addCliente(cliente);

  //limpiar formulario
  $("input").val("");
  //cerrar el formulario
  $("#frmModal").modal("hide");
  //mostrar el mensaje
  if (data.mensaje == "insertado") {
    mensaje("Cliente grabado", "success");
    mostrarClientes();
  } else {
    mensaje("Cliente NO grabado", "error");
  }
};

//Esta función realiza hace uso de nuestra interfaz API consumidora de la api rest automatizada para
//traer los clientes y mostrarlos en una tabla.
const mostrarClientes = async () => {
  const botAcc = `<button type='button' class='edit btn btn-success'><i class="fa-regular fa-pen-to-square"></i></button><button type='button' class='del btn btn-danger ms-2'><i class="fa-solid fa-trash"></i></button>`;
  //vaciar la tabla para borrar los datos y cargarlos de nuevo
  $(".table tbody").empty();
  //cargar los clientes
  //Como getClientes es una función async, la cual envuelve la función en una promesa, la llamada requiere
  //del uso de await.
  const clientes = await getClientes();
  //La función getClientes devuelve un objeto definido por la propia función que contiene un campo data
  //con los datos traídos desde el servidor
  console.log(clientes);
  if (clientes.data.length > 0) {
    //cargar los clientes en la tabla
    clientes.data.forEach((cliente) => {
      $(".table tbody").append(
        `<tr><td>${cliente.id}</td><td>${cliente.nameCliente}</td><td>${cliente.emailCliente}</td><td>${cliente.tlfnoCliente}</td><td>${cliente.empresaCliente}</td><td>${botAcc}</td></tr>`
      );
    });
    //establecer evento click a los botones de acción de cada fila
    $(".del").on("click", eliminarCliente);
    $(".edit").on("click", actualizarCliente);
  } else {//Si no hay registros se indica con un mensaje en la tabla.
    $(".table tbody").append(
      `<tr><td colspan=6 class="text-center">No hay registros</td></tr>`);
  }
};

//Función que asocia al botón de acción eliminar de la fila.
const eliminarCliente =function()  {
  //Se extrae el id de la fila
  const id=this.parentNode.parentNode.firstChild.innerText;
  console.log(id);
  //Se pide confirmación
  Swal.fire({
    title: "¿Desea eliminar el cliente?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    focusCancel:true
  }).then(async(result) => {
    if (result.isConfirmed) {
      //Función deleteCliente
      const datos=await deleteCliente(id);
      mostrarClientes();
      
      
    }
  });
};

//Función que carga los datos del cliente en la ventana modal para su actualización
const actualizarCliente =async function()  {
  //this=botón
  //1º parentNode: la columna que contiene el botón
  //2ª parentNode: la fila que contiene el botón.
  //firstChild: la columna que contiene el ID
   id=this.parentNode.parentNode.firstChild.innerText;

  //cargar los datos del cliente
  const datos= await getCliente(id);
  //mostrar la ventana modal
  $("#frmModal").modal("show");
  //cargar los datos en el formulario
  document.querySelector("#nameCliente").value=datos.nameCliente;
  document.querySelector("#emailCliente").value=datos.emailCliente;
  document.querySelector("#tlfnoCliente").value=datos.tlfnoCliente;
  document.querySelector("#empresaCliente").value=datos.empresaCliente;
//modificar los textos para que el usuario vea que está MODIFICANDO UN CLIENTE
//(la misma ventana modal se utiliza para añadir clientes y se configura en ese caso
//de manera diferente)
  document.querySelector(".modal-title").innerText="Modificar Cliente";
  document.querySelector(".submit").innerText="Modificar";
};

//Esta función graba un cliente que se está actualizando.
const grabarActCliente=async ()=>{
  //Construimos el objeto que la función updateCliente requiere como parámetro de entrada
  //a partir de los datos introducidos.
   const cliente={
    'id':id,
    'nameCliente':document.querySelector("#nameCliente").value,
    'emailCliente':document.querySelector("#emailCliente").value,
    'tlfnoCliente':document.querySelector("#tlfnoCliente").value,
    'empresaCliente': document.querySelector("#empresaCliente").value
   }
   //Llamamos a updateCliente que como es una función async requiere el uso de await
   const datos= await updateCliente(cliente);
   //mostrar el mensaje
   if (datos.mensaje=="actualizado"){
    mensaje("Cliente actualizado", "success");
    mostrarClientes();
   }else{
    mensaje("Cliente No actualizado", "error");
   }
   //limpiar y cerrar formulario
   $("input").val("");
   $("#frmModal").modal("hide");

   

};
