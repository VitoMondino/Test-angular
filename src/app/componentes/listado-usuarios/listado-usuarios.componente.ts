import { Component, type OnInit, type OnDestroy, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormBuilder, type FormGroup } from "@angular/forms"
import { Store } from "@ngrx/store"
import { type Observable, Subject, of } from "rxjs"
import { takeUntil, debounceTime, distinctUntilChanged, map, catchError } from "rxjs/operators"

import type { Usuario } from "../../modelos/usuario.modelo"
import * as AccionesUsuario from "../../store/usuario.acciones"
import * as SelectoresUsuario from "../../store/usuario.selectores"
import { CargandoComponente } from "../cargando/cargando.componente"
import { FormularioUsuarioComponente } from "../formulario-usuario/formulario-usuario.componente"

@Component({
  selector: "app-listado-usuarios",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CargandoComponente, FormularioUsuarioComponente],
  templateUrl: "./listado-usuarios.template.html",
  styleUrls: ["./listado-usuarios.styles.css"],
})
export class ListadoUsuariosComponente implements OnInit, OnDestroy {
  usuarios$: Observable<Usuario[]>
  cargando$: Observable<boolean>
  error$: Observable<string | null>
  infoPaginacion$: Observable<any>

  formularioFiltros: FormGroup
  mostrarFormulario = false
  usuarioSeleccionado: Usuario | null = null

  private store: Store
  private fb: FormBuilder
  private destruir$ = new Subject<void>()

  estasCargando = false

  constructor() {
    // Inyección de dependencias usando inject()
    this.store = inject(Store)
    this.fb = inject(FormBuilder)

    // Seleccionar los estados del store con manejo de errores

    this.usuarios$ = this.store.select(SelectoresUsuario.seleccionarUsuarios).pipe(catchError(() => of([])))
    this.cargando$ = this.store.select(SelectoresUsuario.seleccionarCargando).pipe(catchError(() => of(false)))
    this.error$ = this.store.select(SelectoresUsuario.seleccionarError).pipe(catchError(() => of(null)))
    this.infoPaginacion$ = this.store
      .select(SelectoresUsuario.seleccionarInfoPaginacion)
      .pipe(catchError(() => of(null)))

    // Crear formulario de filtros
    this.formularioFiltros = this.fb.group({
      busqueda: [""],
      rol: [""],
    })
  }

  // Métodos "Helper" para paginación
  calcularInicio(paginacion: any): number {
    if (!paginacion) return 0
    return (paginacion.paginaActual - 1) * paginacion.tamañoPagina + 1
  }

  calcularFin(paginacion: any): number {
    if (!paginacion) return 0
    const fin = paginacion.paginaActual * paginacion.tamañoPagina
    return fin > paginacion.totalUsuarios ? paginacion.totalUsuarios : fin
  }

  ngOnInit() {
    // Cargar usuarios iniciales
    this.store.dispatch(AccionesUsuario.cargarUsuarios({ pagina: 1, tamañoPagina: 10 }))

    // Suscribirse al estado de carga con manejo de errores
    this.cargando$
      .pipe(
        takeUntil(this.destruir$),
        map((cargando) => cargando || false),
        catchError(() => of(false)),
      )
      .subscribe({
        next: (cargando) => {
          this.estasCargando = cargando
        },
        error: (error) => {
          console.error("Error en estado de carga:", error)
          this.estasCargando = false
        },
      })

    // Suscribirse a cambios en los filtros con manejo de errores
    this.formularioFiltros.valueChanges
      .pipe(
        takeUntil(this.destruir$),
        debounceTime(300),
        distinctUntilChanged(),
        catchError(() => of({})),
      )
      .subscribe({
        next: (filtros) => {
          this.store.dispatch(AccionesUsuario.establecerFiltros({ filtros }))
        },
        error: (error) => {
          console.error("Error en filtros:", error)
        },
      })
  }

  ngOnDestroy() {
    this.destruir$.next()
    this.destruir$.complete()
  }

  rastrearPorIdUsuario(indice: number, usuario: Usuario): string {
    return usuario?.id || indice.toString()
  }

  editarUsuario(usuario: Usuario) {
    this.usuarioSeleccionado = usuario
    this.mostrarFormulario = true
  }

  eliminarUsuario(id: string) {
    if (confirm("¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.")) {
      this.store.dispatch(AccionesUsuario.eliminarUsuario({ id }))
    }
  }

  guardarUsuario(datosUsuario: Omit<Usuario, "id"> | Usuario) {
    if ("id" in datosUsuario) {
      // Actualizar usuario existente
      this.store.dispatch(AccionesUsuario.actualizarUsuario({ usuario: datosUsuario as Usuario }))
    } else {
      // Agregar nuevo usuario
      this.store.dispatch(AccionesUsuario.agregarUsuario({ usuario: datosUsuario }))
    }
    this.cerrarFormulario()
  }

  cerrarFormulario() {
    this.mostrarFormulario = false
    this.usuarioSeleccionado = null
  }

  irAPagina(pagina: number) {
    this.store.dispatch(AccionesUsuario.establecerPagina({ pagina }))
  }
}
