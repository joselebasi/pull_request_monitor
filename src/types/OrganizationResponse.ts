export interface OrganizationPlan {
  name: string;
  space: number;
  private_repos: number;
  filled_seats: number;
  seats: number;
}

export interface OrganizationResponse {
  login: string;
  id: number;
  node_id: string;
  url: string;
  repos_url: string;
  events_url: string;
  hooks_url: string;
  issues_url: string;
  members_url: string;
  public_members_url: string;
  avatar_url: string;
  description: string | null;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  twitter_username: string | null;
  is_verified: boolean;
  has_organization_projects: boolean;
  has_repository_projects: boolean;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  html_url: string;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
  type: string;
  total_private_repos: number;
  owned_private_repos: number;
  private_gists: number;
  disk_usage: number;
  collaborators: number;
  billing_email: string;
  default_repository_permission: string;
  members_can_create_repositories: boolean;
  two_factor_requirement_enabled: boolean;
  members_allowed_repository_creation_type: string;
  members_can_create_public_repositories: boolean;
  members_can_create_private_repositories: boolean;
  members_can_create_internal_repositories: boolean;
  members_can_create_pages: boolean;
  members_can_fork_private_repositories: boolean;
  web_commit_signoff_required: boolean;
  deploy_keys_enabled_for_repositories: boolean;
  members_can_create_public_pages: boolean;
  members_can_create_private_pages: boolean;
  members_can_delete_repositories: boolean;
  members_can_change_repo_visibility: boolean;
  members_can_invite_outside_collaborators: boolean;
  members_can_delete_issues: boolean;
  display_commenter_full_name_setting_enabled: boolean;
  readers_can_create_discussions: boolean;
  members_can_create_teams: boolean;
  members_can_view_dependency_insights: boolean;
  default_repository_branch: string;
  plan: OrganizationPlan;
  advanced_security_enabled_for_new_repositories: boolean;
  dependabot_alerts_enabled_for_new_repositories: boolean;
  dependabot_security_updates_enabled_for_new_repositories: boolean;
  dependency_graph_enabled_for_new_repositories: boolean;
  secret_scanning_enabled_for_new_repositories: boolean;
  secret_scanning_push_protection_enabled_for_new_repositories: boolean;
  secret_scanning_push_protection_custom_link_enabled: boolean;
  secret_scanning_push_protection_custom_link: string | null;
  secret_scanning_validity_checks_enabled: boolean;
}
