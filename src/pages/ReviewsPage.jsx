import { useMemo, useState } from 'react';
import { Badge, Button, Card, Modal, PageHeader } from '../components/UI.jsx';
import { useAppData } from '../state/AppDataContext.jsx';

export default function ReviewsPage() {
  const { reviews, update, setToast } = useAppData();
  const [filter, setFilter] = useState('Barchasi');
  const [replying, setReplying] = useState(null);
  const [reply, setReply] = useState('');
  const average = reviews.length ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : '0.0';
  const shown = useMemo(() => reviews.filter((review) => filter === 'Barchasi' || (filter === 'Shikoyatlar' ? review.complaint : review.rating === Number(filter))), [reviews, filter]);
  const sendReply = (event) => {
    event.preventDefault();
    update('reviews', (current) => current.map((review) => review.id === replying ? { ...review, reply: reply.trim() } : review));
    setReplying(null); setReply(''); setToast({ id: Date.now(), message: 'Javob sharhga qo‘shildi.' });
  };
  const markComplaint = (id) => update('reviews', (current) => current.map((review) => review.id === id ? { ...review, complaint: !review.complaint } : review));
  return <>
    <PageHeader eyebrow="RESTORAN / MIJOZLAR FIKRI" title="Sharhlar" description="Mijozlar fikrini o‘qing, javob bering va xizmatni yaxshilang." actions={<Badge tone="green">{reviews.length} ta sharh</Badge>} />
    <div className="review-overview"><div className="average-rating"><span className="rating-big">{average}</span><span className="stars">★★★★★</span><span className="rating-caption">O‘rtacha baho</span><small>{reviews.length} ta sharh asosida</small></div><div className="rating-bars">{[5, 4, 3, 2, 1].map((rating) => { const count = reviews.filter((review) => review.rating === rating).length; const percent = reviews.length ? count / reviews.length * 100 : 0; return <div key={rating}><span>{rating} ★</span><i><b style={{ width: `${percent}%` }} /></i><small>{count}</small></div>; })}</div><div className="review-stat"><span>Javob kutilmoqda</span><strong>{reviews.filter((review) => !review.reply).length}</strong><small>Mijozlarga javob bering</small></div><div className="review-stat complaint-stat"><span>Shikoyatlar</span><strong>{reviews.filter((review) => review.complaint).length}</strong><small>Alohida e’tibor kerak</small></div></div>
    <Card><div className="panel-heading review-list-heading"><div><h2>Mijozlar sharhlari</h2><p>Barcha fikrlarni boshqaring</p></div><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>Barchasi</option><option value="Shikoyatlar">Shikoyatlar</option><option value="5">5 yulduz</option><option value="4">4 yulduz</option><option value="3">3 yulduz</option><option value="2">2 yulduz</option><option value="1">1 yulduz</option></select></div><div className="reviews-list">{shown.map((review) => <article className={`review-card ${review.complaint ? 'is-complaint' : ''}`} key={review.id}><div className="review-person"><span className="customer-avatar">{review.customer.split(' ').map((word) => word[0]).join('')}</span><div><strong>{review.customer}</strong><small>{new Date(`${review.date}T00:00:00`).toLocaleDateString('uz-UZ')}</small></div><span className="review-stars">{'★'.repeat(review.rating)}<i>{'★'.repeat(5 - review.rating)}</i></span>{review.complaint && <Badge tone="red">Shikoyat</Badge>}</div><p className="review-text">{review.text}</p>{review.reply && <div className="review-reply"><span>↳</span><div><strong>Restoran javobi</strong><p>{review.reply}</p></div></div>}<div className="review-actions"><button onClick={() => { setReplying(review.id); setReply(review.reply || ''); }}>{review.reply ? '✎ Javobni tahrirlash' : '↩ Javob yozish'}</button><button className={review.complaint ? 'complaint-active' : ''} onClick={() => markComplaint(review.id)}>{review.complaint ? '⚑ Shikoyatni olib tashlash' : '⚑ Shikoyat deb belgilash'}</button></div></article>)}{!shown.length && <div className="empty-inline">Bu filtrga mos sharh yo‘q.</div>}</div></Card>
    {replying && <Modal title="Sharhga javob yozish" onClose={() => setReplying(null)}><form className="form-stack" onSubmit={sendReply}><label className="field-label">Javobingiz<textarea rows="5" autoFocus value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Mijozga muloyim javob yozing..." required /></label><div className="form-actions"><Button type="button" onClick={() => setReplying(null)}>Bekor qilish</Button><Button type="submit" variant="primary">Javobni yuborish</Button></div></form></Modal>}
  </>;
}
