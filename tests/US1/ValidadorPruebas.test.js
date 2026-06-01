const Prueba = require("../src/entidades/Prueba");

describe("US1 - Prueba", () => {

  // Condición 3
  test("debe proveer el nombre de la prueba", () => {
    const prueba = new Prueba("test_autenticacion", new Date(), "passed");
    expect(prueba.proveerNombre()).toBe("test_autenticacion");
  });

  test("debe proveer la fecha de ejecución", () => {
    const fecha = new Date("2026-05-01");
    const prueba = new Prueba("test_sesion", fecha, "passed");
    expect(prueba.proveerFechaEjecucion()).toEqual(fecha);
  });

  test("debe proveer el resultado obtenido", () => {
    const prueba = new Prueba("test_token", new Date(), "failed");
    expect(prueba.proveerResultadoObtenido()).toBe("failed");
  });

});