import { Injectable, inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { of } from "rxjs"
import { map, mergeMap, catchError, withLatestFrom } from "rxjs/operators"
import { Store } from "@ngrx/store"
import { ServicioUsuario } from "../servicios/usuario.servicio"
import * as AccionesUsuario from "./usuario.acciones"
import { seleccionarFiltros, seleccionarTamañoPagina } from "./usuario.selectores"

@Injectable()
export class EfectosUsuario {
  private acciones$ = inject(Actions)
  private servicioUsuario = inject(ServicioUsuario)
  private store = inject(Store)

  cargarUsuarios$ = createEffect(() =>
    this.acciones$.pipe(
      ofType(AccionesUsuario.cargarUsuarios),
      mergeMap(({ pagina, tamañoPagina, filtros }) =>
        this.servicioUsuario.obtenerUsuarios(pagina, tamañoPagina, filtros).pipe(
          map((datos) => AccionesUsuario.cargarUsuariosExito({ datos })),
          catchError((error) =>
            of(
              AccionesUsuario.cargarUsuariosError({
                error: error?.message || "Error al cargar usuarios",
              }),
            ),
          ),
        ),
      ),
    ),
  )

  agregarUsuario$ = createEffect(() =>
    this.acciones$.pipe(
      ofType(AccionesUsuario.agregarUsuario),
      mergeMap(({ usuario }) =>
        this.servicioUsuario.agregarUsuario(usuario).pipe(
          map((nuevoUsuario) => AccionesUsuario.agregarUsuarioExito({ usuario: nuevoUsuario })),
          catchError((error) =>
            of(
              AccionesUsuario.agregarUsuarioError({
                error: error?.message || "Error al agregar usuario",
              }),
            ),
          ),
        ),
      ),
    ),
  )

  actualizarUsuario$ = createEffect(() =>
    this.acciones$.pipe(
      ofType(AccionesUsuario.actualizarUsuario),
      mergeMap(({ usuario }) =>
        this.servicioUsuario.actualizarUsuario(usuario).pipe(
          map((usuarioActualizado) => AccionesUsuario.actualizarUsuarioExito({ usuario: usuarioActualizado })),
          catchError((error) =>
            of(
              AccionesUsuario.actualizarUsuarioError({
                error: error?.message || "Error al actualizar usuario",
              }),
            ),
          ),
        ),
      ),
    ),
  )

  eliminarUsuario$ = createEffect(() =>
    this.acciones$.pipe(
      ofType(AccionesUsuario.eliminarUsuario),
      mergeMap(({ id }) =>
        this.servicioUsuario.eliminarUsuario(id).pipe(
          map(() => AccionesUsuario.eliminarUsuarioExito({ id })),
          catchError((error) =>
            of(
              AccionesUsuario.eliminarUsuarioError({
                error: error?.message || "Error al eliminar usuario",
              }),
            ),
          ),
        ),
      ),
    ),
  )

  // Recargar usuarios cuando cambian los filtros
  recargarConFiltros$ = createEffect(() =>
    this.acciones$.pipe(
      ofType(AccionesUsuario.establecerFiltros),
      withLatestFrom(this.store.select(seleccionarTamañoPagina)),
      map(([{ filtros }, tamañoPagina]) => AccionesUsuario.cargarUsuarios({ pagina: 1, tamañoPagina, filtros })),
    ),
  )

  // Recargar usuarios cuando cambia la página
  recargarConPagina$ = createEffect(() =>
    this.acciones$.pipe(
      ofType(AccionesUsuario.establecerPagina),
      withLatestFrom(this.store.select(seleccionarTamañoPagina), this.store.select(seleccionarFiltros)),
      map(([{ pagina }, tamañoPagina, filtros]) => AccionesUsuario.cargarUsuarios({ pagina, tamañoPagina, filtros })),
    ),
  )
}
