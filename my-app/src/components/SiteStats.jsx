export function SiteStats({ meta, sites }) {
  const totalEvents = sites.reduce((acc, site) => {
    return acc + (site.visits || []).flatMap(v => v.events || []).length;
  }, 0);

  const totalVisits = sites.reduce((acc, site) => acc + (site.visits || []).length, 0);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">🌐</div>
        <div className="stat-info">
          <span className="stat-value">{meta.total}</span>
          <span className="stat-label">Всего сайтов</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">⚡</div>
        <div className="stat-info">
          <span className="stat-value">{totalEvents}</span>
          <span className="stat-label">Событий (на стр.)</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">👣</div>
        <div className="stat-info">
          <span className="stat-value">{totalVisits}</span>
          <span className="stat-label">Визитов (на стр.)</span>
        </div>
      </div>
    </div>
  );
}