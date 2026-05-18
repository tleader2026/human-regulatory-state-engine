-- CreateTable
CREATE TABLE "DiagnosticTest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" TEXT NOT NULL,
    "invasiveness" TEXT NOT NULL,
    "accessibility" TEXT NOT NULL,
    "specificity" TEXT NOT NULL,
    "sensitivity" TEXT NOT NULL,
    "mechanisticRelevance" TEXT NOT NULL,
    "temporalRelevance" TEXT NOT NULL,
    "falsePositiveContexts" TEXT NOT NULL,
    "interpretationCaution" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiagnosticTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Biomarker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sampleType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "diagnosticTestId" TEXT,

    CONSTRAINT "Biomarker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObservableFinding" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "findingType" TEXT NOT NULL,
    "polarity" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ObservableFinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemporalWindow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TemporalWindow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosticEvidenceRule" (
    "id" TEXT NOT NULL,
    "diagnosticTestId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "direction" TEXT NOT NULL DEFAULT 'supports',
    "evidenceTier" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "discriminates" TEXT NOT NULL,
    "functionalDomainId" TEXT,
    "phenotypeId" TEXT,
    "mechanismHypothesisId" TEXT,
    "triggerId" TEXT,
    "interventionId" TEXT,
    "observableFindingId" TEXT,
    "temporalWindowId" TEXT,

    CONSTRAINT "DiagnosticEvidenceRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeightedEdge" (
    "id" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceLabel" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetLabel" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "explanation" TEXT NOT NULL,

    CONSTRAINT "WeightedEdge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiagnosticTest_name_key" ON "DiagnosticTest"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Biomarker_name_key" ON "Biomarker"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ObservableFinding_name_key" ON "ObservableFinding"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TemporalWindow_name_key" ON "TemporalWindow"("name");

-- AddForeignKey
ALTER TABLE "Biomarker" ADD CONSTRAINT "Biomarker_diagnosticTestId_fkey" FOREIGN KEY ("diagnosticTestId") REFERENCES "DiagnosticTest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticEvidenceRule" ADD CONSTRAINT "DiagnosticEvidenceRule_diagnosticTestId_fkey" FOREIGN KEY ("diagnosticTestId") REFERENCES "DiagnosticTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticEvidenceRule" ADD CONSTRAINT "DiagnosticEvidenceRule_functionalDomainId_fkey" FOREIGN KEY ("functionalDomainId") REFERENCES "FunctionalDomain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticEvidenceRule" ADD CONSTRAINT "DiagnosticEvidenceRule_phenotypeId_fkey" FOREIGN KEY ("phenotypeId") REFERENCES "Phenotype"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticEvidenceRule" ADD CONSTRAINT "DiagnosticEvidenceRule_mechanismHypothesisId_fkey" FOREIGN KEY ("mechanismHypothesisId") REFERENCES "MechanismHypothesis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticEvidenceRule" ADD CONSTRAINT "DiagnosticEvidenceRule_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "Trigger"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticEvidenceRule" ADD CONSTRAINT "DiagnosticEvidenceRule_interventionId_fkey" FOREIGN KEY ("interventionId") REFERENCES "Intervention"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticEvidenceRule" ADD CONSTRAINT "DiagnosticEvidenceRule_observableFindingId_fkey" FOREIGN KEY ("observableFindingId") REFERENCES "ObservableFinding"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticEvidenceRule" ADD CONSTRAINT "DiagnosticEvidenceRule_temporalWindowId_fkey" FOREIGN KEY ("temporalWindowId") REFERENCES "TemporalWindow"("id") ON DELETE SET NULL ON UPDATE CASCADE;
