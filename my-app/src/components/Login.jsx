import { useState } from 'react';
import { authApi } from '../api';

export function Login({ onLogin }) {
  const [mode, setMode] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setError(null);
    setSuccess(null);
    setLoading(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        await authApi.register({ email, password, name });
        setSuccess('Регистрация успешна! Теперь войдите.');
        setMode('login');
        setPassword('');
      } else {
        const { data } = await authApi.login(email, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('csrfToken', data.csrfToken);
        onLogin();
      }
    } catch (err) {
      const msg = err.response?.data?.error
        || err.response?.data?.errors?.[0]?.message
        || 'Ошибка. Попробуйте ещё раз.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Hesustus Analytics</h1>
        <p className="subtitle">
          {mode === 'login' ? 'Войдите в аккаунт' : 'Создайте аккаунт'}
        </p>

        <div className="mode-switch">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => switchMode('login')}
          >
            Вход
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'active' : ''}
            onClick={() => switchMode('register')}
          >
            Регистрация
          </button>
        </div>

        {mode === 'register' && (
          <input
            type="text"
            placeholder="Имя (необязательно)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <button type="submit" disabled={loading}>
          {loading
            ? 'Подождите...'
            : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>

      </form>
    </div>
  );
}