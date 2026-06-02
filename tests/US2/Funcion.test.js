const Funcion = require('../../src/entidades/Funcion');

// Condicion 3: En la medicion deben omitirse las lineas
// que correspondan exclusivamente a comentarios


test("US2-EVAL - debe retornar el nombre identificador de la función", () => {
  const lineas = [
    'function calcular() {',
    '  const x = 1;',
    '  return x;',
    '}'
  ];
  const funcion = new Funcion('calcular', lineas);

  expect(funcion.getNombre()).toBe('calcular');
});

test("US2-EVAL - debe contar solo líneas lógicas excluyendo comentarios y líneas vacías", () => {
  const lineas = [
    'function calcular() {',
    '  // esto es un comentario',
    '  const x = 1;',
    '  /* bloque comentario */',
    '',
    '  return x;',
    '}'
  ];
  const funcion = new Funcion('calcular', lineas);

  expect(funcion.getLineasLogicasNetas()).toBe(4);
});



