export interface PullRequestResponse {
  repository: string;
  number: number;
  author: string;
  assignees: string[];
  reviewers: string[];
  link: string;
  title: string;
  description: string;
  source_branch: string;
  target_branch: string;
  days_open: number;
}
