import { createAction, props } from "@ngrx/store"
import type { Usuario, UsuariosPaginados } from "../modelos/usuario.modelo"

// Cargar Usuarios
export const cargarUsuarios = createAction(
  "[Usuario] Cargar Usuarios",
  props<{ pagina: number; tamañoPagina: number; filtros?: any }>(),
)

export const cargarUsuariosExito = createAction(
  "[Usuario] Cargar Usuarios Éxito",
  props<{ datos: UsuariosPaginados }>(),
)

export const cargarUsuariosError = createAction("[Usuario] Cargar Usuarios Error", props<{ error: string }>())

// Agregar Usuario
export const agregarUsuario = createAction("[Usuario] Agregar Usuario", props<{ usuario: Omit<Usuario, "id"> }>())

export const agregarUsuarioExito = createAction("[Usuario] Agregar Usuario Éxito", props<{ usuario: Usuario }>())

export const agregarUsuarioError = createAction("[Usuario] Agregar Usuario Error", props<{ error: string }>())

// Actualizar Usuario
export const actualizarUsuario = createAction("[Usuario] Actualizar Usuario", props<{ usuario: Usuario }>())

export const actualizarUsuarioExito = createAction("[Usuario] Actualizar Usuario Éxito", props<{ usuario: Usuario }>())

export const actualizarUsuarioError = createAction("[Usuario] Actualizar Usuario Error", props<{ error: string }>())

// Eliminar Usuario
export const eliminarUsuario = createAction("[Usuario] Eliminar Usuario", props<{ id: string }>())

export const eliminarUsuarioExito = createAction("[Usuario] Eliminar Usuario Éxito", props<{ id: string }>())

export const eliminarUsuarioError = createAction("[Usuario] Eliminar Usuario Error", props<{ error: string }>())

// Filtros y Paginación
export const establecerFiltros = createAction(
  "[Usuario] Establecer Filtros",
  props<{ filtros: { rol: string; busqueda: string } }>(),
)

export const establecerPagina = createAction("[Usuario] Establecer Página", props<{ pagina: number }>())
