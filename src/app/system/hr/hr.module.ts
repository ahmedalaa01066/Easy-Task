import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrRoutingModule } from './hr-routing.module';
import { AnnualDrawComponent } from './components/profile/annual/annual-draw/annual-draw.component';
import { VacationsComponent } from './pages/vacations/vacations.component';
import { VacationsListComponent } from './components/vacations/vacations-list/vacations-list.component';
@NgModule({
  declarations: [


  ],
  imports: [CommonModule, HrRoutingModule],
})
export class HrModule {}
