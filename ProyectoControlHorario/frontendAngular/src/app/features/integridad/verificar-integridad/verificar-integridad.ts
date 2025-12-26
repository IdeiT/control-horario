import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IntegridadService } from '../../../core/services/integridad.service';
import { DepartamentoService } from '../../../core/services/departamento.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verificar-integridad',
  standalone: false,
  templateUrl: './verificar-integridad.html',
  styleUrl: './verificar-integridad.css'
})
export class VerificarIntegridad implements OnInit {
  integridadForm: FormGroup;
  departamentos: string[] = [];
  fichajes: any[] = [];
  totalFichajes: number = 0;
  fichajesValidos: number = 0;
  fichajesCorruptos: number = 0;
  paginaActual: number = 0;
  elementosPorPagina: number = 5;
  totalPaginas: number = 0;
  loading: boolean = false;
  verificado: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  currentUserRole: string = '';
  currentUserDept: string = '';
  soloSuDepartamento: boolean = false;
  displayedColumns: string[] = ['id', 'username', 'fechaOriginal', 'fechaEditada', 'tipo', 'huellaGuardada', 'huellaCalculada', 'estado'];

  constructor(
    private fb: FormBuilder,
    private integridadService: IntegridadService,
    private departamentoService: DepartamentoService,
    private authService: AuthService,
    private router: Router
  ) {
    this.integridadForm = this.fb.group({
      departamento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const userData = this.authService.getUserData();
    if (userData) {
      this.currentUserRole = userData.rol;
      this.currentUserDept = userData.departamento || '';
      this.soloSuDepartamento = (userData.rol === 'Auditor' || userData.rol === 'Supervisor');
      this.cargarDepartamentos();
    }
  }

  cargarDepartamentos(): void {
    if (this.soloSuDepartamento) {
      // Auditor o Supervisor: solo su departamento
      if (!this.currentUserDept) {
        this.showMessage('❌ Error: Sin departamento asignado', 'error');
        return;
      }
      this.departamentos = [this.currentUserDept];
      this.integridadForm.patchValue({ departamento: this.currentUserDept });
      this.integridadForm.get('departamento')?.disable();
    } else {
      // Administrador: todos los departamentos
      this.departamentoService.listarDepartamentos().subscribe({
        next: (depts) => {
          this.departamentos = depts;
        },
        error: (error) => {
          console.error('Error al cargar departamentos:', error);
        }
      });
    }
  }

  verificarIntegridad(): void {
    if (this.integridadForm.invalid) {
      this.showMessage('⚠️ Por favor selecciona un departamento', 'error');
      return;
    }

    this.loading = true;
    this.verificado = false;
    const departamento = this.integridadForm.get('departamento')?.value || this.currentUserDept;

    // Primero contar totales
    this.integridadService.contarFichajesTotales(departamento).subscribe({
      next: (data) => {
        this.totalFichajes = data.totalFichajesDepartamento || 0;
        this.totalPaginas = Math.ceil(this.totalFichajes / this.elementosPorPagina);

        if (this.totalFichajes === 0) {
          this.loading = false;
          this.fichajes = [];
          this.verificado = true;
          this.showMessage('ℹ️ No hay fichajes en este departamento', 'success');
          return;
        }

        // Obtener todos los fichajes para contar válidos/corruptos
        this.integridadService.verificarIntegridadFichajes(departamento, 0, this.totalFichajes).subscribe({
          next: (todosFichajes) => {
            this.fichajesValidos = 0;
            this.fichajesCorruptos = 0;

            todosFichajes.forEach(f => {
              const mensaje = (f.mensaje || f.estado || '').toUpperCase();
              if (mensaje.includes('INCONSISTENCIA') || mensaje.includes('CORRUPTO') || 
                  mensaje.includes('COMPROMETID') || mensaje.includes('INVÁLIDO') ||
                  mensaje.includes('ERROR') || mensaje.includes('DETECTADA')) {
                this.fichajesCorruptos++;
              } else {
                this.fichajesValidos++;
              }
            });

            // Luego cargar la página actual
            this.cargarPagina();
          },
          error: (error) => {
            this.loading = false;
            this.showMessage('❌ Error al verificar integridad', 'error');
          }
        });
      },
      error: (error) => {
        this.loading = false;
        this.showMessage('❌ Error al contar fichajes', 'error');
      }
    });
  }

  cargarPagina(): void {
    const departamento = this.integridadForm.get('departamento')?.value || this.currentUserDept;
    this.loading = true;

    this.integridadService.verificarIntegridadFichajes(departamento, this.paginaActual, this.elementosPorPagina).subscribe({
      next: (fichajes) => {
        this.fichajes = fichajes;
        this.loading = false;
        this.verificado = true;
      },
      error: (error) => {
        this.loading = false;
        const mensaje = error.error?.msg || 'Error al verificar integridad';
        this.showMessage(`❌ ${mensaje}`, 'error');
      }
    });
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina < 0 || nuevaPagina >= this.totalPaginas) return;
    this.paginaActual = nuevaPagina;
    this.cargarPagina();
  }

  esCorrupto(fichaje: any): boolean {
    const mensaje = (fichaje.mensaje || fichaje.estado || '').toUpperCase();
    return mensaje.includes('INCONSISTENCIA') || mensaje.includes('CORRUPTO') || 
           mensaje.includes('COMPROMETID') || mensaje.includes('INVÁLIDO') ||
           mensaje.includes('ERROR') || mensaje.includes('DETECTADA');
  }

  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  volverDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  generarPaginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i);
  }

  irAPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPaginas) {
      this.paginaActual = pagina;
      this.cargarPagina();
    }
  }

  cambiarElementosPorPagina(): void {
    this.paginaActual = 0;
    this.totalPaginas = Math.ceil(this.totalFichajes / this.elementosPorPagina);
    this.cargarPagina();
  }
}
