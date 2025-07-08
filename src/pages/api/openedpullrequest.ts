
import type { APIRoute } from 'astro';

const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;
const ORG = 'BUS-BackOffice';
const FILTERS = [/ORA_/, /WF_/];

export const GET: APIRoute = async () => {
    console.log('Fetching repositories and pull requests...');
    // Verificamos si el token de acceso personal (PAT) está definido
    console.log(`GITHUB_TOKEN: ${GITHUB_TOKEN ? 'defined' : 'not defined'}`);
  if (!GITHUB_TOKEN) {
    return new Response(JSON.stringify({ error: 'No PAT provided' }), { status: 500 });
  }

  // Primero, obtenemos la cantidad total de repositorios para calcular el número de páginas
  const orgRes = await fetch(`https://api.github.com/orgs/${ORG}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (!orgRes.ok) {
    return new Response(JSON.stringify({ error: 'GitHub API error', status: orgRes.status }), { status: 500 });
  }
  const orgData = await orgRes.json();
  const totalRepos = orgData.owned_private_repos || 0;
  const perPage = 100;
  const totalPages = Math.ceil(totalRepos / perPage);

  // Creamos los fetch en paralelo
  const fetches = Array.from({ length: totalPages }, (_, i) =>
    fetch(`https://api.github.com/orgs/${ORG}/repos?per_page=${perPage}&page=${i + 1}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
        },
      }
    )
  );

  const responses = await Promise.all(fetches);
  for (const res of responses) {
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'GitHub API error', status: res.status }), { status: 500 });
    }
  }
  const allData = await Promise.all(responses.map(res => res.json()));
  const repos = allData.flat();

  const filtered = repos.filter(repo => FILTERS.some(rx => rx.test(repo.name)));

  console.log(`Filtered repositories count: ${filtered.length}`);


  // Limitar el paralelismo de los fetches de PRs
  const CONCURRENCY = 5;
  const allPRs: any[] = [];
  for (let i = 0; i < filtered.length; i += CONCURRENCY) {
    const batch = filtered.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(repo =>
        fetch(`https://api.github.com/repos/${ORG}/${repo.name}/pulls?state=open&per_page=100`, {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json',
          },
        })
          .then(async res => {
            if (!res.ok) return [];
            const pulls = await res.json();
            console.log(`Fetched ${pulls.length} PRs from ${repo.name}`);
            return pulls.map((pr: any) => ({
              repository: repo.name,
              number: pr.number,
              author: pr.user?.login || '',
              assignees: (pr.assignees?.map((a: any) => a.login)) || [],
              reviewers: (pr.requested_reviewers?.map((r: any) => r.login)) || [],
              link: pr.html_url,
              title: pr.title,
              description: pr.body || '',
              source_branch: pr.head?.ref || '',
              target_branch: pr.base?.ref || '',
              days_open: Math.floor((Date.now() - new Date(pr.created_at).getTime()) / (1000 * 60 * 60 * 24)),
            }));
          })
      )
    );
    allPRs.push(...results.flat());
  }

  return new Response(JSON.stringify(allPRs), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
