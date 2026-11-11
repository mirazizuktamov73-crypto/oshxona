import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Badge, Button, Card, Modal, PageHeader, Toggle, money } from '../components/UI.jsx';
import { useAppData } from '../state/AppDataContext.jsx';

const blankProduct = { name: '', price: '', category: '', description: '', image: '', modifiers: '' };

export default function MenuPage() {
  const { categories, products, update, setToast } = useAppData();
  const [category, setCategory] = useState('Barchasi');
  const [modal, setModal] = useState(null);
  const [draft, setDraft] = useState(blankProduct);
  const [categoryName, setCategoryName] = useState('');
  const [includeStopped, setIncludeStopped] = useState(false);
  const fileRef = useRef(null);
  const shown = products.filter((product) => (category === 'Barchasi' || product.category === category) && (includeStopped || product.active));

  const saveProduct = (event) => {
    event.preventDefault();
    const product = { ...draft, id: draft.id || `prd-${Date.now()}`, price: Number(draft.price), image: draft.image || '🍽️', active: draft.active ?? true, modifiers: typeof draft.modifiers === 'string' ? draft.modifiers.split(',').map((item) => item.trim()).filter(Boolean) : draft.modifiers || [] };
    update('products', (current) => draft.id ? current.map((item) => item.id === draft.id ? product : item) : [product, ...current]);
    setModal(null); setToast({ id: Date.now(), message: draft.id ? 'Mahsulot yangilandi.' : 'Yangi mahsulot qo‘shildi.' });
  };
  const openProduct = (product = null) => setModal({ type: 'product', includeStopped: true, productId: product?.id });
  const editProduct = (product) => { setDraft({ ...product, modifiers: product.modifiers.join(', ') }); openProduct(product); };
  const addCategory = (event) => {
    event.preventDefault();
    if (!categoryName.trim()) return;
    update('categories', (current) => [...current, { id: `cat-${Date.now()}`, name: categoryName.trim(), color: '#f0edff' }]);
    setCategoryName(''); setModal(null); setToast({ id: Date.now(), message: 'Kategoriya qo‘shildi.' });
  };
  const renameCategory = (item) => {
    const name = window.prompt('Kategoriya nomini kiriting:', item.name);
    if (!name?.trim()) return;
    update('categories', (current) => current.map((categoryItem) => categoryItem.id === item.id ? { ...categoryItem, name: name.trim() } : categoryItem));
    update('products', (current) => current.map((product) => product.category === item.name ? { ...product, category: name.trim() } : product));
  };
  const removeCategory = (item) => {
    if (!window.confirm(`“${item.name}” kategoriyasi o‘chirilsinmi? Mahsulotlar “Boshqa” kategoriyasiga o‘tadi.`)) return;
    update('categories', (current) => current.filter((entry) => entry.id !== item.id));
    update('products', (current) => current.map((product) => product.category === item.name ? { ...product, category: 'Boshqa' } : product));
    setCategory('Barchasi');
  };
  const toggleActive = (product) => update('products', (current) => current.map((item) => item.id === product.id ? { ...item, active: !item.active } : item));
  const removeProduct = (product) => {
    if (window.confirm(`“${product.name}” mahsuloti o‘chirilsinmi?`)) update('products', (current) => current.filter((item) => item.id !== product.id));
  };
  const importExcel = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
      const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: '' });
      const imported = rows.map((row, index) => {
        const normalized = Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toString().toLocaleLowerCase('uz').trim(), value]));
        return { id: `imp-${Date.now()}-${index}`, name: String(normalized.nomi || normalized.name || normalized['mahsulot nomi'] || '').trim(), price: Number(String(normalized.narxi || normalized.narx || normalized.price || 0).replace(/[\s,]/g, '')), category: String(normalized.kategoriya || normalized.category || categories[0]?.name || 'Boshqa'), description: String(normalized.tavsif || normalized.description || ''), image: String(normalized.rasm || normalized.image || '🍽️'), active: true, modifiers: [] };
      }).filter((product) => product.name && product.price >= 0);
      update('products', (current) => [...imported, ...current]);
      setToast({ id: Date.now(), message: `${imported.length} ta mahsulot Excel fayldan qo‘shildi.` });
    } catch { setToast({ id: Date.now(), message: 'Excel faylini o‘qib bo‘lmadi.' }); }
    event.target.value = '';
  };

  return <>
    <PageHeader eyebrow="RESTORAN / MENYU" title="Menyu" description="Kategoriyalar, taomlar va qo‘shimchalarni bir joyda boshqaring." actions={<><input ref={fileRef} type="file" accept=".xlsx,.xls" hidden onChange={importExcel} /><Button onClick={() => fileRef.current?.click()}>⇧ Excel import</Button><Button variant="primary" onClick={() => { setDraft({ ...blankProduct, category: categories[0]?.name || '' }); setModal({ type: 'product' }); }}>＋ Mahsulot qo‘shish</Button></>} />
    <div className="menu-summary"><div><span>Jami mahsulot</span><strong>{products.length}</strong></div><div><span>Faol mahsulot</span><strong>{products.filter((product) => product.active).length}</strong></div><div><span>Kategoriyalar</span><strong>{categories.length}</strong></div><div><span>Stop-list</span><strong>{products.filter((product) => !product.active).length}</strong></div></div>
    <div className="menu-layout"><Card className="categories-card"><div className="panel-heading"><div><h2>Kategoriyalar</h2><p>Menyuni bo‘limlarga ajrating</p></div><button className="icon-add" onClick={() => setModal({ type: 'category' })}>＋</button></div><div className="category-list"><button onClick={() => setCategory('Barchasi')} className={`category-row ${category === 'Barchasi' ? 'active' : ''}`}><span className="category-emoji">▦</span><span>Barchasi</span><small>{products.length}</small></button>{categories.map((item, index) => <div className="category-row-wrap" key={item.id}><button onClick={() => setCategory(item.name)} className={`category-row ${category === item.name ? 'active' : ''}`}><span className="category-emoji" style={{ background: item.color }}>{['🍔', '🍕', '🥤', '🥗', '🍰'][index % 5]}</span><span>{item.name}</span><small>{products.filter((product) => product.category === item.name).length}</small></button><div className="category-actions"><button title="Tahrirlash" onClick={() => renameCategory(item)}>✎</button><button title="O‘chirish" onClick={() => removeCategory(item)}>×</button></div></div>)}</div><Button className="add-category" onClick={() => setModal({ type: 'category' })}>＋ Yangi kategoriya</Button></Card>
      <Card className="menu-products-card"><div className="panel-heading menu-products-heading"><div><h2>{category === 'Barchasi' ? 'Barcha mahsulotlar' : category}<span className="sub-count">{shown.length} ta</span></h2><p>Taomlar va ichimliklar ro‘yxati</p></div><label className="stop-toggle"><span>Stop-listni ko‘rsatish</span><input type="checkbox" checked={includeStopped} onChange={(event) => setIncludeStopped(event.target.checked)} /></label></div><div className="product-grid">{shown.map((product) => <article className={`menu-product ${!product.active ? 'product-stopped' : ''}`} key={product.id}><div className="menu-product-image">{String(product.image).startsWith('http') ? <img src={product.image} alt="" /> : <span>{product.image}</span>}<span className={`product-state ${product.active ? 'available' : 'stopped'}`}>{product.active ? 'Sotuvda' : 'Stop-list'}</span></div><div className="menu-product-body"><div className="menu-product-top"><div><h3>{product.name}</h3><small>{product.category}</small></div><button className="dots-button" onClick={() => editProduct(product)}>•••</button></div><p>{product.description || 'Tavsif kiritilmagan.'}</p><div className="modifier-tags">{product.modifiers.slice(0, 2).map((modifier) => <span key={modifier}>+ {modifier}</span>)}{product.modifiers.length > 2 && <span>+{product.modifiers.length - 2}</span>}</div><div className="menu-product-foot"><strong>{money(product.price)}</strong><div className="product-quick-actions"><button title={product.active ? 'Stop-listga olish' : 'Sotuvga qaytarish'} onClick={() => toggleActive(product)}>{product.active ? 'Ⅱ' : '▶'}</button><button title="Tahrirlash" onClick={() => editProduct(product)}>✎</button><button title="O‘chirish" onClick={() => removeProduct(product)}>×</button></div></div></div></article>)}</div>{shown.length === 0 && <div className="empty-inline">Bu kategoriyada hozircha mahsulot yo‘q.</div>}</Card></div>
    {modal?.type === 'product' && <ProductModal key={modal.productId || 'new'} draft={draft} setDraft={setDraft} categories={categories} onSave={saveProduct} onClose={() => setModal(null)} />}
    {modal?.type === 'category' && <Modal title="Yangi kategoriya" onClose={() => setModal(null)}><form className="form-stack" onSubmit={addCategory}><label className="field-label">Kategoriya nomi<input autoFocus value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="Masalan, Nonushta" required /></label><div className="form-actions"><Button type="button" onClick={() => setModal(null)}>Bekor qilish</Button><Button type="submit" variant="primary">Kategoriya qo‘shish</Button></div></form></Modal>}
  </>;
}

function ProductModal({ draft, setDraft, categories, onSave, onClose }) {
  const field = (name, value) => setDraft((current) => ({ ...current, [name]: value }));
  return <Modal title={draft.id ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'} onClose={onClose} wide><form className="form-stack" onSubmit={onSave}><div className="form-grid"><label className="field-label">Mahsulot nomi<input autoFocus value={draft.name} onChange={(event) => field('name', event.target.value)} placeholder="Masalan, Tovuqli burger" required /></label><label className="field-label">Narxi (so‘m)<input type="number" min="0" value={draft.price} onChange={(event) => field('price', event.target.value)} placeholder="45000" required /></label><label className="field-label">Kategoriya<select value={draft.category} onChange={(event) => field('category', event.target.value)} required><option value="" disabled>Kategoriyani tanlang</option>{categories.map((item) => <option key={item.id}>{item.name}</option>)}</select></label><label className="field-label">Rasm (emoji yoki URL)<input value={draft.image || ''} onChange={(event) => field('image', event.target.value)} placeholder="🍔 yoki https://..." /></label><label className="field-label full-field">Tavsif<textarea rows="3" value={draft.description} onChange={(event) => field('description', event.target.value)} placeholder="Taom tarkibi haqida qisqacha..." /></label><label className="field-label full-field">Modifikatorlar<input value={draft.modifiers} onChange={(event) => field('modifiers', event.target.value)} placeholder="Qo‘shimcha pishloq, sous (vergul bilan ajrating)" /><small>Masalan: qo‘shimcha pishloq, sous, achchiq qalampir</small></label></div><div className="form-actions"><Button type="button" onClick={onClose}>Bekor qilish</Button><Button type="submit" variant="primary">Saqlash</Button></div></form></Modal>;
}
