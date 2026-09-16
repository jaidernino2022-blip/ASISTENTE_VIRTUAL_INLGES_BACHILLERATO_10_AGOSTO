import plan_8vo from '../PensamientosPEA/Planificacion_Microcurricular_Ingles_8vo.md?raw';
import plan_9no from '../PensamientosPEA/planificacion_microcurricular_Igles_9no.md?raw';
import plan_2bach_segsem from '../PensamientosPEA/Planificacion_Ingles_2bachillerato_segundosemestre.md?raw';
import plan_2bach_semanas from '../PensamientosPEA/Planificacion_Ingles_2bachillerato_semanas.md?raw';
import plan_3bach_segsem from '../PensamientosPEA/Planificacion_Ingles_3bachillerato_segundosemestre.md?raw';
import plan_3bach_semanas from '../PensamientosPEA/Planificacion_Ingles_3bachillerato_semanas.md?raw';

export const consultarPlanificacion = (curso: string, tipo: string): string => {
  const query = `${curso?.toLowerCase() || ''}_${tipo?.toLowerCase() || ''}`;
  
  if (query.includes('8')) {
    return `Planificación de 8vo:\n${plan_8vo}`;
  }
  if (query.includes('9')) {
    return `Planificación de 9no:\n${plan_9no}`;
  }
  if (query.includes('2') || query.includes('segundo')) {
    if (query.includes('seman')) {
      return `Planificación de 2do Bachillerato (Semanas):\n${plan_2bach_semanas}`;
    }
    return `Planificación de 2do Bachillerato (Segundo Semestre):\n${plan_2bach_segsem}`;
  }
  if (query.includes('3') || query.includes('tercero')) {
    if (query.includes('seman')) {
      return `Planificación de 3ro Bachillerato (Semanas):\n${plan_3bach_semanas}`;
    }
    return `Planificación de 3ro Bachillerato (Segundo Semestre):\n${plan_3bach_segsem}`;
  }
  
  return "No se encontró una planificación específica para esos parámetros. Por favor, especifica un curso (ej. 8vo, 9no, 2do_bach, 3ro_bach) y un tipo si aplica (semanas, semestre).";
};
