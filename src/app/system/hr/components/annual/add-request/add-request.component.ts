import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { createRequestTypeViewModel } from '../../../models/interfaces/annual';
import { AnnualService } from '../../../services/annuals/annual.service';

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.css'],
  standalone: true,
  providers: [HttpClient],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    DropdownModule,
    CalendarModule,
  ],
})
export class AddRequestComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() requestToEdit: createRequestTypeViewModel | null = null; // 👈 لو edit جاي من بره
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() requestAdded = new EventEmitter<any>();

  requestForm: FormGroup;

  constructor(private fb: FormBuilder, private annualService: AnnualService) {
    this.requestForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      maxRequestNum: [null, [Validators.required, Validators.min(1)]],
      confirmationLayerNum: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // 👇 لو المودال اتفتح
    if (changes['visible'] && this.visible) {
      this.requestForm.reset();

      // 👇 لو في بيانات للتعديل
      if (this.requestToEdit) {
        this.requestForm.patchValue({
          id: this.requestToEdit.id,
          name: this.requestToEdit.name,
          maxRequestNum: this.requestToEdit.maxRequestNum,
          confirmationLayerNum: this.requestToEdit.confirmationLayerNum,
        });
      }
    }
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  save() {
    if (this.requestForm.invalid) return;
    const body: createRequestTypeViewModel = this.requestForm.value;

    this.annualService.postOrUpdateRequestType(body).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.requestAdded.emit(res.data);
          this.closeDialog();
        }
      },
      error: (err) => console.error('API Error:', err),
    });
  }
}



