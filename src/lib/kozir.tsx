import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ru" | "uz";

const dict = {
  play: { en: "Play", ru: "Играть", uz: "O'ynash" },
  shop: { en: "Shop", ru: "Магазин", uz: "Do'kon" },
  profile: { en: "Profile", ru: "Профиль", uz: "Profil" },
  games: { en: "Games", ru: "Игры", uz: "O'yinlar" },
  playNow: { en: "Play now", ru: "Играть сейчас", uz: "Hozir o'ynash" },
  quickMatch: { en: "Quick match", ru: "Быстрая игра", uz: "Tezkor o'yin" },
  createRoom: { en: "Create room", ru: "Создать комнату", uz: "Xona yaratish" },
  joinCode: { en: "Join with code", ru: "Войти по коду", uz: "Kod orqali kirish" },
  join: { en: "Join", ru: "Войти", uz: "Kirish" },
  rooms: { en: "Rooms", ru: "Комнаты", uz: "Xonalar" },
  players: { en: "players", ru: "игрока", uz: "o'yinchi" },
  comingSoon: { en: "Coming soon", ru: "Скоро", uz: "Tez orada" },
  noRooms: { en: "No open rooms yet", ru: "Пока нет открытых комнат", uz: "Hozircha ochiq xonalar yo'q" },
  noRoomsHint: { en: "Invite a friend and start a table together.", ru: "Пригласите друга и начните игру вместе.", uz: "Do'stingizni taklif qiling va birga o'ynang." },
  invite: { en: "Invite a friend", ru: "Пригласить друга", uz: "Do'stni taklif qilish" },
  retry: { en: "Try again", ru: "Повторить", uz: "Qayta urinish" },
  loadError: { en: "Couldn't load rooms", ru: "Не удалось загрузить комнаты", uz: "Xonalarni yuklab bo'lmadi" },
  game: { en: "Game", ru: "Игра", uz: "O'yin" },
  seats: { en: "Seats", ru: "Места", uz: "O'rinlar" },
  privacy: { en: "Privacy", ru: "Приватность", uz: "Maxfiylik" },
  private: { en: "Private", ru: "Приватная", uz: "Yopiq" },
  public: { en: "Public", ru: "Открытая", uz: "Ochiq" },
  roomCode: { en: "Room code", ru: "Код комнаты", uz: "Xona kodi" },
  share: { en: "Share", ru: "Поделиться", uz: "Ulashish" },
  create: { en: "Create", ru: "Создать", uz: "Yaratish" },
  waiting: { en: "Waiting for players…", ru: "Ожидание игроков…", uz: "O'yinchilar kutilmoqda…" },
  start: { en: "Start game", ru: "Начать игру", uz: "O'yinni boshlash" },
  leave: { en: "Leave room", ru: "Покинуть комнату", uz: "Xonadan chiqish" },
  emptySeat: { en: "Empty seat", ru: "Свободно", uz: "Bo'sh o'rin" },
  host: { en: "Host", ru: "Хозяин", uz: "Mezbon" },
  balance: { en: "Your balance", ru: "Ваш баланс", uz: "Balansingiz" },
  freeCoins: { en: "Get free coins", ru: "Бесплатные монеты", uz: "Bepul tangalar" },
  watchAd: { en: "Watch a short ad", ru: "Посмотрите рекламу", uz: "Qisqa reklama ko'ring" },
  subscribe: { en: "Subscribe: daily coins", ru: "Подписка: монеты каждый день", uz: "Obuna: har kuni tangalar" },
  subscribeHint: { en: "+150 coins every day, no ads", ru: "+150 монет в день, без рекламы", uz: "Har kuni +150 tanga, reklamasiz" },
  coins: { en: "Coins", ru: "Монеты", uz: "Tangalar" },
  cardSkins: { en: "Card skins", ru: "Рубашки", uz: "Karta dizayni" },
  tableSkins: { en: "Table skins", ru: "Столы", uz: "Stol dizayni" },
  bestValue: { en: "Best value", ru: "Выгодно", uz: "Eng foydali" },
  owned: { en: "Owned", ru: "Куплено", uz: "Sizniki" },
  equipped: { en: "Equipped", ru: "Выбрано", uz: "Tanlangan" },
  buy: { en: "Buy", ru: "Купить", uz: "Sotib olish" },
  locked: { en: "Locked", ru: "Закрыто", uz: "Yopiq" },
  apply: { en: "Apply", ru: "Применить", uz: "Qo'llash" },
  unlockAt: { en: "Unlocks at rating", ru: "Откроется при рейтинге", uz: "Reytingda ochiladi" },
  notEnough: { en: "Not enough coins", ru: "Недостаточно монет", uz: "Tangalar yetarli emas" },
  purchased: { en: "Purchased!", ru: "Куплено!", uz: "Sotib olindi!" },
  applied: { en: "Applied", ru: "Применено", uz: "Qo'llandi" },
  subscription: { en: "Subscription", ru: "Подписка", uz: "Obuna" },
  monthly: { en: "Monthly", ru: "Ежемесячно", uz: "Oylik" },
  yearly: { en: "Yearly", ru: "Ежегодно", uz: "Yillik" },
  save: { en: "Save 40%", ru: "Экономия 40%", uz: "40% tejash" },
  continue: { en: "Continue", ru: "Продолжить", uz: "Davom etish" },
  restore: { en: "Restore purchases", ru: "Восстановить покупки", uz: "Xaridlarni tiklash" },
  b1: { en: "150 coins every day", ru: "150 монет каждый день", uz: "Har kuni 150 tanga" },
  b2: { en: "No ads between games", ru: "Без рекламы между играми", uz: "O'yinlar orasida reklama yo'q" },
  b3: { en: "Exclusive monthly card skin", ru: "Эксклюзивная рубашка каждый месяц", uz: "Har oy eksklyuziv karta dizayni" },
  b4: { en: "Gold name badge", ru: "Золотой значок у имени", uz: "Oltin nishon" },
  gamesPlayed: { en: "Games played", ru: "Сыграно игр", uz: "O'ynalgan o'yinlar" },
  wins: { en: "Wins", ru: "Победы", uz: "G'alabalar" },
  winRate: { en: "Win rate", ru: "Процент побед", uz: "G'alaba foizi" },
  rating: { en: "Rating", ru: "Рейтинг", uz: "Reyting" },
  account: { en: "Account", ru: "Аккаунт", uz: "Hisob" },
  linkGoogle: { en: "Link Google account", ru: "Привязать Google", uz: "Google hisobini ulash" },
  signOut: { en: "Sign out", ru: "Выйти", uz: "Chiqish" },
  preferences: { en: "Preferences", ru: "Настройки", uz: "Sozlamalar" },
  language: { en: "Language", ru: "Язык", uz: "Til" },
  sound: { en: "Sound", ru: "Звук", uz: "Ovoz" },
  animSpeed: { en: "Animation speed", ru: "Скорость анимации", uz: "Animatsiya tezligi" },
  notifications: { en: "Notifications", ru: "Уведомления", uz: "Bildirishnomalar" },
  lightTheme: { en: "Light theme", ru: "Светлая тема", uz: "Yorug' mavzu" },
  about: { en: "About & Rules", ru: "О игре и правила", uz: "O'yin haqida va qoidalar" },
  version: { en: "Version", ru: "Версия", uz: "Versiya" },
  slow: { en: "Slow", ru: "Медленно", uz: "Sekin" },
  normal: { en: "Normal", ru: "Обычно", uz: "Oddiy" },
  fast: { en: "Fast", ru: "Быстро", uz: "Tez" },
  editName: { en: "Edit name", ru: "Изменить имя", uz: "Ismni o'zgartirish" },
  done: { en: "Done", ru: "Готово", uz: "Tayyor" },
  searching: { en: "Finding opponents…", ru: "Ищем соперников…", uz: "Raqiblar qidirilmoqda…" },
  invalidCode: { en: "Enter all 6 characters", ru: "Введите все 6 символов", uz: "6 ta belgini kiriting" },
  copied: { en: "Code copied", ru: "Код скопирован", uz: "Kod nusxalandi" },
  support: { en: "Support", ru: "Поддержка", uz: "Yordam" },
} as const;

export type Key = keyof typeof dict;

type State = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: Key) => string;
  coins: number;
  setCoins: (fn: (c: number) => number) => void;
  light: boolean;
  setLight: (b: boolean) => void;
  name: string;
  setName: (s: string) => void;
};

const Ctx = createContext<State | null>(null);

export function KozirProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [coins, setCoinsRaw] = useState(1250);
  const [light, setLight] = useState(false);
  const [name, setName] = useState("Ahror");

  useEffect(() => {
    const l = localStorage.getItem("kozir-lang") as Lang | null;
    if (l) setLang(l);
    if (localStorage.getItem("kozir-light") === "1") setLight(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("kozir-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);
  useEffect(() => {
    localStorage.setItem("kozir-light", light ? "1" : "0");
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  return (
    <Ctx.Provider
      value={{
        lang,
        setLang,
        t: (k) => dict[k][lang],
        coins,
        setCoins: (fn) => setCoinsRaw(fn),
        light,
        setLight,
        name,
        setName,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useKozir() {
  const c = useContext(Ctx);
  if (!c) throw new Error("KozirProvider missing");
  return c;
}

export const LANGS: { code: Lang; native: string; sub: string }[] = [
  { code: "uz", native: "O'zbekcha", sub: "Uzbek" },
  { code: "ru", native: "Русский", sub: "Russian" },
  { code: "en", native: "English", sub: "English" },
];

/** Whether a purchase is affordable; returns new balance or null. */
export function tryPurchase(balance: number, price: number): number | null {
  return balance >= price ? balance - price : null;
}
