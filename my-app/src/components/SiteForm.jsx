import { useState } from 'react';

export function SiteForm({ onAdd }) {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !domain.trim()) {
      alert('Заполните оба поля');
      return;
    }

    onAdd({
      id: Date.now(),
      name: name.trim(),
      domain: domain.trim(),
      isActive: true,
      createdAt: new Date().toISOString()
    });

    setName('');
    setDomain('');
  };

  return (
    <form onSubmit={handleSubmit} className="site-form">
      <input
        type="text"
        placeholder="Название сайта"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Домен (blog.ru)"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      />
      <button type="submit">Добавить</button>
    </form>
  );
}