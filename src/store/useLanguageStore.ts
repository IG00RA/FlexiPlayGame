import { create } from 'zustand';

interface State {
  query: string;
  setQuery: (query: string) => void;
  locale: string;
  setLocale: (locale: string) => void;
}

const useLanguageStore = create<State>(set => ({
  query: '',
  setQuery: query => set({ query }),
  locale: '',
  setLocale: locale => set({ locale }),
}));

export default useLanguageStore;
