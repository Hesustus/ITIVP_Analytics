import { useState, useEffect } from 'react';
import { authApi } from '../api';

export function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    authApi.profile().then(res => setUser(res.data));
  }, []);

  if (!user) return <div className="loading-state">Загрузка...</div>;

  return (
    <div className="page-container">
      <h1>Профиль</h1>
      <div className="profile-card">
        <p><strong>Имя:</strong> {user.name || 'Не указано'}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
}