import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ListadoUsuariosComponente } from "./componentes/listado-usuarios/listado-usuarios.componente"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, ListadoUsuariosComponente],
  template: `
    <div class="contenedor-app">
      <header class="encabezado-app">
        <div class="contenido-encabezado">
          <h1>🏢 Sistema de Gestión de Usuarios</h1>
          <p>Administra usuarios de forma eficiente con Angular SSR</p>
        </div>
      </header>

      <main class="principal-app">
        <app-listado-usuarios></app-listado-usuarios>
      </main>

      <footer class="pie-app">
        <p>&copy; 2024 Sistema de Gestión de Usuarios - Desarrollado con Angular SSR y NgRx</p>
      </footer>
    </div>
  `,
  styles: [
    `
    .contenedor-app {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
    }

    .encabezado-app {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .contenido-encabezado {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .encabezado-app h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .encabezado-app p {
      margin: 0;
      color: #6c757d;
      font-size: 1.1rem;
    }

    .principal-app {
      flex: 1;
      padding: 2rem 0;
    }

    .pie-app {
      background: rgba(0, 0, 0, 0.8);
      color: white;
      text-align: center;
      padding: 1rem;
      margin-top: auto;
    }

    .pie-app p {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      .encabezado-app h1 {
        font-size: 2rem;
      }

      .contenido-encabezado {
        padding: 1.5rem;
      }

      .principal-app {
        padding: 1rem 0;
      }
    }
  `,
  ],
})
export class AppComponent {
  title = "Sistema de Gestión de Usuarios"
}
