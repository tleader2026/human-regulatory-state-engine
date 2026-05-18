import { prisma } from "@/lib/prisma";
import type { DiagnosticRecommendation, RankedScore } from "@/lib/types";

type SessionScoreResult = {
  domains: RankedScore[];
  phenotypes: RankedScore[];
  mechanisms: RankedScore[];
  triggers: RankedScore[];
  interventions: RankedScore[];
};

function addScore(map: Map<string, RankedScore>, key: string, weight: number, reason: string, id?: string) {
  const current = map.get(key) ?? { id, label: key, score: 0, confidence: 0, explanation: "" };
  current.score += weight;
  current.explanation = current.explanation ? `${current.explanation} ${reason}` : reason;
  map.set(key, current);
}

function finalize(map: Map<string, RankedScore>): RankedScore[] {
  const values = [...map.values()].sort((a, b) => b.score - a.score);
  const max = values[0]?.score || 1;
  return values.map((item: RankedScore) => ({
    ...item,
    score: Number(item.score.toFixed(1)),
    confidence: Number(Math.min(100, Math.max(8, (item.score / max) * 92)).toFixed(0))
  }));
}

export async function calculateSessionScores(sessionId: string) {
  const answers = await prisma.patientAnswer.findMany({
    where: { sessionId },
    include: {
      answerOption: {
        include: {
          scoreRules: {
            include: {
              functionalDomain: true,
              phenotype: true,
              mechanismHypothesis: true,
              trigger: true,
              intervention: true
            }
          }
        }
      }
    }
  });

  const domains = new Map<string, RankedScore>();
  const phenotypes = new Map<string, RankedScore>();
  const mechanisms = new Map<string, RankedScore>();
  const triggers = new Map<string, RankedScore>();
  const interventions = new Map<string, RankedScore>();

  for (const answer of answers) {
    for (const rule of answer.answerOption.scoreRules) {
      if (rule.functionalDomain) addScore(domains, rule.functionalDomain.name, rule.weight, rule.explanation, rule.functionalDomain.id);
      if (rule.phenotype) addScore(phenotypes, rule.phenotype.name, rule.weight, rule.explanation, rule.phenotype.id);
      if (rule.mechanismHypothesis) addScore(mechanisms, rule.mechanismHypothesis.name, rule.weight, rule.explanation, rule.mechanismHypothesis.id);
      if (rule.trigger) addScore(triggers, rule.trigger.name, rule.weight, rule.explanation, rule.trigger.id);
      if (rule.intervention) addScore(interventions, rule.intervention.name, rule.weight, rule.explanation, rule.intervention.id);
    }
  }

  const result = {
    domains: finalize(domains),
    phenotypes: finalize(phenotypes),
    mechanisms: finalize(mechanisms),
    triggers: finalize(triggers),
    interventions: finalize(interventions)
  };

  await prisma.sessionScore.deleteMany({ where: { sessionId } });
  await prisma.sessionScore.createMany({
    data: [
      ...result.domains.map((score: RankedScore) => ({ sessionId, scoreType: "DOMAIN", label: score.label, score: score.score, confidence: score.confidence, explanation: score.explanation, functionalDomainId: score.id })),
      ...result.phenotypes.map((score: RankedScore) => ({ sessionId, scoreType: "PHENOTYPE", label: score.label, score: score.score, confidence: score.confidence, explanation: score.explanation, phenotypeId: score.id })),
      ...result.mechanisms.map((score: RankedScore) => ({ sessionId, scoreType: "MECHANISM", label: score.label, score: score.score, confidence: score.confidence, explanation: score.explanation, mechanismHypothesisId: score.id }))
    ]
  });

  await prisma.intakeSession.update({ where: { id: sessionId }, data: { status: "COMPLETE" } });

  return result;
}

function findMatch(scores: RankedScore[], label?: string | null) {
  if (!label) return undefined;
  return scores.find((score: RankedScore) => score.label === label);
}

function addUnique(items: string[], value: string) {
  if (!items.includes(value)) items.push(value);
}

export async function rankDiagnosticTests(result: SessionScoreResult): Promise<DiagnosticRecommendation[]> {
  const rules = await prisma.diagnosticEvidenceRule.findMany({
    include: {
      diagnosticTest: true,
      functionalDomain: true,
      phenotype: true,
      mechanismHypothesis: true,
      trigger: true,
      intervention: true,
      temporalWindow: true
    }
  });

  const recommendations = new Map<string, DiagnosticRecommendation>();

  for (const rule of rules) {
    const matches = [
      findMatch(result.domains, rule.functionalDomain?.name),
      findMatch(result.phenotypes, rule.phenotype?.name),
      findMatch(result.mechanisms, rule.mechanismHypothesis?.name),
      findMatch(result.triggers, rule.trigger?.name),
      findMatch(result.interventions, rule.intervention?.name)
    ].filter((score: RankedScore | undefined): score is RankedScore => Boolean(score));

    if (matches.length === 0) continue;

    const strongestMatch = matches.sort((a: RankedScore, b: RankedScore) => b.confidence - a.confidence)[0];
    const contribution = rule.weight * (strongestMatch.confidence / 100);
    const current =
      recommendations.get(rule.diagnosticTest.id) ??
      {
        id: rule.diagnosticTest.id,
        name: rule.diagnosticTest.name,
        category: rule.diagnosticTest.category,
        score: 0,
        confidence: 0,
        cost: rule.diagnosticTest.cost,
        invasiveness: rule.diagnosticTest.invasiveness,
        accessibility: rule.diagnosticTest.accessibility,
        specificity: rule.diagnosticTest.specificity,
        sensitivity: rule.diagnosticTest.sensitivity,
        mechanisticRelevance: rule.diagnosticTest.mechanisticRelevance,
        temporalRelevance: rule.diagnosticTest.temporalRelevance,
        falsePositiveContexts: rule.diagnosticTest.falsePositiveContexts,
        interpretationCaution: rule.diagnosticTest.interpretationCaution,
        reasons: [],
        discriminates: [],
        temporalWindows: []
      };

    current.score += contribution;
    addUnique(current.reasons, `${strongestMatch.label}: ${rule.explanation}`);
    addUnique(current.discriminates, rule.discriminates);
    if (rule.temporalWindow) addUnique(current.temporalWindows, `${rule.temporalWindow.name}: ${rule.temporalWindow.description}`);
    recommendations.set(rule.diagnosticTest.id, current);
  }

  const ranked = [...recommendations.values()].sort((a: DiagnosticRecommendation, b: DiagnosticRecommendation) => b.score - a.score);
  const max = ranked[0]?.score || 1;

  return ranked.map((item: DiagnosticRecommendation) => ({
    ...item,
    score: Number(item.score.toFixed(1)),
    confidence: Number(Math.min(100, Math.max(8, (item.score / max) * 92)).toFixed(0)),
    reasons: item.reasons.slice(0, 3),
    discriminates: item.discriminates.slice(0, 3),
    temporalWindows: item.temporalWindows.slice(0, 2)
  }));
}

export function confidenceLabel(value: number) {
  if (value >= 80) return "strong signal";
  if (value >= 55) return "moderate signal";
  return "early signal";
}
