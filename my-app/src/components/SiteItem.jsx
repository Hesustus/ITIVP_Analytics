import { useState } from 'react';

export function SiteItem({ site, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [name, setName] = useState(site.name);
  const [domain, setDomain] = useState(site.domain);

  const eventsCount = site.events?.length || 0;

  const handleSave = () => {
    if (!name.trim() || !domain.trim()) return;
    onUpdate(site.id, { name: name.trim(), domain: domain.trim() });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(site.name);
    setDomain(site.domain);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="site-item editing">
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <input value={domain} onChange={(e) => setDomain(e.target.value)} />
        <button onClick={handleSave}>Сохранить</button>
        <button onClick={handleCancel}>Отмена</button>
      </li>
    );
  }

  return (
    <li className="site-item">
      <div className="site-header" onClick={() => setIsExpanded(v => !v)}>
        <span className="toggle">{isExpanded ? '▼' : '▶'}</span>
        <strong>{site.name}</strong>
        <span className="domain">{site.domain}</span>
        <span className="events-badge">
          {eventsCount} {declOfNum(eventsCount, ['событие', 'события', 'событий'])}
        </span>

        <div className="actions" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setIsEditing(true)} title="Редактировать">Редактировать</button>
          <button onClick={() => onDelete(site.id)} title="Удалить">Удалить</button>
        </div>
      </div>

      {isExpanded && (
        <div className="events-panel">
          {eventsCount === 0 ? (
            <p className="empty-events">У этого сайта пока нет событий</p>
          ) : (
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
                {site.events.map(ev => (
                  <tr key={ev.id}>
                    <td><span className={`event-name ${ev.eventName}`}>{ev.eventName}</span></td>
                    <td>{ev.pageUrl}</td>
                    <td>{ev.element || '—'}</td>
                    <td>{new Date(ev.createdAt).toLocaleString('ru-RU')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </li>
  );
}

function declOfNum(n, forms) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}