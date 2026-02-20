export interface HierarchyViewModel {
  levelId :string;
  levelName :string;
  sequence :number;
  candidateID :string;
  candidateName :string;
  managementId :string;
  managementName :string;
  candidates :CandidateHierarchyVM;
}

export interface CandidateHierarchyVM {
  candidateID :string;
  candidateName :string;
  levelId :string;
  levelName :string;
  levelSeq :number;
  managementId :string;
  managementName :string;
  candidateThirdLevel :CandidateHierarchyVM;
}

export interface CreateHierarchyViewModel{
    id: string;
  name: string;
  sequence:number;
}

export interface SearchHierarcyiewModel {
  num:number;
}