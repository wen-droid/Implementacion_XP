// src/persistencia/TareaRepository.js
const supabase = require('./db');

class TareaRepository {
  async guardar(tarea) {
    const { data, error } = await supabase
      .from('tarea')
      .insert([{ nombre: tarea.nombre, estadoValidacion: tarea.proveerEstadoValidacion() }])
      .select();
    if (error) throw error;
    return data[0].id;
  }

  async obtenerTodos() {
    const { data, error } = await supabase
      .from('tarea')
      .select('*');
    if (error) throw error;
    return data;
  }

  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from('tarea')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async actualizarEstado(id, estado) {
    const { error } = await supabase
      .from('tarea')
      .update({ estadoValidacion: estado })
      .eq('id', id);
    if (error) throw error;
  }
}

module.exports = new TareaRepository();