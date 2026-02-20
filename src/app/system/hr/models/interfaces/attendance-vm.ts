export interface searchCandidatesAssignation {
  SearchText: string;
}
export interface CandidatesAssignation {
  id: string;
  name: string;
  candidateId: string;
  shiftName: string;
  shiftID: string;
  fromTime: string;
  toTime: string;
  attendanceActivation: number;
  departmentName: string;
}
export interface Shift {
  shiftName: string;
  start: string;
  end: string;
  pause: string;
  assign: string[];
}
export interface searchAllShiftsVM {
  SearchText: string;
}
export interface allShiftsVM {
  id: string;
  name: string;
  fromTime: string;
  toTime: string;
  maxPauseDuration: string;
  assignation: string[];
  marginBefore: string;
  marginAfter: string;
}
export interface createShiftsVM {
  id: string;
  name: string;
  fromTime: string;
  toTime: string;
  PauseOption: boolean;
  maxPauseDuration: string;
  marginBefore: string;
  marginAfter: string;
}
export interface GetAllShiftsDetailsForCandidateVM {
  log: string;
  time: string;
  date: Date;
}

export interface searchGetAllShiftsDetailsForCandidateVM {
  CandidateId: string;
  From: Date;
  TO: Date;
}
export interface assignCandidateToShiftVM {
  startDate: Date;
  endDate: Date;
  candidateIds: string[];
  shiftId: string;
}

export interface unAssignShiftVM {
  candidateId: string;
  shiftId: string;
}

export interface startPauseVM {
  attendanceId: string;
}

export interface stopPauseVM {
  id: string;
}

export interface editAttendenceActivationVM {
  id: string;
  attendanceActivation: number;
}
export interface searchCandidatesWeeklyStatusVM {
  SearchText: string;
  StartDate: Date;
  EndDate: Date;
}
export interface candidatesWeeklyStatusVM {
  candidateId: string;
  candidateName: string;
  departmentName: string;
  weeklyStatuses: weeklyStatusesVM;
}
export interface weeklyStatusesVM {
  dayName: string;
  date: Date;
  status: number;
}
