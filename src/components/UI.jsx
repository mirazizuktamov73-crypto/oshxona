import { useEffect } from 'react';

export function Button({ children, variant = 'secondary', className = '', ...props }) {
  return <button className={`btn btn-${variant} ${className}`} {...props}>{children}</button>;
}

export function Card({ children, className = '' }) {
  return <section className={`panel ${className}`}>{children}</section>;
}

export function PageHeader({ eyebrow, title, description, actions }) {
  return <div className="page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{actions && <div className="page-actions">{actions}</div>}</div>;
}

export function StatCard({ label, value, change, icon, tone = 'purple' }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div>{change && <div className="stat-change">↗ {change}</div>}</div>;
}

export function Badge({ children, tone = 'gray' }) {
  return <span className={`badge badge-${tone}`}><i />{children}</span>;
}

export function Toggle({ checked, onChange, label, compact = false }) {
  return <label className={`toggle-wrap ${compact ? 'toggle-compact' : ''}`}><span>{label}</span><button type="button" className={`toggle ${checked ? 'on' : ''}`} role="switch" aria-checked={checked} onClick={() => onChange(!checked)}><i /></button></label>;
}

export function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', closeOnEscape);
    document.body.classList.add('modal-open');
    return () => { window.removeEventListener('keydown', closeOnEscape); document.body.classList.remove('modal-open'); };
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}><header className="modal-head"><h2>{title}</h2><button className="close-button" onClick={onClose} aria-label="Yopish">×</button></header><div className="modal-body">{children}</div></section></div>;
}

export function EmptyState({ icon = '⌕', title, detail }) {
  return <div className="empty-state"><span>{icon}</span><strong>{title}</strong><p>{detail}</p></div>;
}

export function Table({ columns, rows, empty = 'Ma’lumot topilmadi.' }) {
  return <div className="table-scroll"><table><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row) => <tr key={row.key}>{row.cells.map((cell, index) => <td key={`${row.key}-${index}`}>{cell}</td>)}</tr>) : <tr><td colSpan={columns.length}><EmptyState title={empty} detail="Boshqa qidiruv so‘zini kiriting yoki yangi ma’lumot qo‘shing." /></td></tr>}</tbody></table></div>;
}

export const money = (value) => `${new Intl.NumberFormat('uz-UZ').format(Number(value) || 0)} so‘m`;
export const dateText = (value) => new Intl.DateTimeFormat('uz-UZ', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
