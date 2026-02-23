export interface VacationsVM {
  id: string;
  candidateId: string;
  candidateName: string;
  vacationId: string;
  vacationName: string;
  maxRequestNum: number;
  counter: number;
  year: number;
}

export class searchVacationsVM {
  SearchText: string;
}


export class editVacationVM {
  id: string;
  counter: number;
}