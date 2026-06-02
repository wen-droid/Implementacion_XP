const AvisoFlotante = require('../../src/control/AvisoFlotante');

// Condicion 5 y 6 : El aviso debe mostrar el mensaje exacto
// y cerrarse únicamente por acción manual del desarrollador


test("US2-EVAL - el aviso no debe estar visible antes de ser activado", () => {
  const aviso = new AvisoFlotante();

  expect(aviso.isVisible()).toBe(false);
});

test("US2-EVAL - debe mostrarse visible al llamar mostrarAlerta", () => {
  const aviso = new AvisoFlotante();

  aviso.mostrarAlerta('calcular');

  expect(aviso.isVisible()).toBe(true);
});

test("US2-EVAL - el aviso debe mostrar exactamente: 'Función muy larga. Se recomienda dividirla'", () => {
  const aviso = new AvisoFlotante();

  aviso.mostrarAlerta('calcular');

  expect(aviso.getMensaje()).toBe('Función muy larga. Se recomienda dividirla');
});

test("US2-EVAL - el aviso debe cerrarse solo cuando el desarrollador lo decide manualmente", () => {
  const aviso = new AvisoFlotante();
  aviso.mostrarAlerta('calcular');

  expect(aviso.isVisible()).toBe(true);

  aviso.cerrarAlerta();

  expect(aviso.isVisible()).toBe(false);
});


