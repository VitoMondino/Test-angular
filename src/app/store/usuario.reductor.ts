import { createReducer, on } from "@ngrx/store"
import type { EstadoUsuario } from "../modelos/usuario.modelo"
import * as AccionesUsuario from "./usuario.acciones"

export const estadoInicial: EstadoUsuario = {
  usuarios: [],
  cargando: false,
  error: null,
  paginaActual: 1,
  tamañoPagina: 10,
  totalUsuarios: 0,
  filtros: {
    rol: "",
    busqueda: "",
  },
}

export const reductorUsuario = createReducer(
  estadoInicial,

  // Cargar Usuarios
  on(AccionesUsuario.cargarUsuarios, (estado) => ({
    ...estado,
    cargando: true,
    error: null,
  })),

  on(AccionesUsuario.cargarUsuariosExito, (estado, { datos }) => ({
    ...estado,
    cargando: false,
    usuarios: datos.usuarios,
    totalUsuarios: datos.total,
    paginaActual: datos.pagina,
  })),

  on(AccionesUsuario.cargarUsuariosError, (estado, { error }) => ({
    ...estado,
    cargando: false,
    error,
  })),

  // Agregar Usuario
  on(AccionesUsuario.agregarUsuario, (estado) => ({
    ...estado,
    cargando: true,
    error: null,
  })),

  on(AccionesUsuario.agregarUsuarioExito, (estado, { usuario }) => ({
    ...estado,
    cargando: false,
    usuarios: [...estado.usuarios, usuario],
    totalUsuarios: estado.totalUsuarios + 1,
  })),

  on(AccionesUsuario.agregarUsuarioError, (estado, { error }) => ({
    ...estado,
    cargando: false,
    error,
  })),

  // Actualizar Usuario
  on(AccionesUsuario.actualizarUsuario, (estado) => ({
    ...estado,
    cargando: true,
    error: null,
  })),

  on(AccionesUsuario.actualizarUsuarioExito, (estado, { usuario }) => ({
    ...estado,
    cargando: false,
    usuarios: estado.usuarios.map((u) => (u.id === usuario.id ? usuario : u)),
  })),

  on(AccionesUsuario.actualizarUsuarioError, (estado, { error }) => ({
    ...estado,
    cargando: false,
    error,
  })),

  // Eliminar Usuario
  on(AccionesUsuario.eliminarUsuario, (estado) => ({
    ...estado,
    cargando: true,
    error: null,
  })),

  on(AccionesUsuario.eliminarUsuarioExito, (estado, { id }) => ({
    ...estado,
    cargando: false,
    usuarios: estado.usuarios.filter((u) => u.id !== id),
    totalUsuarios: estado.totalUsuarios - 1,
  })),

  on(AccionesUsuario.eliminarUsuarioError, (estado, { error }) => ({
    ...estado,
    cargando: false,
    error,
  })),

  // Filtros y Paginación
  on(AccionesUsuario.establecerFiltros, (estado, { filtros }) => ({
    ...estado,
    filtros,
    paginaActual: 1,
  })),

  on(AccionesUsuario.establecerPagina, (estado, { pagina }) => ({
    ...estado,
    paginaActual: pagina,
  })),
)
