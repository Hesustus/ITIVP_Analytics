import { useState, useEffect, useCallback } from 'react';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { SiteDetail } from './components/SiteDetail';
import { SiteForm } from './components/SiteForm';
import { Profile } from './components/Profile';
import { sitesApi } from './api';
import './App.css';

function App() {
  const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedSiteId, setSelectedSiteId] = useState(null);

  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');          
  const [debouncedSearch, setDebouncedSearch] = useState(''); 
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('csrfToken');
    setIsAuthed(false);
    setCurrentPage('home');
  };

  const navigate = (pageName, id = null) => {
    setCurrentPage(pageName);
    setSelectedSiteId(id);
  };

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
        page: page, 
        limit: 10, 
        search: debouncedSearch 
      });
      setSites(data.data);
      setMeta({ total: data.total, totalPages: data.totalPages });
    } catch (err) {
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    if (isAuthed) loadSites();
  }, [isAuthed, loadSites]);

  const handleAddSite = async (formData) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticSite = { id: tempId, name: formData.name, domain: formData.domain, visits: [] };
    
    setSites(prev => [optimisticSite, ...prev]);
    setPage(1); 
    navigate('home');

    try {
      const { data } = await sitesApi.create(formData);
      setSites(prev => prev.map(s => s.id === tempId ? { ...data, visits: [] } : s));
    } catch (err) {
      setSites(prev => prev.filter(s => s.id !== tempId));
      alert('Ошибка при создании сайта');
    }
  };

  const handleEditSite = async (id, formData) => {
    const oldSite = sites.find(s => s.id === id);
    setSites(prev => prev.map(s => s.id === id ? { ...s, ...formData } : s));
    navigate('home');

    try {
      await sitesApi.update(id, formData);
    } catch (err) {
      setSites(prev => prev.map(s => s.id === id ? oldSite : s));
      alert('Ошибка при обновлении');
    }
  };

  const handleDeleteSite = async (id) => {
    const removed = sites.find(s => s.id === id);
    setSites(prev => prev.filter(s => s.id !== id));

    try {
      await sitesApi.remove(id);
      setMeta(prev => ({ ...prev, total: prev.total - 1 }));
    } catch (err) {
      setSites(prev => [removed, ...prev]);
      alert('Ошибка при удалении');
    }
  };

  if (!isAuthed) return <Login onLogin={() => setIsAuthed(true)} />;

  const renderPage = () => {
    switch (currentPage) {
      case 'detail':
        return <SiteDetail id={selectedSiteId} onNavigate={navigate} />;
      case 'form':
        return <SiteForm id={selectedSiteId} sites={sites} onAdd={handleAddSite} onEdit={handleEditSite} onNavigate={navigate} />;
      case 'profile':
        return <Profile />;
      case 'home':
      default:
        return (
          <Home 
            sites={sites} 
            loading={loading} 
            error={error} 
            onRetry={loadSites}
            onDelete={handleDeleteSite}
            onNavigate={navigate}
            search={search}
            setSearch={setSearch}
            page={page}
            setPage={setPage}
            meta={meta}
          />
        );
    }
  };

  return (
    <Layout onLogout={handleLogout} onNavigate={navigate}>
      {renderPage()}
    </Layout>
  );
}

export default App;

//ivan@mail.ru
//password123