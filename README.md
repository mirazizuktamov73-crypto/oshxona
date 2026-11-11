# Oshxona · sotuvchi paneli

Restoran sotuvchisi uchun o‘zbekcha demo admin paneli. React, Vite, Tailwind CSS 4, React Router va Recharts ishlatilgan. Barcha ma’lumotlar `src/data/` ichidagi mock fayllardan olinadi, o‘zgarishlar brauzerning `localStorage` xotirasida saqlanadi. Backend talab qilinmaydi.

## Ishga tushirish

Node.js 20.19+ (yoki 22.12+) versiyasini o‘rnating, so‘ng loyiha papkasida:

```bash
npm install
npm run dev
```

Build olish va lokal ko‘rish:

```bash
npm run build
npm run preview
```

Kirish sahifasida istalgan ism, email va parol bilan demo kabinetiga o‘tish mumkin.

## Tuzilma

```text
src/
├── components/   # Umumiy UI, yon menyu va layout
├── data/         # Mock mahsulotlar, buyurtmalar, filiallar va hisobotlar
├── pages/        # Login va to‘qqizta boshqaruv bo‘limi
├── state/        # React holati, localStorage va yangi buyurtma simulyatsiyasi
├── App.jsx
├── index.css     # Tailwind va responsive qo‘shimcha uslublar
└── main.jsx
```

## Demo imkoniyatlari

- Buyurtmalarni qabul qilish, rad etish, tayyorlash va chekni chop etish.
- Menyu kategoriyalari va mahsulotlarini boshqarish; Excel `.xlsx` importi.
- Filiallar jadvali va band rejimi, aksiyalar, CSV moliya hisoboti.
- Recharts grafiklari, sharhlarga javob, xodim rollari va ruxsatlari.
- Ovoz va bildirishnoma sozlamalari; har 90 soniyada soxta yangi buyurtma simulyatsiyasi.

Bu demo: to‘lovlar, buyurtmalar va xodim ruxsatlari serverga yuborilmaydi. Brauzer xotirasi tozalansa, saqlangan o‘zgarishlar ham o‘chadi.
