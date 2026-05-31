class Tarea {
  constructor(id, nombre) {
    this.id = id;
    this.nombre = nombre;
    this.pruebas = [];
  }

  agregarPrueba(prueba) {
    this.pruebas.push(prueba);
  }

  indicarSiTienePruebas() {
    return this.pruebas.length > 0;
  }

  proveerEstadoValidacion() {
    return this.pruebas.length === 0 ? "Sin validación" : "Con validación";
  }

  proveerPruebasAsociadas() {
    return this.pruebas;
  }
}

module.exports = Tarea;