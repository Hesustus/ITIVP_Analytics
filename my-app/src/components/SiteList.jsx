import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SiteForm } from './SiteForm';
import { SiteItem } from './SiteItem';
import { SiteStats } from './SiteStats';

const INITIAL_SITES = [
  {
    id: 1,
    name: 'Мой блог',
    domain: 'blog.by',
    createdAt: '2026-01-01T10:00:00Z',
    events: [
      { id: 101, eventName: 'page_view', pageUrl: '/',      element: null,        createdAt: '2026-09-15T10:00:00Z' },
      { id: 102, eventName: 'click',     pageUrl: '/',      element: 'buy-btn',   createdAt: '2026-09-15T10:01:00Z' },
      { id: 103, eventName: 'page_view', pageUrl: '/blog',  element: null,        createdAt: '2026-09-15T10:05:00Z' },
      { id: 104, eventName: 'click',     pageUrl: '/blog',  element: 'read-more', createdAt: '2026-09-15T10:07:00Z' }
    ]
  },
  {
    id: 2,
    name: 'БГУИР',
    domain: 'bsuir.by',
    createdAt: '2026-02-15T12:30:00Z',
    events: [
      { id: 201, eventName: 'page_view', pageUrl: '/catalog',  element: null,      createdAt: '2026-09-16T12:00:00Z' },
      { id: 202, eventName: 'purchase',  pageUrl: '/checkout', element: 'buy-btn', createdAt: '2026-09-16T12:15:00Z' }
    ]
  },
  {
    id: 3,
    name: 'Спотифай',
    domain: 'spotify.com',
    createdAt: '2026-03-20T08:00:00Z',
    events: []
  }
];

export function SiteList() {
  const [sites, setSites] = useLocalStorage('hesustus.sites.v2', INITIAL_SITES);

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);


  const handleAdd = (site) => setSites(prev => [...prev, { ...site, events: [] }]);
  const handleDelete = (id) => {
    if (!confirm('Удалить сайт?')) return;
    setSites(prev => prev.filter(s => s.id !== id));
  };
  const handleUpdate = (id, patch) => {
    setSites(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
  };


  const visibleSites = sites
    .filter(s => {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.domain.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'name')   return a.name.localeCompare(b.name);
      if (sortBy === 'date')   return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'events') return (b.events?.length || 0) - (a.events?.length || 0);
      return 0;
    });

  if (isLoading) {
    return <div className="loader">Загрузка данных...</div>;
  }

  return (
    <div className="site-list">
      <h1>Hesustus Analytics</h1>

      <SiteStats sites={sites} />

      <SiteForm onAdd={handleAdd} />

      <div className="controls">
        <input
          type="text"
          placeholder="Поиск по названию или домену..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">По имени</option>
          <option value="date">По дате (новые сверху)</option>
          <option value="events">По числу событий</option>
        </select>
      </div>

      {visibleSites.length === 0 ? (
        <p className="empty">Ничего не найдено</p>
      ) : (
        <ul className="sites">
          {visibleSites.map(site => (
            <SiteItem
              key={site.id}
              site={site}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </ul>
      )}
    </div>
  );
}