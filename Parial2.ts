enum Color {
    RED = "RED",
    BLACK = "BLACK"
}

class Producto {
    constructor(
        public codigo: string,
        public nombre: string,
        public precio: number
    ) {}
}

class NodoRBT {
    public izquierda: NodoRBT | null = null;
    public derecha: NodoRBT | null = null;
    public padre: NodoRBT | null = null;
    public color: Color;

    constructor(public producto: Producto, color: Color = Color.RED) {
        this.color = color;
    }
}

class ArbolRBT {
    private nil: NodoRBT;
    private raiz: NodoRBT;

    constructor() {
        this.nil = new NodoRBT(new Producto("", "", 0), Color.BLACK);
        this.raiz = this.nil;
    }

    insertar(producto: Producto): void {
        const nuevoNodo = new NodoRBT(producto);
        nuevoNodo.izquierda = this.nil;
        nuevoNodo.derecha = this.nil;

        let padre: NodoRBT | null = null;
        let actual = this.raiz;

        while (actual !== this.nil) {
            padre = actual;
            if (nuevoNodo.producto.precio < actual.producto.precio) {
                actual = actual.izquierda!;
            } else {
                actual = actual.derecha!;
            }
        }

        nuevoNodo.padre = padre;
        if (padre === null) {
            this.raiz = nuevoNodo;
        } else if (nuevoNodo.producto.precio < padre.producto.precio) {
            padre.izquierda = nuevoNodo;
        } else {
            padre.derecha = nuevoNodo;
        }

        this.balancearInsercion(nuevoNodo);
    }

    eliminar(codigo: string): Producto | null {
        const nodo = this.buscarNodo(this.raiz, codigo);
        if (nodo !== this.nil) {
            const productoEliminado = nodo.producto;
            this.eliminarNodo(nodo);
            return productoEliminado;
        }
        return null;
    }

    private balancearInsercion(nodo: NodoRBT): void {
    }

    private balancearEliminacion(nodo: NodoRBT): void {
    }

    private eliminarNodo(nodo: NodoRBT): void {
    }

    private buscarNodo(nodo: NodoRBT, codigo: string): NodoRBT {
        if (nodo === this.nil || codigo === nodo.producto.codigo) {
            return nodo;
        }
        if (codigo < nodo.producto.codigo) {
            return this.buscarNodo(nodo.izquierda!, codigo);
        }
        return this.buscarNodo(nodo.derecha!, codigo);
    }

    productosEnOrden(): Producto[] {
        const productos: Producto[] = [];
        this._recorrerEnOrden(this.raiz, productos);
        return productos;
    }

    private _recorrerEnOrden(nodo: NodoRBT, productos: Producto[]): void {
        if (nodo !== this.nil) {
            this._recorrerEnOrden(nodo.izquierda!, productos);
            productos.push(nodo.producto);
            this._recorrerEnOrden(nodo.derecha!, productos);
        }
    }

    encontrarPrecioMinimo(): Producto | null {
        let actual = this.raiz;
        while (actual.izquierda !== this.nil) {
            actual = actual.izquierda!;
        }
        return actual === this.nil ? null : actual.producto;
    }

    encontrarPrecioMaximo(): Producto | null {
        let actual = this.raiz;
        while (actual.derecha !== this.nil) {
            actual = actual.derecha!;
        }
        return actual === this.nil ? null : actual.producto;
    }
    productosEnRango(precioMin: number, precioMax: number): Producto[] {
        const productos: Producto[] = [];
        this._rangoProductos(this.raiz, precioMin, precioMax, productos);
        return productos;
    }
    
    private _rangoProductos(nodo: NodoRBT, precioMin: number, precioMax: number, productos: Producto[]): void {
        if (nodo !== this.nil) {
            if (precioMin <= nodo.producto.precio && nodo.producto.precio <= precioMax) {
                productos.push(nodo.producto);
            }
            if (precioMin < nodo.producto.precio) {
                this._rangoProductos(nodo.izquierda!, precioMin, precioMax, productos);
            }
            if (nodo.producto.precio < precioMax) {
                this._rangoProductos(nodo.derecha!, precioMin, precioMax, productos);
            }
        }
    }
}

class Tienda {
    private arbolPrecios: ArbolRBT;

    constructor() {
        this.arbolPrecios = new ArbolRBT();
    }

    agregarProducto(codigo: string, nombre: string, precio: number): void {
        const producto = new Producto(codigo, nombre, precio);
        this.arbolPrecios.insertar(producto);
    }

    eliminarProducto(nombre: string): void {
        const productoEliminado = this.arbolPrecios.eliminar(nombre);
        if (productoEliminado) {
            console.log(`Producto eliminado: ${productoEliminado.nombre} - $${productoEliminado.precio}`);
        } else {
            console.log("Producto no encontrado.");
        }
    }

    mostrarProductos(): void {
        const productos = this.arbolPrecios.productosEnOrden();
        console.log("Productos en la tienda:");
        productos.forEach(producto => 
            console.log(`${producto.codigo}: ${producto.nombre} - $${producto.precio}`)
        );
    }

    consultarPrecioMinimo(): Producto | null {
        return this.arbolPrecios.encontrarPrecioMinimo();
    }

    consultarPrecioMaximo(): Producto | null {
        return this.arbolPrecios.encontrarPrecioMaximo();
    }

    consultarProductosEnRango(precioMin: number, precioMax: number): Producto[] {
        return this.arbolPrecios.productosEnRango(precioMin, precioMax);
    }
}

const tienda = new Tienda();
tienda.agregarProducto("001", "Tijeras", 50.0);
tienda.agregarProducto("002", "Audifonos", 30.0);
tienda.agregarProducto("003", "Teclado", 70.0);
tienda.agregarProducto("004", "Bocina", 2000.0)
tienda.agregarProducto("005", "Telefono en oferta", 4500.0)
tienda.agregarProducto("006", "Telefono", 5000.01)

tienda.mostrarProductos();

console.log("Producto con precio mínimo:", tienda.consultarPrecioMinimo()?.nombre);
console.log("Producto con precio máximo:", tienda.consultarPrecioMaximo()?.nombre);
const productosEnRango = tienda.consultarProductosEnRango(0, 5000);
console.log("Productos en rango de precio de: 0 a 5000:");
productosEnRango.forEach(producto => console.log(`${producto.nombre} - $${producto.precio}`));

tienda.eliminarProducto("001");
