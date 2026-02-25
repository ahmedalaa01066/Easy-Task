import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidatesComponent } from './pages/candidates/candidates.component';
import { ManagementComponent } from './pages/management/management.component';
import { RecommendedCoursesComponent } from './pages/recommended-courses/recommended-courses.component';
import { CourseDetailsComponent } from './components/recommended-course/course-details/course-details.component';
import { HierarchyComponent } from './pages/hierarchy/hierarchy.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { KpiComponent } from './pages/kpis/kpi/kpi.component';
import { DefaultKpiComponent } from './components/kpis/default-kpi/default-kpi.component';
import { PermissionsComponent } from './pages/permissions/permissions.component';
import { AnnualComponent } from './pages/annual/annual.component';
import { SpecialDaysComponent } from './pages/special-days/special-days.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { AttendanceConfigComponent } from './components/attendance/attendance-config/attendance-config.component';
import { AttendDetailsComponent } from './components/attendance/attend-details/attend-details.component';
import { CandidateRequestsComponent } from './pages/candidate-requests/candidate-requests.component';
import { RequestNotificationComponent } from './pages/request-notification/request-notification.component';
import { DashboardComponent } from './pages/dashboad/dashboard/dashboard.component';
import { VacationsComponent } from './pages/vacations/vacations.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'candidates',
    pathMatch: 'full',
  },
  {
    path: 'candidates',
    component: CandidatesComponent,
  },
  {
    path: 'managements',
    component: ManagementComponent,
  },
  {
    path: 'recommendedCourses',
    component: RecommendedCoursesComponent,
  },
  {
    path: 'recommendedCourses/courseDetails/:id',
    component: CourseDetailsComponent,
  },
  {
    path: 'hierarchy',
    component: HierarchyComponent,
  },
  { path: 'profile/:id', component: ProfileComponent },

  {
    path: 'documents',
    component: DocumentsComponent,
  },
  {
    path: 'attendance',
    component: AttendanceComponent,
  },
  {
    path: 'attendance/attendanceConfig',
    component: AttendanceConfigComponent,
  },
  {
    path: 'attendance/attend-details/:id',
    component: AttendDetailsComponent,
  },
  {
    path: 'kpi',
    component: KpiComponent,
  },
  {
    path: 'default-Kpi',
    component: DefaultKpiComponent,
  },
  {
    path: 'permissions',
    component:PermissionsComponent,
  },
  {
    path: 'jobs',
    component: JobsComponent,
  },
  {
    path: 'annual',
    component: AnnualComponent,
  },
  {
    path: 'specialDays',
    component: SpecialDaysComponent,
  },
  {
    path: 'candidateRequests',
    component: CandidateRequestsComponent,
  },
  {
    path: 'requestNotification',
    component: RequestNotificationComponent,
  },
  {
    path: 'dashboard',
    component:DashboardComponent,
  },
   {
    path: 'vacations',
    component:VacationsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrRoutingModule {}
