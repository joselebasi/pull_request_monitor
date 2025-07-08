import { type Launch, type SpaceXLaunchesResponse } from '../types/SpaceXLaunchesResponse';


export const getLaunchBy = async (id: string) => {
  const response = await fetch(`https://api.spacexdata.com/v5/launches/${id}`);

  const launch = (await response.json()) as Launch;
  return launch;
}

export const getLastestLaunches = async (page: number, limit: number, search: string) => {
  // Filtrar por launches que tengan logo (patch.large) y descripción (details)
  const query: any = search
    ? { name: { $regex: search, $options: 'i' } }
    : {};

  // Agregar condiciones para que patch.large y details existan y no sean null
  query["links.patch.large"] = { $ne: null };
  query["details"] = { $ne: null };

  const response = await fetch("https://api.spacexdata.com/v5/launches/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      options: {
        page,
        limit,
        sort: { date_utc: "desc" },
      },
    }),
  });

  const data = await response.json() as SpaceXLaunchesResponse;
  return data;
}

