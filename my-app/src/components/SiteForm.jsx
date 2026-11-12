import { useState, useEffect } from 'react';

export function SiteForm({ id, sites, onAdd, onEdit, onNavigate }) {
  const isEdit = Boolean(id);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');

  useEffect(() => {
    if (isEdit) {
      const site = sites.find(s => s.id === id);
      if (site) {
        setName(site.name);
        setDomain(site.domain);
      }
    }
  }, [id, isEdit, sites]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !domain.trim()) return;

    if (isEdit) {
      onEdit(id, { name, domain });
    } else {
      onAdd({ name, domain });
    }
  };

  return (
    <div className="page-container form-page">
      <button className="btn-back" onClick={() => onNavigate('home')}>← Назад</button>
      <h1>{isEdit ? 'Редактировать сайт' : 'Новый сайт'}</h1>

      <form className="site-form-page" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название сайта</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Например: Мой блог"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Домен</label>
          <input 
            type="text" 
            value={domain} 
            onChange={e => setDomain(e.target.value)} 
            placeholder="Например: blog.ru"
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => onNavigate('home')}>Отмена</button>
          <button type="submit" className="btn-primary">Сохранить</button>
        </div>
      </form>
    </div>
  );
}