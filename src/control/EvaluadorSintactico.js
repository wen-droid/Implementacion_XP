const ConfiguracionLenguaje = require('./ConfiguracionLenguaje');
const AvisoFlotante = require('./AvisoFlotante');

class EvaluadorSintactico {
  constructor() {
    this.config = new ConfiguracionLenguaje();
  }

  calcularComplejidad(funcion, extension) {
    const limite = this.config.buscarLimitePorExtension(extension);
    const lineasLogicas = funcion.getLineasLogicasNetas();
    if (lineasLogicas > limite) {
      const aviso = new AvisoFlotante();
      aviso.mostrarAlerta(funcion.getNombre());
      return aviso;
    }
    return null;
  }
}

module.exports = EvaluadorSintactico;