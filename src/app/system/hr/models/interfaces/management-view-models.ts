export interface ManagementViewModel {
  id: string;
  name: string;
  isActive: boolean;
  departments: DepartmentViewModel[];
  managerId: string;
}
export interface DepartmentViewModel {
  id: string;
  name: string;
  isActive: boolean;
  candidateCount: number;
}
export class SearchManagementViewModel {
  name: string;
}
export interface CreateManagementViewModel {
  id: string;
  name: string;
  departmentName: string[];
  managerId: string;
}
export interface EditManagementViewModel {
  id: string;
  name: string;
  managerId: string;
}
export class selectManagersList {
  id: string;
  name: string;
}
