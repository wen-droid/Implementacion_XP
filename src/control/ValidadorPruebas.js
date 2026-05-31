const EstadoPrueba = require('../enumeraciones/EstadoPrueba');

class ValidadorPruebas {
  constructor() {
    this.vista = null;
  }

  setVista(vista) {
    this.vista = vista;
  }

  identificarSiTienePruebas(tarea) {
    return tarea.indicarSiTienePruebas();
  }

  clasificarPruebas(pruebas) {
    return pruebas.map(p => {
      let estado;
      if (!p.fechaEjecucion || !p.resultadoObtenido) {
        estado = EstadoPrueba.PENDIENTE;
      } else if (p.resultadoObtenido === 'passed') {
        estado = EstadoPrueba.APROBADA;
      } else {
        estado = EstadoPrueba.FALLIDA;
      }
      return { prueba: p, estado };
    });
  }

  calcularTotal(pruebas) {
    return pruebas.length;
  }

  calcularAprobadas(pruebas) {
    return this.clasificarPruebas(pruebas)
      .filter(r => r.estado === EstadoPrueba.APROBADA).length;
  }

  calcularFallidas(pruebas) {
    return this.clasificarPruebas(pruebas)
      .filter(r => r.estado === EstadoPrueba.FALLIDA).length;
  }

  calcularPendientes(pruebas) {
    return this.clasificarPruebas(pruebas)
      .filter(r => r.estado === EstadoPrueba.PENDIENTE).length;
  }

  notificarCambio() {
    if (this.vista) {
      this.vista.actualizarAlCambio();
    }
  }
}

module.exports = ValidadorPruebas;