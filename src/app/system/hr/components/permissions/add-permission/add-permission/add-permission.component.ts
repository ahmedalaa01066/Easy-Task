import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { CreatePermissionViewModel } from 'src/app/system/hr/models/interfaces/permissions-vm';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styleUrls: ['./add-permission.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    FileUploadModule,
    DropdownModule,
    InputSwitchModule,
  ],
})
export class AddPermissionComponent {
  // @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() permissionAdded = new EventEmitter<CreatePermissionViewModel>();
  currentStep: number = 0;
  private _visible: boolean = false;

  @Input()
  set visible(val: boolean) {
    this._visible = val;
    if (val) {
      this.currentStep = 0; 
    }
  }

  get visible(): boolean {
    return this._visible;
  }


  candidateList = [
    { name: 'Ahmed Mohamed', value: 1 },
    { name: 'Sara Ali', value: 2 },
  ];
  permissionsList = [
    { label: 'Edit Project', value: false },
    { label: 'View Project', value: false },
    { label: 'Delete Project', value: false },
    { label: 'Export Project', value: false },
    { label: 'Share Project', value: false },
    { label: 'Duplicate Project', value: false },
    { label: 'Archive Project', value: false },
    { label: 'Import Project', value: false },
    { label: 'Restore Project', value: false },
    { label: 'Rename Project', value: false },
    { label: 'Move Project', value: false },
    { label: 'Clone Project', value: false },
    { label: 'Assign Task', value: false },
    { label: 'Set Due Date', value: false },
    { label: 'Notify Team', value: false },
  ];

  selectedCandidate: any = null;

  onCancel() {
    this.visible = false;
  }

  onSave() {
    console.log('Selected Candidate:', this.selectedCandidate);
    this.visible = false;
  }
  onNext() {
    if (this.selectedCandidate) {
      this.currentStep = 1;
    }
  }



}
