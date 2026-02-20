export interface Dashboard {
  attendance: number;
  annual: number;
  workFromHome: number;
}
export interface searchCourses {
  Name: string;
}
export interface allCourses {
  id: string;
  name: string;
  numOfCandidates: number;
}
export class coursesStatistics {
  courseCount: number;
  assignedCourseCount: number;
  unassignedCourseCount: number;
}
export class levelsStatistics {
  id: string;
  name: string;
  assignedCandidatesCount: number;
}
export interface searchEmployeeAttendence {
  FromDate:string;
  ToDate:string;
}