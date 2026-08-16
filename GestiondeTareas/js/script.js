/*Obtener fecha actual en calendario*/

const calendario = document.getElementById("calendario");

const fecha = new Date();
const fechaActual = {
  año: fecha.getFullYear(),
  mes: fecha.getMonth(),
}
let {año, mes} = fechaActual;

const diaActual = fecha.getDate();

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

/*Construir calendario*/
function mostrarCalendario() {
  /*Calcula cuantos dias tiene el mes actual*/
  const diasEnMes = new Date(año, mes + 1, 0).getDate();

  /*Determina en que dia de la semana comienza el mes*/
  const primerDia = new Date(año, mes, 1);
  const primerDiaSemana = (primerDia.getDay() + 6) % 7;

  /*Construyendo los dias en el calendario*/
  let diasHTML = "";

  /*Espacios antes del primer dia*/
  for (let i = 0; i < primerDiaSemana; i++) {
    diasHTML += "<div></div>";
  }

  /*Dias correspondientes en el mes*/
  for (let dia = 1; dia <= diasEnMes; dia++) {
    if (dia === diaActual) {
      diasHTML += `<div data-dia="${dia}" class="hoy">${dia}</div>`;
    } else {
      diasHTML += `<div data-dia="${dia}">${dia}</div>`;
    }
  }

  /*Hacer visible el calendario en html*/
  calendario.innerHTML = `
<div id="navegacion">
    <button id="mes-anterior">◀</button>
    <h2>${meses[mes]} ${año}</h2>
    <button id="mes-siguiente">▶</button>
</div>

<div id= "semana">
  <div>Lun</div> 
  <div>Mar</div>
  <div>Mie</div>
  <div>Jue</div>
  <div>Vie</div>
  <div>Sab</div>
  <div>Dom</div>
</div>

<div id="dias">
    ${diasHTML} 
    </div>
    `;

  /*Activar funcion de botones navegadores*/
  const botonAnterior = document.getElementById("mes-anterior");
  const botonSiguiente = document.getElementById("mes-siguiente");

  botonAnterior.addEventListener("click", function () {
    mes--;
    mostrarCalendario();
    activarDias();
  });

  botonSiguiente.addEventListener("click", function () {
    mes++;
    mostrarCalendario();
    activarDias();
  });
}
/*Recuperar tareas guardadas*/
const tareasGuardadas = localStorage.getItem("tareas");
const tareas = tareasGuardadas ? JSON.parse(tareasGuardadas) : {};

/*Creacion de formulario en cada dia para tareas*/
const formularioTarea = document.getElementById("formulario-tarea");

/*Llamar funciones de dibujo de calendario*/
mostrarCalendario();
activarDias();

/*Crear funcion para generar dias en calendario, mes a mes*/
function activarDias() {

  /* Solo seleccionamos los div que realmente son días */
  const dias = document.querySelectorAll("#dias div[data-dia]");

  /* Crear interacción para cada día */
  dias.forEach(function (dia) {
    
    /*Extraer solo numero del dia del array del mes correspondiente*/
    const numeroDia = dia.dataset.dia;
    const claveDia = `${año}-${mes}-${numeroDia}`;

    /*Mostrar todas las tareas del dias*/
    function mostrarTareas() {
      /*Limpiar contenido del dia*/
      dia.innerHTML = numeroDia;

      /* Si no hay tareas, terminar la función */
      if (!tareas[claveDia]) {
        return;
      }

      /*Recorrer las tareas que quedan*/
      tareas[claveDia].forEach(function (tarea, indice) {
        dia.innerHTML += `
                  <p>
                ${tarea}
                 <button class= "eliminar-tarea" data-indice="${indice}">
                Eliminar
                </button>
                </p>`;
      });

      /*Buscar botones despues de crearlos*/
      const botonesEliminar = dia.querySelectorAll(".eliminar-tarea");

      /*Activar los botones, para borrar tareas*/
      botonesEliminar.forEach(function (boton) {
        boton.addEventListener("click", function () {
          const indice = boton.dataset.indice;

          /*Eliminar tarea*/
          tareas[claveDia].splice(indice, 1);

          /*Si no quedan tareas, eliminar el día*/
          if (tareas[claveDia].length === 0) {
            delete tareas[claveDia];
          }

          /*Guardar tarea en LocalStorage*/
          localStorage.setItem("tareas", JSON.stringify(tareas));

          /*Volver a mostrar tareas*/
          mostrarTareas();
        });
      });
    }

    /*Mostrar tareas automaticamente*/
    mostrarTareas();

    /*Crear interaccion para cada dia*/
    dia.addEventListener("click", function () {
      /*Crear Formulario*/
      formularioTarea.innerHTML =
        "<h3>Agregar tarea para el dia " +
        numeroDia +
        "</h3>" +
        "<input type='text' id='tarea'>" +
        "<button id='agregar-tarea'>Agregar Tarea</button>";

      /*Obtener elementos creado*/
      const inputTarea = document.getElementById("tarea");
      const botonAgregar = document.getElementById("agregar-tarea");

      /*Agregar tarea*/
      botonAgregar.addEventListener("click", function () {
        /*No permitir agregar si hay espacio en blanco*/
        if (!inputTarea.value) {
          alert("Debes escribir una tarea");
          return;
        }

        /*Crear arreglo si el dia no tiene tareas*/
        if (!tareas[claveDia]) {
          tareas[claveDia] = [];
        }
        /*Guardar tarea*/
        tareas[claveDia].push(inputTarea.value);

        /*Guardar tarea en Local Storage*/
        localStorage.setItem("tareas", JSON.stringify(tareas));

        /*Volver a mostrar tareas*/
        mostrarTareas();

        /*Mostrar tareas guardadas en el dia*/
        if (tareas[claveDia]) {
          mostrarTareas();
        }
      });
    });
  });
}
