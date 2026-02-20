export interface searchSpecialDayViewModel {
    Name:string;
    From:Date;
    To:Date;
}


export interface CreateSpecialDayViewModel {
    name:string;
    fromDate:Date;
    toDate:Date;
    isOneDay:boolean;
}