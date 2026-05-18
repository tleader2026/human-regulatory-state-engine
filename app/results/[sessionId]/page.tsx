import Link from "next/link";
import { notFound } from "next/navigation";
import { DatabaseUnavailable } from "@/components/DatabaseUnavailable";
import { ScoreBar } from "@/components/ScoreBar";
import { databaseUnavailableMessage } from "@/lib/databaseStatus";
import { prisma } from "@/lib/prisma";
import { calculateSessionScores, rankDiagnosticTests } from "@/lib/scoring";
import type { DiagnosticRecommendation, RankedScore } from "@/lib/types";
import type { Prisma } from "@prisma/client";

type ResultDomain = Prisma.FunctionalDomainGetPayload<object>;
type ResultSession = Prisma.IntakeSessionGetPayload<{
  include: { patient: true };
}>;

export default async function ResultsPage({ params }: { params: { sessionId: string } }) {
  let session: ResultSession | null;

  try {
    session = await prisma.intakeSession.findUnique({
      where: { id: params.sessionId },
      include: { patient: true }
    });
  } catch (error) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-10">
        <DatabaseUnavailable message={databaseUnavailableMessage(error)} />
      </main>
    );
  }
  if (!session) notFound();

  const result = await calculateSessionScores(session.id);
  const diagnosticRecommendations = await rankDiagnosticTests(result);
  const domainColors = await prisma.functionalDomain.findMany();
  const colorByName = new Map(domainColors.map((domain: ResultDomain) => [domain.name, domain.color]));
  const topPhenotype = result.phenotypes[0];
  const phenotype = topPhenotype
    ? await prisma.phenotype.findUnique({ where: { name: topPhenotype.label }, include: { pathway: true } })
    : null;

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-clinical">Results</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">{session.patient.name}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            These are regulatory-state phenotype candidates. They are not diagnoses and do not confirm cellular pathology.
          </p>
        </div>
        <Link href="/intake" className="rounded-md border border-line bg-white px-4 py-2 text-sm font-medium text-ink">New intake</Link>
      </div>

      <section className="mb-6 rounded-lg border border-line bg-white p-5 shadow-soft">
        <div className="mb-4">
          <h2 className="font-semibold text-ink">Highest-yield measurements</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-muted">
            These diagnostics are ranked by expected value for narrowing uncertainty between competing hypothesis layers.
            They are not diagnosis instructions and should be interpreted with a qualified clinician.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {diagnosticRecommendations.slice(0, 6).map((item: DiagnosticRecommendation) => (
            <article key={item.id} className="rounded-lg border border-line bg-paper p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-clinical">{item.category}</p>
                  <h3 className="mt-1 font-semibold text-ink">{item.name}</h3>
                </div>
                <div className="text-right text-sm font-semibold text-ink">{item.confidence}%</div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-clinical" style={{ width: `${item.confidence}%` }} />
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{item.mechanisticRelevance}</p>
              <dl className="mt-3 grid gap-2 text-xs text-muted md:grid-cols-2">
                <div><dt className="font-medium text-ink">Access</dt><dd>{item.accessibility}</dd></div>
                <div><dt className="font-medium text-ink">Invasiveness</dt><dd>{item.invasiveness}</dd></div>
                <div><dt className="font-medium text-ink">Specificity</dt><dd>{item.specificity}</dd></div>
                <div><dt className="font-medium text-ink">Sensitivity</dt><dd>{item.sensitivity}</dd></div>
              </dl>
              <div className="mt-3 rounded-md border border-line bg-white p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Why this measurement?</p>
                <ul className="mt-2 space-y-1 text-sm leading-6 text-muted">
                  {item.reasons.map((reason: string) => <li key={reason}>{reason}</li>)}
                </ul>
              </div>
              <p className="mt-3 text-xs leading-5 text-muted">
                Helps distinguish: {item.discriminates.join("; ")}. Caveat: {item.interpretationCaution}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-lg border border-line bg-white p-5 shadow-soft">
        <h2 className="font-semibold text-ink">Suggested next pathway</h2>
        <p className="mt-2 text-lg font-medium text-clinical">{phenotype?.pathway?.name ?? "Mixed-system review pathway"}</p>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-muted">{phenotype?.pathway?.description ?? "Review strongest domains and repeat intake after changing one stabilizing variable."}</p>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-muted">{phenotype?.pathway?.steps}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section>
          <h2 className="mb-3 font-semibold text-ink">Top functional domains</h2>
          <div className="grid gap-3">
            {result.domains.slice(0, 6).map((score: RankedScore) => (
              <ScoreBar key={score.label} {...score} color={colorByName.get(score.label)} />
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-semibold text-ink">Phenotype candidates</h2>
          <div className="grid gap-3">
            {result.phenotypes.slice(0, 7).map((score: RankedScore) => (
              <ScoreBar key={score.label} {...score} color="#0f766e" />
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-semibold text-ink">Candidate mechanism hypothesis layer</h2>
          <div className="grid gap-3">
            {result.mechanisms.slice(0, 8).map((score: RankedScore) => (
              <ScoreBar key={score.label} {...score} color="#7c3aed" />
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-semibold text-ink">Trigger and intervention signals</h2>
          <div className="grid gap-3">
            {[...result.triggers.slice(0, 4), ...result.interventions.slice(0, 4)].map((score: RankedScore) => (
              <ScoreBar key={score.label} {...score} color="#b45309" />
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-line bg-white p-5">
        <h2 className="font-semibold text-ink">Clinical language guardrail</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Candidate mechanisms are shown because they make the scoring explainable. They are not diagnostic findings,
          and they should be interpreted as hypothesis-layer signals for discussion with a qualified clinician.
        </p>
      </section>
    </main>
  );
}
