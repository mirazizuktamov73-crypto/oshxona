import { useState } from 'react';
import { Badge, Button, Card, Modal, PageHeader, money } from '../components/UI.jsx';
import { useAppData } from '../state/AppDataContext.jsx';
import { promotionDashboardMetrics } from '../data/dashboardMetrics.js';

const emptyPromo = { name: '', kind: 'Chegirma', code: '', value: '', start: '', end: '', active: true };

export default function PromotionsPage() {
  const { promotions, update, setToast } = useAppData();
  const [modal, setModal] = useState(false);
  const [draft, setDraft] = useState(emptyPromo);
  const [filter, setFilter] = useState('Barchasi');
  const visible = promotions.filter((promo) => filter === 'Barchasi' || promo.kind === filter);
  const save = (event) => {
    event.preventDefault();
    const promo = { ...draft, id: draft.id || `promo-${Date.now()}` };
    update('promotions', (current) => draft.id ? current.map((item) => item.id === draft.id ? promo : item) : [promo, ...current]);
    setModal(false); setToast({ id: Date.now(), message: draft.id ? 'Aksiya yangilandi.' : 'Yangi aksiya yaratildi.' });
  };
  const toggle = (id) => update('promotions', (current) => current.map((item) => item.id === id ? { ...item, active: !item.active } : item));
  const remove = (promo) => { if (window.confirm(`“${promo.name}” aksiyasi o‘chirilsinmi?`)) update('promotions', (current) => current.filter((item) => item.id !== promo.id)); };
  const edit = (promo) => { setDraft({ ...promo }); setModal(true); };
  const create = () => { setDraft({ ...emptyPromo, start: new Date().toISOString().slice(0, 10), end: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) }); setModal(true); };
  return <>
    <PageHeader eyebrow="RESTORAN / SAVDONI OSHIRISH" title="Aksiyalar" description="Chegirmalar va maxsus takliflarni yarating, natijasini kuzating." actions={<Button variant="primary" onClick={create}>＋ Aksiya yaratish</Button>} />
    <div className="promo-stats"><div><span>Faol aksiyalar</span><strong>{promotions.filter((item) => item.active).length}</strong><small>mijozlar uchun ko‘rinadi</small></div><div><span>Promokod ishlatilishi</span><strong>{promotionDashboardMetrics.promoCodeUses}</strong><small className="positive">↗ {promotionDashboardMetrics.promoCodeGrowthPercent}% bu oy</small></div><div><span>Aksiyalar orqali savdo</span><strong>{money(promotionDashboardMetrics.promotionSales)}</strong><small>joriy oy</small></div><div className="promo-illustration">✳<span>Taklif yarating<br />va mijozlarni jalb qiling</span></div></div>
    <Card><div className="panel-heading promo-heading"><div><h2>Barcha aksiyalar</h2><p>Chegirma, promokod va kombolar</p></div><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>Barchasi</option><option>Chegirma</option><option>Promokod</option><option>Kombo</option></select></div><div className="promo-grid">{visible.map((promo) => <article className="promo-card" key={promo.id}><div className={`promo-cover ${promo.kind.toLowerCase()}`}><span>{promo.kind === 'Kombo' ? '🍔 + 🥤' : promo.kind === 'Promokod' ? '％' : '✦'}</span><Badge tone={promo.active ? 'green' : 'gray'}>{promo.active ? 'Faol' : 'Nofaol'}</Badge></div><div className="promo-content"><div className="promo-type">{promo.kind}</div><h3>{promo.name}</h3><div className="promo-value">{promo.value}{promo.code && <span> · {promo.code}</span>}</div><div className="promo-dates"><span>▦ {promo.start}</span><span>→</span><span>{promo.end}</span></div><div className="promo-actions"><button onClick={() => edit(promo)}>✎ Tahrirlash</button><button className={promo.active ? 'pause-action' : 'resume-action'} onClick={() => toggle(promo.id)}>{promo.active ? 'Ⅱ To‘xtatish' : '▶ Faollashtirish'}</button><button className="delete-action" onClick={() => remove(promo)}>×</button></div></div></article>)}</div>{!visible.length && <div className="empty-inline">Bu turdagi aksiya yo‘q.</div>}</Card>
    {modal && <Modal title={draft.id ? 'Aksiyani tahrirlash' : 'Yangi aksiya'} onClose={() => setModal(false)}><form className="form-stack" onSubmit={save}><label className="field-label">Aksiya nomi<input autoFocus value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Masalan, Kechki chegirma" required /></label><div className="form-grid"><label className="field-label">Turi<select value={draft.kind} onChange={(event) => setDraft({ ...draft, kind: event.target.value })}><option>Chegirma</option><option>Promokod</option><option>Kombo</option></select></label><label className="field-label">Qiymati<input value={draft.value} onChange={(event) => setDraft({ ...draft, value: event.target.value })} placeholder="10% yoki 50 000 so‘m" required /></label></div>{draft.kind === 'Promokod' && <label className="field-label">Promokod<input value={draft.code} onChange={(event) => setDraft({ ...draft, code: event.target.value.toUpperCase() })} placeholder="MASALAN15" /></label>}<div className="form-grid"><label className="field-label">Boshlanish sanasi<input type="date" value={draft.start} onChange={(event) => setDraft({ ...draft, start: event.target.value })} required /></label><label className="field-label">Tugash sanasi<input type="date" value={draft.end} onChange={(event) => setDraft({ ...draft, end: event.target.value })} required /></label></div><div className="form-actions"><Button type="button" onClick={() => setModal(false)}>Bekor qilish</Button><Button type="submit" variant="primary">Saqlash</Button></div></form></Modal>}
  </>;
}
