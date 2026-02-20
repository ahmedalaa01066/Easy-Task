export interface JobVM {
  id: string;
  name: string;
  managementName: string;
  managementId: string;
  description: string;
  jobCode: string;
}
export class searchJobVM {
  SearchText: string;
}
export interface createNewPositionVM {
  id: string;
  name: string;
  managementId: string;
  description: string;
}
