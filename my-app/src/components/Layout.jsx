export function Layout({ children, onLogout, onNavigate }) {
  return (
    <>
      <header className="main-header">
        <div className="header-container">
          <div className="logo" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
            Hesustus Analytics
          </div>
          <nav className="header-nav">
            <button className="nav-link" onClick={() => onNavigate('profile')}>
              Профиль
            </button>
            <button onClick={onLogout} className="btn-logout">
              Выйти
            </button>
          </nav>
        </div>
      </header>
      <div className="main-content">
        {children}
      </div>
    </>
  );
}