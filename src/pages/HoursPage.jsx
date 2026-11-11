import { useState } from 'react';
import { Badge, Button, Card, Modal, PageHeader, Toggle } from '../components/UI.jsx';
import { useAppData } from '../state/AppDataContext.jsx';

export default function HoursPage() {
  const { branches, update, setToast } = useAppData();
  const [selected, setSelected] = useState(branches[0]?.id);
  const [newBranch, setNewBranch] = useState(false);
  const [branchName, setBranchName] = useState('');
  const branch = branches.find((item) => item.id === selected) || branches[0];
  const changeHours = (index, key, value) => update('branches', (current) => current.map((item) => item.id === branch.id ? { ...item, hours: item.hours.map((day, dayIndex) => dayIndex === index ? { ...day, [key]: value } : day) } : item));
  const changeBusy = (value) => {
    update('branches', (current) => current.map((item) => item.id === branch.id ? { ...item, busy: value } : item));
    setToast({ id: Date.now(), message: value ? 'Band rejimi yoqildi. Yangi buyurtmalar qabul qilinmaydi.' : 'Band rejimi o‘chirildi. Restoran buyurtma qabul qiladi.' });
  };
  const addBranch = (event) => {
    event.preventDefault();
    const id = `br-${Date.now()}`;
    const hours = branch.hours.map((day) => ({ ...day }));
    update('branches', (current) => [...current, { id, name: branchName.trim(), address: 'Manzil kiritilmagan', busy: false, hours }]);
    setSelected(id); setBranchName(''); setNewBranch(false);
  };
  const removeBranch = () => {
    if (branches.length < 2) return setToast({ id: Date.now(), message: 'Kamida bitta filial qolishi kerak.' });
    if (!window.confirm(`${branch.name} o‘chirilsinmi?`)) return;
    const next = branches.filter((item) => item.id !== branch.id);
    update('branches', next); setSelected(next[0].id);
  };

  if (!branch) return null;
  return <>
    <PageHeader eyebrow="RESTORAN / ISH TARTIBI" title="Ish vaqti" description="Filiallar jadvali va buyurtma qabul qilish holatini boshqaring." actions={<Button variant="primary" onClick={() => setNewBranch(true)}>＋ Filial qo‘shish</Button>} />
    <div className="branch-tabs">{branches.map((item) => <button key={item.id} className={`branch-tab ${item.id === branch.id ? 'active' : ''}`} onClick={() => setSelected(item.id)}><span className="branch-pin">⌖</span><span><strong>{item.name}</strong><small>{item.address}</small></span><Badge tone={item.busy ? 'orange' : 'green'}>{item.busy ? 'Band' : 'Ochiq'}</Badge></button>)}</div>
    <div className="hours-layout"><Card className="hours-card"><div className="panel-heading"><div><h2>Haftalik jadval</h2><p>{branch.name} uchun ish vaqti</p></div><button className="text-danger" onClick={removeBranch}>Filialni o‘chirish</button></div><div className="hours-list">{branch.hours.map((day, index) => <div className={`hours-row ${!day.open ? 'closed-day' : ''}`} key={day.day}><strong>{day.day}</strong><Toggle compact checked={day.open} onChange={(value) => changeHours(index, 'open', value)} label={day.open ? 'Ochiq' : 'Yopiq'} /><input type="time" value={day.from} disabled={!day.open} onChange={(event) => changeHours(index, 'from', event.target.value)} /><span>dan</span><input type="time" value={day.to} disabled={!day.open} onChange={(event) => changeHours(index, 'to', event.target.value)} /><span>gacha</span></div>)}</div><div className="hours-note">ℹ O‘zgarishlar avtomatik saqlanadi va mijozlarga ko‘rinadi.</div></Card><div className="hours-side"><Card className="busy-card"><div className="busy-icon">◷</div><div className="busy-title"><h2>Band rejimi</h2><p>Yangi buyurtmalarni vaqtincha to‘xtating</p></div><Toggle checked={branch.busy} onChange={changeBusy} label="" /><div className={`busy-state ${branch.busy ? 'busy-on' : ''}`}><span />{branch.busy ? 'Band · buyurtmalar pauzada' : 'Hozir buyurtma qabul qilinyapti'}</div><p>Band rejimi yoqilganda restoran vaqtincha buyurtmalar ro‘yxatida ko‘rsatilmaydi.</p></Card><Card className="branch-info"><div className="branch-info-icon">⌖</div><div><span>Faol filial</span><strong>{branch.name}</strong><small>{branch.address}</small></div><button aria-label="Filialni o‘zgartirish" onClick={() => document.querySelector('.branch-tabs')?.scrollIntoView({ behavior: 'smooth' })}>↗</button></Card><div className="hours-tip"><span>✦</span><p><strong>Maslahat</strong><br />Dam olish kunlari uchun jadvalni mijozlar ko‘p bo‘ladigan vaqtga qarab moslang.</p></div></div></div>
    {newBranch && <Modal title="Yangi filial qo‘shish" onClose={() => setNewBranch(false)}><form className="form-stack" onSubmit={addBranch}><label className="field-label">Filial nomi<input autoFocus value={branchName} onChange={(event) => setBranchName(event.target.value)} placeholder="Masalan, Sergeli filiali" required /></label><div className="form-actions"><Button type="button" onClick={() => setNewBranch(false)}>Bekor qilish</Button><Button type="submit" variant="primary">Filial qo‘shish</Button></div></form></Modal>}
  </>;
}
