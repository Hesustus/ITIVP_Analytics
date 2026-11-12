import { useState } from 'react';

export function SiteItem({ site, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [name, setName] = useState(site.name);
  const [domain, setDomain] = useState(site.domain);

  const visits = site.visits || [];
  const allEvents = visits.flatMap(v => v.events || []);
  const eventsCount = allEvents.length;

  const handleSave = () => {
    if (!name.trim() || !domain.trim()) return;
    onUpdate(site.id, { name: name.trim(), domain: domain.trim() });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="site-card editing">
        <div className="edit-form">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Название" />
          <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="Домен" />
          <div className="edit-actions">
            <button className="btn btn-primary" onClick={handleSave}>Сохранить</button>
            <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>Отмена</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`site-card ${site._pending ? 'pending' : ''} ${isExpanded ? 'expanded' : ''}`}>
      <div className="card-header" onClick={() => setIsExpanded(v => !v)}>
        <div className="card-title">
          <h3>{site.name}</h3>
          <span className="domain">{site.domain}</span>
        </div>
        <div className="card-meta">
          <span className="badge">{eventsCount} событий</span>
        </div>
        <div className="card-actions" onClick={e => e.stopPropagation()}>
          <button className="icon-btn" onClick={() => setIsEditing(true)} title="Редактировать">✏️</button>
          <button className="icon-btn" onClick={() => onDelete(site.id)} title="Удалить">🗑️</button>
        </div>
        <div className="expand-icon">{isExpanded ? '▲' : '▼'}</div>
      </div>

      {isExpanded && (
        <div className="card-body">
          <div className="visits-summary">
            <span>Визитов: <b>{visits.length}</b></span>
            <span>Событий: <b>{eventsCount}</b></span>
          </div>
          
          {visits.length === 0 ? (
            <p className="empty-text">У этого сайта нет визитов</p>
          ) : (
            <div className="table-wrapper">
              <table className="events-table">
                <thead>
                  <tr>
                    <th>Событие</th>
                    <th>Страница</th>
                    <th>Элемент</th>
                    <th>Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {allEvents.map(ev => (
                    <tr key={ev.id}>
                      <td><span className={`tag ${ev.event_name}`}>{ev.event_name}</span></td>
                      <td className="text-truncate">{ev.page_url || '—'}</td>
                      <td>{ev.element || '—'}</td>
                      <td className="text-muted">{new Date(ev.created_at).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}