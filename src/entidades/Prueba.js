class Prueba {
  constructor(nombre, fechaEjecucion, resultadoObtenido) {
    this.nombre            = nombre;
    this.fechaEjecucion    = fechaEjecucion;
    this.resultadoObtenido = resultadoObtenido;
    this.estado            = null;
  }

  proveerNombre() {
    return this.nombre;
  }git

  proveerFechaEjecucion() {
    return this.fechaEjecucion;
  }

  proveerResultadoObtenido() {
    return this.resultadoObtenido;
  }

  proveerEstado() {
    return this.estado;
  }
}

module.exports = Prueba;