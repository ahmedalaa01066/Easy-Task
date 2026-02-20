import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import {
  addDocumentViewModel,
  createPenaltiyViewModel,
} from '../../../../models/interfaces/profile-details-view-model';
import { environment } from 'src/environments/environment';
import { HrService } from '../../../../services/hr.service';
import { SourceType } from '../../../../models/enum/sourceType';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    DropdownModule,
  ],
})

export class AddDocumentComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() documentAdded = new EventEmitter<addDocumentViewModel>();
  @Input() candidateId!: string;
  @Input() documentId!: string;


  displayEditDialog: boolean = false;
  environment = environment;
  isDragOver = false;
  selectedFiles: File[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly _hrService: HrService
  ) {}
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const files = Array.from((event.dataTransfer?.files || []) as File[]);
    this.handleFiles(files);
  }

  onDialogHide() {
    this.selectedFiles = [];
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  private handleFiles(files: File[]) {
    this.selectedFiles = [...this.selectedFiles, ...files];
  }
addDocuments() {
  if (this.selectedFiles.length > 0) {
    const path = 'Documents/Candidates';

    this._hrService.uploadImage(this.selectedFiles, path).subscribe({
      next: (res: any) => {
        if (res.isSuccess && res.data && res.data.path) {
          
          const body: addDocumentViewModel = {
            sourceId: this.candidateId,     
            documentId: this.documentId,    
            attachMediaToDocumentDTOs: res.data.path.map((filePath: string) => ({
              sourceType: SourceType.CandidateData,
              path: filePath
            })),
          };

          this._hrService.addDocument(body).subscribe({
            next: (attachRes) => {
              if (attachRes.isSuccess) {
                this.documentAdded.emit(body);
                this.closeDialog();
              }
            },
            error: (err) => console.error('❌ Attach error:', err),
          });
        }
      },
      error: (err) => console.error('❌ Upload error:', err),
    });
  } else {
    this.closeDialog();
  }
}



  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
  onFileSelected(event: any) {
    const files = Array.from(event.target.files as File[]);
    this.handleFiles(files);
  }
}
