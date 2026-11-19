import { ref } from 'vue';
import { QUIZ_API_BASE } from './quizApiBase.js';
import { authFetch } from '../../utils/authFetch.js';

export type TypeKey = 'oily' | 'dry' | 'combo' | 'normal' | 'sensitive';

// названия должны совпадать с SkinType в базе
export const TYPE_NAMES: Record<TypeKey, string> = {
  oily: 'Жирная', dry: 'Сухая', combo: 'Комбинированная',
  normal: 'Нормальная', sensitive: 'Чувствительная',
};

export const TYPE_INFO: Record<TypeKey, { text: string; tips: string[] }> = {
  oily: {
    text: 'Кожа вырабатывает много себума, блеск появляется по всему лицу, поры заметны.',
    tips: ['Мягкое очищение гелем или пенкой', 'Лёгкие гелевые и флюидные текстуры', 'Тоники и сыворотки с ниацинамидом', 'SPF в лёгкой текстуре'],
  },
  dry: {
    text: 'Коже не хватает липидов и влаги: бывает стянутость и шелушение.',
    tips: ['Нежное очищение без пересушивания', 'Кремы с церамидами и маслами', 'Сыворотки с гиалуроновой кислотой', 'Питательные маски'],
  },
  combo: {
    text: 'Т-зона (лоб, нос, подбородок) жирнее, а щёки нормальные или сухие.',
    tips: ['Баланс: лёгкий уход для Т-зоны, более питательный для щёк', 'Тоники для выравнивания pH', 'Гелевые кремы'],
  },
  normal: {
    text: 'Кожа сбалансирована: нет выраженной жирности или сухости.',
    tips: ['Базовый уход: очищение, увлажнение, SPF', 'Антиоксидантные сыворотки', 'Профилактический антивозрастной уход'],
  },
  sensitive: {
    text: 'Кожа быстро реагирует на средства и внешние факторы: покраснение, жжение, зуд.',
    tips: ['Короткий состав без отдушек', 'Успокаивающие компоненты: пантенол, центелла, бисаболол', 'Новые средства вводить по одному', 'Минеральный SPF'],
  },
};

type Q = { text: string; options: { label: string; score: Partial<Record<TypeKey, number>> }[] };

export const QUESTIONS: Q[] = [
  { text: 'Что вы чувствуете через час после умывания, если не наносить крем?', options: [
    { label: 'Стянутость, хочется нанести крем', score: { dry: 2 } },
    { label: 'Комфорт, ничего не беспокоит', score: { normal: 2 } },
    { label: 'Лоб и нос блестят, щёки в порядке', score: { combo: 2 } },
    { label: 'Блестит всё лицо', score: { oily: 2 } },
    { label: 'Краснеет, пощипывает', score: { sensitive: 2, dry: 1 } },
  ]},
  { text: 'Как выглядит кожа к середине дня?', options: [
    { label: 'Блестит по всему лицу', score: { oily: 2 } },
    { label: 'Блестит только Т-зона', score: { combo: 2 } },
    { label: 'Матовая, без блеска', score: { normal: 1, dry: 1 } },
  ]},
  { text: 'Что с порами?', options: [
    { label: 'Заметны по всему лицу', score: { oily: 2 } },
    { label: 'Заметны на носу и лбу', score: { combo: 2 } },
    { label: 'Почти не видны', score: { normal: 1, dry: 1 } },
  ]},
  { text: 'Как кожа реагирует на новые средства или погоду?', options: [
    { label: 'Часто краснеет, чешется, щиплет', score: { sensitive: 3 } },
    { label: 'Иногда бывает реакция', score: { sensitive: 1 } },
    { label: 'Обычно никак', score: { normal: 1 } },
  ]},
  { text: 'Бывает ли шелушение?', options: [
    { label: 'Часто', score: { dry: 2 } },
    { label: 'Иногда, зимой', score: { dry: 1, combo: 1 } },
    { label: 'Почти никогда', score: { oily: 1, normal: 1 } },
  ]},
];

export function calcResult(answers: number[]): TypeKey {
  const t: Record<TypeKey, number> = { oily: 0, dry: 0, combo: 0, normal: 0, sensitive: 0 };
  answers.forEach((a, qi) => {
    const s = QUESTIONS[qi].options[a].score;
    (Object.keys(s) as TypeKey[]).forEach((k) => (t[k] += s[k] ?? 0));
  });
  if (t.sensitive >= 3) return 'sensitive';
  const order: TypeKey[] = ['combo', 'normal', 'dry', 'oily']; // порядок при равенстве
  return order.reduce((best, k) => (t[k] > t[best] ? k : best), order[0]);
}

const LS = 'skinQuizType';
export const skinKey = ref<TypeKey | null>((localStorage.getItem(LS) as TypeKey) || null);

export function setSkinKey(key: TypeKey) {
  skinKey.value = key;
  localStorage.setItem(LS, key);
}

export function clearSkinProfile() {
  skinKey.value = null;
  localStorage.removeItem(LS);
}

export async function saveSkinProfile(key: TypeKey, id?: number) {
  setSkinKey(key);
  if (!id) return;
  try {
    await authFetch(QUIZ_API_BASE + 'my_skin_type/', {   // подстрой под свою сигнатуру authFetch
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skin_type: id }),
    });
  } catch { /* гость: остаётся только localStorage */ }
}