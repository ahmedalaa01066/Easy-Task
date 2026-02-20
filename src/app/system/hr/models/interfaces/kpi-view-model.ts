export interface KpiViewModel {
  id: string;
  name: string;
  positionName: string;
  path:string;
  candidateKPIs: GetKPIsByCandidateIdVM;
}
export interface GetKPIsByCandidateIdVM {
  KPIsName: string[];
  UpdatedDate?: Date;
}
export class searchKpiViewModel {
  SearchText: string;
}

export interface createKpiViewModel {
  name: string;
  type:number;
  candidateId:string;
  percentage:number
}
export interface defaultKpiViewModel {
  id:string;
  name: string;
  type:number;
  percentage:number
}
export interface createDefaultKpiViewModel {
  name: string;
  type:number;
  percentage:number
}
export interface deleteDefaultKpiViewModel {
  id:string
}
