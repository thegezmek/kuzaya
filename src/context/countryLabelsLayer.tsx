import { createContext, useContext } from 'react';

export const CountryLabelsLayerContext = createContext<HTMLDivElement | null>(null);

export function useCountryLabelsLayer() {
  return useContext(CountryLabelsLayerContext);
}
