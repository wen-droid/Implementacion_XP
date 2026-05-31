class Prueba {
  constructor(id, nombre, fechaEjecucion, resultadoObtenido, tareaId) {
    this.id = id;
    this.nombre = nombre;
    this.fechaEjecucion = fechaEjecucion;
    this.resultadoObtenido = resultadoObtenido;
    this.tareaId = tareaId;
    this.estado = null;
  }

  proveerNombre() {
    return this.nombre;
  }

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