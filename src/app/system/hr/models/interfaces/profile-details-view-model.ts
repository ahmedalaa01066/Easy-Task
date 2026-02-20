export interface ProfileDetailsViewModel {
  id: string;
  firstName: string;
  lastName: string;
  joiningDate: Date;
  email: string;
  bio: string;
  phoneNumber: string;
  candidateStatus: number;
  managerId: string;
  managementId: string;
  departmentId: string;
  levelId: string;
  levelName: string;
  positionId: string;
  positionName: string;
  candidateImage: string;
  paths: string[];
  documentId: string;
  documentPath: string;
}

export interface EditProfileViewModel {
  id: string;
  firstName: string;
  lastName: string;
  joiningDate: Date;
  email: string;
  bio: string;
  phoneNumber: string;
  candidateStatus: number;
  managerId: string;
  managementId: string;
  departmentId: string;
  levelId: string;
  positionId: string;
  positionName: string;
  documentId: string;
  paths: string[];
}
export interface createPenaltiyViewModel {
  candidateId: string;
  description: string;
}
export interface editPenaltiyViewModel {
  id: string;
  description: string;
}
export interface editBioViewModel {
  id: string;
  bio: string;
}
export interface addDocumentViewModel {
  sourceId: string;
  documentId: string;
  attachMediaToDocumentDTOs: AttachMediaToDocumentViewModel[];
}
export interface AttachMediaToDocumentViewModel {
  sourceType: number;
  path: string;
}

export interface startCourseVM {
  candidateId: string;
  courseId: string;
  actualStartDate: string;
}
export interface GetManagerByCandidateViewModel {
  id: string;
  managerName: string;
  email: string;
  level: string;
}
export interface EditHierarchyinProfileViewModel {
  id: string;
  levelId: string;
}

export interface KPIsinProfileViewModel {
  id: string;
  kpiName: string;
  kpiType: string;
  updatedDate: string;
}

export interface AttendanceProfileViewModel {
  actualStartDate: string; // DateOnly -> string بصيغة YYYY-MM-DD
  fromTime: string; // TimeSpan -> string بصيغة HH:mm:ss
  toTime: string; // TimeSpan -> string بصيغة HH:mm:ss
}
export interface searchAttendanceProfileViewModel {
  CandidateId:string;
  From:Date;
  To:Date;
}
export interface getAnnualProfileViewModel {
  maxRequestNum: number,
  remainingDays: number,
}