export interface SoilErosionView {
  id: string;
  value: string;
  statement: string;
  scope: string;
  source: string;
  url: string;
  retrieved: string;
}

export interface StatCitation {
  statement?: string;
  source: string;
  url: string;
  retrieved: string;
}

export interface ScaleOfLossView {
  id: string;
  footballPitch: StatCitation & {
    intervalSeconds: number;
    statement: string;
  };
  degradedLand: StatCitation & {
    valueMin: number;
    valueMax: number;
    statement: string;
  };
}

export interface NutritionDeficiency {
  id: string;
  label: string;
  value: number;
  unit: string;
  population: string;
}

export interface HumanStakesView {
  id: string;
  affectedPeople: StatCitation & {
    value: number;
    unit: string;
    statement: string;
  };
  nutritionKenya: StatCitation & {
    title: string;
    contextNote: string;
    deficiencies: NutritionDeficiency[];
  };
}

export interface FertilizerPoint {
  year: number;
  value: number;
}

export type FertilizerCountryId = 'kenya' | 'rwanda' | 'ethiopia' | 'tanzania' | 'uganda';

export interface FertilizerView {
  generatedAt: string;
  indicator: string;
  label: string;
  unit: string;
  source: string;
  url: string;
  chartFromYear: number;
  series: Record<FertilizerCountryId, FertilizerPoint[]>;
}
