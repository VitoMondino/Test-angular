import type { ApplicationConfig } from "@angular/core"
import { provideRouter } from "@angular/router"
import { provideClientHydration } from "@angular/platform-browser"
import { provideStore } from "@ngrx/store"
import { provideEffects } from "@ngrx/effects"
import { provideStoreDevtools } from "@ngrx/store-devtools"
import { importProvidersFrom } from "@angular/core"
import { ReactiveFormsModule } from "@angular/forms"
import { isDevMode } from "@angular/core"

import { reductorUsuario } from "./store/usuario.reductor"
import { EfectosUsuario } from "./store/usuario.efectos"
import { ServicioUsuario } from "./servicios/usuario.servicio"

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    provideClientHydration(),
    provideStore({ usuarios: reductorUsuario }),
    provideEffects([EfectosUsuario]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
      name: "Sistema Gestión Usuarios",
    }),
    importProvidersFrom(ReactiveFormsModule),
    ServicioUsuario,
  ],
}
