import {
  Component,
  Input,
  Output,
  EventEmitter,
  type OnInit,
  type OnChanges,
  inject
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  type FormGroup,
  Validators
} from "@angular/forms";
import type { Usuario } from "../../modelos/usuario.modelo";

@Component({
  selector: "app-formulario-usuario",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./formulario-usuario.component.html",
  styleUrls: ["./formulario-usuario.component.css"]
})
export class FormularioUsuarioComponente implements OnInit, OnChanges {
  @Input() usuario: Usuario | null = null;
  @Input() cargando = false;
  @Output() guardar = new EventEmitter<Omit<Usuario, "id"> | Usuario>();
  @Output() cancelar = new EventEmitter<void>();

  formularioUsuario: FormGroup;
  modoEdicion = false;
  private fb: FormBuilder;

  constructor() {
    this.fb = inject(FormBuilder);
    this.formularioUsuario = this.crearFormulario();
  }

  ngOnInit() {
    this.actualizarFormulario();
  }

  ngOnChanges() {
    this.actualizarFormulario();
  }

  private crearFormulario(): FormGroup {
    return this.fb.group({
      nombre: ["", [Validators.required, Validators.minLength(3)]],
      apellido: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      rol: [""]
    });
  }

  private actualizarFormulario() {
    this.modoEdicion = !!this.usuario;

    if (this.usuario) {
      this.formularioUsuario.patchValue({
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        email: this.usuario.email,
        rol: this.usuario.rol || ""
      });
    } else {
      this.formularioUsuario.reset();
    }
  }

  esCampoInvalido(nombreCampo: string): boolean {
    const campo = this.formularioUsuario.get(nombreCampo);
    return !!(campo && campo.invalid && (campo.dirty || campo.touched));
  }

  alEnviar() {
    if (this.formularioUsuario.valid) {
      const valorFormulario = this.formularioUsuario.value;
      const datosUsuario = {
        ...valorFormulario,
        rol: valorFormulario.rol || undefined
      };

      if (this.modoEdicion && this.usuario) {
        this.guardar.emit({ ...datosUsuario, id: this.usuario.id });
      } else {
        this.guardar.emit(datosUsuario);
      }
    }
  }

  alCancelar() {
    this.cancelar.emit();
  }
}
