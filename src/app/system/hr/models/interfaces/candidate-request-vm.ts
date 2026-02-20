import { Time } from "@angular/common";

export interface SearchCandidateRequestViewModel {
    VacationRequestStatus: number;
    IsSpecial:boolean;
}

export interface CreateVacationRequestViewModel {
    id:string;
    candidateId?: string;
    vacationId: string;
    fromDate: Date;
    toDate: Date;
}
export interface SearchPermissionRequestViewModel {
    Status:number;
}
export interface createPermissionRequestViewModel {
    id:string;
    candidateId?:string;
    permissionId:string;
    date:Date;
    fromTime:Time;
    toTime:Time
}