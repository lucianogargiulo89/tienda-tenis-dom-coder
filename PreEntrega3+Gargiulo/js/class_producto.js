class Producto {
    constructor(id, nombre, imagen, precio, cantidad) {
        this.id = id,
        this.nombre = nombre,
        this.imagen = imagen,
        this.precio = precio,
        this.cantidad = cantidad
    }
}

// La propiedad "cantidad" representa la cantidad inicial al agregarse el item al carrito (1) luego se modifica en caso de agregarse el mismo item, sumar o restar dentro del carrito.