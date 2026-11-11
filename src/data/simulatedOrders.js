export const simulationIntervalMs = 90_000;
const simulatedCustomers = ['Shahnoza Ismoilova', 'Rustam Qodirov', 'Mohira Nazarova'];

export function createSimulatedOrder(products) {
  const activeProducts = products.filter((product) => product.active);
  const product = activeProducts[Math.floor(Math.random() * activeProducts.length)] || { name: 'Klassik burger', price: 42_000 };
  const id = `ORD-${Date.now().toString().slice(-5)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  return {
    id,
    customer: simulatedCustomers[Math.floor(Math.random() * simulatedCustomers.length)],
    phone: '+998 90 555 44 33',
    type: Math.random() > .5 ? 'Yetkazib berish' : 'Olib ketish',
    address: 'Toshkent shahri',
    createdAt: new Date().toISOString(),
    status: 'new',
    eta: null,
    items: [{ name: product.name, quantity: 1, price: product.price }],
    total: product.price,
  };
}
