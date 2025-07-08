export interface RepositoryOwner {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface RepositoryResponse {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: RepositoryOwner;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  // ...otros campos relevantes según la respuesta de la API de GitHub
  [key: string]: any;
}
