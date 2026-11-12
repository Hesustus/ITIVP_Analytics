export function Home({ 
  sites, loading, error, onRetry, onDelete, onNavigate, 
  search, setSearch, page, setPage, meta 
}) {
  
  if (error) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>{error}</p>
          <button className="btn-primary" onClick={onRetry}>Повторить</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Мои сайты</h1>
        <button className="btn-primary" onClick={() => onNavigate('form')}>
          Добавить сайт
        </button>
      </div>

      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Поиск по названию или домену..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Загрузка...</p>
        </div>
      ) : sites.length === 0 ? (
        <div className="empty-state">Сайтов не найдено</div>
      ) : (
        <div className="sites-list">
          <div className="list-header">
            <span>Название</span>
            <span>Домен</span>
            <span>События</span>
            <span>Действия</span>
          </div>
          {sites.map(site => {
            const eventsCount = (site.visits || []).flatMap(v => v.events || []).length;
            return (
              <div 
                key={site.id} 
                className="list-row" 
                onClick={() => onNavigate('detail', site.id)}
              >
                <span className="site-name">{site.name}</span>
                <span className="site-domain">{site.domain}</span>
                <span className="site-events">{eventsCount} шт.</span>
                <div className="row-actions" onClick={e => e.stopPropagation()}>
                  <button className="btn-text" onClick={() => onNavigate('form', site.id)}>Изменить</button>
                  <button className="btn-text text-danger" onClick={() => onDelete(site.id)}>Удалить</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && meta.totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Назад</button>
          <span>{page} / {meta.totalPages} (Всего: {meta.total})</span>
          <button disabled={page === meta.totalPages} onClick={() => setPage(p => p + 1)}>Вперед</button>
        </div>
      )}
    </div>
  );
}