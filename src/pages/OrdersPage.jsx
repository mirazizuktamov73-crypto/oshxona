import { useMemo, useState } from 'react';
import { Badge, Button, Card, Modal, PageHeader, money, dateText } from '../components/UI.jsx';
import { useAppData } from '../state/AppDataContext.jsx';
import { orderDashboardMetrics } from '../data/dashboardMetrics.js';

const tabs = [
  { id: 'new', label: 'Yangi' }, { id: 'preparing', label: 'Tayyorlanmoqda' }, { id: 'ready', label: 'Tayyor' }, { id: 'history', label: 'Tarix' },
];

export default function OrdersPage() {
  const { orders, update, settings, branches, setToast } = useAppData();
  const [tab, setTab] = useState('new');
  const [accepting, setAccepting] = useState(null);
  const [eta, setEta] = useState('20');
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => orders.filter((order) => {
    const inTab = tab === 'history' ? ['completed', 'rejected'].includes(order.status) : order.status === tab;
    const bySearch = `${order.id} ${order.customer} ${order.phone}`.toLocaleLowerCase('uz').includes(search.toLocaleLowerCase('uz'));
    return inTab && bySearch;
  }), [orders, tab, search]);
  const countFor = (id) => orders.filter((order) => id === 'history' ? ['completed', 'rejected'].includes(order.status) : order.status === id).length;

  const acceptOrder = (event) => {
    event.preventDefault();
    if (branches.length && branches.every((branch) => branch.busy)) {
      setAccepting(null);
      setToast({ id: Date.now(), message: 'Band rejimi yoqilgan. Yangi buyurtmalar qabul qilinmaydi.' });
      return;
    }
    const orderId = accepting;
    update('orders', (current) => current.map((order) => order.id === orderId ? { ...order, status: 'preparing', eta: Number(eta), acceptedAt: new Date().toISOString() } : order));
    setAccepting(null);
    setTab('preparing');
    setToast({ id: Date.now(), message: `Buyurtma qabul qilindi · ${eta} daqiqa` });
  };
  const rejectOrder = (id) => {
    if (!window.confirm(`${id} buyurtmani rad etasizmi?`)) return;
    update('orders', (current) => current.map((order) => order.id === id ? { ...order, status: 'rejected' } : order));
  };
  const advanceOrder = (order) => {
    const next = order.status === 'preparing' ? 'ready' : 'completed';
    update('orders', (current) => current.map((item) => item.id === order.id ? { ...item, status: next } : item));
    setToast({ id: Date.now(), message: next === 'ready' ? 'Buyurtma tayyor deb belgilandi.' : 'Buyurtma yakunlandi.' });
  };

  return <>
    <PageHeader eyebrow="BUYURTMALAR / BUGUN" title="Buyurtmalar" description="Buyurtmalarni kuzating, qabul qiling va tayyorlash jarayonini boshqaring." actions={<><span className="live-pill"><i /> Jonli yangilanmoqda</span><span className="today-pill">▦ {new Intl.DateTimeFormat('uz-UZ', { day: 'numeric', month: 'long' }).format(new Date())}</span></>} />
    <div className="order-overview"><div><span>Bugungi buyurtmalar</span><strong>{orders.length + orderDashboardMetrics.completedToday}</strong><small><b>↗ 12%</b> kechagiga nisbatan</small></div><div><span>O‘rtacha tayyorlash</span><strong>{orderDashboardMetrics.averagePreparationMinutes} <small>daq</small></strong><small>Odatdagi vaqtdan {orderDashboardMetrics.preparationChangeMinutes} daqiqa tez</small></div><div><span>Bugungi tushum</span><strong>{money(orderDashboardMetrics.dailyRevenue)}</strong><small><b>↗ {orderDashboardMetrics.revenueChangePercent}%</b> haftalik o‘rtacha</small></div><div className="order-overview-icon">◷<span>Oshxona holati<br /><b>{settings.restaurant.name} · {branches.length && branches.every((branch) => branch.busy) ? 'Band' : 'Ochiq'}</b></span></div></div>
    <Card className="orders-panel"><div className="order-toolbar"><div className="tabs">{tabs.map((item) => <button key={item.id} onClick={() => setTab(item.id)} className={`tab-button ${tab === item.id ? 'active' : ''}`}>{item.label}<span>{countFor(item.id)}</span></button>)}</div><label className="search-field"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buyurtma qidirish..." /></label></div><div className="order-list">{filtered.length ? filtered.map((order) => <article className="order-card" key={order.id}><div className="order-card-head"><div><span className="order-id">{order.id}</span><span className="order-time">· {dateText(order.createdAt)}</span></div><Badge tone={order.status === 'new' ? 'purple' : order.status === 'preparing' ? 'orange' : order.status === 'ready' || order.status === 'completed' ? 'green' : 'red'}>{({ new: 'Yangi', preparing: 'Tayyorlanmoqda', ready: 'Tayyor', completed: 'Yakunlangan', rejected: 'Rad etilgan' })[order.status]}</Badge></div><div className="order-customer"><span className="customer-avatar">{order.customer.split(' ').map((word) => word[0]).join('').slice(0, 2)}</span><div><strong>{order.customer}</strong><small>{order.type} · {order.phone}</small></div><strong className="order-total">{money(order.total)}</strong></div><div className="order-items">{order.items.map((item, index) => <div className="order-item" key={`${item.name}-${index}`}><span><b>{item.quantity}×</b> {item.name}{item.note && <small> · {item.note}</small>}</span><span>{money(item.price * item.quantity)}</span></div>)}</div><div className="order-address"><span>⌖</span>{order.address}{order.eta && <span className="eta-note">· {order.eta} daqiqada tayyor</span>}</div><div className="order-card-actions"><Button onClick={() => printReceipt(order, settings.restaurant.name)}>▧ Chek chiqarish</Button>{order.status === 'new' && <><Button variant="danger-ghost" onClick={() => rejectOrder(order.id)}>Rad etish</Button><Button variant="primary" onClick={() => { setAccepting(order.id); setEta('20'); }}>✓ Qabul qilish</Button></>}{order.status === 'preparing' && <Button variant="primary" onClick={() => advanceOrder(order)}>Tayyor bo‘ldi →</Button>}{order.status === 'ready' && <Button variant="primary" onClick={() => advanceOrder(order)}>Topshirildi ✓</Button>}</div></article>) : <div className="no-orders"><span>☕</span><strong>{search ? 'Mos buyurtma topilmadi' : 'Bu bo‘limda buyurtma yo‘q'}</strong><p>Yangi buyurtmalar kelganda shu yerda ko‘rinadi.</p></div>}</div><div className="orders-footer"><span>Oxirgi yangilanish: hozirgina</span><span><i /> Avtomatik yangilanadi</span></div></Card>
    {accepting && <Modal title="Buyurtmani qabul qilish" onClose={() => setAccepting(null)}><form className="form-stack" onSubmit={acceptOrder}><p className="modal-copy">Buyurtma <b>{accepting}</b> uchun tayyorlash vaqtini belgilang.</p><label className="field-label">Tayyorlash vaqti<select value={eta} onChange={(event) => setEta(event.target.value)}>{[15, 20, 30, 45].map((minute) => <option key={minute} value={minute}>{minute} daqiqa</option>)}</select></label><div className="form-actions"><Button type="button" onClick={() => setAccepting(null)}>Bekor qilish</Button><Button type="submit" variant="primary">Qabul qilish</Button></div></form></Modal>}
  </>;
}

function printReceipt(order, restaurantName) {
  const receipt = window.open('', '_blank', 'width=400,height=650');
  if (!receipt) return;
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const rows = order.items.map((item) => `<tr><td>${item.quantity} × ${escapeHtml(item.name)}</td><td>${new Intl.NumberFormat('uz-UZ').format(item.price * item.quantity)}</td></tr>`).join('');
  receipt.document.write(`<!doctype html><html lang="uz"><head><meta charset="utf-8"><title>${escapeHtml(order.id)} · Chek</title><style>body{font:14px monospace;max-width:340px;margin:24px auto;color:#111}h2,p{text-align:center;margin:6px}hr{border:0;border-top:1px dashed #888;margin:14px 0}table{width:100%;border-collapse:collapse}td{padding:6px 0}td:last-child{text-align:right;white-space:nowrap}.total{font-weight:bold;font-size:17px}</style></head><body><h2>${escapeHtml(restaurantName)}</h2><p>Buyurtma cheki</p><hr><p>${escapeHtml(order.id)} · ${new Date(order.createdAt).toLocaleString('uz-UZ')}</p><p>${escapeHtml(order.customer)}</p><hr><table>${rows}</table><hr><p class="total">Jami: ${new Intl.NumberFormat('uz-UZ').format(order.total)} so‘m</p><p>${escapeHtml(order.type)}</p><hr><p>Yoqimli ishtaha!</p><script>window.onload=()=>{window.print()}</script></body></html>`);
  receipt.document.close();
}
