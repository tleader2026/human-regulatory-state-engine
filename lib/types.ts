export type ScoreTarget = "domain" | "phenotype" | "mechanism" | "trigger" | "intervention";

export type RankedScore = {
  id?: string;
  label: string;
  score: number;
  confidence: number;
  explanation: string;
};

export type DiagnosticRecommendation = {
  id: string;
  name: string;
  category: string;
  score: number;
  confidence: number;
  cost: string;
  invasiveness: string;
  accessibility: string;
  specificity: string;
  sensitivity: string;
  mechanisticRelevance: string;
  temporalRelevance: string;
  falsePositiveContexts: string;
  interpretationCaution: string;
  reasons: string[];
  discriminates: string[];
  temporalWindows: string[];
};
