export interface CandidateViewModel {
  id: string;
  firstName: string;
  lastName: string;
  joiningDate: Date;
  email: string;
  jobCode: string;
  phoneNumber: string;
  candidateStatus: number;
  statusName: string;
  manager: string;
  management: string;
  department: string;
  level: string;
  position: string;
  positionName: string;
  candidateImage: string;
}
export class SearchCandidateViewModel {
  candidateStatus: number;
}
export interface CreateCandidateViewModel {
  id: string;
  firstName: string;
  LastName: string;
  password: string;
  confirmPassword: string;
  joiningDate: string;
  email: string;
  phoneNumber: string;
  candidateStatus: number;
  managerId: string;
  managementId: string;
  departmentId: string;
  levelId: string;
  positionId: string;
  positionName: string;
    bio: string;
}
export interface SelectCandidateViewModel {
  id: string;
  name: string;
}
