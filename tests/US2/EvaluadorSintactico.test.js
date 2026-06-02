const EvaluadorSintactico = require('../../src/control/EvaluadorSintactico');
const Funcion             = require('../../src/entidades/Funcion');

// Condicion 4: Evaluar funciones por lenguaje y
// excluir comentarios del conteo antes de comparar


test("US2-EVAL - debe generar un aviso cuando la función supera el límite de JavaScript", () => {
  const lineas    = Array(26).fill('  const x = 1;');
  const funcion   = new Funcion('funcionLarga', lineas);
  const evaluador = new EvaluadorSintactico();

  const aviso = evaluador.calcularComplejidad(funcion, '.js');

  expect(aviso).not.toBeNull();
  expect(aviso.isVisible()).toBe(true);
});


test("US2-EVAL - debe generar aviso si la función supera el límite de Java (30 líneas)", () => {
  const lineas    = Array(31).fill('  int x = 1;');
  const funcion   = new Funcion('metodoLargo', lineas);
  const evaluador = new EvaluadorSintactico();

  const aviso = evaluador.calcularComplejidad(funcion, '.java');

  expect(aviso).not.toBeNull();
  expect(aviso.isVisible()).toBe(true);
});

test("US2-EVAL - debe generar aviso si la función supera el límite de Python (20 líneas)", () => {
  const lineas    = Array(21).fill('  x = 1');
  const funcion   = new Funcion('funcionPython', lineas);
  const evaluador = new EvaluadorSintactico();

  const aviso = evaluador.calcularComplejidad(funcion, '.py');

  expect(aviso).not.toBeNull();
  expect(aviso.isVisible()).toBe(true);
});

test("US2-EVAL - debe aplicar límite de 40 líneas para lenguaje no configurado", () => {
  const lineas    = Array(41).fill('  x = 1');
  const funcion   = new Funcion('funcionRuby', lineas);
  const evaluador = new EvaluadorSintactico();

  const aviso = evaluador.calcularComplejidad(funcion, '.rb');

  expect(aviso).not.toBeNull();
  expect(aviso.isVisible()).toBe(true);
});


