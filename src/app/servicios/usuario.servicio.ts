import { Injectable } from "@angular/core"
import { type Observable, of, delay } from "rxjs"
import { map } from "rxjs/operators"
import type { Usuario, UsuariosPaginados } from "../modelos/usuario.modelo"

@Injectable({
  providedIn: "root",
})
export class ServicioUsuario {
  private usuarios: Usuario[] = [
    { id: "1", nombre: "Juan", apellido: "Pérez", email: "juan@ejemplo.com", rol: "Administrador" },
    { id: "2", nombre: "María", apellido: "García", email: "maria@ejemplo.com", rol: "Usuario" },
    { id: "3", nombre: "Carlos", apellido: "López", email: "carlos@ejemplo.com", rol: "Usuario" },
    { id: "4", nombre: "Ana", apellido: "Martínez", email: "ana@ejemplo.com", rol: "Administrador" },
    { id: "5", nombre: "Luis", apellido: "Rodríguez", email: "luis@ejemplo.com", rol: "Usuario" },
    { id: "6", nombre: "Carmen", apellido: "Fernández", email: "carmen@ejemplo.com", rol: "Usuario" },
    { id: "7", nombre: "Miguel", apellido: "Sánchez", email: "miguel@ejemplo.com", rol: "Administrador" },
    { id: "8", nombre: "Laura", apellido: "Jiménez", email: "laura@ejemplo.com", rol: "Usuario" },
    { id: "9", nombre: "Pedro", apellido: "Ruiz", email: "pedro@ejemplo.com", rol: "Usuario" },
    { id: "10", nombre: "Isabel", apellido: "Moreno", email: "isabel@ejemplo.com", rol: "Administrador" },
    { id: "11", nombre: "Sofía", apellido: "Gómez", email: "sofia@ejemplo.com", rol: "Usuario" },
    { id: "12", nombre: "Diego", apellido: "Alonso", email: "diego@ejemplo.com", rol: "Administrador" },
    { id: "13", nombre: "Valentina", apellido: "Cabrera", email: "valentina@ejemplo.com", rol: "Usuario" },
    { id: "14", nombre: "Javier", apellido: "Ortega", email: "javier@ejemplo.com", rol: "Usuario" },
    { id: "15", nombre: "Lucía", apellido: "Castro", email: "lucia@ejemplo.com", rol: "Administrador" },
    { id: "16", nombre: "Andrés", apellido: "Silva", email: "andres@ejemplo.com", rol: "Usuario" },
    { id: "17", nombre: "Elena", apellido: "Ramos", email: "elena@ejemplo.com", rol: "Usuario" },
    { id: "18", nombre: "Francisco", apellido: "Navarro", email: "francisco@ejemplo.com", rol: "Administrador" },
    { id: "19", nombre: "Natalia", apellido: "Romero", email: "natalia@ejemplo.com", rol: "Usuario" },
    { id: "20", nombre: "Santiago", apellido: "Vargas", email: "santiago@ejemplo.com", rol: "Usuario" },

    // Usuarios adicionales para probar paginación
    ...Array.from({ length: 15 }, (_, i) => ({
      id: `${i + 11}`,
      nombre: `Usuario${i + 11}`,
      apellido: `Apellido${i + 11}`,
      email: `usuario${i + 11}@ejemplo.com`,
      rol: i % 2 === 0 ? "Administrador" : ("Usuario" as "Administrador" | "Usuario"),
    })),
  ]

  obtenerUsuarios(pagina = 1, tamañoPagina = 10, filtros?: any): Observable<UsuariosPaginados> {
    return of(null).pipe(
      delay(1000),// es para la medir y simular la carga de datos
      map(() => {
        let usuariosFiltrados = [...this.usuarios]

        // Aplicar filtros
        if (filtros?.rol && filtros.rol !== "") {
          usuariosFiltrados = usuariosFiltrados.filter((usuario) => usuario.rol === filtros.rol)
        }

        if (filtros?.busqueda && filtros.busqueda.trim() !== "") {
          const terminoBusqueda = filtros.busqueda.toLowerCase()
          usuariosFiltrados = usuariosFiltrados.filter(
            (usuario) =>
              usuario.nombre.toLowerCase().includes(terminoBusqueda) ||
              usuario.apellido.toLowerCase().includes(terminoBusqueda),
          )
        }

        const total = usuariosFiltrados.length
        const indiceInicio = (pagina - 1) * tamañoPagina
        const indiceFin = indiceInicio + tamañoPagina
        const usuariosPaginados = usuariosFiltrados.slice(indiceInicio, indiceFin)

        return {
          usuarios: usuariosPaginados,
          total,
          pagina,
          tamañoPagina,
        }
      }),
    )
  }

  agregarUsuario(usuario: Omit<Usuario, "id">): Observable<Usuario> {
    return of(null).pipe(
      delay(800),
      map(() => {
        const nuevoUsuario: Usuario = {
          ...usuario,
          id: Date.now().toString(),
        }
        this.usuarios.push(nuevoUsuario)
        return nuevoUsuario
      }),
    )
  }

  actualizarUsuario(usuario: Usuario): Observable<Usuario> {
    return of(null).pipe(
      delay(800),
      map(() => {
        const indice = this.usuarios.findIndex((u) => u.id === usuario.id)
        if (indice === -1) {
          throw new Error("Usuario no encontrado")
        }
        this.usuarios[indice] = usuario
        return usuario
      }),
    )
  }

  eliminarUsuario(id: string): Observable<void> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const indice = this.usuarios.findIndex((u) => u.id === id)
        if (indice === -1) {
          throw new Error("Usuario no encontrado")
        }
        this.usuarios.splice(indice, 1)
      }),
    )
  }
}
