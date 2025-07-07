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
  template: `
    <div class="contenedor-listado-usuarios">
      <div class="encabezado">
        <h2>Gestión de Usuarios</h2>
        <button
          class="boton boton-primario"
          (click)="mostrarFormulario = true; usuarioSeleccionado = null"
        >
          <span class="icono">+</span>
          Nuevo Usuario
        </button>
      </div>

      <!-- Sección de Filtros -->
      <div class="seccion-filtros">
        <h4>Filtros de Búsqueda</h4>
        <form [formGroup]="formularioFiltros" class="formulario-filtros">
          <div class="grupo-filtro">
            <label for="busqueda">Buscar por nombre o apellido:</label>
            <input
              type="text"
              id="busqueda"
              formControlName="busqueda"
              placeholder="Escriba para buscar..."
              class="control-formulario"
            >
          </div>

          <div class="grupo-filtro">
            <label for="rol">Filtrar por rol:</label>
            <select id="rol" formControlName="rol" class="control-formulario">
              <option value="">Todos los roles</option>
              <option value="Administrador">Administrador</option>
              <option value="Usuario">Usuario</option>
            </select>
          </div>
        </form>
      </div>

      <!-- Mensaje de Error -->
      <div class="alerta alerta-peligro" *ngIf="error$ | async as error">
        <strong>¡Error!</strong> {{ error }}
      </div>

      <!-- Indicador de Carga -->
      <app-cargando
        *ngIf="cargando$ | async"
        mensaje="Cargando usuarios..."
        [superpuesto]="true">
      </app-cargando>

      <!-- Tabla de Usuarios -->
      <div class="contenedor-tabla" *ngIf="!(cargando$ | async)">
        <div class="tabla-responsive">
          <table class="tabla-usuarios">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo Electrónico</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let usuario of usuarios$ | async; trackBy: rastrearPorIdUsuario">
                <td>{{ usuario.nombre }}</td>
                <td>{{ usuario.apellido }}</td>
                <td>{{ usuario.email }}</td>
                <td>
                  <span class="etiqueta-rol" [class]="'rol-' + (usuario.rol || 'ninguno')">
                    {{ usuario.rol || 'Sin rol' }}
                  </span>
                </td>
                <td class="acciones">
                  <button
                    class="boton boton-pequeño boton-contorno-primario"
                    (click)="editarUsuario(usuario)"
                    title="Editar usuario"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    class="boton boton-pequeño boton-contorno-peligro"
                    (click)="eliminarUsuario(usuario.id)"
                    title="Eliminar usuario"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Estado Vacío -->
        <div class="estado-vacio" *ngIf="(usuarios$ | async)?.length === 0">
          <div class="icono-vacio">👥</div>
          <h3>No se encontraron usuarios</h3>
          <p>No hay usuarios que coincidan con los filtros aplicados.</p>
        </div>
      </div>

      <!-- Paginación -->
      <div class="contenedor-paginacion" *ngIf="infoPaginacion$ | async as paginacion">
        <div class="info-paginacion">
          Mostrando {{ calcularInicio(paginacion) }} -
          {{ calcularFin(paginacion) }}
          de {{ paginacion.totalUsuarios }} usuarios
        </div>

        <div class="controles-paginacion">
          <button
            class="boton boton-contorno-secundario"
            [disabled]="!paginacion.tieneAnterior"
            (click)="irAPagina(paginacion.paginaActual - 1)"
          >
            ← Anterior
          </button>

          <span class="info-pagina">
            Página {{ paginacion.paginaActual }} de {{ paginacion.totalPaginas }}
          </span>

          <button
            class="boton boton-contorno-secundario"
            [disabled]="!paginacion.tieneSiguiente"
            (click)="irAPagina(paginacion.paginaActual + 1)"
          >
            Siguiente →
          </button>
        </div>
      </div>

      <!-- Modal del Formulario de Usuario -->
      <div class="superposicion-modal" *ngIf="mostrarFormulario" (click)="cerrarFormulario()">
        <div class="contenido-modal" (click)="$event.stopPropagation()">
          <app-formulario-usuario
            [usuario]="usuarioSeleccionado"
            [cargando]="estasCargando"
            (guardar)="guardarUsuario($event)"
            (cancelar)="cerrarFormulario()"
          ></app-formulario-usuario>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .contenedor-listado-usuarios {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      background-color: #f8f9fa;
      min-height: 100vh;
    }

    .encabezado {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .encabezado h2 {
      margin: 0;
      color: #333;
      font-size: 1.8rem;
      font-weight: 600;
    }

    .seccion-filtros {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .seccion-filtros h4 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .formulario-filtros {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }

    .grupo-filtro {
      display: flex;
      flex-direction: column;
    }

    .grupo-filtro label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
      font-size: 0.9rem;
    }

    .control-formulario {
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 0.9rem;
      transition: all 0.2s ease-in-out;
    }

    .control-formulario:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    .alerta {
      padding: 1rem 1.5rem;
      margin-bottom: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid;
    }

    .alerta-peligro {
      background-color: #fff5f5;
      border-left-color: #dc3545;
      color: #721c24;
    }

    .contenedor-tabla {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .tabla-responsive {
      overflow-x: auto;
    }

    .tabla-usuarios {
      width: 100%;
      border-collapse: collapse;
    }

    .tabla-usuarios th,
    .tabla-usuarios td {
      padding: 1rem 1.5rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .tabla-usuarios th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #333;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tabla-usuarios tbody tr {
      transition: background-color 0.2s ease-in-out;
    }

    .tabla-usuarios tbody tr:hover {
      background-color: #f8f9fa;
    }

    .etiqueta-rol {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .rol-Administrador {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .rol-Usuario {
      background-color: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    }

    .rol-ninguno {
      background-color: #f8f9fa;
      color: #6c757d;
      border: 1px solid #dee2e6;
    }

    .acciones {
      display: flex;
      gap: 0.5rem;
    }

    .boton {
      padding: 0.75rem 1.5rem;
      border: 2px solid transparent;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .boton:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .boton-primario {
      background-color: #007bff;
      border-color: #007bff;
      color: white;
    }

    .boton-primario:hover:not(:disabled) {
      background-color: #0056b3;
      border-color: #0056b3;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    }

    .boton-contorno-primario {
      color: #007bff;
      border-color: #007bff;
      background-color: transparent;
    }

    .boton-contorno-primario:hover {
      background-color: #007bff;
      color: white;
    }

    .boton-contorno-peligro {
      color: #dc3545;
      border-color: #dc3545;
      background-color: transparent;
    }

    .boton-contorno-peligro:hover {
      background-color: #dc3545;
      color: white;
    }

    .boton-contorno-secundario {
      color: #6c757d;
      border-color: #6c757d;
      background-color: transparent;
    }

    .boton-contorno-secundario:hover:not(:disabled) {
      background-color: #6c757d;
      color: white;
    }

    .boton-pequeño {
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
    }

    .estado-vacio {
      text-align: center;
      padding: 4rem 2rem;
      color: #6c757d;
    }

    .icono-vacio {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .estado-vacio h3 {
      margin: 0 0 0.5rem 0;
      color: #495057;
    }

    .estado-vacio p {
      margin: 0;
      font-size: 0.9rem;
    }

    .contenedor-paginacion {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .info-paginacion {
      color: #6c757d;
      font-size: 0.9rem;
    }

    .controles-paginacion {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .info-pagina {
      color: #333;
      font-weight: 500;
      padding: 0 1rem;
    }

    .superposicion-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .contenido-modal {
      background: white;
      border-radius: 12px;
      max-width: 90vw;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .icono {
      font-size: 1.2rem;
    }

    @media (max-width: 768px) {
      .contenedor-listado-usuarios {
        padding: 1rem;
      }

      .formulario-filtros {
        grid-template-columns: 1fr;
      }

      .encabezado {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .contenedor-paginacion {
        flex-direction: column;
        gap: 1rem;
      }

      .tabla-usuarios {
        font-size: 0.8rem;
      }

      .tabla-usuarios th,
      .tabla-usuarios td {
        padding: 0.75rem 0.5rem;
      }

      .acciones {
        flex-direction: column;
      }
    }
  `,
  ],
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

  // Propiedades adicionales
  estasCargando = false

  constructor() {
    // Inyección de dependencias usando inject()
    this.store = inject(Store)
    this.fb = inject(FormBuilder)

    // Inicializar observables con manejo de errores para SSR
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

  // Métodos helper para paginación
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
