const EventoGuardado      = require('../../src/control/EventoGuardado');
const EvaluadorSintactico = require('../../src/control/EvaluadorSintactico');

// Condicion 1: El proceso de evaluacion debe activarse
// de forma automatica al guardar el archivo


test("US2-EVAL - debe almacenar la ruta del archivo al detectar el guardado", () => {
  const evento = new EventoGuardado();
  evento.detectarGuardado('/proyecto/src/utils.js');

  expect(evento.getRutaArchivo()).toBe('/proyecto/src/utils.js');
  
});


test("US2-EVAL - debe notificar al EvaluadorSintactico cuando se guarda el           archivo", () => {
  const evento = new EventoGuardado();
  const evaluador = new EvaluadorSintactico();

  evento.detectarGuardado('/proyecto/src/utils.js');
  const resultado = evento.notificarEvaluador(evaluador, '/proyecto/src/utils.js');

  expect(resultado).toBe(true);
  
});


test("US2-EVAL - debe retornar false si se notifica sin ruta de archivo", () => {
  const evento    = new EventoGuardado();
  const evaluador = new EvaluadorSintactico();

  const resultado = evento.notificarEvaluador(evaluador, null);

  expect(resultado).toBe(false);
});


