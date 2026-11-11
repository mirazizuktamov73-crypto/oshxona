import { useState } from 'react';
import { Badge, Button, Card, Modal, PageHeader } from '../components/UI.jsx';
import { useAppData } from '../state/AppDataContext.jsx';

const roles = ['Egasi', 'Menejer', 'Kassir', 'Oshpaz'];
const permissions = [{ id: 'buyurtmalar', label: 'Buyurtmalar' }, { id: 'menyu', label: 'Menyu' }, { id: 'moliya', label: 'Moliya' }, { id: 'xodimlar', label: 'Xodimlar' }, { id: 'sozlamalar', label: 'Sozlamalar' }];
const roleTone = { Egasi: 'purple', Menejer: 'blue', Kassir: 'green', Oshpaz: 'orange' };

export default function StaffPage() {
  const { staff, update, setToast } = useAppData();
  const [adding, setAdding] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [draft, setDraft] = useState({ name: '', phone: '', role: 'Kassir' });
  const add = (event) => {
    event.preventDefault();
    const defaultPermissions = draft.role === 'Egasi' ? permissions.map((item) => item.id) : draft.role === 'Menejer' ? ['buyurtmalar', 'menyu', 'xodimlar'] : ['buyurtmalar'];
    update('staff', (current) => [...current, { ...draft, id: `emp-${Date.now()}`, permissions: defaultPermissions }]);
    setAdding(false); setDraft({ name: '', phone: '', role: 'Kassir' }); setToast({ id: Date.now(), message: 'Xodim qo‘shildi.' });
  };
  const remove = (person) => { if (window.confirm(`${person.name} xodimlar ro‘yxatidan o‘chirilsinmi?`)) update('staff', (current) => current.filter((item) => item.id !== person.id)); };
  const setRole = (id, role) => update('staff', (current) => current.map((person) => person.id === id ? { ...person, role } : person));
  const permissionChange = (person, permission) => update('staff', (current) => current.map((item) => item.id === person.id ? { ...item, permissions: item.permissions.includes(permission) ? item.permissions.filter((entry) => entry !== permission) : [...item.permissions, permission] } : item));
  return <>
    <PageHeader eyebrow="RESTORAN / JAMOA" title="Xodimlar" description="Jamoangizni boshqaring va har bir rol uchun ruxsatlarni belgilang." actions={<Button variant="primary" onClick={() => setAdding(true)}>＋ Xodim qo‘shish</Button>} />
    <div className="staff-summary"><div><span>Jami xodimlar</span><strong>{staff.length}</strong></div><div><span>Faol rollar</span><strong>{new Set(staff.map((person) => person.role)).size}</strong></div><div className="roles-summary"><span>Rollar</span>{roles.map((role) => <Badge key={role} tone={roleTone[role]}>{role}</Badge>)}</div></div>
    <Card><div className="panel-heading"><div><h2>Jamoa a’zolari</h2><p>Ruxsatlarni tahrirlash uchun xodim qatorini oching</p></div><span className="member-count">{staff.length} xodim</span></div><div className="staff-list">{staff.map((person) => <article className="staff-member" key={person.id}><div className="staff-row"><span className="staff-avatar">{person.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}</span><div className="staff-name"><strong>{person.name}</strong><small>{person.phone}</small></div><select className="role-select" value={person.role} onChange={(event) => setRole(person.id, event.target.value)}>{roles.map((role) => <option key={role}>{role}</option>)}</select><Badge tone={roleTone[person.role] || 'gray'}>{person.role}</Badge><button className="permissions-button" onClick={() => setExpanded(expanded === person.id ? null : person.id)}>{expanded === person.id ? 'Yopish' : 'Ruxsatlar'} {expanded === person.id ? '⌃' : '⌄'}</button><button className="delete-icon" title="Xodimni o‘chirish" onClick={() => remove(person)}>×</button></div>{expanded === person.id && <div className="permission-editor"><div><strong>Bo‘limlarga ruxsat</strong><small>Bu xodim qaysi bo‘limlardan foydalana olishini tanlang.</small></div><div className="permission-checks">{permissions.map((permission) => <label key={permission.id}><input type="checkbox" checked={person.permissions.includes(permission.id)} onChange={() => permissionChange(person, permission.id)} />{permission.label}</label>)}</div></div>}</article>)}</div><div className="staff-footnote">ℹ Ruxsatlar mock rejimda saqlanadi. Haqiqiy kirish nazorati backend ulangandan keyin ishlaydi.</div></Card>
    <div className="role-explain"><strong>Rollar haqida</strong><p><span>Egasi</span> — barcha bo‘limlarga to‘liq ruxsat</p><p><span>Menejer</span> — buyurtma, menyu va jamoani boshqaradi</p><p><span>Kassir</span> — buyurtmalarni qabul qiladi</p><p><span>Oshpaz</span> — taom tayyorlash buyurtmalarini ko‘radi</p></div>
    {adding && <Modal title="Yangi xodim qo‘shish" onClose={() => setAdding(false)}><form className="form-stack" onSubmit={add}><label className="field-label">Ism va familiya<input autoFocus value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Masalan, Malika Karimova" required /></label><label className="field-label">Telefon raqami<input type="tel" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} placeholder="+998 90 123 45 67" required /></label><label className="field-label">Xodim roli<select value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value })}>{roles.map((role) => <option key={role}>{role}</option>)}</select></label><div className="form-actions"><Button type="button" onClick={() => setAdding(false)}>Bekor qilish</Button><Button type="submit" variant="primary">Xodim qo‘shish</Button></div></form></Modal>}
  </>;
}
