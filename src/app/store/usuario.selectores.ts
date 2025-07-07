import { createFeatureSelector, createSelector } from "@ngrx/store"
import type { EstadoUsuario } from "../modelos/usuario.modelo"

export const seleccionarEstadoUsuario = createFeatureSelector<EstadoUsuario>("usuarios")

export const seleccionarUsuarios = createSelector(seleccionarEstadoUsuario, (estado) => estado.usuarios)

export const seleccionarCargando = createSelector(seleccionarEstadoUsuario, (estado) => estado.cargando)

export const seleccionarError = createSelector(seleccionarEstadoUsuario, (estado) => estado.error)

export const seleccionarPaginaActual = createSelector(seleccionarEstadoUsuario, (estado) => estado.paginaActual)

export const seleccionarTamañoPagina = createSelector(seleccionarEstadoUsuario, (estado) => estado.tamañoPagina)

export const seleccionarTotalUsuarios = createSelector(seleccionarEstadoUsuario, (estado) => estado.totalUsuarios)

export const seleccionarFiltros = createSelector(seleccionarEstadoUsuario, (estado) => estado.filtros)

export const seleccionarTotalPaginas = createSelector(
  seleccionarTotalUsuarios,
  seleccionarTamañoPagina,
  (total, tamañoPagina) => Math.ceil(total / tamañoPagina),
)

export const seleccionarInfoPaginacion = createSelector(
  seleccionarPaginaActual,
  seleccionarTotalPaginas,
  seleccionarTotalUsuarios,
  seleccionarTamañoPagina,
  (paginaActual, totalPaginas, totalUsuarios, tamañoPagina) => ({
    paginaActual,
    totalPaginas,
    totalUsuarios,
    tamañoPagina,
    tieneSiguiente: paginaActual < totalPaginas,
    tieneAnterior: paginaActual > 1,
  }),
)
