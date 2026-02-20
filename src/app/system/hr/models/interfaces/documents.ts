export interface AttachMediaToDocumentDTO {
  sourceType: number;
  path: string;
}

export interface AttachMediaToDocumentRequestViewModel {
  sourceId: string;
  documentId: string;
  attachMediaToDocumentDTOs: AttachMediaToDocumentDTO[];
}



export interface AddFolderRequestViewModel {
  name: string;                     
  parentDocumentId: string; 
}
