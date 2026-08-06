export type LabStatus = 'High' | 'Low' | 'Normal';

export interface LabResultItem {
  test_name: string;
  value: string;
  reference_range?: string;
  status: LabStatus | string;
  explanation: string;
}

export interface MedicalSummary {
  key_findings: string[];
  simplification: string;
  lab_results: LabResultItem[];
  actionable_questions: string[];
}

export interface ReportSimplifyResponse {
  id: string;
  filename: string;
  processed_at: string;
  summary: MedicalSummary;
}
