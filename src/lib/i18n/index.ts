export { ar } from "./ar";
export { en } from "./en";
export { he } from "./he";
export { getLocale, LANGUAGES } from "./locales";
export {
  getApiErrorMessage,
  rejectMessage,
  translateFromState,
} from "./fromState";
export {
  createTranslator,
  translate,
  translatePlural,
  type Translator,
} from "./translate";
export type {
  Dictionary,
  PluralKey,
  TranslationKey,
  TranslationVars,
} from "./types";
export { useLocale, useT } from "./useT";
