const weekdays = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'];
export const initialHours = weekdays.map((day, index) => ({ day, open: index !== 6, from: '09:00', to: index > 3 && index < 6 ? '23:00' : '22:00' }));
export const initialBranches = [
  { id: 'br-1', name: 'Yunusobod filiali', address: 'Yunusobod, Amir Temur ko‘chasi 45', busy: false, hours: initialHours },
  { id: 'br-2', name: 'Chilonzor filiali', address: 'Chilonzor, Bunyodkor ko‘chasi 12', busy: false, hours: initialHours.map((day) => ({ ...day })) },
];
export const initialPromotions = [
  { id: 'promo-1', name: 'Tushlik vaqti', kind: 'Chegirma', code: '', value: '15%', start: '2026-11-01', end: '2026-11-30', active: true },
  { id: 'promo-2', name: 'Yangi mijozlar', kind: 'Promokod', code: 'BIRINCHI20', value: '20%', start: '2026-11-01', end: '2026-12-31', active: true },
  { id: 'promo-3', name: 'Burger + limonad', kind: 'Kombo', code: '', value: '55 000 so‘m', start: '2026-10-01', end: '2026-10-31', active: false },
];
export const initialPayments = [
  { id: 'PAY-981', date: '2026-11-10', amount: 3850000, status: 'To‘landi' },
  { id: 'PAY-980', date: '2026-11-03', amount: 4210000, status: 'To‘landi' },
  { id: 'PAY-979', date: '2026-10-27', amount: 3620000, status: 'To‘landi' },
  { id: 'PAY-978', date: '2026-10-20', amount: 2980000, status: 'Jarayonda' },
];
export const initialReviews = [
  { id: 'REV-1', customer: 'Madina R.', rating: 5, date: '2026-11-10', text: 'Burger juda mazali va issiq keldi. Yetkazib berish ham tez ekan!', reply: '', complaint: false },
  { id: 'REV-2', customer: 'Jasur A.', rating: 3, date: '2026-11-09', text: 'Pitsa yaxshi, lekin biroz sovib qolgan edi.', reply: 'Fikringiz uchun rahmat. Keyingi safar issiq yetib borishini nazorat qilamiz.', complaint: true },
  { id: 'REV-3', customer: 'Nilufar S.', rating: 5, date: '2026-11-08', text: 'Sezar salati ajoyib! Yana buyurtma beraman.', reply: '', complaint: false },
  { id: 'REV-4', customer: 'Sardor T.', rating: 2, date: '2026-11-06', text: 'Buyurtmada ichimlik yetishmadi, qo‘llab-quvvatlashga yozdim.', reply: '', complaint: true },
];
export const initialStaff = [
  { id: 'emp-1', name: 'Aziz Karimov', phone: '+998 90 111 22 33', role: 'Egasi', permissions: ['buyurtmalar', 'menyu', 'moliya', 'sozlamalar'] },
  { id: 'emp-2', name: 'Dilnoza Ergasheva', phone: '+998 91 222 33 44', role: 'Menejer', permissions: ['buyurtmalar', 'menyu', 'xodimlar'] },
  { id: 'emp-3', name: 'Kamol Sobirov', phone: '+998 93 333 44 55', role: 'Kassir', permissions: ['buyurtmalar'] },
  { id: 'emp-4', name: 'Olim Yunusov', phone: '+998 94 444 55 66', role: 'Oshpaz', permissions: ['buyurtmalar'] },
];
export const initialSettings = {
  restaurant: { name: 'Oshxona', tagline: 'Mazali taomlar, yaxshi kayfiyat', phone: '+998 71 200 30 40', email: 'salom@oshxona.uz', address: 'Toshkent sh., Yunusobod tumani', logo: '🍽️' },
  sound: true,
  notifications: { newOrders: true, reviews: true, payments: false },
};
