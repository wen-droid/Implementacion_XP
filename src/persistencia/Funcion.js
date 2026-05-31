// src/persistencia/FuncionRepository.js
const supabase = require('./db');

class FuncionRepository {
  async guardar(funcion, extension, lineasLogicasNetas, superaLimite, tareaId) {
    const { data, error } = await supabase
      .from('funcion')
      .insert([{
        nombre:            funcion.getNombre(),
        extension,
        lineasLogicasNetas,
        superaLimite,
        tareaId:           tareaId || null
      }])
      .select();
    if (error) throw error;
    return data[0].id;
  }

  async obtenerPorTarea(tareaId) {
    const { data, error } = await supabase
      .from('funcion')
      .select('*')
      .eq('tareaId', tareaId);
    if (error) throw error;
    return data;
  }

  async obtenerTodos() {
    const { data, error } = await supabase
      .from('funcion')
      .select('*');
    if (error) throw error;
    return data;
  }
}

module.exports = new FuncionRepository();