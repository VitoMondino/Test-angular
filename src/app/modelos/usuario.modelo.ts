export interface Usuario {
  id: string
  nombre: string
  apellido: string
  email: string
  rol?: "Administrador" | "Usuario"
}

export interface EstadoUsuario {
  usuarios: Usuario[]
  cargando: boolean
  error: string | null
  paginaActual: number
  tamañoPagina: number
  totalUsuarios: number
  filtros: {
    rol: string
    busqueda: string
  }
}

export interface UsuariosPaginados {
  usuarios: Usuario[]
  total: number
  pagina: number
  tamañoPagina: number
}
