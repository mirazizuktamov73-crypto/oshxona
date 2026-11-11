const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60_000).toISOString();

export const initialOrders = [
  { id: 'ORD-2048', customer: 'Madina Rahimova', phone: '+998 90 123 45 67', type: 'Yetkazib berish', address: 'Yunusobod, 4-mavze', createdAt: minutesAgo(2), status: 'new', eta: null, items: [{ name: 'Double cheese burger', quantity: 2, price: 58000, note: 'Piyozsiz' }, { name: 'Limonad', quantity: 2, price: 18000 }], total: 152000 },
  { id: 'ORD-2047', customer: 'Jasur Aliyev', phone: '+998 91 234 56 78', type: 'Olib ketish', address: 'Filialdan olib ketadi', createdAt: minutesAgo(7), status: 'new', eta: null, items: [{ name: 'Pepperoni pitsa', quantity: 1, price: 85000 }, { name: 'Sezar salati', quantity: 1, price: 39000 }], total: 124000 },
  { id: 'ORD-2046', customer: 'Nilufar Saidova', phone: '+998 93 345 67 89', type: 'Yetkazib berish', address: 'Chilonzor, 9-mavze', createdAt: minutesAgo(19), status: 'preparing', eta: 25, items: [{ name: 'Klassik burger', quantity: 3, price: 42000 }, { name: 'Margarita pitsa', quantity: 1, price: 69000 }], total: 195000 },
  { id: 'ORD-2045', customer: 'Sardor Tursunov', phone: '+998 94 456 78 90', type: 'Olib ketish', address: 'Filialdan olib ketadi', createdAt: minutesAgo(36), status: 'ready', eta: 20, items: [{ name: 'Margarita pitsa', quantity: 2, price: 69000 }], total: 138000 },
  { id: 'ORD-2044', customer: 'Zarina Akbarova', phone: '+998 95 567 89 01', type: 'Yetkazib berish', address: 'Mirzo Ulug‘bek, Buyuk Ipak Yo‘li', createdAt: minutesAgo(95), status: 'completed', eta: 30, items: [{ name: 'Klassik burger', quantity: 1, price: 42000 }, { name: 'Tiramisu', quantity: 1, price: 32000 }], total: 74000 },
  { id: 'ORD-2043', customer: 'Bekzod Mamatov', phone: '+998 97 678 90 12', type: 'Yetkazib berish', address: 'Shayxontohur, Beruniy ko‘chasi', createdAt: minutesAgo(138), status: 'rejected', eta: null, items: [{ name: 'Pepperoni pitsa', quantity: 1, price: 85000 }], total: 85000 },
];
