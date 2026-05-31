// src/persistencia/PruebaRepository.js
const supabase = require('./db');

class PruebaRepository {
  async guardar(prueba) {
    const { data, error } = await supabase
      .from('prueba')
      .insert([{
        nombre:            prueba.nombre,
        fechaEjecucion:    prueba.fechaEjecucion,
        resultadoObtenido: prueba.resultadoObtenido,
        estado:            prueba.estado || 'PENDIENTE',
        tareaId:           prueba.tareaId
      }])
      .select();
    if (error) throw error;
    return data[0].id;
  }

  async obtenerPorTarea(tareaId) {
    const { data, error } = await supabase
      .from('prueba')
      .select('*')
      .eq('tareaId', tareaId);
    if (error) throw error;
    return data;
  }

  async obtenerTodos() {
    const { data, error } = await supabase
      .from('prueba')
      .select('*');
    if (error) throw error;
    return data;
  }
}

module.exports = new PruebaRepository();