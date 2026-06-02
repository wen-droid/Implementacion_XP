const ConfiguracionLenguaje = require('../../src/control/ConfiguracionLenguaje');

// Condicion 2: La herramienta debe aplicar los límites
// configurados por lenguaje (JS:25, Java:30, Python:20)
// y 40 líneas por defecto si el lenguaje no está registrado


test("US2-EVAL - debe retornar 25 líneas como límite para archivos JavaScript", () => {
  const config = new ConfiguracionLenguaje();

  expect(config.buscarLimitePorExtension('.js')).toBe(25);
});

test("US2-EVAL - debe retornar 30 líneas como límite para archivos Java", () => {
  const config = new ConfiguracionLenguaje();

  expect(config.buscarLimitePorExtension('.java')).toBe(30);
});

test("US2-EVAL - debe retornar 20 líneas como límite para archivos Python", () => {
  const config = new ConfiguracionLenguaje();

  expect(config.buscarLimitePorExtension('.py')).toBe(20);
});

test("US2-EVAL - debe aplicar el límite por defecto de 40 líneas para lenguajes no registrados", () => {
  const config = new ConfiguracionLenguaje();

  expect(config.buscarLimitePorExtension('.rb')).toBe(40);
});

test("US2-EVAL - debe confirmar si una extensión existe en el mapa de configuración", () => {
  const config = new ConfiguracionLenguaje();

  expect(config.existeExtension('.js')).toBe(true);
  expect(config.existeExtension('.rb')).toBe(false);
});
