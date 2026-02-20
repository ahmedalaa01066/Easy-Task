import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DocumentsService } from '../../../services/documents/documents.service';
import { DialogModule } from 'primeng/dialog';
import { AddFolderRequestViewModel, AttachMediaToDocumentDTO, AttachMediaToDocumentRequestViewModel } from '../../../models/interfaces/documents';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
  standalone: true,
  providers: [HttpClient],
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    AvatarModule,
    ButtonModule,
    MenuModule,
    DialogModule,
    FormsModule
  ],
})
export class DocumentListComponent {
  viewMode: 'root' | 'list' | 'sublist' = 'root';
  // fileDialogVisible = false;
  selectedFile: any = null;
  dialogFiles: any[] = [];
  uploadBoxes: any[] = [];
  selectedFolderId: string | null = null;
  selectedFilesMap: { [key: string]: File[] } = {};
  uploadDialogVisible = false;
  uploadedFiles: File[] = [];
  folderFiles: any[] = [];
  addFolderDialogVisible = false;
  newFolderName: string = '';
  isTouched: boolean = false;
breadcrumbPath: string[] = ['All Documents'];

  DocumentType = [
    { name: 'Management', id: 1 },
    { name: 'Department', id: 2 },
    { name: 'Candidate', id: 3 },
    { name: 'Course', id: 4 },
  ];
  currentDocuments: any[] = [];
  historyStack: { sourceType?: number, parentId?: string }[] = [];
  currentFolder: any = null;

  constructor(private documentsService: DocumentsService) { }
  openUploadDialog() {
    this.uploadDialogVisible = true;
    this.dialogFiles = [];

  }

  closeUploadDialog() {
    this.uploadDialogVisible = false;
    this.uploadedFiles = [];
  }

  openBySourceType(doc: any) {
    this.historyStack = [];
    this.breadcrumbPath = ['All Documents', doc.name];
    this.loadDocuments(doc.id, null);
  }

  loadDocuments(sourceType?: number, parentId: string | null = null) {
    this.documentsService.getDocuments(1, 50, sourceType?.toString(), parentId || undefined)
      .subscribe(res => {
        this.currentDocuments = res.data.items;
        this.viewMode = parentId ? 'sublist' : 'list';

        this.historyStack.push({ sourceType, parentId: parentId || undefined });
      });
  }

  openSubDocuments(doc: any) {
    if (doc.isFolder) {
      this.loadDocuments(undefined, doc.id);
    } else {
      this.openFileDialog(doc);
    }
  }


  deleteFileInDialog(index: number) {
    this.dialogFiles.splice(index, 1);
  }

  goBack() {
    this.uploadDialogVisible = false;
    this.dialogFiles = [];
    this.folderFiles = []

    this.historyStack.pop();
    this.breadcrumbPath.pop();
    const prev = this.historyStack[this.historyStack.length - 1];

    if (!prev) {
      this.viewMode = 'root';
      this.currentDocuments = [];
       this.breadcrumbPath = [];
    } else {
      this.loadDocuments(prev.sourceType, prev.parentId);
      this.historyStack.pop();
    }
  }



  canGoBack(): boolean {
    return this.viewMode !== 'root';
  }


  openFileDialog(file: any) {
    this.selectedFile = file;
    // this.fileDialogVisible = true;
  }

  openFolderDialog(folder: any) {
    this.selectedFolderId = folder.id;
    this.currentFolder = folder;
    this.documentsService.getDocuments(1, 50, undefined, folder.id).subscribe(res => {
      const items = res.data.items;
      this.currentFolder = folder;
      const folders = items.filter(item => item.isFolder);
      const files = items.filter(item => !item.isFolder);
      if (folders.length > 0) {
        this.currentDocuments = folders;
        this.folderFiles = files;
        this.viewMode = 'sublist';
      } else {
        this.currentDocuments = [];
        this.folderFiles = files;
        this.viewMode = 'sublist';
      }

      this.historyStack.push({ parentId: folder.id });
        this.breadcrumbPath.push(folder.name);
    });
  }


  addNewUploadBox() {
    this.uploadBoxes.push({});
  }



  handleFiles(files: FileList | File[]) {
    const fileArray = Array.from(files);

    this.documentsService.uploadMedia(fileArray, 'Media').subscribe({
      next: (res) => {
        console.log('تم رفع الملفات بنجاح:', res);
        this.refreshDialogFiles();
      },

    });
  }

  onFileSelected(event: Event | FileList) {
    let files: File[] = [];

    if (event instanceof FileList) {
      files = Array.from(event);
    } else {
      const input = event.target as HTMLInputElement;
      if (!input.files?.length) return;
      files = Array.from(input.files);
    }

    this.documentsService.uploadMedia(files, 'Media').subscribe({
      next: (res) => {
        const uploadedPaths = res.data?.path || [];

        uploadedPaths.forEach((path: string) => {
          const fileName = path.split('/').pop();

          this.dialogFiles.push({
            id: null,
            name: fileName,
            path: path,
            preview: `https://apiet.rage3ly.com/${path}`,
            isTemp: true
          });
        });

      },

    });

    if (!(event instanceof FileList)) {
      (event.target as HTMLInputElement).value = '';
    }
  }

  isImage(file: any): boolean {
    if (file.type) {
      return file.type.startsWith('image/');
    }
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);
  }

  getImagePreview(file: any): string {
    if (file.preview) {
      return file.preview;
    }
    return `http://localhost:5000/uploads/${file.name}`;
  }


  triggerFileInput(event: Event) {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  downloadFile(doc: any) {
    this.documentsService.downloadFile(doc.id).subscribe((file: Blob) => {
      const url = window.URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name || 'file';
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }



  deleteFile(file: any) {
    this.documentsService.deleteFile(file.id).subscribe({
      next: () => {
        this.dialogFiles = this.dialogFiles.filter(f => f.id !== file.id);
        window.location.reload();

      },

    });
  }

  refreshDialogFiles() {
    if (this.selectedFolderId) {
      this.documentsService.getDocuments(1, 50, undefined, this.selectedFolderId).subscribe(res => {
        this.dialogFiles = res.data.items.filter(item => !item.isFolder);
      });
    }
  }



  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.onFileSelected(files);
    }
  }




  saveUploadedFiles() {
    if (!this.selectedFolderId || this.dialogFiles.length === 0) {
      return;
    }
    const mediaDTOs: AttachMediaToDocumentDTO[] = this.dialogFiles.map(file => ({
      sourceType: 1,
      path: file.path
    }));

    const lastHistory = this.historyStack[this.historyStack.length - 1];
    const sourceType = lastHistory?.sourceType ?? 1;
    const sourceId = this.currentFolder?.sourceId;

    const body: AttachMediaToDocumentRequestViewModel = {
      sourceId: sourceId,
      documentId: this.selectedFolderId!,
      attachMediaToDocumentDTOs: mediaDTOs
    };

    this.documentsService.saveMedia(body).subscribe({
      next: () => {
        this.uploadDialogVisible = false;
        this.dialogFiles = [];
        if (this.currentFolder) {
          this.openFolderDialog(this.currentFolder);
        }

      },
    });
  }


  openAddFolderDialog() {
    this.addFolderDialogVisible = true;
    this.newFolderName = '';
  }

  closeAddFolderDialog() {
    this.addFolderDialogVisible = false;
    this.newFolderName = '';
  }

  saveNewFolder() {
    if (!this.newFolderName.trim()) return;

    const lastHistory = this.historyStack[this.historyStack.length - 1];

    const body: AddFolderRequestViewModel = {
      name: this.newFolderName,
      parentDocumentId: this.selectedFolderId
    };

    this.documentsService.addFolder(body).subscribe({
      next: () => {
        this.addFolderDialogVisible = false;
        this.newFolderName = '';

        const lastHistory = this.historyStack[this.historyStack.length - 1];

        if (lastHistory?.parentId) {
          this.loadDocuments(lastHistory.sourceType, lastHistory.parentId);
        } else if (lastHistory?.sourceType) {
          this.loadDocuments(lastHistory.sourceType, null);
        } else {
          this.viewMode = 'root';
        }
      }
    });

  }

  get isFolderView(): boolean {
    return this.currentDocuments.some(d => d.isFolder);
  }

  get isFileView(): boolean {
    return this.folderFiles.length > 0 || (this.selectedFolderId && this.currentDocuments.every(d => !d.isFolder));
  }

onBreadcrumbClick(index: number) {
  if (index === 0) {
    this.breadcrumbPath = ['All Documents'];
    this.historyStack = [];
    this.viewMode = 'root';
    this.currentDocuments = [];
    this.folderFiles = [];
    this.selectedFolderId = null;
    return;
  }
  if (index === this.breadcrumbPath.length - 1) return;
  this.breadcrumbPath = this.breadcrumbPath.slice(0, index + 1);
  const adjustedIndex = index - 1;
  this.historyStack = this.historyStack.slice(0, adjustedIndex + 1);

  const target = this.historyStack[adjustedIndex];

  if (!target) {
    this.viewMode = 'root';
    this.currentDocuments = [];
    this.selectedFolderId = null;
    this.folderFiles = [];
    return;
  }
  this.documentsService.getDocuments(1, 50, target.sourceType?.toString(), target.parentId || undefined)
    .subscribe(res => {
      const items = res.data.items;
      const folders = items.filter(item => item.isFolder);
      const files = items.filter(item => !item.isFolder);

      this.currentDocuments = folders;
      this.folderFiles = files;
      this.viewMode = target.parentId ? 'sublist' : 'list';
      this.selectedFolderId = target.parentId || null;
    });
}

}
