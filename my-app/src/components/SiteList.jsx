import { useState, useEffect, useCallback } from 'react';
import { sitesApi } from '../api';
import { SiteForm } from './SiteForm';
import { SiteItem } from './SiteItem';
import { SiteStats } from './SiteStats';

export function SiteList({ onLogout }) {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const loadSites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await sitesApi.list({
        page,
        limit: 9,
        search: debouncedSearch
      });
      setSites(data.data);
      setMeta({ total: data.total, totalPages: data.totalPages });
    } catch (err) {
      if (err.response?.status === 401) return onLogout();
      setError(err.response?.data?.error || 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, onLogout]);

  useEffect(() => {
    loadSites();
  }, [loadSites]);

  useEffect(() => {
    document.title = `📊 ${meta.total} сайтов — Hesustus Analytics`;
  }, [meta.total]);



  const handleAdd = async (formData) => {
    const tempId = `temp-${Date.now()}`;
    const optimistic = { id: tempId, name: formData.name, domain: formData.domain, visits: [], _pending: true };
    
    setSites(prev => [optimistic, ...prev]);
    setMeta(prev => ({ ...prev, total: prev.total + 1 }));

    try {
      const { data } = await sitesApi.create(formData);
      setSites(prev => prev.map(s => s.id === tempId ? data : s));
    } catch (err) {
      setSites(prev => prev.filter(s => s.id !== tempId));
      setMeta(prev => ({ ...prev, total: prev.total - 1 }));
      alert('Ошибка при создании сайта');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить сайт?')) return;
    const removed = sites.find(s => s.id === id);
    
    setSites(prev => prev.filter(s => s.id !== id));
    setMeta(prev => ({ ...prev, total: prev.total - 1 }));

    try {
      await sitesApi.remove(id);
    } catch (err) {
      setSites(prev => [removed, ...prev]);
      setMeta(prev => ({ ...prev, total: prev.total + 1 }));
      alert('Ошибка при удалении');
    }
  };

  const handleUpdate = async (id, patch) => {
    const old = sites.find(s => s.id === id);
    setSites(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));

    try {
      const { data } = await sitesApi.update(id, {
        name: patch.name ?? old.name,
        domain: patch.domain ?? old.domain
      });
      setSites(prev => prev.map(s => s.id === id ? data : s));
    } catch (err) {
      setSites(prev => prev.map(s => s.id === id ? old : s));
      alert('Ошибка при обновлении');
    }
  };

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="brand">Hesustus Analytics</div>
        <button className="btn-logout" onClick={onLogout}>Выйти</button>
      </header>

      <div className="dashboard-content">
        <SiteStats meta={meta} sites={sites} />

        <div className="toolbar">
          <div className="search-box">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              type="text"
              placeholder="Поиск по названию или домену..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <SiteForm onAdd={handleAdd} />
        </div>

        {error && (
          <div className="alert error">
            <span>{error}</span>
            <button onClick={loadSites}>Повторить</button>
          </div>
        )}

        <div className="sites-grid">
          {loading ? (
            <div className="loading-state"><div className="spinner" /><p>Загрузка...</p></div>
          ) : sites.length === 0 ? (
            <div className="empty-state">
              <p>{search ? 'По вашему запросу ничего не найдено' : 'Сайтов пока нет. Добавьте первый!'}</p>
            </div>
          ) : (
            sites.map(site => (
              <SiteItem key={site.id} site={site} onDelete={handleDelete} onUpdate={handleUpdate} />
            ))
          )}
        </div>

        {meta.totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Назад</button>
            <span>Страница {page} из {meta.totalPages}</span>
            <button disabled={page === meta.totalPages} onClick={() => setPage(p => p + 1)}>Вперёд →</button>
          </div>
        )}
      </div>
    </div>
  );
}