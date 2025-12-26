import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { DepartamentoService } from '../../../core/services/departamento.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioExitosoDialogComponent } from '../../../shared/components/usuario-exitoso-dialog/usuario-exitoso-dialog.component';

interface Rol {
  nombre: string;
  requiereDepartamento: boolean;
}

@Component({
  selector: 'app-crear-usuario',
  standalone: false,
  templateUrl: './crear-usuario.html',
  styleUrl: './crear-usuario.css'
})
export class CrearUsuario implements OnInit {
  usuarioForm: FormGroup;
  departamentos: string[] = [];
  roles: Rol[] = [
    { nombre: 'Empleado', requiereDepartamento: true },
    { nombre: 'Supervisor', requiereDepartamento: true },
    { nombre: 'Auditor', requiereDepartamento: true },
    { nombre: 'Administrador', requiereDepartamento: false }
  ];
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  loading: boolean = false;
  nombreUsuario: string = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private departamentoService: DepartamentoService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.usuarioForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rol: ['', Validators.required],
      departamento: ['']  
    });
  }

  ngOnInit(): void {
    const userData = this.authService.getUserData();
    if (userData) {
      this.nombreUsuario = `${userData.username} (${userData.rol})`;
    }
    this.cargarDepartamentos();
    
    // Observar cambios en el rol para ajustar validación de departamento
    this.usuarioForm.get('rol')?.valueChanges.subscribe(rol => {
      const deptControl = this.usuarioForm.get('departamento');
      const rolSeleccionado = this.roles.find(r => r.nombre === rol);
      
      if (rolSeleccionado?.requiereDepartamento) {
        deptControl?.setValidators([Validators.required]);
      } else {
        deptControl?.clearValidators();
        deptControl?.setValue('');
      }
      deptControl?.updateValueAndValidity();
    });
  }

  cargarDepartamentos(): void {
    this.departamentoService.listarDepartamentos().subscribe({
      next: (depts) => {
        this.departamentos = depts;
      },
      error: (error) => {
        console.error('Error al cargar departamentos:', error);
        this.showMessage('Error al cargar departamentos', 'error');
      }
    });
  }

  get mostrarDepartamento(): boolean {
    const rol = this.usuarioForm.get('rol')?.value;
    return rol && rol !== 'Administrador';
  }

  registrarUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.showMessage('⚠️ Por favor completa todos los campos correctamente', 'error');
      return;
    }

    this.loading = true;
    const formData = this.usuarioForm.value;
    
    // Si es Administrador, no enviar departamento
    if (formData.rol === 'Administrador') {
      formData.departamento = '';
    }

    this.usuarioService.crearUsuario(formData).subscribe({
      next: (response) => {
        this.loading = false;
        
        // Preparar datos para el diálogo
        const dialogData: any = {
          username: formData.username,
          rol: formData.rol
        };
        
        if (formData.departamento) {
          dialogData.departamento = formData.departamento;
        }
        
        // Mostrar diálogo de éxito
        this.dialog.open(UsuarioExitosoDialogComponent, {
          data: dialogData,
          width: '500px'
        });
        
        this.showMessage(`✅ Usuario "${formData.username}" creado exitosamente`, 'success');
        this.usuarioForm.reset();
      },
      error: (error) => {
        this.loading = false;
        const mensaje = error.error?.msg || error.message || 'Error al crear usuario';
        this.showMessage(`❌ ${mensaje}`, 'error');
      }
    });
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
}
