import { PrismaClient } from "@prisma/client";
import type { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const domains = [
  { name: "Neurologic / Cognitive", slug: "neurologic-cognitive", color: "#2563eb", description: "Cognitive, sensory, neurovascular, and head-pressure regulatory-state signals." },
  { name: "Autonomic / POTS-like", slug: "autonomic-pots", color: "#0f766e", description: "Heart-rate, temperature, fluid-balance, postural, and stress-response instability signals." },
  { name: "Histamine / Mast-cell", slug: "histamine-mast-cell", color: "#b45309", description: "Food, pollen, skin, vascular, H1/H2, and mast-cell threshold signals." },
  { name: "Immune / Inflammatory", slug: "immune-inflammatory", color: "#7c3aed", description: "Post-viral persistence, inflammatory flare, cytokine, and surveillance signals." },
  { name: "Sleep / Circadian", slug: "sleep-circadian", color: "#334155", description: "Sleep timing, nighttime activation, glymphatic, and circadian drift signals." },
  { name: "Metabolic / Mitochondrial", slug: "metabolic-mitochondrial", color: "#be123c", description: "ATP, redox, exertion tolerance, nutrition, and recovery-capacity signals." }
];

const pathways = [
  { name: "Histamine stabilization pathway", description: "Track food/environment thresholds and H1/H2 response signals while reducing avoidable amplification.", steps: "Food and pollen log; clinician review of antihistamine response; sleep and gut-state tracking; re-challenge only with appropriate supervision." },
  { name: "Neuroimmune calming pathway", description: "Reduce amplification load while tracking cognition, head pressure, sleep dependency, and anti-inflammatory response.", steps: "Daily head-pressure/cognition ratings; sleep consistency; trigger audit; clinician-guided review of anti-inflammatory or antiviral response signals." },
  { name: "Autonomic conditioning pathway", description: "Stabilize fluid, thermal, postural, and exertion-state signals with gradual conditioning.", steps: "Hydration/electrolyte trial tracking; compression and heat-avoidance notes; recumbent conditioning progression; HR response log." },
  { name: "Sleep restoration pathway", description: "Treat sleep as a control-layer input and track downstream regulatory-state effects.", steps: "Fixed wake time; light/dark exposure; nighttime symptom log; clinician-guided review of sleep-supporting interventions." },
  { name: "Energy envelope pathway", description: "Map exertion response and recovery timing before increasing load.", steps: "Activity envelope; post-exertional symptom timing; nutrition and sunlight notes; gradual adaptation only when recovery is stable." },
  { name: "Mixed-system stabilization pathway", description: "Prioritize identifying the strongest destabilizers before layering interventions.", steps: "Rank triggers; change one variable at a time; weekly domain score review; focus on sleep, hydration, and pacing baselines." }
];

const phenotypes = [
  ["Histamine-dominant regulatory phenotype", "Prominent food, pollen, H1/H2, flushing, GI, or Pepcid-response signals.", "Histamine stabilization pathway"],
  ["Neuroimmune / head-pressure phenotype", "Head pressure, sensory gain, cognitive flattening, and neurovascular/neuroimmune signals.", "Neuroimmune calming pathway"],
  ["Autonomic instability phenotype", "Heart-rate, heat, postural, hydration, post-meal, and stress-crash signals.", "Autonomic conditioning pathway"],
  ["Sleep-collapse phenotype", "Insomnia, nighttime activation, circadian drift, and sleep-restoration dependency signals.", "Sleep restoration pathway"],
  ["Viral-reactivation-suspected phenotype", "Post-viral persistence with antiviral-response or immune-surveillance signals.", "Neuroimmune calming pathway"],
  ["Metabolic fatigue phenotype", "Exercise intolerance, ATP/redox stress, and post-exertional depletion signals.", "Energy envelope pathway"],
  ["Mixed-system unstable phenotype", "Broad multi-domain volatility with no single dominant regulatory layer yet.", "Mixed-system stabilization pathway"]
];

const regions: Record<string, string[]> = {
  "Neurologic / Cognitive": ["Frontal cortex", "Insula", "Thalamus", "Brainstem", "Hippocampus"],
  "Autonomic / POTS-like": ["Hypothalamus", "Brainstem", "Vagus pathways", "Sympathetic ganglia"],
  "Histamine / Mast-cell": ["Gut", "Skin", "Sinuses", "CNS-adjacent mast cells", "Vascular beds"],
  "Immune / Inflammatory": ["Innate immunity", "Adaptive immunity", "Neuroimmune interface"],
  "Sleep / Circadian": ["Suprachiasmatic nucleus", "Pineal axis", "Glymphatic system"],
  "Metabolic / Mitochondrial": ["ATP generation", "Lipid metabolism", "Redox balance"]
};

const mechanisms: Array<[string, string, string, string]> = [
  ["Microglia", "Neurologic / Cognitive", "Microglia", "Inflammatory amplification, synaptic pruning dysregulation, cytokine propagation."],
  ["Astrocytes", "Neurologic / Cognitive", "Astrocytes", "Glutamate recycling dysfunction, glymphatic impairment, neurovascular support instability."],
  ["Oligodendrocytes", "Neurologic / Cognitive", "Oligodendrocytes", "Myelin maintenance instability and conduction fatigue."],
  ["NG2 glia / OPCs", "Neurologic / Cognitive", "NG2 glia / OPCs", "Repair suppression and remyelination slowdown."],
  ["Pericytes", "Neurologic / Cognitive", "Pericytes", "BBB gating instability and capillary tone dysregulation."],
  ["Endothelial cells", "Neurologic / Cognitive", "Endothelial cells", "Nitric oxide imbalance and vascular coupling dysfunction."],
  ["Magnocellular neurosecretory cells", "Autonomic / POTS-like", "Magnocellular neurosecretory cells", "Vasopressin regulation and fluid-balance signals."],
  ["Parvocellular neurosecretory cells", "Autonomic / POTS-like", "Parvocellular neurosecretory cells", "HPA modulation and stress amplification."],
  ["Osmoreceptor neurons", "Autonomic / POTS-like", "Osmoreceptor neurons", "Electrolyte sensing instability."],
  ["Glucosensing neurons", "Autonomic / POTS-like", "Glucosensing neurons", "Postprandial dysfunction signals."],
  ["Thermosensitive neurons", "Autonomic / POTS-like", "Thermosensitive neurons", "Heat dissipation mismatch and exertional overheating."],
  ["Mast cells", "Histamine / Mast-cell", "Mast cells", "Histamine release and cytokine cascades."],
  ["Basophils", "Histamine / Mast-cell", "Basophils", "Systemic inflammatory amplification."],
  ["ECL cells", "Histamine / Mast-cell", "ECL cells", "H2 signaling instability."],
  ["H1 receptor axis", "Histamine / Mast-cell", "H1 receptor axis", "Itching, anxiety, wakefulness, and flushing signals."],
  ["H2 receptor axis", "Histamine / Mast-cell", "H2 receptor axis", "Vascular fullness, fatigue, head pressure, and GI tone signals."],
  ["CD4 T cells", "Immune / Inflammatory", "CD4 T cells", "Chronic activation signaling."],
  ["CD8 T cells", "Immune / Inflammatory", "CD8 T cells", "Exhaustion vs suppression signals."],
  ["CD19 B cells", "Immune / Inflammatory", "CD19 B cells", "Antigen persistence signaling."],
  ["Monocytes", "Immune / Inflammatory", "Monocytes", "Cytokine propagation."],
  ["NK cells", "Immune / Inflammatory", "NK cells", "Viral surveillance failure signal."],
  ["SCN pacemaker neurons", "Sleep / Circadian", "SCN pacemaker neurons", "Circadian drift."],
  ["Orexin neurons", "Sleep / Circadian", "Orexin neurons", "Wakefulness instability."],
  ["Pineal / melatonin axis", "Sleep / Circadian", "Pineal / melatonin axis", "Light/dark and melatonin timing signals."],
  ["Glymphatic astrocytic networks", "Sleep / Circadian", "Glymphatic astrocytic networks", "Metabolic waste-clearance signals."],
  ["Mitochondria", "Metabolic / Mitochondrial", "Mitochondria", "ATP instability and ROS overload."],
  ["CoQ10 / electron transport", "Metabolic / Mitochondrial", "CoQ10 / electron transport", "Electron-transport support signal."],
  ["NAD+ / redox systems", "Metabolic / Mitochondrial", "NAD+ / redox systems", "Energetic collapse and redox balance signals."],
  ["Lipid metabolism networks", "Metabolic / Mitochondrial", "Lipid metabolism networks", "Membrane signaling dysfunction."]
];

const symptoms = ["head pressure", "cognitive flattening", "emotional blunting", "memory fragmentation", "sensory amplification", "overheating", "HR instability", "stress crashes", "post-meal dysfunction", "circadian instability", "food-triggered neuropathy", "tomato sensitivity", "pollen sensitivity", "flushing", "fatigue", "post-viral persistence", "fluctuating inflammation", "insomnia", "nighttime brain vibrations", "exercise intolerance", "post-exertional depletion"];
const triggers = [["Tomato / high-histamine foods", "food"], ["Pollen / environmental exposure", "environment"], ["Heat", "thermal"], ["Exertion", "exertion"], ["Stress", "stress"], ["Meals / glucose shifts", "metabolic"], ["Poor sleep", "circadian"], ["Viral-like flare", "immune"]];
const timings = ["immediate", "delayed 2-8 hours", "next-day crash", "nighttime", "morning", "post-meal", "post-exertional", "cyclical"];
const interventions = [["Famotidine", "H2"], ["Hydroxyzine", "H1"], ["Acyclovir", "antiviral"], ["CoQ10", "mitochondrial"], ["Electrolytes", "autonomic"], ["Hydration", "autonomic"], ["Compression", "autonomic"], ["Sleep restoration", "circadian"], ["Exercise conditioning", "conditioning"], ["Steroids", "anti-inflammatory"], ["Red light", "circadian"], ["Cyclobenzaprine", "sleep"]];
const outcomes = [["Daily function", "0-10"], ["Head pressure", "0-10"], ["Cognitive clarity", "0-10"], ["Sleep quality", "0-10"], ["Exertion recovery", "hours"], ["Food tolerance", "0-10"]];

type BiomarkerSeed = readonly [name: string, sampleType: string, description: string, diagnosticTest: string];
type ObservableFindingSeed = readonly [name: string, findingType: string, polarity: string, description: string];
type TemporalWindowSeed = readonly [name: string, phase: string, description: string];
type DiagnosticEvidenceSeed = readonly [
  testName: string,
  targetType: "domain" | "phenotype" | "mechanism" | "trigger" | "intervention",
  targetLabel: string,
  findingName: string,
  windowName: string,
  weight: number,
  evidenceTier: string,
  explanation: string,
  discriminates: string
];
type WeightedEdgeSeed = readonly [
  sourceType: string,
  sourceLabel: string,
  targetType: string,
  targetLabel: string,
  relation: string,
  direction: string,
  weight: number,
  explanation: string
];

const diagnosticTests = [
  {
    name: "EBV early antigen and serology pattern",
    category: "Viral persistence",
    description: "Serologic pattern review for EBV reactivation signals in the context of post-viral relapse patterns.",
    cost: "moderate",
    invasiveness: "blood draw",
    accessibility: "commonly available through clinical laboratories",
    specificity: "context-dependent",
    sensitivity: "context-dependent",
    mechanisticRelevance: "Useful for separating viral-reactivation-suspected patterns from broader immune activation signals.",
    temporalRelevance: "Most useful during relapse windows or persistent post-viral flare patterns.",
    falsePositiveContexts: "Past exposure, nonspecific immune activation, and assay variability can complicate interpretation.",
    interpretationCaution: "A positive or negative result does not confirm or exclude LongCovid; it only informs a competing hypothesis."
  },
  {
    name: "Lymphocyte subset flow cytometry",
    category: "Immune profiling",
    description: "CD4, CD8, CD19 B-cell, and NK-cell distribution review for immune-surveillance patterning.",
    cost: "moderate to high",
    invasiveness: "blood draw",
    accessibility: "specialty clinical laboratory",
    specificity: "moderate",
    sensitivity: "moderate",
    mechanisticRelevance: "Helps evaluate whether immune cell distribution supports surveillance, exhaustion, or B-cell persistence hypotheses.",
    temporalRelevance: "Most informative in chronic fluctuating or recurrent flare states.",
    falsePositiveContexts: "Recent infections, vaccination, medications, and autoimmune overlap can shift lymphocyte subsets.",
    interpretationCaution: "Subset changes require clinical context and trend review rather than one-off interpretation."
  },
  {
    name: "CBC with differential and eosinophil trend",
    category: "Accessible screening",
    description: "Routine blood count trend focused on eosinophils and broad inflammatory context.",
    cost: "low",
    invasiveness: "blood draw",
    accessibility: "widely available",
    specificity: "low to moderate",
    sensitivity: "low to moderate",
    mechanisticRelevance: "Low-cost discriminator for allergic, eosinophilic, inflammatory, or medication-related signal environments.",
    temporalRelevance: "Best interpreted as a trend across flare, baseline, and recovery windows.",
    falsePositiveContexts: "Allergies, parasites, medications, asthma, and many non-LongCovid conditions can alter eosinophils.",
    interpretationCaution: "Normal values do not rule out mast-cell, histamine, or immune dysregulation hypotheses."
  },
  {
    name: "Serum tryptase",
    category: "Mast-cell markers",
    description: "Blood marker often interpreted around suspected mast-cell activation contexts.",
    cost: "moderate",
    invasiveness: "blood draw",
    accessibility: "available but timing-sensitive",
    specificity: "moderate when timed to events",
    sensitivity: "limited",
    mechanisticRelevance: "Can help discriminate mast-cell activation signals from nonspecific food intolerance or autonomic post-meal shifts.",
    temporalRelevance: "Most useful when collected near acute flushing, itching, or systemic reaction windows.",
    falsePositiveContexts: "Timing, baseline variation, clonal mast-cell disorders, and lab handling affect interpretation.",
    interpretationCaution: "A normal tryptase does not exclude mediator-driven symptoms."
  },
  {
    name: "Urinary histamine and prostaglandin metabolites",
    category: "Mast-cell mediators",
    description: "Mediator metabolite testing used to evaluate histamine/prostaglandin signal environments.",
    cost: "moderate to high",
    invasiveness: "urine collection",
    accessibility: "specialty laboratory",
    specificity: "moderate",
    sensitivity: "timing-dependent",
    mechanisticRelevance: "Adds observability for mediator release when food, pollen, H1/H2 response, or flushing patterns cluster.",
    temporalRelevance: "Most informative when paired with trigger windows or flare diaries.",
    falsePositiveContexts: "Diet, medications, collection timing, and handling can affect results.",
    interpretationCaution: "Mediator results should be interpreted as uncertainty-reduction signals, not standalone diagnoses."
  },
  {
    name: "Tilt-table or active stand autonomic testing",
    category: "Autonomic function",
    description: "Structured HR/BP response measurement during posture change.",
    cost: "moderate",
    invasiveness: "noninvasive functional testing",
    accessibility: "specialty clinic or simplified active stand protocol",
    specificity: "moderate",
    sensitivity: "moderate",
    mechanisticRelevance: "Helps distinguish autonomic instability from primary metabolic fatigue or histamine-only trigger patterns.",
    temporalRelevance: "Best measured when postural symptoms are active and hydration/compression state is documented.",
    falsePositiveContexts: "Deconditioning, medications, dehydration, anxiety, and acute illness can affect results.",
    interpretationCaution: "A normal result on one day may miss fluctuating dysautonomia."
  },
  {
    name: "Cytokine panel",
    category: "Inflammatory signaling",
    description: "Multiplex inflammatory mediator panel for broad immune activation patterning.",
    cost: "high",
    invasiveness: "blood draw",
    accessibility: "specialty or research laboratory",
    specificity: "low to moderate",
    sensitivity: "variable",
    mechanisticRelevance: "Can support or weaken cytokine-propagation hypotheses when steroid responsiveness or inflammatory flares are prominent.",
    temporalRelevance: "Most useful when collected during flare and compared with baseline.",
    falsePositiveContexts: "Recent infection, exercise, sleep loss, autoimmune disease, and lab platform variability.",
    interpretationCaution: "Cytokine panels are noisy and should be used to guide hypotheses, not certify mechanisms."
  },
  {
    name: "Endothelial activation marker panel",
    category: "Vascular signaling",
    description: "Markers such as von Willebrand factor, D-dimer context, soluble adhesion markers, or related vascular activation signals.",
    cost: "moderate to high",
    invasiveness: "blood draw",
    accessibility: "mixed clinical and specialty availability",
    specificity: "context-dependent",
    sensitivity: "context-dependent",
    mechanisticRelevance: "Helps explore vascular coupling, endothelial activation, and head-pressure hypotheses.",
    temporalRelevance: "Most useful during head-pressure, exertional, or inflammatory flare windows.",
    falsePositiveContexts: "Recent infection, clotting risk, inflammation, medications, and comorbid vascular disease.",
    interpretationCaution: "Vascular markers require clinician interpretation and do not identify a single causal pathway."
  },
  {
    name: "Stool calprotectin",
    category: "GI immune screening",
    description: "Noninvasive stool marker for intestinal inflammatory signal context.",
    cost: "low to moderate",
    invasiveness: "stool sample",
    accessibility: "widely available",
    specificity: "moderate for intestinal inflammation",
    sensitivity: "moderate",
    mechanisticRelevance: "Helps separate GI immune inflammation from food-triggered histamine sensitivity or postprandial autonomic shifts.",
    temporalRelevance: "Useful when GI symptoms, food-triggered flares, or post-meal dysfunction are active.",
    falsePositiveContexts: "IBD, infection, NSAID use, and other intestinal inflammatory conditions.",
    interpretationCaution: "It is a GI inflammation screen, not a LongCovid-specific marker."
  },
  {
    name: "Intestinal permeability marker panel",
    category: "GI barrier research",
    description: "Research-oriented barrier markers such as zonulin-context assays or related permeability signals.",
    cost: "moderate to high",
    invasiveness: "blood or stool sample",
    accessibility: "limited and platform-dependent",
    specificity: "limited",
    sensitivity: "variable",
    mechanisticRelevance: "Explores whether food-triggered inflammatory or histamine patterns may involve gut-barrier signaling.",
    temporalRelevance: "Most useful in post-meal or diet-linked flare windows.",
    falsePositiveContexts: "Assay variability, GI disease, diet, infection, and nonstandard reference ranges.",
    interpretationCaution: "This is best treated as exploratory research metadata, not a clinical conclusion."
  },
  {
    name: "Metabolomics or organic acids profile",
    category: "Metabolic systems",
    description: "Broad energetic and redox-context profiling used for metabolic pattern generation.",
    cost: "high",
    invasiveness: "blood or urine sample",
    accessibility: "specialty or research laboratory",
    specificity: "low to moderate",
    sensitivity: "variable",
    mechanisticRelevance: "Can help prioritize mitochondrial, redox, and recovery-capacity hypotheses when PEM or energetic collapse dominates.",
    temporalRelevance: "Best interpreted against exertional load, nutrition, sleep, and recovery timing.",
    falsePositiveContexts: "Diet, supplements, medications, fasting state, and lab method variation.",
    interpretationCaution: "Broad profiles generate hypotheses and require careful follow-up, not direct diagnosis."
  },
  {
    name: "Microbiome sequencing",
    category: "Microbiome research",
    description: "Stool sequencing for microbial composition patterns related to GI and immune-state hypotheses.",
    cost: "moderate to high",
    invasiveness: "stool sample",
    accessibility: "commercial or research availability",
    specificity: "low",
    sensitivity: "variable",
    mechanisticRelevance: "Helps study diet-linked, histamine-linked, and GI immune dysregulation branches over time.",
    temporalRelevance: "Most useful longitudinally across diet changes, flares, and recovery windows.",
    falsePositiveContexts: "Diet, antibiotics, probiotics, geography, and sampling variability.",
    interpretationCaution: "Microbiome results are research-oriented and not deterministic treatment instructions."
  },
  {
    name: "Neuroinflammation PET imaging",
    category: "Research imaging",
    description: "Research-grade imaging approach for neuroinflammatory signal exploration.",
    cost: "very high",
    invasiveness: "imaging with tracer exposure",
    accessibility: "research-limited",
    specificity: "research-dependent",
    sensitivity: "research-dependent",
    mechanisticRelevance: "May help distinguish microglial/neuroimmune hypotheses in severe head-pressure or cognitive-gain patterns.",
    temporalRelevance: "Most relevant in persistent neurocognitive-dominant states.",
    falsePositiveContexts: "Tracer specificity, comorbid neurologic disease, inflammation, and protocol differences.",
    interpretationCaution: "This is not routine clinical testing and should be framed as research observability."
  }
];

const biomarkers: BiomarkerSeed[] = [
  ["EBV early antigen", "blood", "Potential viral-reactivation context marker.", "EBV early antigen and serology pattern"],
  ["CD19 B-cell percentage", "blood", "B-cell distribution signal for immune persistence hypotheses.", "Lymphocyte subset flow cytometry"],
  ["NK-cell count or percentage", "blood", "Viral-surveillance context signal.", "Lymphocyte subset flow cytometry"],
  ["Eosinophil trend", "blood", "Accessible allergic/inflammatory trend signal.", "CBC with differential and eosinophil trend"],
  ["Serum tryptase", "blood", "Mast-cell activation context marker.", "Serum tryptase"],
  ["Urinary histamine metabolites", "urine", "Mediator release context marker.", "Urinary histamine and prostaglandin metabolites"],
  ["Orthostatic HR/BP response", "functional", "Autonomic response measurement.", "Tilt-table or active stand autonomic testing"],
  ["Inflammatory cytokines", "blood", "Broad cytokine signaling context.", "Cytokine panel"],
  ["Endothelial activation markers", "blood", "Vascular activation context.", "Endothelial activation marker panel"],
  ["Stool calprotectin", "stool", "GI inflammatory context marker.", "Stool calprotectin"],
  ["Barrier permeability markers", "blood or stool", "Exploratory gut-barrier context marker.", "Intestinal permeability marker panel"],
  ["Redox and organic acid profile", "blood or urine", "Energetic and redox context signal.", "Metabolomics or organic acids profile"],
  ["Microbial composition profile", "stool", "Longitudinal microbiome context.", "Microbiome sequencing"],
  ["TSPO or related tracer signal", "imaging", "Research neuroinflammation observability.", "Neuroinflammation PET imaging"]
];

const observableFindings: ObservableFindingSeed[] = [
  ["EBV early antigen signal", "biomarker", "positive", "EBV serology pattern that may support viral-reactivation-suspected hypotheses in context."],
  ["Reduced or shifted NK-cell signal", "biomarker", "abnormal", "Immune-surveillance finding that may support viral persistence or immune exhaustion branches."],
  ["Elevated eosinophil trend", "biomarker", "elevated", "Accessible signal that can support allergic, histamine, or inflammatory branch review."],
  ["Mediator elevation near flare", "biomarker", "elevated", "Timed histamine/prostaglandin signal that can support mast-cell mediator hypotheses."],
  ["Orthostatic tachycardia or BP instability", "functional", "abnormal", "Measured postural response supporting autonomic instability branch review."],
  ["Inflammatory cytokine elevation", "biomarker", "elevated", "Broad inflammatory signal supporting cytokine-propagation hypotheses."],
  ["Vascular activation signal", "biomarker", "elevated", "Endothelial or clotting-context signal supporting vascular coupling review."],
  ["GI inflammatory signal", "biomarker", "elevated", "Stool-based signal that can separate intestinal inflammation from other post-meal branches."],
  ["Energy metabolism shift", "biomarker", "abnormal", "Metabolic profile signal that can support mitochondrial/redox hypotheses."]
];

const temporalWindows: TemporalWindowSeed[] = [
  ["Post-viral onset window", "early post-viral", "Signals appearing after infection onset may help separate post-viral persistence from gradual noninfectious patterns."],
  ["Chronic fluctuating window", "chronic", "Signals repeated across relapsing/remitting phases can be more informative than isolated results."],
  ["Post-exertional window", "24-48 hour PEM", "Signals collected after exertion can clarify metabolic, autonomic, or inflammatory recovery limits."],
  ["Post-meal window", "0-8 hours after meals", "Signals collected around meal-linked flares can help distinguish GI immune, histamine, and autonomic branches."],
  ["Nocturnal activation window", "nighttime", "Night-linked signals can clarify sleep/circadian and neuroimmune coupling hypotheses."],
  ["Acute flare window", "active relapse", "Measurements during a flare can carry more discriminating value than baseline-only data."]
];

const diagnosticEvidenceRules: DiagnosticEvidenceSeed[] = [
  ["EBV early antigen and serology pattern", "phenotype", "Viral-reactivation-suspected phenotype", "EBV early antigen signal", "Post-viral onset window", 3.2, "research-informed", "Viral-reactivation-suspected scoring makes EBV serology a higher-yield uncertainty reducer.", "viral persistence vs nonspecific immune activation"],
  ["EBV early antigen and serology pattern", "mechanism", "NK cells", "Reduced or shifted NK-cell signal", "Chronic fluctuating window", 2.2, "hypothesis", "NK-cell surveillance signals can contextualize suspected viral persistence.", "viral surveillance failure vs broad inflammatory drift"],
  ["Lymphocyte subset flow cytometry", "phenotype", "Viral-reactivation-suspected phenotype", "Reduced or shifted NK-cell signal", "Chronic fluctuating window", 2.8, "research-informed", "Flow cytometry can separate immune-surveillance patterns from symptom-only viral persistence hypotheses.", "B-cell persistence vs T-cell/NK-cell surveillance patterns"],
  ["Lymphocyte subset flow cytometry", "mechanism", "CD19 B cells", "Reduced or shifted NK-cell signal", "Chronic fluctuating window", 2.6, "hypothesis", "B-cell distribution is relevant when antigen persistence signaling is high.", "B-cell persistence vs innate immune activation"],
  ["CBC with differential and eosinophil trend", "phenotype", "Histamine-dominant regulatory phenotype", "Elevated eosinophil trend", "Acute flare window", 1.9, "clinical-adjacent", "Eosinophil trends are low-cost context for histamine/allergic branch review.", "allergic/eosinophilic context vs mediator-only symptoms"],
  ["CBC with differential and eosinophil trend", "domain", "Immune / Inflammatory", "Elevated eosinophil trend", "Chronic fluctuating window", 1.4, "clinical-adjacent", "Routine inflammatory context can identify broad immune signals worth following.", "immune flare context vs isolated autonomic state"],
  ["Serum tryptase", "phenotype", "Histamine-dominant regulatory phenotype", "Mediator elevation near flare", "Acute flare window", 2.6, "clinical-adjacent", "Timed tryptase can help discriminate mast-cell activation from nonspecific food sensitivity.", "mast-cell activation vs non-mast-cell food intolerance"],
  ["Serum tryptase", "mechanism", "Mast cells", "Mediator elevation near flare", "Acute flare window", 2.8, "clinical-adjacent", "Mast-cell hypothesis scoring increases the informational value of timed mediator testing.", "mast-cell mediator release vs H1/H2 receptor sensitivity"],
  ["Urinary histamine and prostaglandin metabolites", "phenotype", "Histamine-dominant regulatory phenotype", "Mediator elevation near flare", "Post-meal window", 3.0, "clinical-adjacent", "Food-triggered and H1/H2 response patterns make mediator metabolites more informative.", "histamine/prostaglandin mediator state vs autonomic postprandial dysfunction"],
  ["Urinary histamine and prostaglandin metabolites", "intervention", "Famotidine", "Mediator elevation near flare", "Post-meal window", 2.2, "hypothesis", "H2 response strengthens the value of mediator observability.", "H2-linked vascular/GI signaling vs nonspecific symptom relief"],
  ["Tilt-table or active stand autonomic testing", "phenotype", "Autonomic instability phenotype", "Orthostatic tachycardia or BP instability", "Chronic fluctuating window", 3.4, "clinical-adjacent", "Autonomic phenotype scoring makes structured posture response testing high-yield.", "POTS-like physiology vs primary fatigue or histamine-only patterns"],
  ["Tilt-table or active stand autonomic testing", "domain", "Autonomic / POTS-like", "Orthostatic tachycardia or BP instability", "Acute flare window", 2.4, "clinical-adjacent", "Autonomic domain load benefits from direct HR/BP observability.", "fluid-balance instability vs stress-only amplification"],
  ["Cytokine panel", "domain", "Immune / Inflammatory", "Inflammatory cytokine elevation", "Acute flare window", 2.6, "research", "Inflammatory domain scoring increases the value of flare-timed cytokine panels.", "cytokine propagation vs non-inflammatory symptom fluctuation"],
  ["Cytokine panel", "mechanism", "Monocytes", "Inflammatory cytokine elevation", "Acute flare window", 2.3, "research", "Monocyte/cytokine propagation hypotheses are better tested during active flares.", "monocyte cytokine signaling vs downstream neuroimmune effects"],
  ["Endothelial activation marker panel", "phenotype", "Neuroimmune / head-pressure phenotype", "Vascular activation signal", "Acute flare window", 2.7, "research-informed", "Head-pressure and neurovascular patterns raise the value of vascular activation markers.", "endothelial activation vs mast-cell vascular fullness"],
  ["Endothelial activation marker panel", "mechanism", "Endothelial cells", "Vascular activation signal", "Post-exertional window", 2.8, "research-informed", "Endothelial coupling hypotheses are more discriminating when paired with exertional or head-pressure windows.", "vascular coupling dysfunction vs neuroimmune sensory gain"],
  ["Stool calprotectin", "trigger", "Meals / glucose shifts", "GI inflammatory signal", "Post-meal window", 2.2, "clinical-adjacent", "Meal-linked dysfunction makes GI inflammatory screening more informative.", "intestinal inflammation vs postprandial autonomic shift"],
  ["Stool calprotectin", "domain", "Histamine / Mast-cell", "GI inflammatory signal", "Post-meal window", 1.8, "clinical-adjacent", "Histamine/GI patterns can benefit from separating inflammation from mediator sensitivity.", "GI immune inflammation vs histamine threshold sensitivity"],
  ["Intestinal permeability marker panel", "trigger", "Tomato / high-histamine foods", "GI inflammatory signal", "Post-meal window", 1.9, "research", "Food-triggered neuropathy patterns make gut-barrier signals research-relevant.", "gut-barrier signaling vs isolated mast-cell mediator release"],
  ["Metabolomics or organic acids profile", "phenotype", "Metabolic fatigue phenotype", "Energy metabolism shift", "Post-exertional window", 3.1, "research", "Metabolic fatigue scoring increases the value of redox and energy-profile observability.", "ATP/redox limitation vs autonomic or inflammatory fatigue"],
  ["Metabolomics or organic acids profile", "mechanism", "Mitochondria", "Energy metabolism shift", "Post-exertional window", 2.9, "research", "Mitochondrial hypothesis scoring is best discriminated against exertion/recovery timing.", "mitochondrial recovery limits vs deconditioning alone"],
  ["Microbiome sequencing", "domain", "Histamine / Mast-cell", "GI inflammatory signal", "Chronic fluctuating window", 1.8, "research", "Histamine and food-triggered patterns can be studied longitudinally with microbiome context.", "microbiome-linked histamine load vs non-GI mediator sensitivity"],
  ["Microbiome sequencing", "trigger", "Meals / glucose shifts", "GI inflammatory signal", "Post-meal window", 1.6, "research", "Meal-linked symptom shifts make microbiome context useful for longitudinal branch development.", "diet-linked microbiome state vs glucose/autonomic response"],
  ["Neuroinflammation PET imaging", "phenotype", "Neuroimmune / head-pressure phenotype", "Inflammatory cytokine elevation", "Chronic fluctuating window", 1.8, "research", "Severe neurocognitive/head-pressure scoring can make research imaging relevant for study enrollment.", "microglial activation vs vascular coupling vs sensory gain"],
  ["Neuroinflammation PET imaging", "mechanism", "Microglia", "Inflammatory cytokine elevation", "Chronic fluctuating window", 2.0, "research", "Microglial hypothesis scoring increases research imaging value when accessible.", "microglial activation vs peripheral inflammatory signaling"]
];

const weightedEdges: WeightedEdgeSeed[] = [
  ["trigger", "Meals / glucose shifts", "mechanism", "Glucosensing neurons", "activates", "forward", 0.7, "Meal-linked dysfunction can route through glucosensing and autonomic postprandial pathways."],
  ["domain", "Histamine / Mast-cell", "domain", "Autonomic / POTS-like", "amplifies", "bidirectional", 0.6, "Mediator release can amplify vascular tone and autonomic instability; autonomic stress can lower mediator thresholds."],
  ["domain", "Immune / Inflammatory", "mechanism", "Microglia", "signals_to", "forward", 0.8, "Peripheral inflammatory signaling can increase neuroimmune hypothesis confidence."],
  ["domain", "Metabolic / Mitochondrial", "domain", "Autonomic / POTS-like", "constrains", "bidirectional", 0.5, "Energy recovery limits and autonomic stress can reinforce post-exertional instability."],
  ["domain", "Sleep / Circadian", "domain", "Immune / Inflammatory", "modulates", "bidirectional", 0.6, "Sleep disruption can alter immune thresholds, while inflammation can destabilize sleep architecture."]
];

const questions = [
  ["onset", "When did this regulatory-state pattern begin?", "onset", [["After a viral illness", "viral"], ["Gradually without a clear trigger", "gradual"], ["After a major stressor", "stress"], ["I am not sure", "unknown"]]],
  ["head_pressure", "How prominent is head pressure or cranial fullness?", "symptom", [["Not present", "none"], ["Mild or occasional", "mild"], ["Moderate and recurring", "moderate"], ["Severe or state-defining", "severe"]]],
  ["cognitive_flattening", "Do you experience cognitive flattening, reduced mental range, or memory fragmentation?", "symptom", [["No", "none"], ["Sometimes", "mild"], ["Often", "moderate"], ["Very strongly", "severe"]]],
  ["sensory_gain", "Are light, sound, smell, touch, or internal sensations amplified?", "symptom", [["No", "none"], ["Mildly", "mild"], ["Clearly", "moderate"], ["Strongly", "severe"]]],
  ["emotional_blunting", "Is emotional reward, motivation, or affective range blunted?", "symptom", [["No", "none"], ["Slightly", "mild"], ["Often", "moderate"], ["Very strongly", "severe"]]],
  ["heat_instability", "How much does heat or exertional overheating destabilize you?", "trigger", [["Not much", "none"], ["Somewhat", "mild"], ["Frequently", "moderate"], ["Strongly", "severe"]]],
  ["hr_instability", "Do you notice heart-rate instability, pounding, or postural intolerance?", "symptom", [["No", "none"], ["Mild", "mild"], ["Moderate", "moderate"], ["Severe", "severe"]]],
  ["electrolyte_response", "Do electrolytes, salt, hydration, or compression improve your state?", "response", [["No clear response", "none"], ["Small improvement", "mild"], ["Meaningful improvement", "moderate"], ["Large stabilizing effect", "severe"]]],
  ["post_meal", "Do meals trigger fatigue, head pressure, neuropathy, HR shifts, or brain fog?", "trigger", [["No", "none"], ["Occasionally", "mild"], ["Often", "moderate"], ["Strongly", "severe"]]],
  ["tomato_food", "Do tomatoes or high-histamine foods trigger neuropathy, fullness, flushing, or head pressure?", "trigger", [["No", "none"], ["Unclear or mild", "mild"], ["Yes, reliably", "moderate"], ["Yes, strongly", "severe"]]],
  ["pollen", "Do pollen, sinus, seasonal, or environmental exposures worsen symptoms?", "trigger", [["No", "none"], ["Slightly", "mild"], ["Clearly", "moderate"], ["Strongly", "severe"]]],
  ["flushing_itching", "Do flushing, itching, wakefulness, or anxiety spikes occur with triggers?", "symptom", [["No", "none"], ["Mildly", "mild"], ["Often", "moderate"], ["Strongly", "severe"]]],
  ["famotidine", "How do H2 blockers such as famotidine/Pepcid affect your state?", "response", [["Not tried or no effect", "none"], ["Small improvement", "mild"], ["Clear improvement", "moderate"], ["Major stabilizing effect", "severe"]]],
  ["hydroxyzine", "How do H1 blockers such as hydroxyzine affect sleep, itching, anxiety, or flares?", "response", [["Not tried or no effect", "none"], ["Small improvement", "mild"], ["Clear improvement", "moderate"], ["Major stabilizing effect", "severe"]]],
  ["viral_persistence", "Do symptoms feel like a post-viral persistence pattern with recurring immune-like flares?", "immune", [["No", "none"], ["Maybe", "mild"], ["Often", "moderate"], ["Very strongly", "severe"]]],
  ["antiviral_response", "Have antivirals such as acyclovir produced a meaningful state shift?", "response", [["Not tried or no effect", "none"], ["Small shift", "mild"], ["Clear shift", "moderate"], ["Large shift", "severe"]]],
  ["steroid_response", "Have steroids or anti-inflammatory agents produced a meaningful temporary improvement?", "response", [["Not tried or no effect", "none"], ["Small shift", "mild"], ["Clear shift", "moderate"], ["Large shift", "severe"]]],
  ["sleep_collapse", "How disrupted is sleep initiation, continuity, or depth?", "sleep", [["Stable", "none"], ["Mild disruption", "mild"], ["Frequent disruption", "moderate"], ["Collapsed or highly unstable", "severe"]]],
  ["night_vibrations", "Do nighttime brain vibrations, internal buzzing, or nocturnal activation occur?", "sleep", [["No", "none"], ["Rarely", "mild"], ["Often", "moderate"], ["Strongly", "severe"]]],
  ["sleep_restoration", "When sleep improves, how much do other domains improve?", "response", [["No clear link", "none"], ["Some link", "mild"], ["Strong link", "moderate"], ["Sleep is the main stabilizer", "severe"]]],
  ["circadian_drift", "Is your symptom pattern tied to circadian drift, late nights, light exposure, or morning instability?", "sleep", [["No", "none"], ["Mildly", "mild"], ["Often", "moderate"], ["Strongly", "severe"]]],
  ["fatigue", "How prominent is fatigue or energetic collapse?", "metabolic", [["Not prominent", "none"], ["Mild", "mild"], ["Moderate", "moderate"], ["Severe", "severe"]]],
  ["exercise_intolerance", "How does exertion affect symptoms within the next 24-48 hours?", "metabolic", [["Usually improves me", "improves"], ["Neutral or mixed", "none"], ["Delayed symptom increase", "moderate"], ["Clear post-exertional depletion", "severe"]]],
  ["coq10", "Does CoQ10, nutrition, sunlight, or metabolic support improve stamina or clarity?", "response", [["Not tried or no effect", "none"], ["Small improvement", "mild"], ["Clear improvement", "moderate"], ["Large improvement", "severe"]]],
  ["stress_crash", "Do emotional, cognitive, or physical stressors cause disproportionate crashes?", "trigger", [["No", "none"], ["Sometimes", "mild"], ["Often", "moderate"], ["Strongly", "severe"]]],
  ["fluctuation", "How quickly can your state change after a trigger or stabilizer?", "timing", [["Slowly over weeks", "slow"], ["Within days", "days"], ["Within hours", "hours"], ["Within minutes", "minutes"]]],
  ["functional_limit", "Current functional limitation compared with baseline?", "outcome", [["Minimal", "mild"], ["Moderate", "moderate"], ["Severe", "severe"], ["Variable by state", "variable"]]],
  ["multi_domain", "Do several systems destabilize together rather than one isolated symptom cluster?", "summary", [["No", "none"], ["Somewhat", "mild"], ["Often", "moderate"], ["Yes, strongly", "severe"]]]
] as const;

const ruleMap: Record<string, Array<[string, string, number, string]>> = {
  viral: [["domain:Immune / Inflammatory", "phenotype:Viral-reactivation-suspected phenotype", 3, "Post-viral onset supports immune persistence hypothesis."], ["phenotype:Neuroimmune / head-pressure phenotype", "mechanism:Microglia", 1.5, "Post-viral onset can couple to neuroimmune state shifts."]],
  stress: [["domain:Autonomic / POTS-like", "mechanism:Parvocellular neurosecretory cells", 2, "Stress-linked onset supports HPA/autonomic amplification."], ["phenotype:Mixed-system unstable phenotype", "domain:Sleep / Circadian", 1.2, "Stress onset can destabilize multiple control layers."]],
  severe: [["phenotype:Mixed-system unstable phenotype", "domain:Immune / Inflammatory", 0.7, "High severity contributes to mixed-system instability."]],
  moderate: [["phenotype:Mixed-system unstable phenotype", "domain:Immune / Inflammatory", 0.4, "Moderate recurring signal contributes to cross-domain load."]],
  hours: [["phenotype:Mixed-system unstable phenotype", "domain:Histamine / Mast-cell", 1.5, "Rapid state changes suggest threshold or mediator-driven regulation."], ["domain:Autonomic / POTS-like", "phenotype:Autonomic instability phenotype", 1, "Hour-scale shifts can reflect autonomic state changes."]],
  minutes: [["phenotype:Histamine-dominant regulatory phenotype", "domain:Histamine / Mast-cell", 2, "Minute-scale shifts suggest threshold-mediated trigger sensitivity."], ["phenotype:Autonomic instability phenotype", "domain:Autonomic / POTS-like", 1.5, "Very rapid shifts also support autonomic coupling."]],
  variable: [["phenotype:Mixed-system unstable phenotype", "domain:Sleep / Circadian", 2, "Variable limitation suggests state-dependent regulation rather than fixed capacity alone."]]
};

const questionRules: Record<string, Array<[string, string, number, string]>> = {
  head_pressure: [["domain:Neurologic / Cognitive", "phenotype:Neuroimmune / head-pressure phenotype", 3, "Head pressure is a core neuroimmune/neurovascular state signal."], ["mechanism:Pericytes", "mechanism:Endothelial cells", 1.2, "Cranial fullness can map to vascular coupling hypotheses."], ["mechanism:H2 receptor axis", "domain:Histamine / Mast-cell", 0.8, "Head pressure can also appear in H2/histamine patterns."]],
  cognitive_flattening: [["domain:Neurologic / Cognitive", "phenotype:Neuroimmune / head-pressure phenotype", 2.4, "Cognitive flattening supports neurologic/cognitive domain load."], ["mechanism:Astrocytes", "mechanism:Microglia", 1.4, "Cognitive compression maps to neuroimmune/glial hypothesis layers."]],
  sensory_gain: [["domain:Neurologic / Cognitive", "phenotype:Neuroimmune / head-pressure phenotype", 2, "Sensory amplification indicates altered gain control."], ["mechanism:Microglia", "domain:Histamine / Mast-cell", 1, "Sensory gain can couple neuroimmune and histamine mediator states."]],
  emotional_blunting: [["domain:Neurologic / Cognitive", "mechanism:Astrocytes", 1.8, "Emotional blunting is treated as a cognitive/reward state signal."], ["phenotype:Neuroimmune / head-pressure phenotype", "domain:Metabolic / Mitochondrial", 1, "Reduced reward can track neuroimmune or energy-state compression."]],
  heat_instability: [["domain:Autonomic / POTS-like", "phenotype:Autonomic instability phenotype", 3, "Heat destabilization supports thermoregulatory/autonomic instability."], ["mechanism:Thermosensitive neurons", "trigger:Heat", 2, "Heat sensitivity maps to thermosensitive neuron hypothesis layer."]],
  hr_instability: [["domain:Autonomic / POTS-like", "phenotype:Autonomic instability phenotype", 3, "Heart-rate instability is a core autonomic signal."], ["mechanism:Magnocellular neurosecretory cells", "mechanism:Osmoreceptor neurons", 1.4, "HR instability can couple fluid-balance and electrolyte sensing hypotheses."]],
  electrolyte_response: [["domain:Autonomic / POTS-like", "phenotype:Autonomic instability phenotype", 2.4, "Electrolyte/hydration response supports autonomic fluid-balance signaling."], ["intervention:Electrolytes", "intervention:Hydration", 2, "Reported response strengthens electrolyte/hydration intervention-response signal."]],
  post_meal: [["domain:Autonomic / POTS-like", "phenotype:Autonomic instability phenotype", 1.8, "Post-meal dysfunction supports autonomic/metabolic coupling."], ["mechanism:Glucosensing neurons", "trigger:Meals / glucose shifts", 2, "Meal-linked shifts map to glucosensing and postprandial hypotheses."]],
  tomato_food: [["domain:Histamine / Mast-cell", "phenotype:Histamine-dominant regulatory phenotype", 3, "Food-triggered neuropathy/fullness strongly supports histamine threshold instability."], ["mechanism:Mast cells", "trigger:Tomato / high-histamine foods", 2, "Tomato/high-histamine sensitivity maps to mast-cell mediator hypotheses."]],
  pollen: [["domain:Histamine / Mast-cell", "phenotype:Histamine-dominant regulatory phenotype", 2.4, "Pollen sensitivity supports histamine/environment threshold instability."], ["mechanism:H1 receptor axis", "trigger:Pollen / environmental exposure", 1.8, "Environmental sensitivity maps to H1-type mediator signals."]],
  flushing_itching: [["domain:Histamine / Mast-cell", "phenotype:Histamine-dominant regulatory phenotype", 2.5, "Flushing/itching/wakefulness are H1/histamine-axis signals."], ["mechanism:H1 receptor axis", "mechanism:Mast cells", 1.8, "This answer strengthens mast-cell/H1 candidate mechanisms."]],
  famotidine: [["domain:Histamine / Mast-cell", "phenotype:Histamine-dominant regulatory phenotype", 3, "Famotidine response is a strong H2-axis regulatory signal."], ["mechanism:H2 receptor axis", "intervention:Famotidine", 2.5, "H2 blocker response strengthens the H2 receptor hypothesis layer."]],
  hydroxyzine: [["domain:Histamine / Mast-cell", "phenotype:Histamine-dominant regulatory phenotype", 2.5, "H1 blocker response supports H1/histamine involvement."], ["mechanism:H1 receptor axis", "intervention:Hydroxyzine", 2, "Hydroxyzine response strengthens H1 intervention-response signal."]],
  viral_persistence: [["domain:Immune / Inflammatory", "phenotype:Viral-reactivation-suspected phenotype", 3, "Persistent post-viral flares support immune-surveillance/persistence hypothesis."], ["mechanism:NK cells", "mechanism:CD8 T cells", 1.5, "This maps to viral surveillance and T-cell exhaustion/suppression hypotheses."]],
  antiviral_response: [["domain:Immune / Inflammatory", "phenotype:Viral-reactivation-suspected phenotype", 3, "Antiviral response is a signal, not proof, for viral-reactivation-suspected phenotype."], ["intervention:Acyclovir", "mechanism:NK cells", 2, "Acyclovir response strengthens antiviral-response signal."]],
  steroid_response: [["domain:Immune / Inflammatory", "phenotype:Neuroimmune / head-pressure phenotype", 2.2, "Steroid responsiveness supports inflammatory amplification signal."], ["intervention:Steroids", "mechanism:Monocytes", 2, "Temporary anti-inflammatory response maps to monocyte/cytokine propagation hypotheses."]],
  sleep_collapse: [["domain:Sleep / Circadian", "phenotype:Sleep-collapse phenotype", 3, "Sleep disruption is a core circadian control-layer signal."], ["mechanism:Orexin neurons", "mechanism:SCN pacemaker neurons", 1.5, "Sleep collapse maps to wakefulness and circadian pacemaker hypotheses."]],
  night_vibrations: [["domain:Sleep / Circadian", "phenotype:Sleep-collapse phenotype", 2.4, "Nocturnal activation strengthens sleep/circadian instability."], ["mechanism:Orexin neurons", "domain:Neurologic / Cognitive", 1.2, "Nighttime buzzing can couple wakefulness and neurologic state signals."]],
  sleep_restoration: [["domain:Sleep / Circadian", "phenotype:Sleep-collapse phenotype", 2.5, "Broad improvement after sleep supports sleep as a control-layer input."], ["intervention:Sleep restoration", "mechanism:Glymphatic astrocytic networks", 2, "Sleep restoration response strengthens glymphatic/circadian hypothesis layer."]],
  circadian_drift: [["domain:Sleep / Circadian", "phenotype:Sleep-collapse phenotype", 2.2, "Light/timing-linked symptoms support circadian drift."], ["mechanism:SCN pacemaker neurons", "intervention:Red light", 1.4, "Light sensitivity maps to SCN/light-exposure intervention signals."]],
  fatigue: [["domain:Metabolic / Mitochondrial", "phenotype:Metabolic fatigue phenotype", 2.5, "Fatigue is a core metabolic/energy-state signal."], ["mechanism:Mitochondria", "mechanism:NAD+ / redox systems", 1.8, "Energetic collapse maps to mitochondrial and redox hypotheses."]],
  exercise_intolerance: [["domain:Metabolic / Mitochondrial", "phenotype:Metabolic fatigue phenotype", 3, "Post-exertional depletion supports metabolic recovery-capacity instability."], ["trigger:Exertion", "mechanism:Mitochondria", 2, "Exertion sensitivity maps to ATP/recovery hypotheses."]],
  coq10: [["domain:Metabolic / Mitochondrial", "phenotype:Metabolic fatigue phenotype", 2.2, "Metabolic support response strengthens energy-state hypothesis."], ["intervention:CoQ10", "mechanism:CoQ10 / electron transport", 2, "CoQ10 response maps to electron transport support signal."]],
  stress_crash: [["domain:Autonomic / POTS-like", "phenotype:Autonomic instability phenotype", 2.2, "Stress crashes support autonomic/HPA amplification."], ["trigger:Stress", "mechanism:Parvocellular neurosecretory cells", 1.8, "Stress sensitivity maps to HPA modulation hypotheses."]],
  multi_domain: [["phenotype:Mixed-system unstable phenotype", "domain:Immune / Inflammatory", 2.5, "Multi-domain destabilization supports mixed-system instability."], ["domain:Autonomic / POTS-like", "domain:Sleep / Circadian", 1.2, "Multiple coupled systems suggest synchronization failure across domains."]]
};

function multiplier(value: string) {
  if (value === "severe") return 1.35;
  if (value === "moderate") return 1;
  if (value === "mild") return 0.45;
  if (value === "improves") return 0.8;
  return 0;
}

async function seedDiagnosticGraph() {
  await prisma.diagnosticEvidenceRule.deleteMany();
  await prisma.weightedEdge.deleteMany();

  const diagnosticTestByName = new Map<string, { id: string }>();
  for (const test of diagnosticTests) {
    const created = await prisma.diagnosticTest.upsert({
      where: { name: test.name },
      update: test,
      create: test
    });
    diagnosticTestByName.set(created.name, created);
  }

  for (const [name, sampleType, description, testName] of biomarkers) {
    await prisma.biomarker.upsert({
      where: { name },
      update: { sampleType, description, diagnosticTestId: diagnosticTestByName.get(testName)?.id },
      create: { name, sampleType, description, diagnosticTestId: diagnosticTestByName.get(testName)?.id }
    });
  }

  const findingByName = new Map<string, { id: string }>();
  for (const [name, findingType, polarity, description] of observableFindings) {
    const created = await prisma.observableFinding.upsert({
      where: { name },
      update: { findingType, polarity, description },
      create: { name, findingType, polarity, description }
    });
    findingByName.set(created.name, created);
  }

  const temporalWindowByName = new Map<string, { id: string }>();
  for (const [name, phase, description] of temporalWindows) {
    const created = await prisma.temporalWindow.upsert({
      where: { name },
      update: { phase, description },
      create: { name, phase, description }
    });
    temporalWindowByName.set(created.name, created);
  }

  const domainByName = new Map((await prisma.functionalDomain.findMany()).map((item) => [item.name, item]));
  const phenotypeByName = new Map((await prisma.phenotype.findMany()).map((item) => [item.name, item]));
  const mechanismByName = new Map((await prisma.mechanismHypothesis.findMany()).map((item) => [item.name, item]));
  const triggerByName = new Map((await prisma.trigger.findMany()).map((item) => [item.name, item]));
  const interventionByName = new Map((await prisma.intervention.findMany()).map((item) => [item.name, item]));

  for (const [testName, targetType, targetLabel, findingName, windowName, weight, evidenceTier, explanation, discriminates] of diagnosticEvidenceRules) {
    const data: Prisma.DiagnosticEvidenceRuleUncheckedCreateInput = {
      diagnosticTestId: diagnosticTestByName.get(testName)!.id,
      weight,
      evidenceTier,
      explanation,
      discriminates,
      observableFindingId: findingByName.get(findingName)?.id,
      temporalWindowId: temporalWindowByName.get(windowName)?.id
    };

    if (targetType === "domain") data.functionalDomainId = domainByName.get(targetLabel)?.id;
    if (targetType === "phenotype") data.phenotypeId = phenotypeByName.get(targetLabel)?.id;
    if (targetType === "mechanism") data.mechanismHypothesisId = mechanismByName.get(targetLabel)?.id;
    if (targetType === "trigger") data.triggerId = triggerByName.get(targetLabel)?.id;
    if (targetType === "intervention") data.interventionId = interventionByName.get(targetLabel)?.id;

    await prisma.diagnosticEvidenceRule.create({ data });
  }

  await prisma.weightedEdge.createMany({
    data: weightedEdges.map(([sourceType, sourceLabel, targetType, targetLabel, relation, direction, weight, explanation]) => ({
      sourceType,
      sourceLabel,
      targetType,
      targetLabel,
      relation,
      direction,
      weight,
      explanation
    }))
  });
}

async function main() {
  const existingDomains = await prisma.functionalDomain.count();
  if (existingDomains > 0) {
    console.log("Core ontology seed data already exists; refreshing diagnostic graph seed.");
    await seedDiagnosticGraph();
    return;
  }

  await prisma.patientAnswer.deleteMany();
  await prisma.sessionScore.deleteMany();
  await prisma.scoreRule.deleteMany();
  await prisma.diagnosticEvidenceRule.deleteMany();
  await prisma.weightedEdge.deleteMany();
  await prisma.biomarker.deleteMany();
  await prisma.observableFinding.deleteMany();
  await prisma.temporalWindow.deleteMany();
  await prisma.diagnosticTest.deleteMany();
  await prisma.answerOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.intakeSession.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.phenotype.deleteMany();
  await prisma.carePathway.deleteMany();
  await prisma.mechanismHypothesis.deleteMany();
  await prisma.cellPopulation.deleteMany();
  await prisma.regionOrSystem.deleteMany();
  await prisma.functionalDomain.deleteMany();
  await prisma.symptom.deleteMany();
  await prisma.trigger.deleteMany();
  await prisma.timingPattern.deleteMany();
  await prisma.interventionResponse.deleteMany();
  await prisma.intervention.deleteMany();
  await prisma.outcomeMeasure.deleteMany();

  const domainByName = new Map<string, { id: string }>();
  for (const domain of domains) {
    const created = await prisma.functionalDomain.create({ data: domain });
    domainByName.set(created.name, created);
  }

  for (const [domainName, names] of Object.entries(regions)) {
    for (const name of names) {
      await prisma.regionOrSystem.create({ data: { name, type: domainName.includes("/") ? "region" : "system", functionalDomainId: domainByName.get(domainName)!.id } });
    }
  }

  const pathwayByName = new Map<string, { id: string }>();
  for (const pathway of pathways) {
    const created = await prisma.carePathway.create({ data: pathway });
    pathwayByName.set(created.name, created);
  }

  const phenotypeByName = new Map<string, { id: string }>();
  for (const [name, description, pathwayName] of phenotypes) {
    const created = await prisma.phenotype.create({ data: { name, description, pathwayId: pathwayByName.get(pathwayName)!.id } });
    phenotypeByName.set(name, created);
  }

  const cellByName = new Map<string, { id: string }>();
  const mechanismByName = new Map<string, { id: string }>();
  for (const [cellName, domainName, mechanismName, description] of mechanisms) {
    const cell = await prisma.cellPopulation.upsert({
      where: { name: cellName },
      update: {},
      create: { name: cellName, description }
    });
    cellByName.set(cellName, cell);
    const mechanism = await prisma.mechanismHypothesis.create({
      data: { name: mechanismName, description, functionalDomainId: domainByName.get(domainName)!.id, cellPopulationId: cell.id }
    });
    mechanismByName.set(mechanismName, mechanism);
  }

  const triggerByName = new Map<string, { id: string }>();
  for (const [name, className] of triggers) {
    const trigger = await prisma.trigger.create({ data: { name, className, description: `${className} trigger class` } });
    triggerByName.set(name, trigger);
  }

  for (const name of symptoms) await prisma.symptom.create({ data: { name } });
  for (const name of timings) await prisma.timingPattern.create({ data: { name } });

  const interventionByName = new Map<string, { id: string }>();
  for (const [name, category] of interventions) {
    const intervention = await prisma.intervention.create({ data: { name, category } });
    interventionByName.set(name, intervention);
    await prisma.interventionResponse.create({ data: { interventionId: intervention.id, responseLabel: "Reported improvement", interpretation: `${name} response is tracked as an intervention-response signal, not proof of mechanism.` } });
  }
  for (const [name, scale] of outcomes) await prisma.outcomeMeasure.create({ data: { name, scale } });

  async function createRule(answerOptionId: string, targetA: string, targetB: string, weight: number, explanation: string) {
    const data: Prisma.ScoreRuleUncheckedCreateInput = { answerOptionId, weight, explanation };
    for (const target of [targetA, targetB]) {
      const [kind, label] = target.split(":");
      if (kind === "domain") data.functionalDomainId = domainByName.get(label)!.id;
      if (kind === "phenotype") data.phenotypeId = phenotypeByName.get(label)!.id;
      if (kind === "mechanism") data.mechanismHypothesisId = mechanismByName.get(label)!.id;
      if (kind === "trigger") data.triggerId = triggerByName.get(label)!.id;
      if (kind === "intervention") data.interventionId = interventionByName.get(label)!.id;
    }
    await prisma.scoreRule.create({ data });
  }

  for (const [index, [code, prompt, category, options]] of questions.entries()) {
    const question = await prisma.question.create({ data: { code, prompt, category, sortOrder: index + 1 } });
    for (const [optionIndex, [label, value]] of options.entries()) {
      const option = await prisma.answerOption.create({ data: { questionId: question.id, label, value, sortOrder: optionIndex + 1 } });
      const mult = multiplier(value);
      const rules = [...(questionRules[code] ?? []), ...(ruleMap[value] ?? [])];
      for (const [targetA, targetB, weight, explanation] of rules) {
        const finalWeight = value === "none" || value === "unknown" || value === "slow" || value === "days" ? 0 : weight * (mult || 1);
        if (finalWeight > 0) await createRule(option.id, targetA, targetB, finalWeight, explanation);
      }
    }
  }

  await prisma.patient.create({ data: { name: "Demo Patient", email: "demo@example.local" } });
  await seedDiagnosticGraph();
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
