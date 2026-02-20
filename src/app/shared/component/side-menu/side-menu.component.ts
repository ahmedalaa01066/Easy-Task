import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from 'src/app/system/auth/services/login/login.service';
import { UserViewModel } from 'src/app/system/auth/interface/login/login';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class SideMenuComponent {
  isHrExpanded = true;

  user: UserViewModel = null;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }
  toggleHrModule() {
    this.isHrExpanded = !this.isHrExpanded;
  }
  ngOnInit(): void {
    this.loadUserInfo()
  }


  logOut(): void {
    const attendanceId = localStorage.getItem('attendanceId');

    if (!attendanceId) {
      localStorage.removeItem('token');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loginService.endAttendence(attendanceId).subscribe({
      next: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('attendanceId');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Error ending attendance:', err);
      }
    });
  }



loadUserInfo() {
    this.loginService.getUserInfo().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.user = res.data;
        }
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
      }
    });
  }

}
