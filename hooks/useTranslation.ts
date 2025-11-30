import { fr } from '../translations/fr';

// For now, we only support French
// In the future, you can add more languages here
export const useTranslation = () => {
  return { t: fr };
};

export default useTranslation;

