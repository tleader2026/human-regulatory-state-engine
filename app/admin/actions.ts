"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type EditableModel =
  | "functionalDomain"
  | "symptom"
  | "trigger"
  | "question"
  | "answerOption"
  | "phenotype"
  | "carePathway"
  | "scoreRule";

const editableFields: Record<EditableModel, string[]> = {
  functionalDomain: ["name", "description", "color"],
  symptom: ["name", "description"],
  trigger: ["name", "className", "description"],
  question: ["prompt", "category", "isActive"],
  answerOption: ["label", "value"],
  phenotype: ["name", "description"],
  carePathway: ["name", "description", "steps"],
  scoreRule: ["weight", "explanation"]
};

export async function updateOntologyItem(formData: FormData) {
  const model = String(formData.get("model")) as EditableModel;
  const id = String(formData.get("id"));
  const field = String(formData.get("field"));
  const rawValue = String(formData.get("value") ?? "");

  if (!editableFields[model]?.includes(field)) {
    throw new Error("Unsupported ontology edit");
  }

  let value: string | number | boolean | null = rawValue;
  if (field === "weight") value = Number(rawValue);
  if (field === "isActive") value = rawValue === "true";
  if (rawValue === "" && ["description"].includes(field)) value = null;

  switch (model) {
    case "functionalDomain": {
      const data =
        field === "name" ? { name: String(value) } :
        field === "description" ? { description: String(value ?? "") } :
        { color: String(value) };
      await prisma.functionalDomain.update({ where: { id }, data });
      break;
    }
    case "symptom": {
      const data =
        field === "name" ? { name: String(value) } :
        { description: value === null ? null : String(value) };
      await prisma.symptom.update({ where: { id }, data });
      break;
    }
    case "trigger": {
      const data =
        field === "name" ? { name: String(value) } :
        field === "className" ? { className: String(value) } :
        { description: value === null ? null : String(value) };
      await prisma.trigger.update({ where: { id }, data });
      break;
    }
    case "question": {
      const data =
        field === "prompt" ? { prompt: String(value) } :
        field === "category" ? { category: String(value) } :
        { isActive: Boolean(value) };
      await prisma.question.update({ where: { id }, data });
      break;
    }
    case "answerOption": {
      const data = field === "label" ? { label: String(value) } : { value: String(value) };
      await prisma.answerOption.update({ where: { id }, data });
      break;
    }
    case "phenotype": {
      const data = field === "name" ? { name: String(value) } : { description: String(value) };
      await prisma.phenotype.update({ where: { id }, data });
      break;
    }
    case "carePathway": {
      const data =
        field === "name" ? { name: String(value) } :
        field === "description" ? { description: String(value) } :
        { steps: String(value) };
      await prisma.carePathway.update({ where: { id }, data });
      break;
    }
    case "scoreRule": {
      const data = field === "weight" ? { weight: Number(value) } : { explanation: String(value) };
      await prisma.scoreRule.update({ where: { id }, data });
      break;
    }
  }

  revalidatePath("/admin");
}
