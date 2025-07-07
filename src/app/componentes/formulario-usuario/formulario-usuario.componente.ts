import { Component, Input, Output, EventEmitter, type OnInit, type OnChanges, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import type { Usuario } from "../../modelos/usuario.modelo"

@Component({
  selector: "app-formulario-usuario",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="contenedor-formulario">
      <h3>{{ modoEdicion ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>

      <form [formGroup]="formularioUsuario" (ngSubmit)="alEnviar()">
        <div class="grupo-formulario">
          <label for="nombre">Nombre *</label>
          <input
            type="text"
            id="nombre"
            formControlName="nombre"
            class="control-formulario"
            [class.es-invalido]="esCampoInvalido('nombre')"
            placeholder="Ingrese el nombre"
          >
          <div class="mensaje-error" *ngIf="esCampoInvalido('nombre')">
            <div *ngIf="formularioUsuario.get('nombre')?.errors?.['required']">
              El nombre es obligatorio
            </div>
            <div *ngIf="formularioUsuario.get('nombre')?.errors?.['minlength']">
              El nombre debe tener al menos 3 caracteres
            </div>
          </div>
        </div>

        <div class="grupo-formulario">
          <label for="apellido">Apellido *</label>
          <input
            type="text"
            id="apellido"
            formControlName="apellido"
            class="control-formulario"
            [class.es-invalido]="esCampoInvalido('apellido')"
            placeholder="Ingrese el apellido"
          >
          <div class="mensaje-error" *ngIf="esCampoInvalido('apellido')">
            <div *ngIf="formularioUsuario.get('apellido')?.errors?.['required']">
              El apellido es obligatorio
            </div>
            <div *ngIf="formularioUsuario.get('apellido')?.errors?.['minlength']">
              El apellido debe tener al menos 3 caracteres
            </div>
          </div>
        </div>

        <div class="grupo-formulario">
          <label for="email">Correo Electrónico *</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            class="control-formulario"
            [class.es-invalido]="esCampoInvalido('email')"
            placeholder="ejemplo@correo.com"
          >
          <div class="mensaje-error" *ngIf="esCampoInvalido('email')">
            <div *ngIf="formularioUsuario.get('email')?.errors?.['required']">
              El correo electrónico es obligatorio
            </div>
            <div *ngIf="formularioUsuario.get('email')?.errors?.['email']">
              El formato del correo electrónico no es válido
            </div>
          </div>
        </div>

        <div class="grupo-formulario">
          <label for="rol">Rol</label>
          <select
            id="rol"
            formControlName="rol"
            class="control-formulario"
          >
            <option value="">Seleccionar rol</option>
            <option value="Administrador">Administrador</option>
            <option value="Usuario">Usuario</option>
          </select>
        </div>

        <div class="acciones-formulario">
          <button
            type="button"
            class="boton boton-secundario"
            (click)="alCancelar()"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="boton boton-primario"
            [disabled]="formularioUsuario.invalid || cargando"
          >
            {{ cargando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
    .contenedor-formulario {
      max-width: 500px;
      margin: 0 auto;
      padding: 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    h3 {
      margin-bottom: 1.5rem;
      color: #333;
      text-align: center;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .grupo-formulario {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
      font-size: 0.9rem;
    }

    .control-formulario {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease-in-out;
      box-sizing: border-box;
    }

    .control-formulario:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    .control-formulario.es-invalido {
      border-color: #dc3545;
      background-color: #fff5f5;
    }

    .mensaje-error {
      display: block;
      width: 100%;
      margin-top: 0.5rem;
      font-size: 0.8rem;
      color: #dc3545;
      background-color: #fff5f5;
      padding: 0.5rem;
      border-radius: 4px;
      border-left: 3px solid #dc3545;
    }

    .acciones-formulario {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .boton {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      min-width: 120px;
    }

    .boton:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .boton-primario {
      background-color: #007bff;
      color: white;
    }

    .boton-primario:hover:not(:disabled) {
      background-color: #0056b3;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    }

    .boton-secundario {
      background-color: #6c757d;
      color: white;
    }

    .boton-secundario:hover {
      background-color: #545b62;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
    }

    select.control-formulario {
      cursor: pointer;
    }

    input::placeholder {
      color: #adb5bd;
    }
  `,
  ],
})
export class FormularioUsuarioComponente implements OnInit, OnChanges {
  @Input() usuario: Usuario | null = null
  @Input() cargando = false
  @Output() guardar = new EventEmitter<Omit<Usuario, "id"> | Usuario>()
  @Output() cancelar = new EventEmitter<void>()

  formularioUsuario: FormGroup
  modoEdicion = false
  private fb: FormBuilder

  constructor() {
    this.fb = inject(FormBuilder)
    this.formularioUsuario = this.crearFormulario()
  }

  ngOnInit() {
    this.actualizarFormulario()
  }

  ngOnChanges() {
    this.actualizarFormulario()
  }

  private crearFormulario(): FormGroup {
    return this.fb.group({
      nombre: ["", [Validators.required, Validators.minLength(3)]],
      apellido: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      rol: [""],
    })
  }

  private actualizarFormulario() {
    this.modoEdicion = !!this.usuario

    if (this.usuario) {
      this.formularioUsuario.patchValue({
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        email: this.usuario.email,
        rol: this.usuario.rol || "",
      })
    } else {
      this.formularioUsuario.reset()
    }
  }

  esCampoInvalido(nombreCampo: string): boolean {
    const campo = this.formularioUsuario.get(nombreCampo)
    return !!(campo && campo.invalid && (campo.dirty || campo.touched))
  }

  alEnviar() {
    if (this.formularioUsuario.valid) {
      const valorFormulario = this.formularioUsuario.value
      const datosUsuario = {
        ...valorFormulario,
        rol: valorFormulario.rol || undefined,
      }

      if (this.modoEdicion && this.usuario) {
        this.guardar.emit({ ...datosUsuario, id: this.usuario.id })
      } else {
        this.guardar.emit(datosUsuario)
      }
    }
  }

  alCancelar() {
    this.cancelar.emit()
  }
}
