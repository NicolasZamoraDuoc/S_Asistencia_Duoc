export class Asistencia {
  constructor(
    public bloqueInicio: number = 0,
    public bloqueTermino: number = 0,
    public dia: string = '',
    public horaFin: string = '',
    public horaInicio: string = '',
    public idAsignatura: string = '',
    public nombreAsignatura: string = '',
    public nombreProfesor: string = '',
    public seccion: string = '',
    public sede: string = ''
  ) {}

  static fromJson(json: string): Asistencia {
    const data = JSON.parse(json);
    return new Asistencia(
      data.bloqueInicio,
      data.bloqueTermino,
      data.dia,
      data.horaFin,
      data.horaInicio,
      data.idAsignatura,
      data.nombreAsignatura,
      data.nombreProfesor,
      data.seccion,
      data.sede
    );
  }
}