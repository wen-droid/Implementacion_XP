class Funcion {
  constructor(nombre, lineas) {
    this.nombre = nombre;
    this.lineas = lineas;
  }

  getNombre() {
    return this.nombre;
  }

  getLineasLogicasNetas() {
    return this.lineas.filter(linea => {
      const limpia = linea.trim();
      if (limpia === '') return false;
      if (limpia.startsWith('//')) return false;
      if (
        limpia.startsWith('/*') ||
        limpia.startsWith('*') ||
        limpia.startsWith('*/')
      ) return false;
      return true;
    }).length;
  }
}

module.exports = Funcion;