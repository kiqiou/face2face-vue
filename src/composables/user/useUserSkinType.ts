import { authFetchJson } from '../../utils/apiAuthHelpers.js';
import { QUIZ_API_BASE } from '../quiz/quizApiBase.js';
import { saveSkinProfile, setSkinKey, skinKey, TYPE_NAMES, TypeKey } from '../quiz/skinQuiz.js';

export async function syncSkinProfile(skinTypes: { id: number; name: string }[]) {
  try {
    const data = await authFetchJson(QUIZ_API_BASE + 'my_skin_type/');
    if (data.skin_type) {
      const key = (Object.keys(TYPE_NAMES) as TypeKey[]).find(
        (k) => TYPE_NAMES[k] === data.skin_type.name
      );
      if (key) setSkinKey(key);
    } else if (skinKey.value) {
      const id = skinTypes.find((s) => s.name === TYPE_NAMES[skinKey.value!])?.id;
      if (id) await saveSkinProfile(skinKey.value, id);
    }
  } catch { /* не залогинен */ }
}