import { useRef } from 'react';
import { Button, Card, PageHeader, Toggle } from '../components/UI.jsx';
import { useAppData } from '../state/AppDataContext.jsx';

export default function SettingsPage() {
  const { settings, update, setToast } = useAppData();
  const fileRef = useRef(null);
  const restaurant = settings.restaurant;
  const changeRestaurant = (key, value) => update('settings', (current) => ({ ...current, restaurant: { ...current.restaurant, [key]: value } }));
  const changeNotification = (key, value) => update('settings', (current) => ({ ...current, notifications: { ...current.notifications, [key]: value } }));

  const uploadLogo = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1_000_000) {
      setToast({ id: Date.now(), message: "Logotip 1 MB dan kichik bo'lishi kerak." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => changeRestaurant('logo', reader.result);
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const save = (event) => {
    event.preventDefault();
    setToast({ id: Date.now(), message: 'Restoran sozlamalari saqlandi.' });
  };

  return <>
    <PageHeader eyebrow="RESTORAN / BOSHQARUV" title="Sozlamalar" description="Restoran profili va bildirishnomalarni sozlang." />
    <div className="settings-layout">
      <div className="settings-main">
        <Card>
          <form onSubmit={save}>
            <div className="panel-heading"><div><h2>Restoran profili</h2><p>Mijozlarga ko'rinadigan ma'lumotlar</p></div></div>
            <div className="profile-settings">
              <div className="logo-upload">
                <span className="logo-preview">{String(restaurant.logo).startsWith('data:image') ? <img src={restaurant.logo} alt="Restoran logotipi" /> : restaurant.logo || '🍽️'}</span>
                <div><strong>Restoran logotipi</strong><p>PNG yoki JPG, 1 MB gacha</p><input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={uploadLogo} /><Button type="button" onClick={() => fileRef.current?.click()}>Rasm yuklash</Button></div>
              </div>
              <div className="settings-form-grid">
                <label className="field-label">Restoran nomi<input value={restaurant.name} onChange={(event) => changeRestaurant('name', event.target.value)} /></label>
                <label className="field-label">Qisqa ta'rif<input value={restaurant.tagline} onChange={(event) => changeRestaurant('tagline', event.target.value)} /></label>
                <label className="field-label">Telefon raqami<input type="tel" value={restaurant.phone} onChange={(event) => changeRestaurant('phone', event.target.value)} /></label>
                <label className="field-label">Email manzil<input type="email" value={restaurant.email} onChange={(event) => changeRestaurant('email', event.target.value)} /></label>
                <label className="field-label full-field">Manzil<input value={restaurant.address} onChange={(event) => changeRestaurant('address', event.target.value)} /></label>
              </div>
              <div className="settings-save"><span>Ma'lumotlar brauzeringizda avtomatik saqlanadi.</span><Button variant="primary" type="submit">O'zgarishlarni saqlash</Button></div>
            </div>
          </form>
        </Card>
      </div>
      <div className="settings-side">
        <Card>
          <div className="panel-heading"><div><h2>Bildirishnomalar</h2><p>Nimalar haqida xabar beraylik?</p></div></div>
          <div className="setting-options">
            <Toggle checked={settings.notifications.newOrders} onChange={(value) => changeNotification('newOrders', value)} label="Yangi buyurtmalar" />
            <Toggle checked={settings.notifications.reviews} onChange={(value) => changeNotification('reviews', value)} label="Yangi sharhlar" />
            <Toggle checked={settings.notifications.payments} onChange={(value) => changeNotification('payments', value)} label="To'lovlar" />
          </div>
        </Card>
        <Card>
          <div className="panel-heading"><div><h2>Ovozli signal</h2><p>Yangi buyurtma kelganda</p></div><span className="sound-emoji">♫</span></div>
          <div className="sound-setting">
            <Toggle checked={settings.sound} onChange={(value) => update('settings', (current) => ({ ...current, sound: value }))} label={settings.sound ? 'Signal yoqilgan' : "Signal o'chirilgan"} />
            <p>Yangi buyurtma simulyatsiyasi har 90 soniyada tekshiriladi. Brauzer audio ijrosini cheklasa, sahifa bilan o'zaro ishlagandan so'ng ovoz eshitiladi.</p>
          </div>
        </Card>
        <div className="settings-tip"><span>🔒</span><div><strong>Demo rejim</strong><p>Ma'lumotlar ushbu qurilmaning brauzerida saqlanadi. Hisob boshqa qurilmalarga sinxronlanmaydi.</p></div></div>
      </div>
    </div>
  </>;
}
