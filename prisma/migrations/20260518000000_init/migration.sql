-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntakeSession" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntakeSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "helpText" TEXT,
    "sortOrder" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "parentCode" TEXT,
    "parentValue" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnswerOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "AnswerOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientAnswer" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerOptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FunctionalDomain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "FunctionalDomain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegionOrSystem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "functionalDomainId" TEXT NOT NULL,

    CONSTRAINT "RegionOrSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CellPopulation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "CellPopulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MechanismHypothesis" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "functionalDomainId" TEXT NOT NULL,
    "cellPopulationId" TEXT,

    CONSTRAINT "MechanismHypothesis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Symptom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Symptom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trigger" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimingPattern" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "TimingPattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phenotype" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pathwayId" TEXT,

    CONSTRAINT "Phenotype_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Intervention" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Intervention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterventionResponse" (
    "id" TEXT NOT NULL,
    "interventionId" TEXT NOT NULL,
    "responseLabel" TEXT NOT NULL,
    "interpretation" TEXT NOT NULL,

    CONSTRAINT "InterventionResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutcomeMeasure" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scale" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "OutcomeMeasure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarePathway" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "steps" TEXT NOT NULL,

    CONSTRAINT "CarePathway_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoreRule" (
    "id" TEXT NOT NULL,
    "answerOptionId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "explanation" TEXT NOT NULL,
    "functionalDomainId" TEXT,
    "phenotypeId" TEXT,
    "mechanismHypothesisId" TEXT,
    "symptomId" TEXT,
    "triggerId" TEXT,
    "timingPatternId" TEXT,
    "interventionId" TEXT,

    CONSTRAINT "ScoreRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionScore" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "scoreType" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "explanation" TEXT NOT NULL,
    "functionalDomainId" TEXT,
    "phenotypeId" TEXT,
    "mechanismHypothesisId" TEXT,

    CONSTRAINT "SessionScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_code_key" ON "Question"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PatientAnswer_sessionId_questionId_key" ON "PatientAnswer"("sessionId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "FunctionalDomain_name_key" ON "FunctionalDomain"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FunctionalDomain_slug_key" ON "FunctionalDomain"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CellPopulation_name_key" ON "CellPopulation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Symptom_name_key" ON "Symptom"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Trigger_name_key" ON "Trigger"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TimingPattern_name_key" ON "TimingPattern"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Phenotype_name_key" ON "Phenotype"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Intervention_name_key" ON "Intervention"("name");

-- CreateIndex
CREATE UNIQUE INDEX "OutcomeMeasure_name_key" ON "OutcomeMeasure"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CarePathway_name_key" ON "CarePathway"("name");

-- AddForeignKey
ALTER TABLE "IntakeSession" ADD CONSTRAINT "IntakeSession_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerOption" ADD CONSTRAINT "AnswerOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAnswer" ADD CONSTRAINT "PatientAnswer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "IntakeSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAnswer" ADD CONSTRAINT "PatientAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAnswer" ADD CONSTRAINT "PatientAnswer_answerOptionId_fkey" FOREIGN KEY ("answerOptionId") REFERENCES "AnswerOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionOrSystem" ADD CONSTRAINT "RegionOrSystem_functionalDomainId_fkey" FOREIGN KEY ("functionalDomainId") REFERENCES "FunctionalDomain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MechanismHypothesis" ADD CONSTRAINT "MechanismHypothesis_functionalDomainId_fkey" FOREIGN KEY ("functionalDomainId") REFERENCES "FunctionalDomain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MechanismHypothesis" ADD CONSTRAINT "MechanismHypothesis_cellPopulationId_fkey" FOREIGN KEY ("cellPopulationId") REFERENCES "CellPopulation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phenotype" ADD CONSTRAINT "Phenotype_pathwayId_fkey" FOREIGN KEY ("pathwayId") REFERENCES "CarePathway"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterventionResponse" ADD CONSTRAINT "InterventionResponse_interventionId_fkey" FOREIGN KEY ("interventionId") REFERENCES "Intervention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreRule" ADD CONSTRAINT "ScoreRule_answerOptionId_fkey" FOREIGN KEY ("answerOptionId") REFERENCES "AnswerOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreRule" ADD CONSTRAINT "ScoreRule_functionalDomainId_fkey" FOREIGN KEY ("functionalDomainId") REFERENCES "FunctionalDomain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreRule" ADD CONSTRAINT "ScoreRule_phenotypeId_fkey" FOREIGN KEY ("phenotypeId") REFERENCES "Phenotype"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreRule" ADD CONSTRAINT "ScoreRule_mechanismHypothesisId_fkey" FOREIGN KEY ("mechanismHypothesisId") REFERENCES "MechanismHypothesis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreRule" ADD CONSTRAINT "ScoreRule_symptomId_fkey" FOREIGN KEY ("symptomId") REFERENCES "Symptom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreRule" ADD CONSTRAINT "ScoreRule_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "Trigger"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreRule" ADD CONSTRAINT "ScoreRule_timingPatternId_fkey" FOREIGN KEY ("timingPatternId") REFERENCES "TimingPattern"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreRule" ADD CONSTRAINT "ScoreRule_interventionId_fkey" FOREIGN KEY ("interventionId") REFERENCES "Intervention"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionScore" ADD CONSTRAINT "SessionScore_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "IntakeSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionScore" ADD CONSTRAINT "SessionScore_functionalDomainId_fkey" FOREIGN KEY ("functionalDomainId") REFERENCES "FunctionalDomain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionScore" ADD CONSTRAINT "SessionScore_phenotypeId_fkey" FOREIGN KEY ("phenotypeId") REFERENCES "Phenotype"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionScore" ADD CONSTRAINT "SessionScore_mechanismHypothesisId_fkey" FOREIGN KEY ("mechanismHypothesisId") REFERENCES "MechanismHypothesis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

