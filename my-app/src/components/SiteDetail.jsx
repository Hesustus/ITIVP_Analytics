import { useState, useEffect, useMemo } from 'react';
import { sitesApi } from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function SiteDetail({ id, onNavigate }) {
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedTypes, setSelectedTypes] = useState(new Set());
  const [selectedSessions, setSelectedSessions] = useState(new Set());

  useEffect(() => {
    sitesApi.one(id)
      .then(res => setSite(res.data))
      .catch(() => alert('Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, [id]);

  const allEvents = useMemo(() => {
    if (!site) return [];
    return (site.visits || [])
      .flatMap(visit => 
        (visit.events || []).map(ev => ({
          ...ev,
          event_name: ev.eventName || 'unknown', 
          created_at: ev.createdAt || ev.created_at || new Date(), 
          visit_id: visit.id
        }))
      )
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }, [site]);

  const availableTypes = useMemo(() => {
    const types = allEvents.map(e => e.event_name).filter(t => t !== 'unknown');
    return [...new Set(types)];
  }, [allEvents]);

  const availableSessions = useMemo(() => {
    const sessions = allEvents.map(e => e.visit_id).filter(Boolean);
    return [...new Set(sessions)].sort((a, b) => a - b);
  }, [allEvents]);

  useEffect(() => {
    if (availableTypes.length > 0 && selectedTypes.size === 0) {
      setSelectedTypes(new Set(availableTypes));
    }
  }, [availableTypes]);

  useEffect(() => {
    if (availableSessions.length > 0 && selectedSessions.size === 0) {
      setSelectedSessions(new Set(availableSessions));
    }
  }, [availableSessions]);

  const toggleType = (type) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  };

  const toggleSession = (sessionId) => {
    setSelectedSessions(prev => {
      const next = new Set(prev);
      if (next.has(sessionId)) next.delete(sessionId); else next.add(sessionId);
      return next;
    });
  };

  const selectAllTypes = () => setSelectedTypes(new Set(availableTypes));
  const selectAllSessions = () => setSelectedSessions(new Set(availableSessions));

  const filteredEvents = useMemo(() => {
    return allEvents.filter(e => 
      selectedTypes.has(e.event_name) && selectedSessions.has(e.visit_id)
    );
  }, [allEvents, selectedTypes, selectedSessions]);

  const chartData = useMemo(() => {
    const rawGroups = {};
    filteredEvents.forEach(ev => {
       const d = new Date(ev.created_at);
       const key = d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
       
       if (!rawGroups[key]) {
         rawGroups[key] = { 
           date: key, 
           count: 0, 
           timestamp: new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() 
         };
       }
       rawGroups[key].count++;
    });
    return Object.values(rawGroups).sort((a, b) => a.timestamp - b.timestamp);
  }, [filteredEvents]);

  if (loading) return <div className="loading-state">Загрузка...</div>;
  if (!site) return <div className="empty-state">Сайт не найден</div>;

  return (
    <div className="detail-layout">
      <div className="detail-header">
        <button className="btn-back-arrow" onClick={() => onNavigate('home')} title="Назад">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div className="detail-title">
          <h1>{site.name}</h1>
          <span>{site.domain}</span>
        </div>
      </div>

      <div className="detail-content">
        <aside className="events-sidebar">
          <div className="sidebar-header">
            <h2>События <span className="count-badge">{filteredEvents.length}</span></h2>
          </div>

          <div className="filter-toolbar">
            <span className="filter-label">Событие:</span>
            <div className="filter-pills">
              <button 
                onClick={selectAllTypes}
                className={`filter-pill ${selectedTypes.size === availableTypes.length && availableTypes.length > 0 ? 'active' : ''}`}
              >
                Все
              </button>
              {availableTypes.map(type => (
                <button 
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`filter-pill ${selectedTypes.has(type) ? 'active' : ''}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>


          <div className="filter-toolbar" style={{ borderTop: 'none', paddingTop: 0 }}>
            <span className="filter-label">Сессия:</span>
            <div className="filter-pills session-pills">
              <button 
                onClick={selectAllSessions}
                className={`filter-pill ${selectedSessions.size === availableSessions.length && availableSessions.length > 0 ? 'active' : ''}`}
              >
                Все
              </button>
              {availableSessions.map(session => (
                <button 
                  key={session}
                  onClick={() => toggleSession(session)}
                  className={`filter-pill ${selectedSessions.has(session) ? 'active' : ''}`}
                >
                  #{session}
                </button>
              ))}
            </div>
          </div>

          <div className="events-list-container">
            <table className="events-table-detail">
              <thead>
                <tr>
                  <th>Событие</th>
                  <th>Элемент</th>
                  <th>Сессия</th>
                  <th>Время</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map(ev => (
                  <tr key={ev.id}>
                    <td><span className={`tag ${ev.event_name}`}>{ev.event_name}</span></td>
                    <td>{ev.element || <span className="text-muted">—</span>}</td>
                    <td className="text-muted">#{ev.visit_id}</td>
                    <td className="text-muted">
                      {new Date(ev.created_at).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'medium' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredEvents.length === 0 && (
              <div className="empty-events">Нет событий по выбранным фильтрам</div>
            )}
          </div>
        </aside>

        <section className="chart-section">
          <h2>Активность</h2>
          <p className="chart-subtitle">Количество взаимодействий по дням</p>
          <div className="chart-wrapper">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fill: '#6B7280' }} tickLine={false} axisLine={false} dy={10} />
                  <YAxis allowDecimals={false} tick={{ fill: '#6B7280' }} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                    labelStyle={{ fontWeight: 'bold', color: '#1A1D26' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="События"
                    stroke="#9AA1FF" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#9AA1FF', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">Нет данных для отображения</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}