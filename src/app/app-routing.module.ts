import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/component/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('src/app/system/auth/auth.module').then((m) => m.AuthModule),
  },

  {
    path: 'hr',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('src/app/system/hr/hr.module').then((m) => m.HrModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
