class ConfiguracionLenguaje {
  constructor() {
    this.mapaLimites = {
      '.js': 25,
      '.java': 30,
      '.py': 20
    };
    this.limitePorDefecto = 40;
  }

  buscarLimitePorExtension(extension) {
    if (this.existeExtension(extension)) {
      return this.mapaLimites[extension];
    }
    return this.limitePorDefecto;
  }

  existeExtension(extension) {
    return Object.prototype.hasOwnProperty.call(this.mapaLimites, extension);
  }
}

module.exports = ConfiguracionLenguaje;