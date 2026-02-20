export interface RecommendedCoursesViewModel {
  id: string;
  name: string;
  numOfCandidates: number;
  assignedManagements: ManagementIDAndNameDTO[];
}
export class ManagementIDAndNameDTO {
  id: string;
  name: string;
}
export class SearchRecommendedCoursesViewModel {
  Name: string;
}
export class UnassignManagmentFromCourse {
  courseId!: string;
  managementIds!: string[];
}

export interface CreateRecommendedCoursesViewModel {
  candidateIds: string[];
  courseId?: string;
  startDate: string;
  endDate: string;
  name?: string;
  hours?: number;
  instructorName?: string;
  courseClassification?: number;
  status?: number;
  hasExam?: boolean;
  courseType?: number;
  // paths: string[];
  link: string;
  content: string;
}
export interface GetAllCandidatesForCourseViewModel {
  candidateEmail: string;
  candidateName: string;
  candidateId: string;
  ManagementName: string;
  ManagementId: string;
  path: string;
}
export interface GetCourseByIdViewModel {
  name: string;
  instructorName: string;
  candidateNumber: Number
  link: string;
  content:string;
}

export interface editCourse {
id:string;
name:string;
hours:number;
instructorName:string;
courseClassification:number;
status:number;
hasExam:boolean;
courseType:number;
link:string;
content:string;
paths:string[];
}