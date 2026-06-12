import type { HumanStakesView } from './types';

export const humanStakesView: HumanStakesView = {
  id: 'beat3.human_stakes',
  affectedPeople: {
    value: 485,
    unit: 'million',
    statement: 'people are affected by land degradation across Africa.',
    source: 'UNCCD, Global Land Outlook (2nd edition)',
    url: 'https://www.unccd.int/resources/global-land-outlook/glo2',
    retrieved: '2026-06-11',
  },
  nutritionKenya: {
    title: 'Nutrition in Kenya',
    contextNote:
      'Shown as context, not as a direct link to soil degradation.',
    deficiencies: [
      {
        id: 'stunting',
        label: 'Children stunted',
        value: 26,
        unit: '%',
        population: 'under 5',
      },
      {
        id: 'anaemia',
        label: 'Women with anaemia',
        value: 23,
        unit: '%',
        population: 'reproductive age',
      },
      {
        id: 'vitamin_a',
        label: 'Vitamin A deficiency',
        value: 20,
        unit: '%',
        population: 'children under 5',
      },
      {
        id: 'zinc',
        label: 'Zinc deficiency',
        value: 31,
        unit: '%',
        population: 'children under 5',
      },
    ],
    source: 'Global Nutrition Report; WHO VMNIS',
    url: 'https://globalnutritionreport.org/resources/nutrition-profiles/africa/eastern-africa/kenya/',
    retrieved: '2026-06-11',
  },
};
