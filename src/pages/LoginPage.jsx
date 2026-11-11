import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppData } from '../state/AppDataContext.jsx';

export default function LoginPage() {
  const { user, login, settings } = useAppData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  if (user) return <Navigate to="/buyurtmalar" replace />;
  const submit = (event) => { event.preventDefault(); login(name.trim() || email.split('@')[0] || 'Sotuvchi'); navigate('/buyurtmalar'); };

  return <main className="login-page"><section className="login-aside"><div className="login-brand"><span className="brand-symbol">o</span> oshxona<span className="brand-dot">.</span></div><div className="login-promo"><span className="promo-orbit">✦</span><h1>Restoraningizni<br />bir joydan boshqaring.</h1><p>Buyurtmalar, menyu va biznes ko‘rsatkichlari doim qo‘lingizda.</p><div className="login-illustration"><span>🍔</span><span>🍕</span><span>🥤</span><i>✓</i></div><div className="login-dots"><b /><i /><i /></div></div><span className="login-aside-foot">Sizning restoraningiz. Sizning qoidalaringiz.</span></section><section className="login-main"><div className="login-form-wrap"><div className="mobile-login-brand"><span className="brand-symbol">o</span> oshxona<span className="brand-dot">.</span></div><div className="login-icon">{String(settings.restaurant.logo).startsWith('data:image') ? <img src={settings.restaurant.logo} alt="" /> : settings.restaurant.logo || '🍽️'}</div><div className="eyebrow">SOTUVCHI KABINETI</div><h2>Xush kelibsiz!</h2><p className="login-intro">Davom etish uchun hisobingizga kiring.</p><form noValidate onSubmit={submit} className="form-stack"><label className="field-label">Ismingiz<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Masalan, Aziz Karimov" autoComplete="name" /></label><label className="field-label">Email manzil<input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="siz@restoran.uz" autoComplete="email" /></label><label className="field-label">Parol<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Istalgan parol" autoComplete="current-password" /></label><div className="login-options"><label><input type="checkbox" defaultChecked /> Meni eslab qol</label><a href="mailto:yordam@oshxona.uz">Parolni unutdingizmi?</a></div><button className="btn btn-primary login-submit" type="submit">Kirish <span>→</span></button></form><p className="mock-hint">Demo rejim: istalgan ma’lumot bilan kirishingiz mumkin.</p></div><div className="login-footer">© 2026 oshxona · Xavfsiz kirish</div></section></main>;
}
