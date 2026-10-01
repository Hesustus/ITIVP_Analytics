export function SiteStats({ sites }) {
  const totalSites = sites.length;
  const totalEvents = sites.reduce((sum, s) => sum + (s.events?.length || 0), 0);


  return (
    <div className="stats">
      <div className="stat-card">
        <span className="stat-value">{totalSites}</span>
        <span className="stat-label">Сайтов</span>
      </div>
      <div className="stat-card accent">
        <span className="stat-value">{totalEvents}</span>
        <span className="stat-label">Всего событий</span>
      </div>
    </div>
  );
}