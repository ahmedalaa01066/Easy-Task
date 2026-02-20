import { HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseViewModel } from 'src/app/core/models/response.model';
import { ApiService } from 'src/app/core/services/api.service';
import { environment } from 'src/environments/environment';
import { AddFolderRequestViewModel, AttachMediaToDocumentRequestViewModel } from '../../models/interfaces/documents';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  constructor(private _apiService: ApiService) { }

  getAllDocuments: EventEmitter<void> = new EventEmitter<void>();
  getDocuments(
    pageIndex: number = 1,
    pageSize: number = 0,
    SourceType?: string,
    ParentDocumentId?: string
  ): Observable<ResponseViewModel> {
    if (pageSize === 0) pageSize = environment.pageSize;

    let url = `/GetAllDocumentsEndpoint/GetAllDocuments?pageIndex=${pageIndex}&pageSize=${pageSize}`;

    if (SourceType) {
      url += `&SourceType=${SourceType}`;
    }

    if (ParentDocumentId) {
      url += `&ParentDocumentId=${ParentDocumentId}`;
    }

    return this._apiService.get(url);
  }




 uploadMedia(files: File[], path = "Media") {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('Files', file, file.name);
    });

    formData.append('Path', path);

    return this._apiService.postMedia(
      '/UploadMediaEndPoint/UploadMedia',
      formData,
      true
    );
  }


deleteFile(id: string) {
  const body = { ID: id }; 
  return this._apiService.remove(`/DeleteMediaEndPoint/DeleteMedia`, body);
}


  downloadFile(id:string){
     return this._apiService.getFiles(
      '/DownloadMediaEndpoint/DownloadMedia',
      new HttpParams().set('id', id)
    );
  }



 saveMedia(body: AttachMediaToDocumentRequestViewModel) {
  return this._apiService.post(
    '/AttachMediaToDocumentEndpoint/AttachMediaToDocument',
    body
  );
}


addFolder(body: AddFolderRequestViewModel): Observable<ResponseViewModel> {
  return this._apiService.post(
    '/AddDocumentEndpoint/AddDocument',
    body
  );
}
}
