import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-cargando",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./cargando.component.html",
  styleUrls: ["./cargando.component.css"]
})
export class CargandoComponente {
  @Input() mensaje = "Cargando...";
  @Input() superpuesto = false;
}
