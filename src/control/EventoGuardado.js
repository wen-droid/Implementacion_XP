class EventoGuardado {
  constructor() {
    this.rutaArchivo = null;
  }

  detectarGuardado(rutaArchivo) {
    this.rutaArchivo = rutaArchivo;
  }

  notificarEvaluador(evaluador, rutaArchivo) {
    if (!evaluador || !rutaArchivo) return false;
    this.rutaArchivo = rutaArchivo;
    return true;
  }

  getRutaArchivo() {
    return this.rutaArchivo;
  }
}

module.exports = EventoGuardado;