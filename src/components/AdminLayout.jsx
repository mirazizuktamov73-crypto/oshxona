import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppData } from '../state/AppDataContext.jsx';

const links = [
  { to: '/buyurtmalar', label: 'Buyurtmalar', icon: '▤', count: true },
  { to: '/menyu', label: 'Menyu', icon: '▦' },
  { to: '/ish-vaqti', label: 'Ish vaqti', icon: '◷' },
  { to: '/aksiyalar', label: 'Aksiyalar', icon: '✳' },
  { to: '/moliya', label: 'Moliya', icon: '◈' },
  { to: '/analitika', label: 'Analitika', icon: '▥' },
  { to: '/sharhlar', label: 'Sharhlar', icon: '☆' },
  { to: '/xodimlar', label: 'Xodimlar', icon: '♧' },
  { to: '/sozlamalar', label: 'Sozlamalar', icon: '⚙' },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { settings, user, logout, orders, branches } = useAppData();
  const location = useLocation();
  const navigate = useNavigate();
  const current = links.find((link) => link.to === location.pathname)?.label || 'Buyurtmalar';
  const pending = orders.filter((order) => order.status === 'new').length;
  const allBusy = branches.length > 0 && branches.every((branch) => branch.busy);

  const signOut = () => { logout(); navigate('/kirish'); };
  return <div className="app-layout min-h-screen bg-canvas text-ink">
    {open && <button className="mobile-scrim" aria-label="Menyuni yopish" onClick={() => setOpen(false)} />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-symbol">o</span><span>oshxona<span className="brand-dot">.</span></span><button className="sidebar-close" onClick={() => setOpen(false)} aria-label="Yopish">×</button></div>
      <div className="restaurant-switch"><span className="restaurant-logo">{String(settings.restaurant.logo).startsWith('data:image') ? <img src={settings.restaurant.logo} alt="" /> : settings.restaurant.logo || '🍽️'}</span><span><small>RESTORAN</small><strong>{settings.restaurant.name}</strong></span><span className="switch-chevron">⌄</span></div>
      <div className="nav-caption">ASOSIY MENYU</div>
      <nav className="side-nav">{links.map((link) => <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className={({ isActive }) => `side-link ${isActive ? 'selected' : ''}`}><span className="side-icon">{link.icon}</span><span>{link.label}</span>{link.count && pending > 0 && <span className="nav-count">{pending}</span>}</NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="help-note"><span>✦</span><strong>Yordam kerakmi?</strong><p>Bizning jamoamiz sizga yordam beradi.</p><a href="mailto:yordam@oshxona.uz">Yordam markazi ↗</a></div><button className="account-button" onClick={signOut}><span className="user-avatar">{(user?.name || 'S').slice(0, 1).toUpperCase()}</span><span><strong>{user?.name || 'Sotuvchi'}</strong><small>Restoran egasi</small></span><span className="logout-mark">↗</span></button></div>
    </aside>
    <div className="main-column">
      <header className="topbar"><button className="menu-trigger" onClick={() => setOpen(true)} aria-label="Menyuni ochish">☰</button><div className="topbar-crumb"><span>{settings.restaurant.name}</span><b>/</b><strong>{current}</strong></div><div className="topbar-right"><div className={`status-live ${allBusy ? 'status-busy' : ''}`}><i /> {allBusy ? 'Band' : 'Ochiq'}</div><button className="topbar-bell" aria-label="Bildirishnomalar" onClick={() => setShowNotifications((value) => !value)}>♧{pending > 0 && <i />}</button><div className="top-user"><span className="user-avatar">{(user?.name || 'S').slice(0, 1).toUpperCase()}</span><span><strong>{user?.name || 'Sotuvchi'}</strong><small>Administrator</small></span></div></div>
      {showNotifications && <div className="notification-popover"><strong>Bildirishnomalar</strong><p>{pending ? `${pending} ta yangi buyurtma qabul qilishingizni kutmoqda.` : 'Hozircha yangi bildirishnoma yo‘q.'}</p><button onClick={() => { setShowNotifications(false); navigate('/buyurtmalar'); }}>Buyurtmalarga o‘tish →</button></div>}</header>
      <main className="content-area"><Outlet /></main>
      <footer className="app-footer"><span>© 2026 oshxona. Barcha huquqlar himoyalangan.</span><span>Yordam <b>·</b> O‘zbekcha</span></footer>
    </div>
  </div>;
}
