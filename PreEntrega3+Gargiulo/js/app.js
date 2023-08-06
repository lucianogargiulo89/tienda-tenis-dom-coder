const container = document.querySelector("#container_productos");
const buscador = document.querySelector("#buscador");
const botonTodos = document.querySelector("#boton_todos");
const containerCarrito = document.querySelector("#containerCarrito");
const botonesQuitar = document.getElementsByClassName("boton_item_quitar");
const principal = document.querySelector("#containerPrincipal");
const botonVaciar = document.querySelector("#boton_vaciar");
const contadorCarrito = document.querySelector("#contador_carrito");
const totalCarrito = document.querySelector("#total_numero");
const botonComprar = document.querySelector("#boton_comprar");
const inputModal = document.querySelector("#inputModal");
const botonNombre = document.querySelector("#botonNombre");
const usuarioLogueado = document.querySelector("#usuarioLogueado");
const botonesRestar = document.getElementsByClassName("restarProducto");
const botonesSumar = document.getElementsByClassName("sumarProducto");
const containerRanking = document.querySelector("#containerRanking");
const heroRanking = document.querySelector("#hero-ranking");
const spinner = document.querySelector("#spinner");
const indicesCarrito = document.querySelector("#indices-carrito");

const modalNombre = new bootstrap.Modal("#staticBackdrop");
const modalRanking = new bootstrap.Modal("#modal-ranking");

let nombreUsuario = localStorage.getItem("usuario");

inputModal.value = "";


// Recuperar carrito de LS.
function recuperarCarrito() {
    if(localStorage.getItem("carrito") === null) {
    } else {
        JSON.parse(localStorage.getItem("carrito")).forEach((producto) => carrito.push(producto));
    }
}
recuperarCarrito();


// Recuperar usuario de LS.
function recuperarUsuario() {
if((nombreUsuario === "") || (nombreUsuario === null))  {
    modalNombre.show();
} else {
    modalNombre.hide();
    usuarioLogueado.textContent = nombreUsuario;
}
}
recuperarUsuario();


// Generar Cards mediante Template String.
function crearCard(producto) {
    return `
            <div class="card">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">Precio: $${producto.precio}</p>
                    <button class="btn btn_agregar" id="${producto.id}">AGREGAR</button>
                </div>
            </div>
            `
};


// Modificar contador Icono carrito.
function mostrarContadorCarrito() {
    let suma = carrito.reduce((acc, producto) => acc + (producto.cantidad), 0);
        contadorCarrito.textContent = suma;

        sumarProducto();

}
mostrarContadorCarrito();


// Cargar productos Cards.
function cargarProductos(parametro) {
        container.innerHTML = "";
        parametro.forEach((producto) => {
        container.innerHTML += crearCard(producto);
    });
};
cargarProductos(productos);


// Filtrar productos Input Search.
buscador.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const resultado = productos.filter((producto) => producto.nombre.toUpperCase().includes(buscador.value.trim().toUpperCase()));
            if (resultado.length !== 0) {           
                cargarProductos(resultado);
                botonTodos.classList.add("visible");
                activarBotones(resultado);
            } else {
                Swal.fire({
                    icon:"warning",
                    text: "No se encontro coincidencia",
                    confirmButtonColor: "blue"
                })      
                buscador.value = "";
            }
        }
})


// Mostrar todos los productos click Input Search
buscador.addEventListener("click", () => {
        buscador.value = "";
        mostrarTodos();
        sumarProducto();
})


// Función mostrar todos los productos.
function mostrarTodos() {
    container.innerHTML = "";
    cargarProductos(productos);
    botonTodos.classList.remove("visible");
    buscador.value = "";
    activarBotones(productos);
}


// Botón mostrar todos los productos nuevamente luego de filtrar.
botonTodos.addEventListener("click", () => {
    mostrarTodos();
})


// Darle funcionalidad a los botones Agregar.
function activarBotones(parametro) {
const botones = document.querySelectorAll("button.btn.btn_agregar");
botones.forEach((boton) => {
    boton.addEventListener("click", () => {
        let producto = parametro.find((producto) => producto.id === parseInt(boton.id));
        console.log(producto);
        let validacion = carrito.some((producto1) => producto1.id === producto.id)
        if (validacion === true) {
            producto.cantidad += 1;


            sumarCompra();
            botonVaciar.classList.remove("opacity-25");
            botonVaciar.removeAttribute('disabled');

            Toastify({
                text: "Se agrego el item al carrito",
                duration: 1500,
                gravity: "bottom",
                position: "right",
                stopOnFocus: true,
                style: {
                background: "rgb(250, 143, 4)",
                },
            }).showToast();

            localStorage.setItem("carrito", convertirJSON(carrito));
            
            cargarCarrito();
            mostrarContadorCarrito();
            quitarProducto()

        } else if(validacion === false) {

            carrito.push(producto);
            sumarCompra();
            botonVaciar.classList.remove("opacity-25");
            botonVaciar.removeAttribute('disabled');
            indicesCarrito.classList.add("visible");

            Toastify({
                text: "Se agrego el item al carrito",
                duration: 1500,
                gravity: "bottom",
                position: "right",
                stopOnFocus: true,
                style: {
                background: "rgb(250, 143, 4)",
                },
            }).showToast();

            localStorage.setItem("carrito", convertirJSON(carrito));

            cargarCarrito();
            mostrarContadorCarrito();
            quitarProducto()
        
        }
    })
})
}
activarBotones(productos);


// Cargar productos en el carrito. 
function cargarCarrito() {
    if(carrito.length > 0) {
    containerCarrito.innerHTML = "";

    carrito.forEach((producto) => {
        containerCarrito.innerHTML += crearItemCarrito(producto);
        quitarItem();
        
    })
    } else {
        containerCarrito.innerHTML = "";
        containerCarrito.textContent = "El carrito se encuentra vacío."
        botonVaciar.classList.add("opacity-25");
        botonVaciar.setAttribute('disabled', '');
        indicesCarrito.classList.remove("visible");

    }
}   
cargarCarrito();


// Crear producto para el carrito.
function crearItemCarrito(producto) {
    return `
            <tr class="item_carrito tr_carrito">
            <td class="item_carrito">
                <img class="img_carrito" src="${producto.imagen}" alt="">
            </td>
            <td class="item_carrito">$${producto.precio}</td>
            <td class="cantidadProducto item_carrito">
                <span class="restarProducto" id="${producto.id}">➖</span>
                <span class= "numeroProducto" id="${producto.id}">${producto.cantidad}</span>
                <span class= "sumarProducto" id="${producto.id}">➕</span>
            </td>
            <td class="item_carrito">
                <button class="boton_item_quitar" id="${producto.id}">❌</button>
            </td>
            </tr>
            `
};


// Quitar producto del carrito.
function quitarItem() {
for (let item of botonesQuitar) {
    item.addEventListener("click", () => {
        let producto = carrito.find((producto) => producto.id === parseInt(item.id));
        let indiceQuitar = carrito.indexOf(producto);
        carrito.splice(indiceQuitar, 1);
        sumarCompra();

        Toastify({
            text: "Se quitó el item del carrito.",
            duration: 1500,
            newWindow: true,
            gravity: "bottom",
            position: "right", 
            stopOnFocus: true, 
            style: {
              background: "rgb(186, 105, 1)",
            },
          }).showToast();

          localStorage.setItem("carrito", convertirJSON(carrito));

        cargarCarrito();
        mostrarContadorCarrito()
        reestrablecerCantidad()
    })
}
}

// Reestrablecer cantidad de cada item a 1.
function reestrablecerCantidad() {
    for (item of productos) {
        item.cantidad = 1;
    }
}


// Vaciar carrito.
function vaciarCarrito() {
    carrito.splice(0, carrito.length);
    cargarCarrito();
    mostrarContadorCarrito();
    totalCarrito.textContent = "0";
    reestrablecerCantidad()
    }


// Notificación Vaciar Carrito.
botonVaciar.addEventListener("click", () => {
        vaciarCarrito();

        Toastify({
            text: "Se vacío el carrito.",
            duration: 1500,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "rgb(186, 105, 1)",
            },
          }).showToast();

          actualizarCarritoLS();
    
    })

    
// Funcionalidad botón Finalizar Compra, Mensaje y Vaciar Carrito.
botonComprar.addEventListener("click", () => {

    
        if (carrito.length > 0) {
            spinner.classList.add("visible")

            setTimeout(mensajeCompra, 3000)
            function mensajeCompra() {

            Swal.fire({
                icon:"success",
                text: "¡Gracias por su compra!",
                confirmButtonColor: "rgb(250, 143, 4)"
            })   

            vaciarCarrito();
            spinner.classList.remove("visible")
            actualizarCarritoLS();
        }
           } else {

            Swal.fire({
                icon:"warning",
                text: "Debe ingresar al menos un producto.",
                confirmButtonColor: "rgb(250, 143, 4)"
            })      
        }
    })


// Sumar precio Total productos del carrito.
function sumarCompra() {
        let suma = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
        totalCarrito.textContent = suma;
}
sumarCompra();


// Manejar "click" fuera del input Buscador para reestablecer Value inicial.
const clickfueraBuscador = (e) => {
    if (!buscador.contains(e.target)) {
      buscador.value = "";
    }
  };
document.addEventListener("click", clickfueraBuscador);


//Manejar "click" fuera del input Nombre para reestablecer Value inicial.
const clickfuerainputModal = (e) => {
    if (!inputModal.contains(e.target)) {
      inputModal.value = "";
    }
};
document.addEventListener("click", clickfuerainputModal);


// Convertir Array a JSON
function convertirJSON(parametro) {
    return JSON.stringify(parametro);
}


// Actualizar carrito en LS.
function actualizarCarritoLS() {
    localStorage.setItem("carrito", convertirJSON(carrito));
}


// Funcionalidad Modal Input Nombre.
inputModal.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        nombreUsuario = inputModal.value.trim().toUpperCase();   
        modalNombre.hide();
        localStorage.setItem("usuario", nombreUsuario);
        usuarioLogueado.textContent = nombreUsuario;
    }
})


// Funcionalidad Modal Nombre.
botonNombre.addEventListener("click", () => {
        if (inputModal.value !== "") {
        nombreUsuario = inputModal.value.trim().toUpperCase();   
        modalNombre.hide();
        localStorage.setItem("usuario", nombreUsuario);
        usuarioLogueado.textContent = nombreUsuario;
        } else {
            Swal.fire({
                icon:"warning",
                text: "Debe ingresar un nombre.",
                confirmButtonColor: "rgb(250, 143, 4)"
            })      
        }
})


// Sumar mismo producto "+" del carrito.
function sumarProducto() {
    for (let item of botonesSumar) {
        item.addEventListener ("click", () => {
            let producto = carrito.find((producto) => producto.id === parseInt(item.id));

            producto.cantidad += 1;
    
            cargarCarrito();
            sumarCompra();
            mostrarContadorCarrito()
            quitarProducto();
            
            
        } )
        localStorage.setItem("carrito", convertirJSON(carrito));
    }
}
sumarProducto();


// Restar mismo producto "-" del carrito.
function quitarProducto() {
    for (let item of botonesRestar) {
        item.addEventListener ("click", () => {
            let producto = carrito.find((producto) => producto.id === parseInt(item.id));
            
            if (producto.cantidad > 1) {
                producto.cantidad -= 1;
            } else {
                producto.cantidad = 1;
            }

            cargarCarrito();
            sumarCompra();
            mostrarContadorCarrito()
            quitarProducto();

            

        } )
        localStorage.setItem("carrito", convertirJSON(carrito));
    }
}
quitarProducto();


// Fetch datos y crear array jugadores para mostrar (api creada en mockapi).
const url = "https://64ca761a700d50e3c704ecda.mockapi.io/api/ranking"
const jugadores = []    

function fetchRanking() {
    fetch (url)
    .then ((res) => res.json())
    .then ((data) => jugadores.push(...data))
    .catch ((error) => {
        Swal.fire({
            icon:"error",
            text: error,
            confirmButtonColor: "rgb(250, 143, 4)"
        })      
    })

}
fetchRanking();


// Crear item Ranking.
function crearItemRanking(jugador) {
    return  `
            <tr>
            <td>${jugador.name}</td>
            <td>${jugador.country}</td>
            <td>${jugador.ranking}</td>
            <td>${jugador.points}</td>
            </tr>

            `
}


// Cargar items Ranking de array jugadores para mostrar.
function cargarRanking() {
    containerRanking.innerHTML = "";
    containerRanking.innerHTML = `
    <tr>
    <th>Jugador</th>
    <th>País</th>
    <th>Puesto</th>
    <th>Puntos</th>
    </tr>`;
    for(item of jugadores){
        containerRanking.innerHTML += crearItemRanking(item)
    }
}


// Mostrar modal Ranking TOP 10.
function mostrarModal() {
      cargarRanking();
        modalRanking.show();
}

heroRanking.addEventListener("click", mostrarModal)

