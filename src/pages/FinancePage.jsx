import { useMemo, useState } from 'react';
import { Badge, Button, Card, PageHeader, StatCard, Table, money } from '../components/UI.jsx';
import { useAppData } from '../state/AppDataContext.jsx';
import { financeDashboardMetrics } from '../data/dashboardMetrics.js';

export default function FinancePage() {
  const { payments } = useAppData();
  const [period, setPeriod] = useState('30');
  const now = new Date();
  const threshold = new Date(now.getTime() - Number(period) * 86400000);
  const visible = useMemo(() => payments.filter((payment) => new Date(`${payment.date}T00:00:00`) >= threshold), [payments, period]);
  const gross = visible.reduce((sum, payment) => sum + payment.amount, 0);
  const commission = Math.round(gross * financeDashboardMetrics.commissionRate);
  const net = gross - commission;
  const exportCsv = () => {
    const rows = [['Sana', 'To‘lov raqami', 'Summa', 'Holat'], ...visible.map((payment) => [payment.date, payment.id, payment.amount, payment.status])];
    const csv = '\uFEFF' + rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); link.download = 'oshxona-moliya-hisoboti.csv'; link.click(); URL.revokeObjectURL(link.href);
  };
  const rows = visible.map((payment) => ({ key: payment.id, cells: [<strong className="table-strong">{payment.id}</strong>, new Date(`${payment.date}T00:00:00`).toLocaleDateString('uz-UZ'), <strong>{money(payment.amount)}</strong>, <Badge tone={payment.status === 'To‘landi' ? 'green' : 'orange'}>{payment.status}</Badge>] }));
  return <>
    <PageHeader eyebrow="RESTORAN / HISOB-KITOB" title="Moliya" description="Sotuvlar, komissiya va to‘lovlar tarixini kuzating." actions={<><select className="period-select" value={period} onChange={(event) => setPeriod(event.target.value)}><option value="7">Oxirgi 7 kun</option><option value="30">Oxirgi 30 kun</option><option value="90">Oxirgi 90 kun</option><option value="365">Bu yil</option></select><Button onClick={exportCsv}>⇩ CSV yuklab olish</Button></>} />
    <div className="stats-grid finance-stats"><StatCard label="Jami sotuv" value={money(gross)} change="12,8% oldingi davrga" icon="↗" tone="purple" /><StatCard label="Platforma komissiyasi" value={money(commission)} change={`${financeDashboardMetrics.commissionRate * 100}% komissiya`} icon="◈" tone="orange" /><StatCard label="Sof tushum" value={money(net)} change="To‘lovga tayyor" icon="✓" tone="green" /><StatCard label="Keyingi to‘lov" value={financeDashboardMetrics.nextPayoutDate} change="Kutilmoqda" icon="◷" tone="blue" /></div>
    <Card><div className="panel-heading"><div><h2>To‘lovlar tarixi</h2><p>Filtrlangan davr uchun barcha hisob-kitoblar</p></div><span className="payment-period">{visible.length} ta yozuv</span></div><Table columns={['TO‘LOV RAQAMI', 'SANA', 'SUMMA', 'HOLATI']} rows={rows} empty="Tanlangan davrda to‘lovlar yo‘q." /><div className="table-bottom-note">Komissiya summasi har bir to‘lovdan avtomatik hisoblangan mock ko‘rsatkichdir.</div></Card>
  </>;
}
