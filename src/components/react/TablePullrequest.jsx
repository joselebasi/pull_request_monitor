import React, { useEffect, useState } from 'react';


const columns = [
  { key: 'repository', label: 'Repositorio' },
  { key: 'number', label: 'ID' },
  { key: 'author', label: 'Autor' },
  { key: 'assignees', label: 'Asignados' },
  { key: 'reviewers', label: 'Reviewers' },
  { key: 'days_open', label: 'Días Abierto' },
  { key: 'link', label: 'Enlace' },
];

const TablePullrequest = () => {
  const [pulls, setPulls] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('days_open');
  const [sortDir, setSortDir] = useState('desc');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  useEffect(() => {
    const localData = localStorage.getItem('pullsData');
    if (localData) {
      setPulls(JSON.parse(localData));
      setLoading(false);
    } else {
      fetchData();
    }
    // eslint-disable-next-line
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch(`/api/openedpullrequest`).then(res => res.json()).then(data => {
      setPulls(data);
      localStorage.setItem('pullsData', JSON.stringify(data));
      setLoading(false);
    });
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
    setPage(1); // Reset page when sorting
  };

  const filteredPulls = pulls.filter(pr =>
    search === '' ||
    pr.repository.toLowerCase().includes(search.toLowerCase()) ||
    pr.author.toLowerCase().includes(search.toLowerCase()) ||
    (Array.isArray(pr.assignees) && pr.assignees.some((a) => a.toLowerCase().includes(search.toLowerCase())))
  );

  const sortedPulls = [...filteredPulls].sort((a, b) => {
    if (a[sortBy] === undefined || b[sortBy] === undefined) return 0;
    if (typeof a[sortBy] === 'string') {
      return sortDir === 'asc'
        ? a[sortBy].localeCompare(b[sortBy])
        : b[sortBy].localeCompare(a[sortBy]);
    }
    if (typeof a[sortBy] === 'number') {
      return sortDir === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
    }
    return 0;
  });

  // Calcular totalPages dinámicamente según el filtro actual
  const totalPagesFiltered = Math.max(1, Math.ceil(sortedPulls.length / limit));
  // Si la página actual es mayor al total, ajusta a la última
  useEffect(() => {
    if (page > totalPagesFiltered) setPage(totalPagesFiltered);
  }, [totalPagesFiltered]);

  const pagedPulls = sortedPulls.slice((page - 1) * limit, page * limit);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-md font-bold">Pull Requests Abiertos</h2>
        <button
          className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
          onClick={() => {
            localStorage.removeItem('pullsData');
            fetchData();
          }}
          disabled={loading}
        >Actualizar</button>
      </div>
      <input
        className="border px-2 py-1 mb-4 rounded w-full max-w-xs"
        type="text"
        placeholder="Buscar por repo, autor o asignado..."
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={
                  "px-4 py-2 border-b select-none hover:bg-gray-100" +
                  (col.key !== 'reviewers' ? ' cursor-pointer' : '')
                }
                onClick={col.key !== 'reviewers' ? () => handleSort(col.key) : undefined}
              >
                {col.label}
                {col.key !== 'reviewers' && sortBy === col.key && (
                  <span> {sortDir === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
            ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length} className="text-center py-4">Cargando...</td></tr>
            ) : pagedPulls.length === 0 ? (
              <tr><td colSpan={columns.length} className="text-center py-4">Sin resultados</td></tr>
            ) : (
              pagedPulls.map((pr, idx) => (
                <tr key={pr.link + idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{pr.repository}</td>
                  <td className="px-4 py-2 border-b">{pr.number}</td>
                  <td className="px-4 py-2 border-b">{pr.author}</td>
                  <td className="px-4 py-2 border-b">{pr.assignees.join(', ')}</td>
                  <td className="px-4 py-2 border-b">{pr.reviewers.join(', ')}</td>
                  <td className="px-4 py-2 border-b text-center">{pr.days_open}</td>
                  <td className="px-4 py-2 border-b text-blue-600 underline"><a href={pr.link} target="_blank" rel="noopener noreferrer">Ver PR</a></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
        >Anterior</button>
        <span className="px-2">Página {page} de {totalPagesFiltered}</span>
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPagesFiltered}
        >Siguiente</button>
      </div>
    </div>
  );
};

export default TablePullrequest;
