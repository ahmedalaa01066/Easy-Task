import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// PrimeNG Imports
import { PanelMenuModule } from 'primeng/panelmenu';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule,
    PanelMenuModule,
    AvatarModule,
    ButtonModule,
    RippleModule
  ],
  exports: [
    PanelMenuModule,
    AvatarModule,
    ButtonModule,
    RippleModule
  ]
})
export class SharedModule { }
