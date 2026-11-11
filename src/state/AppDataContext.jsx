import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { initialCategories } from '../data/categories.js';
import { initialProducts } from '../data/products.js';
import { initialOrders } from '../data/orders.js';
import { initialBranches, initialPromotions, initialPayments, initialReviews, initialStaff, initialSettings } from '../data/operations.js';
import { createSimulatedOrder, simulationIntervalMs } from '../data/simulatedOrders.js';

const STORAGE_KEY = 'oshxona-seller-data-v1';
const AuthContext = createContext(null);
const seed = { categories: initialCategories, products: initialProducts, orders: initialOrders, branches: initialBranches, promotions: initialPromotions, payments: initialPayments, reviews: initialReviews, staff: initialStaff, settings: initialSettings };
const loadState = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...seed, ...saved, settings: { ...seed.settings, ...saved.settings, restaurant: { ...seed.settings.restaurant, ...saved.settings?.restaurant }, notifications: { ...seed.settings.notifications, ...saved.settings?.notifications } } } : seed;
  } catch { return seed; }
};

function playBeep() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const audio = new AudioContextClass();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = 'sine'; oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.12, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.45);
    oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + 0.45);
  } catch { /* audio is optional in browsers that block it */ }
}

export function AppDataProvider({ children }) {
  const [data, setData] = useState(loadState);
  const dataRef = useRef(data);
  dataRef.current = data;
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('oshxona-seller-user')) || null; } catch { return null; }
  });
  const [toast, setToast] = useState(null);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data]);
  useEffect(() => { user ? localStorage.setItem('oshxona-seller-user', JSON.stringify(user)) : localStorage.removeItem('oshxona-seller-user'); }, [user]);
  useEffect(() => {
    const timer = window.setInterval(() => {
      const current = dataRef.current;
      if (current.branches.length && current.branches.every((branch) => branch.busy)) return;
      const newOrder = createSimulatedOrder(current.products);
      setData((latest) => latest.orders.some((order) => order.id === newOrder.id) ? latest : { ...latest, orders: [newOrder, ...latest.orders] });
      if (current.settings.sound) playBeep();
      if (current.settings.notifications.newOrders) setToast({ id: Date.now(), message: `Yangi buyurtma: ${newOrder.id}` });
    }, simulationIntervalMs);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const update = useCallback((key, valueOrUpdater) => setData((current) => ({ ...current, [key]: typeof valueOrUpdater === 'function' ? valueOrUpdater(current[key]) : valueOrUpdater })), []);
  const value = useMemo(() => ({ ...data, update, toast, setToast, user, login: (name) => setUser({ name: name || 'Sotuvchi' }), logout: () => setUser(null) }), [data, update, toast, user]);
  return <AuthContext.Provider value={value}>{children}{toast && <div className="toast" role="status"><span className="toast-icon">✓</span>{toast.message}</div>}</AuthContext.Provider>;
}

export function useAppData() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAppData AppDataProvider ichida ishlatilishi kerak');
  return context;
}
