import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthRoutingModule } from '../../auth-routing.module';
import { LoginService } from '../../services/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router ,) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.loginService.setLogin(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('attendanceId', res.data.attendanceId);


        this.router.navigate(['/hr/candidates']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Invalid email or password';
      },
    });
  }



}


