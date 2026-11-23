import { authFetchJson } from '../../utils/apiAuthHelpers.js';
import { QUIZ_API_BASE } from '../quiz/quizApiBase.js';
import {
  CONCERN_NAMES, ConcernKey, saveSkinProfile, setSkinProfile,
  skinConcerns, skinKey, TYPE_NAMES, TypeKey,
} from '../quiz/skinQuiz.js';

type Named = { id: number; name: string };

export async function syncSkinProfile(skinTypes: Named[], purposes: Named[]) {
  try {
    const data = await authFetchJson(QUIZ_API_BASE + 'my_skin_type/');
    if (data.skin_type) {
      const key = (Object.keys(TYPE_NAMES) as TypeKey[]).find((k) => TYPE_NAMES[k] === data.skin_type.name);
      const concerns = (data.concerns as number[])
        .map((id) => purposes.find((p) => p.id === id)?.name)
        .map((name) => (Object.keys(CONCERN_NAMES) as ConcernKey[]).find((k) => CONCERN_NAMES[k] === name))
        .filter(Boolean) as ConcernKey[];
      if (key) setSkinProfile(key, concerns);
    } else if (skinKey.value) {
      const id = skinTypes.find((s) => s.name === TYPE_NAMES[skinKey.value!])?.id;
      const concernIds = skinConcerns.value
        .map((k) => purposes.find((p) => p.name === CONCERN_NAMES[k])?.id)
        .filter(Boolean) as number[];
      if (id) await saveSkinProfile(skinKey.value, skinConcerns.value, id, concernIds);
    }
  } catch { /* не залогинен */ }
}