class AvisoFlotante {
  constructor() {
    this.mensaje = 'Función muy larga. Se recomienda dividirla';
    this.visible = false;
    this.nombreFuncion = '';
  }

  mostrarAlerta(nombreFuncion) {
    this.nombreFuncion = nombreFuncion;
    this.visible = true;
  }

  getMensaje() {
    return this.mensaje;
  }

  isVisible() {
    return this.visible;
  }

  cerrarAlerta() {
    this.visible = false;
  }
}

module.exports = AvisoFlotante;