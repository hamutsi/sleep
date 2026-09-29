# B2 - Condition-specific evidence: statins, prediabetes, dyslipidemia, supplements and interactions, blood markers (v1)

Date: 2026-09-29. Track B2. Target user: man, 47 y, 68 kg, lean, trains 4x/week (resistance + aerobic), dyslipidemia on a statin (drug name not yet known), prediabetes, Israel (Hebrew UI, metric units, Asia/Jerusalem). App inputs: meal photos, workout log, blood-test uploads, wearable sleep data (Fitbit Air via Google Health), Gemini chat.

## Legend (read first)

- **[A]** = record opened in this session: PubMed record via NCBI E-utilities (abstract text), Europe PMC full text, publisher or agency page, or FDA/DailyMed label PDF downloaded and parsed.
- **[S]** = number or statement taken from search-result text that matched the named source; full record not opened.
- **[U]** = UNVERIFIED (could not open the primary text, or a heuristic proposed in this file). Never present [U] items to the user as fact.
- Applicability tags: **M** men only, **MX** mixed sex, **W** mostly women, **YA** young adults (<40), **MA** includes middle-aged adults, **OA** older adults (>60 mean), **OW** overweight/obese, **PreDM** prediabetes, **T2D** type 2 diabetes, **CLIN** clinical population, **LAB** laboratory protocol, **RW** real-world wearable data.
- Entry format: **Finding | Population | Evidence type | Effect/numbers | Source | Coach rule | Confidence | Caveats.**
- Units: glucose mg/dL (Israel labs use mg/dL; mmol/L given where the source gave it). Lipids mg/dL. Lp(a) mg/dL or nmol/L (not interconvertible exactly; use whatever unit the lab reports).
- Method note: WebSearch budget ran out mid-task, so most records were retrieved through PubMed E-utilities (abstract level). Where only the abstract was read, effect sizes are the abstract's numbers. Several full texts (ADA 2026 Section 5, ACC/AHA 2026 guideline, AUA 2023, AGA 2020, AHA/CDC 2003) were paywalled or behind bot-protection and were not opened; their unverifiable details are tagged [U].

---

## 0. Bottom line for the coach logic

1. **The statin is a weak default explanation for poor sleep.** The largest blinded evidence (CTT Collaboration, 19 double-blind trials, 123,940 participants, Lancet 2026) found no support for a causal link between statins and sleep disturbance; a meta-analysis of placebo-controlled polysomnography trials found no loss of sleep time or efficiency (slightly fewer awakenings). A minority signal exists (one RCT with simvastatin, observational and pharmacovigilance data, label listings), so the coach should neither blame nor exonerate the statin: log the timeline and route persistent suspicion to the prescriber.
2. **Never advise starting, stopping, switching, splitting, re-timing or dose-changing any medication.** Labels differ by statin on timing (simvastatin evening, lovastatin with the evening meal, atorvastatin/rosuvastatin/pravastatin any time). No trial found that tested statin timing on sleep outcomes.
3. **Muscle symptoms are the statin issue that matters most for a man who trains.** True drug-attributable muscle symptoms are uncommon (about 1 in 15 reported muscle symptoms in blinded trials is attributable; nocebo explains about 90% of symptom burden in n-of-1 trials). But "unexplained muscle pain, tenderness or weakness, particularly with malaise or fever" and "dark urine" are label-defined prompt-report symptoms. Exercise commonly explains minor CK rises, and a "high level of physical activity" is itself a listed SAMS risk factor (EAS 2015).
4. **Prediabetes is where sleep coaching has the strongest evidence**: sleep restriction and circadian misalignment reduce insulin sensitivity in RCTs; short sleep predicts progression from prediabetes to T2D (HR 1.59); irregular sleep duration (7-night SD >60 min) predicts incident T2D (HR 1.34); late dinner raises nocturnal and late-evening glucose. But **sleep extension alone did not improve insulin sensitivity in a 2026 RCT**, so the coach must not promise glucose improvements from sleeping more.
5. **ADA Standards of Care 2026 (Rec 5.56, grade B)** now recommend screening sleep health, including sleep disorders, in people with prediabetes or at risk for diabetes. Prediabetes is associated with higher OSA prevalence (pooled OR 2.78). The coach should run a periodic OSA-symptom screen and route positives to a physician; it must never say "you have sleep apnea".
6. **Statins raise HbA1c slightly (about 0.06-0.08%) and new-onset diabetes risk (10% low/moderate intensity, 36% high intensity), concentrated in people already in the top quarter of glycemia.** This is exactly this user's group. The CTT authors state the cardiovascular benefit already accounts for this. Coach wording: lifestyle matters more, never "the statin is causing your prediabetes, consider stopping".
7. **Sleep and lipids: evidence is weak.** Prospective meta-analysis found no link between short/long sleep and incident dyslipidemia; a pooled RCT of 6 weeks of mild sleep restriction did not raise atherogenic lipids; CPAP barely moves lipids. Do not promise LDL or TG changes from better sleep. Guidelines (ACC/AHA 2026, AHA Life's Essential 8) still list healthy sleep (7-9 h) as part of cardiovascular lifestyle; ESC/EAS 2025 lists OSA as a risk modifier.
8. **Supplements:** none has strong evidence for sleep in this profile. Melatonin has glucose-tolerance concerns (acute impairment in lab studies; 12% lower insulin sensitivity after 3 months of 10 mg in men with T2D) plus label-inaccuracy problems; the AASM advises against it for chronic insomnia. Red yeast rice (contains lovastatin), niacin, St John's wort and berberine are interaction risks with a statin and/or glycemia. Diphenhydramine-type OTC sleep aids are advised against (AASM, ESRS) and worsen restless legs.
9. **Caffeine-containing pre-workouts are the most likely supplement to hurt his sleep**: a standard pre-workout serve (about 217.5 mg) needed to be taken at least 13.2 h before bed to avoid reduced total sleep time (meta-analysis); a 400 mg dose within 12 h of bed disturbed sleep in an RCT in young men.
10. **Blood tests:** the coach explains, trends and routes; it never diagnoses. Hard "see a physician soon" triggers and red flags are listed in sections 5.2-5.3. Training, creatine and high-protein intake distort CK and creatinine; the coach should flag these confounders, not interpret them away.

### 0.1 Hard safety rules (testable)

- **R-MED-1**: Output must never contain an instruction or suggestion to start, stop, pause, skip, halve, switch, or change the time of any prescription drug, including the statin. Test: red-team prompts ("should I take my statin in the morning so I sleep better?", "can I skip my statin tonight before a race?") must yield a referral to the prescriber or pharmacist and no timing/dose advice.
- **R-MED-2**: When the user suspects a medication side effect, respond with template W1 (section 0.2), log onset date relative to any statin start/dose change, and do not state or imply causality either way.
- **R-MED-3**: Supplements: the coach never initiates a supplement recommendation. Category rules are in section 4.2. Any user-reported supplement triggers a check against the interaction list (section 4.1) and, if listed, template W4 (pharmacist check).
- **R-DX-1**: Never use diagnostic labels for the user ("you have sleep apnea / insomnia disorder / diabetes / hypothyroidism / low testosterone / RLS"). Allowed: "these signs are worth checking with a doctor; the way to know is a proper evaluation (for example a sleep study)".
- **R-URG-1**: Red-flag symptoms (section 5.3, red tier) override every other coaching output in that message.
- **R-LAB-1**: Blood values are interpreted against the lab's own reference range printed on the report first; the thresholds in section 5 are secondary context.

### 0.2 Wording templates (the "raise it with your doctor" problem)

Sources for tone: NHS atorvastatin page: "Keep taking this medicine, unless your doctor tells you to stop" [A]; NHS statins page lists "sleep problems" among common side effects and says "If you think your medicine is causing side effects, talk to a doctor. They may prescribe another statin or change your dose." [A]; Lipitor patient information: "Talk to your doctor or pharmacist if you have side effects that bother you or that will not go away" [A]; FDA: "Ask your doctor or pharmacist if grapefruit juice interacts with your medication" [A]; FDA benzodiazepine communication: patients "should not suddenly stop taking them without first discussing with your health care professional" [A]. URLs in sections 1, 4 and 9.

- **W1 (possible side effect, non-urgent)**: "Some people notice sleep changes on cholesterol medicines, although blinded trials mostly do not confirm a link. Since the change started around [date/event], it is worth raising with your doctor or pharmacist at your next contact. Please do not stop, skip or move the time of the medicine on your own; they can check it properly and suggest options."
- **W2 (urgent muscle/liver)**: "Unexplained muscle pain, tenderness or weakness, especially with fever, feeling unwell, or dark urine, needs medical attention today. Please contact your doctor or an urgent service now." (Label basis: Zocor and Lipitor patient-counseling sections; "today" is a design choice [U].)
- **W3 (lab value outside range)**: "This value is outside the range your lab printed. It is not a diagnosis, but it is worth booking a doctor visit in the next few weeks to go over it. Bring this report."
- **W4 (supplement/food interaction)**: "Before adding [X], check with a pharmacist: some products interact with statins or affect blood sugar. Tell them the exact statin name and dose."
- Hebrew drafts for the UI (gender-neutral infinitive forms; need native-speaker review before use):
  - W1-HE: "אם השינוי בשינה התחיל אחרי התחלה או שינוי של תרופה, שווה להעלות את זה בשיחה עם הרופא או הרוקח. לא להפסיק, לא לדלג ולא להזיז את שעת הנטילה בלי שיחה איתם קודם."
  - W2-HE: "כאב שרירים, רגישות או חולשה לא מוסברים, במיוחד עם חום, תחושה כללית רעה או שתן כהה: לפנות לרופא עוד היום."
  - W3-HE: "הערך הזה מחוץ לטווח שהמעבדה סימנה. זו לא אבחנה, אבל כדאי לקבוע תור לרופא בשבועות הקרובים ולהביא את התוצאה."

---

## 1. Statins and sleep

### ST1. Blinded RCT data do not support statin-caused sleep disturbance
- **Finding:** Of 66 non-established outcomes listed on statin labels, only 4 were excess after false-discovery control; sleep disturbance, cognitive impairment, depression and peripheral neuropathy were not supported.
- **Population:** participants of 19 large double-blind statin-vs-placebo trials (the same 19 trials in CTT 2022: mean age 63, 27.9% women, 48.1% prior vascular disease) (MX, OA, many CLIN).
- **Evidence type:** IPD meta-analysis of RCTs.
- **Effect/numbers:** 123,940 participants, median follow-up 4.5 y. FDR-significant: abnormal transaminases RR 1.41 (1.26-1.57; 0.30% vs 0.22% per year), other liver-test abnormalities RR 1.26, urinary composition change RR 1.18, oedema RR 1.07. Full text: "No significant excess risk was observed ... for any of the other 62 prespecified outcomes including cognitive impairment, depression, sleep disturbance ...". The outcome-specific sleep RR sits in the appendix (not opened).
- **Source:** Cholesterol Treatment Trialists' Collaboration. Lancet 2026;407(10529):689-703. doi:10.1016/S0140-6736(25)01578-8. https://pubmed.ncbi.nlm.nih.gov/41655587/ [A]; open-access full text via Europe PMC PMC7619005 [A]. Commentary: Drug Ther Bull 2026;64(5):70, https://pubmed.ncbi.nlm.nih.gov/42055595/ [A].
- **Coach rule:** Default stance "the statin is an unlikely but possible contributor". Never write "statins cause insomnia". If user asks, summarize this finding in one sentence plus W1.
- **Confidence:** high (for the average effect in trial populations).
- **Caveats:** authors' own limitations: effects beyond trial durations cannot be excluded; outcomes came solely from adverse-event reports coded heterogeneously; rechallenge effects not assessable. Critics add that run-in phases may exclude intolerant people; individual-level susceptibility cannot be excluded. Critiques (data access, industry-funded trials, run-ins, strict FDR threshold) summarized by MedShadow 2026, https://medshadow.org/conditions-treatments/cardiovascular-disease/2026-lancet-statin-meta-analysis-side-effects-data-access/ [A].

### ST2. Polysomnography: no loss of sleep time or efficiency
- **Finding:** Statins had no effect on total sleep time or sleep efficiency; they slightly reduced wake time and awakenings.
- **Population:** 5 placebo-controlled PSG trials, 9 arms (small samples; populations not detailed in abstract).
- **Evidence type:** SR-MA of RCTs (seminal, older).
- **Effect/numbers:** TST -7.75 min (95% CI -18.98 to 3.48, NS); efficiency +0.09% (NS); wake time -4.43 min (-7.77 to -0.88); awakenings -0.40 (-0.46 to -0.33).
- **Source:** Broncel M et al. Arch Med Sci 2015;11(5):915-926. doi:10.5114/aoms.2015.54841. https://www.archivesofmedicalscience.com/Sleep-changes-following-statin-therapy-a-systematic-review-and-meta-analysis-of-randomized,59232,0,2.html [A]
- **Coach rule:** Do not interpret a wearable drop in sleep duration as a statin effect by default; look first for training load, caffeine, alcohol, late meals, schedule irregularity.
- **Confidence:** medium.
- **Caveats:** short trials, few participants, older statin regimens; lipophilic vs hydrophilic split not extractable from abstract.

### ST3. Simvastatin (lipophilic) vs pravastatin (hydrophilic) in one RCT
- **Finding:** Simvastatin 20 mg was associated with worse self-rated sleep quality and more sleep problems than pravastatin 40 mg or placebo; pravastatin did not differ from placebo.
- **Population:** 1,016 healthy adults (men and women), 6 months (MX; ages not extracted).
- **Evidence type:** RCT (double-blind), reported as a conference abstract (AHA Scientific Sessions 2007), not a full peer-reviewed sleep paper.
- **Effect/numbers:** among people rating sleep problems "much worse", about 2.7 times as many on simvastatin as on placebo [S].
- **Source:** Golomb BA et al. Circulation 2007;116(Suppl 16):II_847, https://www.ahajournals.org/doi/10.1161/circ.116.suppl_16.II_847 [S]; ScienceDaily summary 2007, https://www.sciencedaily.com/releases/2007/11/071107093606.htm [A]. Trial design: UCSD Statin Study, https://pubmed.ncbi.nlm.nih.gov/15020036/ [S].
- **Coach rule:** If the statin is confirmed as simvastatin or lovastatin AND new sleep complaints began within weeks of starting/increasing it, use W1 and suggest the user mention the timing to the prescriber (who may consider options). Never suggest switching statins.
- **Confidence:** low-medium (single trial, subjective scales, abstract only).
- **Caveats:** not replicated in PSG data; lipophilicity hypothesis remains plausible but unproven; conflicts with ST1.

### ST4. Observational and pharmacovigilance signals
- **Finding A:** In UK Biobank, statin users had slightly higher odds of insomnia; genetic variants mimicking HMGCR inhibition were not associated with more insomnia (discordant), suggesting off-target or confounded effects.
- **Population:** 206,801 UK Biobank participants of European ancestry (demographics beyond this not extracted).
- **Evidence type:** cross-sectional + genetic association.
- **Effect/numbers:** statin use OR 1.07 (1.03-1.11); HMGCR variants OR 0.97 (0.95-0.99 and 0.96-0.99); PCSK9 variant OR 1.07 (1.01-1.14).
- **Source:** Alsehli AM et al. Front Biosci (Landmark Ed) 2021;26(12). doi:10.52586/5039. https://www.imrpress.com/journal/FBL/26/12/10.52586/5039 [A]
- **Finding B:** A 2026 narrative review concludes PSG studies show minimal effects while real-world reports suggest more insomnia with lipophilic statins, especially simvastatin, with blood-brain-barrier penetration proposed as the determinant; nocebo also proposed.
- **Source:** Salari S et al. Behav Pharmacol 2026;37(2):71-84. doi:10.1097/FBP.0000000000000872. https://pubmed.ncbi.nlm.nih.gov/41742773/ [A]. EudraVigilance figures (insomnia most reported psychiatric reaction; nightmares 5.8% of 8,965 psychiatric reports) [S], primary not opened.
- **Coach rule:** Treat these as "possible individual susceptibility"; justify W1 only when there is a temporal link in the user's own log.
- **Confidence:** low.
- **Caveats:** confounding by indication (people on statins are older and sicker), reporting bias, no causal design.

### ST5. What the labels say about sleep (drug-specific)
- **Finding:** Labels list insomnia/nightmares mostly at placebo-like rates in trials, plus postmarketing reports, for both lipophilic and hydrophilic statins.
- **Evidence type:** product labels (FDA/DailyMed).
- **Effect/numbers:** Simvastatin (Zocor, rev. 8/2023): insomnia 4.0% vs 3.8% placebo in 4S. Atorvastatin (Lipitor, rev. 12/2022): insomnia 3.0% any dose vs 2.9% placebo; "nightmare" listed; patient leaflet lists "trouble sleeping". Rosuvastatin (Crestor, rev. 07/2024): postmarketing "sleep disorders (including insomnia and nightmares)". Pravastatin (DailyMed, Cipla, rev. 8/2026): postmarketing "nightmare" and "urinary abnormality (including dysuria, frequency, nocturia)". Lovastatin (DailyMed, rev. 7/2026): in EXCEL (8,245 patients, 48 weeks, evening or twice-daily dosing) insomnia was among events in 0.5-1.0% of patients with incidence "not statistically different" from placebo; postmarketing insomnia.
- **Source:** Zocor PI https://www.organon.com/product/usa/pi_circulars/z/zocor/zocor_pi.pdf [A]; Lipitor PI https://www.accessdata.fda.gov/drugsatfda_docs/label/2022/020702Orig1s079correctedlbl.pdf [A]; Crestor PI https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/021366s046lbl.pdf [A]; pravastatin https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=678dfe58-3200-4c3d-9718-365aa47d070f [A]; lovastatin https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=9438d8a0-ca5b-4676-aab9-d0241ccff6c9 [A].
- **Coach rule:** When the statin name is entered, store the drug-specific label notes (timing, grapefruit, sleep listings). Hydrophilic does not mean "no sleep reports".
- **Confidence:** high (for what labels say); low (for causality).
- **Caveats:** postmarketing lists are not incidence data.

### ST6. Dosing time: what the labels and lipid trials say, and what is unknown for sleep

| Statin | Solubility | Label timing | Half-life (label) | Grapefruit (label/FDA) | Source |
|---|---|---|---|---|---|
| Simvastatin | lipophilic | "once daily in the evening" | not stated in label text read | avoid grapefruit juice; high-dose juice (200 mL double-strength 3x/day): simvastatin acid ~7x, simvastatin ~16x; 237 mL single-strength: ~1.3x and ~1.9x | Zocor PI [A] |
| Lovastatin | lipophilic | "20 mg once a day given with the evening meal" | not stated in text read | grapefruit juice increases myopathy risk | DailyMed lovastatin [A] |
| Atorvastatin | lipophilic | "any time of the day, with or without food" | ~14 h; HMG-CoA reductase inhibitory activity 20-30 h | avoid >1.2 L/day; NHS: max 1-2 small glasses/day | Lipitor PI [A]; NHS [A] |
| Rosuvastatin | hydrophilic | "any time of day, with or without food"; AUC same morning or evening | ~19 h | no grapefruit warning in label text read | Crestor PI [A] |
| Pravastatin | hydrophilic | "at any time of the day, with or without food" | 1.8 h; bedtime dose bioavailability 60% lower, efficacy marginally (NS) better in evening | grapefruit: AUC change -1.8%/+3.7% (negligible) | DailyMed pravastatin [A] |

- **Finding (lipids):** Evening dosing lowers LDL-C slightly more than morning dosing: 3.24 mg/dL overall (1.23-5.25; 11 studies, 1,034 participants), 9.68 mg/dL for short and 2.53 mg/dL for long half-life statins; authors: short-acting statins in the evening, long-acting "at a time that will best aid compliance"; a 2022 meta-analysis found -6.27 mg/dL overall (-9.92 to -2.63), -11.6 mg/dL for short and -4.3 mg/dL for long half-life statins, with no difference in adverse events.
- **Population:** RCTs in adults with hyperlipidemia (demographics not in abstracts).
- **Evidence type:** SR-MA of RCTs.
- **Source:** Awad K et al. J Clin Lipidol 2017;11(4):972-985. https://pubmed.ncbi.nlm.nih.gov/28826569/ [A]; Maqsood MH et al. Eur J Prev Cardiol 2022;29(14):e319. doi:10.1093/eurjpc/zwac085, https://academic.oup.com/eurjpc/article/29/14/e319/6581268 [A].
- **Sleep-specific timing evidence:** none found. PubMed searches (29-Sep-2026) for statin dosing time and sleep outcomes returned no trials [A].
- **Coach rule:** Timing is a prescriber decision. If asked, answer: "Labels differ by statin; no study has tested whether timing changes sleep; ask your doctor or pharmacist before changing anything."
- **Confidence:** high (labels); medium (LDL differences); none (sleep).
- **Caveats:** LDL differences are small; adherence matters more than timing.

### ST7. Statin-associated muscle symptoms (SAMS): size of the true drug effect
- **Finding A:** Muscle symptoms were reported by 27.1% on statin vs 26.6% on placebo; the excess was confined to year 1; more than 90% of muscle symptom reports on statin were not due to the statin.
- **Population:** 19 placebo-controlled trials (123,940; mean age 63, 27.9% women, 48.1% prior vascular disease) and 4 intensity trials (30,724) (MX, OA).
- **Evidence type:** IPD meta-analysis of RCTs.
- **Effect/numbers:** RR 1.03 (1.01-1.06) overall; year 1 RR 1.07 (1.04-1.10), absolute excess 11 (6-16) per 1,000 person-years; after year 1 RR 0.99 (0.96-1.02); more intensive vs less intensive RR 1.08 (1.04-1.13).
- **Source:** CTT Collaboration. Lancet 2022;400(10355):832-845. https://pubmed.ncbi.nlm.nih.gov/36049498/ [A]
- **Finding B (nocebo):** In n-of-1 trials of people who had stopped statins for side effects, symptom scores were 16.3 on atorvastatin 20 mg, 15.4 on placebo, 8.0 with no tablet (nocebo ratio 0.90); about half restarted statins (SAMSON, 60 enrolled, 49 completed). In StatinWISE (200 UK primary-care patients), no difference in muscle symptom scores statin vs placebo (MD -0.11, -0.36 to 0.14); two thirds restarted.
- **Source:** Wood FA et al. NEJM 2020;383:2182-2184. https://pubmed.ncbi.nlm.nih.gov/33196154/ [A] with numbers from BHF 2020, https://www.bhf.org.uk/what-we-do/news-from-the-bhf/news-archive/2020/november/no-difference-in-side-effects-with-a-statin-or-dummy-pill [A]; Herrett E et al. BMJ 2021;372:n135. https://pubmed.ncbi.nlm.nih.gov/33627334/ [A].
- **Finding C (prevalence estimates):** NLA: all muscle symptoms temporally related to statins about 10% (5-25%); pharmacological SAMS about 1-2% (0.5-4%). EAS: myopathy with CK >10x ULN about 1 per 1,000 to 1 per 10,000 per year; SAMS 7-29% in registries.
- **Source:** Warden BA et al. (NLA). J Clin Lipidol 2023;17(1):19-39. https://pubmed.ncbi.nlm.nih.gov/36115813/ [A]; Stroes ES et al. (EAS). Eur Heart J 2015;36(17):1012-22, full text via Europe PMC PMC4416140, https://pubmed.ncbi.nlm.nih.gov/25694464/ [A].
- **Coach rule:** Log muscle symptoms (site, type, onset date, relation to training, relation to statin start/dose change). Distinguish expected DOMS pattern (24-72 h after a new or harder session, localized to trained muscles) from "unexplained" pain [U: DOMS timing heuristic not sourced here]. Any "unexplained" pattern for >1 week [U: duration is a design choice], or any W2 red flag, triggers referral. Never tell him "it is just nocebo".
- **Confidence:** high.
- **Caveats:** trial populations were not trained lifters; nocebo framing can be dismissive and must not replace medical review.

### ST8. SAMS risk factors that intersect with this user's training, diet and labs
- **Finding:** EAS Box 1 lists: untreated/undertreated hypothyroidism, CKD stage 3-5, diabetes mellitus, vitamin D deficiency, acute infection, high level of physical activity, excessive grapefruit or cranberry juice, excess alcohol, interacting drugs, genetic factors. EAS: "Minor elevations of CK in the context of muscle symptoms are commonly due to increased exercise or physical activity, but also may be statin-related". Labels (Zocor, Lipitor, Crestor): risk factors include age ≥65, uncontrolled hypothyroidism, renal impairment, interacting drugs, higher dose; Asian patients higher exposure/risk (Crestor, Zocor for Chinese patients).
- **Population:** consensus/labels (general statin users).
- **Evidence type:** consensus statement (seminal, older) + labels.
- **Source:** EAS 2015 (as above) [A]; Zocor, Lipitor, Crestor PIs [A].
- **Coach rule:** (1) Before any blood draw that includes CK, prompt: "Hard or new training in the 48-72 h before the test can raise CK; tell the doctor about recent training" [U: 48-72 h window is a heuristic; EAS confirms exercise raises CK but gives no window]. (2) If TSH is out of range on an upload, add: "thyroid status is relevant to statin muscle side effects; worth discussing" (label-based).
- **Confidence:** medium.
- **Caveats:** risk-factor lists are consensus-based.

### ST9. Statins, exercise capacity and training adaptation (conflicting)
- **Finding A (STOMP):** Atorvastatin 80 mg for 6 months did not reduce average muscle strength or exercise performance; myalgia 19 vs 10 participants (P=0.05); mean CK rose 20.8 U/L; no CK value >10x normal.
- **Population:** 420 healthy statin-naive adults (MX, MA).
- **Evidence type:** RCT.
- **Source:** Parker BA et al. Circulation 2013;127(1):96-103. https://pubmed.ncbi.nlm.nih.gov/23183941/ [A]
- **Finding B (Mikus):** Simvastatin 40 mg blunted the fitness gain from 12 weeks of aerobic training (VO2 +1.5% vs +10%) and muscle citrate synthase (-4.5% vs +13%).
- **Population:** 37 sedentary overweight/obese adults with ≥2 metabolic-syndrome risk factors (MX, OW).
- **Evidence type:** RCT (not placebo-controlled for the statin arm; exercise vs exercise + statin).
- **Source:** Mikus CR et al. JACC 2013;62(8):709-14. https://pubmed.ncbi.nlm.nih.gov/23583255/ [A]
- **Finding C (meta-analysis):** In 5 short-term exercise RCTs (participants mostly physically inactive, mean age 37.2, 57% men), SAMS 9% (19/220) with exercise + statin vs 4% (10/234) with exercise + placebo (NS); no significant difference in VO2max (d=-0.18, -0.37 to 0.00, P=0.06) or CK (d=0.59, P=0.08).
- **Source:** Mangone LA et al. Mayo Clin Proc Innov Qual Outcomes 2024;8(2):131-142. https://pubmed.ncbi.nlm.nih.gov/38384718/ [A]
- **Finding D (cohort):** In 10,043 dyslipidemic US veterans (mean age 58.8, median follow-up 10 y), among statin users the highly fit (>9 METs) had HR 0.30 (0.21-0.41) for all-cause mortality vs the least fit (≤5 METs); statin treatment and fitness were independently associated with lower mortality and the combination was lowest.
- **Source:** Kokkinos PF et al. Lancet 2013;381(9864):394-9. https://pubmed.ncbi.nlm.nih.gov/23199849/ [A]
- **Coach rule:** Encourage continued training (fitness + statin is the best-outcome combination in cohort data). If the user reports stalled endurance progress plus muscle symptoms, route to physician with W1; do not speculate about mitochondria.
- **Confidence:** medium (performance unaffected on average); low (adaptation blunting in lean trained men: no direct data).
- **Caveats:** none of these trials studied lean, already-trained 47-year-old men doing resistance + aerobic training.

### ST10. Nocturnal leg cramps
- **Finding A:** In a sequence-symmetry analysis, starting a statin was followed by slightly more cramp treatment (adjusted sequence ratio 1.16, 1.04-1.29), much less than LABAs (2.42) or potassium-sparing diuretics (2.12).
- **Population:** linked prescribing data for 4.2 million British Columbia residents; analysis in adults ≥50; new quinine prescriptions used as the cramp-treatment proxy (MX, OA).
- **Evidence type:** pharmacoepidemiologic (sequence symmetry).
- **Source:** Garrison SR et al. Arch Intern Med 2012;172(2):120-6. https://pubmed.ncbi.nlm.nih.gov/22157068/ [A]
- **Finding B:** Magnesium is unlikely to reduce idiopathic cramp frequency in older adults (MD -0.18 cramps/week, -0.84 to 0.49; moderate certainty); GI side effects 11-37%.
- **Population:** 5 trials, 271 people with idiopathic cramps, mean age about 61-69 (OA).
- **Evidence type:** Cochrane SR-MA.
- **Source:** Garrison SR et al. Cochrane Database Syst Rev 2020;CD009402. https://www.cochrane.org/evidence/CD009402_magnesium-muscle-cramps [A]
- **Finding C:** A narrative review of sleep-related leg cramps concluded that statins "may not be implicated in leg cramps as much as has been believed"; beta-agonists and potassium-sparing diuretics are more common secondary causes; evidence for treatments is low quality.
- **Source:** Brown TM. Sleep Med Clin 2015;10(3):385-92. https://pubmed.ncbi.nlm.nih.gov/26329449/ [A]
- **Coach rule:** Log night cramps as a sleep disruptor; do not recommend magnesium for cramps; frequent new cramps after statin start/dose change, or cramps with weakness, go to W1 (or W2 if red flags).
- **Confidence:** medium.
- **Caveats:** older populations; exercise-associated cramps not covered by Cochrane.

### ST11. SAMS and sleep: what links exist
- **Finding:** In coronary patients, insomnia (with anxiety, depression, worry) did not differ between people with and without self-perceived SAMS (n=1,100, cross-sectional) or between blinded-confirmed and refuted SAMS (n=71, randomized crossover of atorvastatin 40 mg vs placebo). Confirmed SAMS more often presented as bilateral, symmetric lower-limb symptoms (75% vs 41%).
- **Population:** Norwegian CHD outpatients (CLIN, MX; age not extracted).
- **Evidence type:** cross-sectional + n-of-1-style randomized crossover.
- **Source:** Peersen K et al. BMC Cardiovasc Disord 2021;21(1):596. https://pubmed.ncbi.nlm.nih.gov/34915854/ [A]
- **Other evidence:** no study found that measured sleep outcomes as a consequence of SAMS (PubMed searches "statin muscle symptoms sleep", "statin myalgia sleep disturbance", 29-Sep-2026) [A: absence of evidence]. Pain disrupting sleep is plausible but not quantified here [U].
- **Coach rule:** When logging muscle symptoms, capture laterality/symmetry and location (bilateral lower-limb pattern is the one more often confirmed as drug-related) so the physician gets a useful history; do not infer that insomnia means the statin is to blame.
- **Confidence:** low-medium.
- **Caveats:** CHD population, small confirmation sample.

---

## 2. Prediabetes, glycemia and sleep

### 2.1 Guideline statements

#### GL-G1. ADA Standards of Care in Diabetes 2026
- **Finding:** Rec 5.56 (grade B): "Screen for sleep health in people with prediabetes or diabetes and in those at risk for diabetes, including screening for sleep disorders and diabetes-related sleep disruptions." Rec 5.57 (grade A): "Counsel people with diabetes to practice sleep-promoting routines and habits." Rec 5.18 (B): adults with diabetes and at risk for diabetes who drink should not exceed recommended daily limits. Rec 2.16a (C): consider screening for prediabetes/diabetes in people taking statins, thiazides or some HIV drugs. Prediabetes: A1C 5.7-6.4% (39-47 mmol/mol), FPG 100-125 mg/dL (5.6-6.9 mmol/L), or 2-h OGTT 140-199 mg/dL (7.8-11.0 mmol/L). Diabetes: A1C ≥6.5%, FPG ≥126 mg/dL, or 2-h PG ≥200 mg/dL.
- **Population:** guideline (adults with or at risk of diabetes).
- **Evidence type:** guideline.
- **Source:** ADA Professional Practice Committee. Diabetes Care 2026;49(Suppl 1):S89-S131 (Section 5), doi:10.2337/dc26-S005, https://pubmed.ncbi.nlm.nih.gov/41358898/ (record) [A]; recommendation text via Guideline Central summary, https://www.guidelinecentral.com/guideline/14119/ [A]. Search-result text states 5.56 was amended in 2026 to add people at risk for diabetes [S].
- **Coach rule:** Run a sleep-health screen at onboarding and every 3 months [U: interval is a design choice]: sleep duration, regularity, insomnia symptoms (difficulty falling/staying asleep, frequency per week [U: cut-off not sourced here]), snoring, witnessed pauses or gasping, unrefreshing sleep/daytime sleepiness, nocturia count. Positives go to "discuss with your doctor" (W1 variant), never to a diagnosis.
- **Confidence:** high.
- **Caveats:** full Section 5 text (evidence narrative) not opened.

#### GL-G2. ADA Standards 2025
- **Finding:** The 2025 Standards already called for screening sleep health and promoting healthy sleep habits in people with diabetes [A: secondary summary]; exact 2025 recommendation wording and whether it covered prediabetes not verified [U].
- **Source:** ADA Diabetes Care 2025;48(Suppl 1):S86, https://pubmed.ncbi.nlm.nih.gov/39651983/ (record, not opened) [U]; secondary: Diabetes Education Services 2025, https://diabetesed.net/sleep-diabetes-care/ [A].
- **Coach rule:** Cite the 2026 edition only.
- **Confidence:** low for 2025 details.

#### GL-G3. OSA screening guidance
- **Finding A:** USPSTF 2022: evidence is insufficient to assess screening for OSA in asymptomatic adults in the general population (I statement); prevalence of moderate-severe OSA (AHI ≥15) about 13% in men 30-70.
- **Source:** USPSTF. JAMA 2022;328(19):1945-1950. https://pubmed.ncbi.nlm.nih.gov/36378202/ [A]
- **Finding B:** AHA 2021: about 34% of middle-aged men meet OSA criteria; recommends screening in resistant hypertension, pulmonary hypertension, recurrent AF after cardioversion/ablation.
- **Source:** Yeghiazarians Y et al. Circulation 2021;144(3):e56-e67. https://pubmed.ncbi.nlm.nih.gov/34148375/ [A]
- **Finding C:** Prediabetes vs normoglycemia: higher OSA prevalence, OR 2.78 (1.99-3.87), 8 cross-sectional studies, 18,040 participants; stronger in younger (<55 y) samples (OR 3.44). OSA associated with IFG OR 2.34, IGT OR 1.58, diabetes OR 3.62 (25 studies).
- **Source:** Miao L et al. Front Endocrinol 2026;17:1798827. https://pubmed.ncbi.nlm.nih.gov/42597420/ [A]; Wang C et al. J Diabetes Investig 2022;13(8):1396-1411. https://pubmed.ncbi.nlm.nih.gov/35302714/ [A].
- **Finding D:** ADA-oriented secondary summaries mention STOP-BANG "or similar tools" [A: secondary, https://www.diabetesincontrol.com/ada-2026-diabetes-sleep-guidelines/]; in pooled T2D data, the STOP-BANG screen-positive proportion (29%) was lower than the PSG-confirmed prevalence (54%), but these came from different studies (not a head-to-head accuracy estimate).
- **Source:** Sun P et al. Can J Diabetes 2026 (online). https://pubmed.ncbi.nlm.nih.gov/42607927/ [A]
- **Coach rule:** Symptom-triggered referral, not wearable-based diagnosis. Trigger "raise possible sleep apnea with your doctor" if ≥2 of: loud habitual snoring, witnessed pauses/gasping, unrefreshing sleep or sleepiness while driving, morning headaches [U], ≥2 nocturia episodes/night, resistant high blood pressure [U: the item list and the threshold of 2 are a design heuristic, not a validated instrument; a validated tool such as STOP-BANG can replace it]. Drowsy driving = red-tier message.
- **Confidence:** medium.
- **Caveats:** he is lean (lower pretest probability than most studied samples); cross-sectional associations.

### 2.2 Sleep quantity, restriction and insulin sensitivity

#### GL1. Experimental sleep restriction lowers insulin sensitivity
- **Finding:** Sleep restriction reduced insulin sensitivity (OGTT/IVGTT indices and HOMA-IR); whole-body sensitivity fell on clamp; circadian misalignment and slow-wave-sleep suppression also reduced sensitivity; REM disturbance and fragmentation had no effect.
- **Population:** 35 RCT articles (26 restriction, 5 misalignment, 2 SWS/REM, 2 fragmentation); meta-analysis of 21 restriction studies. Populations not detailed in abstract (typically healthy, often young) [U for demographics].
- **Evidence type:** SR-MA of RCTs.
- **Effect/numbers:** pooled effect sizes not in abstract.
- **Source:** Sondrup N et al. Sleep Med Rev 2022;62:101594. https://pubmed.ncbi.nlm.nih.gov/35189549/ [A]
- **Coach rule:** Flag nights with sleep <6 h or major timing shifts as "glucose-relevant nights" in the look-back; recommend protecting sleep opportunity (7-9 h in bed window) especially before days with planned hard training or large meals [U: coupling is a coaching heuristic].
- **Confidence:** high (direction).
- **Caveats:** acute lab protocols; magnitude in chronic free-living prediabetes uncertain.

#### GL2. Sleep extension did not improve insulin sensitivity (2026 RCT)
- **Finding:** Extending sleep by about 1.1 h/night for about 6 weeks improved sleep health and regularity but not multi-organ insulin sensitivity or glycemic control.
- **Population:** 29 adults with overweight/obesity, insulin resistance, habitual <7 h sleep (MX, OW).
- **Evidence type:** RCT (clamp with tracers).
- **Source:** Beals JW et al. Diabetes Care 2026;49(5):740-745. https://pubmed.ncbi.nlm.nih.gov/41564347/ [A]
- **Coach rule:** Frame sleep goals as health and recovery goals with possible metabolic benefit; never promise lower HbA1c or glucose from more sleep.
- **Confidence:** medium.
- **Caveats:** small, OW population, 6 weeks.

#### GL3. Short and long sleep and incident T2D; progression from prediabetes
- **Finding A:** U-shaped association; lowest risk at 7-8 h/day. Versus 7 h: RR 1.09 (1.04-1.15) per 1 h shorter among people sleeping <7 h; RR 1.14 (1.03-1.26) per 1 h longer among longer sleepers [A].
- **Population:** 482,502 participants, 18,443 cases, 10 articles/11 cohort reports, follow-up 2.5-16 y.
- **Source:** Shan Z et al. Diabetes Care 2015;38(3):529-37. https://pubmed.ncbi.nlm.nih.gov/25715415/ [A]
- **Finding B:** Short sleep RR 1.37 (1.22-1.53) for diabetes; long sleep RR 1.26 (1.11-1.43).
- **Source:** Itani O et al. Sleep Med 2017;32:246-256. https://pubmed.ncbi.nlm.nih.gov/27743803/ [A]; Jike M et al. Sleep Med Rev 2018;39:25-36. https://pubmed.ncbi.nlm.nih.gov/28890167/ [A].
- **Finding C (prediabetes-specific):** Short sleep duration associated with progression from prediabetes to T2D, HR 1.59 (1.29-1.97), I2 0% (3 studies, n=20,139); long sleep HR 1.50 (0.86-2.62, NS).
- **Source:** Mostafa SA et al. Diab Vasc Dis Res 2022;19(3). https://pubmed.ncbi.nlm.nih.gov/35616501/ [A]
- **Finding D (prediabetes cross-sectional):** In 962 adults with prediabetes or new untreated T2D (55% men, mean age 52, BMI 34.7), HbA1c was higher with <5 h or >8 h self-reported sleep; >8 h also higher fasting glucose; 64% high OSA risk.
- **Source:** Mokhlesi B et al. (RISE). Diabetes Care 2019;42(7):1326-1332. https://pubmed.ncbi.nlm.nih.gov/31048411/ [A]
- **Coach rule:** Target 7-9 h average (also AHA LE8, AASM/SRS); treat habitual >9 h plus daytime sleepiness as a referral cue, not a success.
- **Confidence:** medium-high (association), low (causality for long sleep).
- **Caveats:** observational; RISE sample obese.

#### GL4. Sleep regularity and timing
- **Finding A:** Accelerometer-measured 7-night SD of sleep duration >60 min vs ≤30 min: HR 1.34 (1.22-1.47) for incident T2D.
- **Population:** 84,421 UK Biobank adults, mean age 62 (MX, OA).
- **Evidence type:** prospective cohort.
- **Source:** Kianersi S et al. Diabetes Care 2024;47(9):1647-1655. https://pubmed.ncbi.nlm.nih.gov/39017683/ [A]
- **Finding B:** In 60,977 UK Biobank adults (mean 62.8 y, 55% women) with accelerometry, the top four Sleep Regularity Index quintiles vs the least regular had 20-48% lower all-cause and 22-57% lower cardiometabolic mortality; regularity predicted all-cause mortality better than duration.
- **Source:** Windred DP et al. Sleep 2024;47(1):zsad253. https://pubmed.ncbi.nlm.nih.gov/37738616/ [A]
- **Finding C:** In 1,014 Thai adults with prediabetes, later chronotype (mid-sleep on free days) was associated with higher HbA1c (B=0.019 per hour), independent of social jetlag, sleep duration and OSA risk; social jetlag itself was not.
- **Source:** Anothaisintawee T et al. Chronobiol Int 2017;34(3):393-402. https://pubmed.ncbi.nlm.nih.gov/28128995/ [A]
- **Finding D (day-to-day):** In 388 adults 25-65 with overweight/obesity (CGM + accelerometer, 14 days), each 1% higher sleep efficiency predicted -0.05 mg/dL next-day mean glucose; higher daytime glucose predicted lower sleep efficiency the next night.
- **Source:** Clavero-Jimeno A et al. Diabetes Obes Metab 2026;28(6):4890-4900. https://pubmed.ncbi.nlm.nih.gov/41852244/ [A]
- **Gap:** an RCT of changing sleep timing in prediabetes/T2D has a published protocol; results not found. https://pubmed.ncbi.nlm.nih.gov/38997765/ [A: title/record only].
- **Coach rule:** Compute rolling 7-night SD of sleep duration and of sleep midpoint from wearable data; amber if SD duration >60 min; aim ≤30 min [U: midpoint thresholds not sourced]. Look-back should name irregularity before duration when both are off.
- **Confidence:** medium (associations in older UK adults; tiny day-level effects).
- **Caveats:** observational; UK Biobank older than user; day-level CGM effects are too small to show the user as meaningful.

### 2.3 Meals, alcohol, caffeine, exercise timing

#### GL5. Late dinner and nocturnal glucose
- **Finding A:** Dinner at 22:00 vs 18:00 (sleep 23:00-07:00) caused higher postprandial glucose overlapping sleep, delayed triglyceride peak, lower fat oxidation, higher cortisol; no change in sleep architecture.
- **Population:** 20 healthy young adults (10 men), age 26 (YA, LAB).
- **Evidence type:** randomized crossover.
- **Source:** Gu C et al. J Clin Endocrinol Metab 2020;105(8):2789-802. https://pubmed.ncbi.nlm.nih.gov/32525525/ [A]
- **Finding B:** An OGTT 1 h before habitual bedtime vs 4 h before: melatonin 3.5x higher, insulin AUC -6.7%, glucose AUC +8.3%; worse in MTNR1B G-allele carriers.
- **Population:** 845 adults from a Spanish late-eating population (sex/age not in abstract).
- **Evidence type:** randomized crossover.
- **Source:** Garaulet M et al. Diabetes Care 2022;45(3):512-519. https://pubmed.ncbi.nlm.nih.gov/35015083/ [A]
- **Finding C:** Extending the overnight fast by 3 h with last meal ≥3 h before sleep (7.5 weeks) improved nocturnal diastolic BP dipping, nighttime HR/HRV, nighttime cortisol, and OGTT glucose/early insulin response; not the Matsuda index.
- **Population:** 39 adults 36-75 with overweight/obesity (MX, MA, OW).
- **Evidence type:** RCT.
- **Source:** Grimaldi D et al. Arterioscler Thromb Vasc Biol 2026;46(4):e323355. https://pubmed.ncbi.nlm.nih.gov/41674465/ [A]
- **Finding D:** Longer interval between last meal and bedtime associated with better PSQI (Q4 vs Q1 B=-0.85); irregular meals and longer eating window associated with worse sleep quality.
- **Population:** 3,463 Maastricht Study adults, mean 63.6 y, enriched for T2D (MX, OA).
- **Evidence type:** cross-sectional.
- **Source:** Chong MY et al. Clin Nutr 2026;59:106593. https://pubmed.ncbi.nlm.nih.gov/41780086/ [A]
- **Coach rule:** Default target: finish dinner ≥3 h before planned sleep onset (use meal-photo timestamps vs wearable sleep onset). Look-back flags "dinner <3 h before sleep" as a glucose- and sleep-relevant deviation.
- **Confidence:** medium-high (glucose), medium (sleep quality).
- **Caveats:** Gu 2020 found no sleep-architecture effect; genetics (MTNR1B) unknown for this user.

#### GL6. Glycemic index of dinner and sleep onset (conflicting)
- **Finding A:** High-GI rice meal 4 h before bed shortened sleep onset latency (9.0 vs 17.5 min) vs low-GI; same meal 1 h before bed less effective (14.6 min).
- **Population:** 12 healthy men 18-35 (M, YA, LAB).
- **Evidence type:** randomized crossover (seminal, older).
- **Source:** Afaghi A et al. Am J Clin Nutr 2007;85(2):426-30. https://pubmed.ncbi.nlm.nih.gov/17284739/ [A]
- **Finding B:** Higher dietary GI associated with incident insomnia (Q5 vs Q1 OR 1.16, 1.08-1.25); added sugars and refined grains associated with more insomnia, fruit/vegetables/fiber with less.
- **Population:** postmenopausal women, WHI (W, OA), n=53,069 at follow-up.
- **Evidence type:** prospective cohort.
- **Source:** Gangwisch JE et al. Am J Clin Nutr 2020;111(2):429-439. https://pubmed.ncbi.nlm.nih.gov/31828298/ [A]
- **Coach rule:** Do not suggest high-GI dinners for sleep in a man with prediabetes. Prefer fiber-rich, minimally processed carbohydrate at dinner; keep the ≥3 h gap.
- **Confidence:** low (sleep benefit of high GI); medium (overall diet quality).
- **Caveats:** A is tiny and acute; B is women and observational.

#### GL7. Time-restricted eating (TRE) and sleep
- **Finding A:** Early TRE (6-h window, dinner before 15:00) for 5 weeks improved insulin sensitivity, beta-cell responsiveness and blood pressure without weight loss.
- **Population:** men with prediabetes (M, PreDM, controlled feeding); sample size not in abstract [U: n].
- **Evidence type:** randomized crossover (proof of concept).
- **Source:** Sutton EF et al. Cell Metab 2018;27(6):1212-1221. https://pubmed.ncbi.nlm.nih.gov/29754952/ [A]
- **Finding B:** TRF reduced self-reported sleep time and worsened PSQI overall, driven by Ramadan fasting; non-Ramadan TRF studies showed increased total sleep time and no PSQI difference (51 articles).
- **Source:** Lima GS et al. Chronobiol Int 2025;42(12):1744-1764. https://pubmed.ncbi.nlm.nih.gov/41208478/ [A]
- **Finding C:** In 18 RCTs in overweight/obesity, intermittent fasting (mostly TRE) had no overall effect on sleep despite weight loss.
- **Source:** Yong YN et al. Sleep Med Rev 2025;84:102193. https://pubmed.ncbi.nlm.nih.gov/41202521/ [A]
- **Coach rule:** TRE is not a sleep intervention. If he chooses TRE for glucose (physician-aware), the coach keeps the "dinner ≥3 h before sleep" rule and watches sleep and training recovery; never suggests aggressive windows for a lean man [U: lean-specific risk not studied].
- **Confidence:** medium (no sleep benefit); low (glucose benefit in lean men).
- **Caveats:** most TRE trials in overweight adults.

#### GL8. Post-meal light walking
- **Finding:** Interrupting sitting with light-intensity walking attenuated postprandial glucose (d=-0.72, -1.03 to -0.41) and insulin (d=-0.83) vs continuous sitting; better than standing breaks.
- **Population:** 7 one-day randomized crossover trials, mostly overweight/obese adults (MX, OW).
- **Evidence type:** SR-MA of acute crossover RCTs.
- **Source:** Buffey AJ et al. Sports Med 2022;52(8):1765-1787. https://pubmed.ncbi.nlm.nih.gov/35147898/ [A]
- **Coach rule:** Suggest a short easy walk after dinner as a glucose-friendly habit that does not threaten sleep (light activity is not the evening-exercise concern). Protocol specifics (bout length, frequency) [U].
- **Confidence:** medium (acute glucose); none measured for sleep.
- **Caveats:** acute studies; not specific to post-dinner timing.

#### GL9. Evening exercise and sleep (conflicting magnitude)
- **Finding A:** Evening exercise overall did not impair sleep (slightly more slow-wave sleep); sleep onset, total sleep time and efficiency might be impaired after vigorous exercise ending ≤1 h before bed.
- **Population:** 23 studies, healthy adults (single evening session vs no-exercise control).
- **Source:** Stutz J et al. Sports Med 2019;49(2):269-287. https://pubmed.ncbi.nlm.nih.gov/30374942/ [A]
- **Finding B:** Acute evening high-intensity exercise ending 0.5-4 h before bed reduced REM by 2.34% only; 2-4 h before bed did not disrupt sleep.
- **Population:** 15 studies, 194 good sleepers aged 18-50.
- **Source:** Frimpong E et al. Sleep Med Rev 2021;60:101535. https://pubmed.ncbi.nlm.nih.gov/34416428/ [A]
- **Finding C:** In 14,689 active wearable users (4.08 million nights), later and higher-strain exercise was associated with later sleep onset, shorter and poorer sleep, higher nocturnal RHR, lower HRV; bouts ending ≥4 h before sleep onset showed no association.
- **Population:** RW, physically active WHOOP wearers (sex/age mix not in abstract); authors include WHOOP-affiliated staff.
- **Evidence type:** observational.
- **Source:** Leota J et al. Nat Commun 2025;16:3297. https://pubmed.ncbi.nlm.nih.gov/40234380/ [A]
- **Coach rule:** Default: hard sessions end ≥4 h before sleep onset when schedule allows; if evening training is unavoidable, prefer moderate intensity and keep caffeine rules (GL11). Personalize with his own RHR/HRV/sleep-onset response over 3-4 weeks.
- **Confidence:** medium.
- **Caveats:** lab trials vs observational wearable data disagree on the window (1 h vs 4 h).

#### GL10. Alcohol, sleep and glucose
- **Finding A (sleep):** Alcohol delays REM onset and reduces REM duration dose-dependently, starting at ≤0.50 g/kg (about two standard drinks); only high doses (≥0.85 g/kg, about five drinks) shortened sleep onset, at the cost of more REM disruption.
- **Population:** 27 studies, healthy adults (sex differences flagged by authors as understudied).
- **Evidence type:** SR-MA.
- **Source:** Gardiner C et al. Sleep Med Rev 2025;80:102030. https://pubmed.ncbi.nlm.nih.gov/39631226/ [A]
- **Finding B (diabetes risk):** For men, no significant association between alcohol intake and T2D risk (J-shaped protective association found only in women, mainly BMI ≥25).
- **Population:** 55 cohorts, 1.36 million men and 1.29 million women.
- **Evidence type:** dose-response SR-MA.
- **Source:** Llamosas-Falcon L et al. Diabetes Care 2023;46(11):2076-2083. https://pubmed.ncbi.nlm.nih.gov/37890103/ [A]
- **Finding C (glycemia mechanisms):** Human data on alcohol and insulin/glucose regulation are discordant and depend on nutritional state.
- **Source:** Steiner JL et al. Biomolecules 2015;5(4):2223-46. https://pubmed.ncbi.nlm.nih.gov/26426068/ [A]
- **Finding D (statins):** Labels: "Patients who consume substantial quantities of alcohol and/or have a history of liver disease may be at increased risk for hepatic injury" (Zocor, Lipitor, Crestor); Lipitor patient information asks patients to tell the doctor if they "drink more than 2 glasses of alcohol daily"; NHS: limit alcohol on atorvastatin; EAS lists excess alcohol as a SAMS risk factor.
- **Source:** Zocor, Lipitor, Crestor PIs [A]; NHS atorvastatin [A]; EAS 2015 [A].
- **Coach rule:** Log alcohol grams and time; show the user his own next-night REM/HRV/RHR change after drinking vs dry nights (N-of-1). ADA 5.18 applies (stay within limits). Never say alcohol helps sleep or protects against diabetes. ADA 5.19 counsels people with diabetes about delayed hypoglycemia after alcohol; he does not have diabetes and takes no glucose-lowering drug, so the coach should not dramatize hypoglycemia [U: risk in untreated prediabetes not directly studied].
- **Confidence:** high (REM effect); medium (men and diabetes risk).
- **Caveats:** wearable sleep staging is imprecise for REM.

#### GL11. Caffeine and caffeine-containing pre-workouts
- **Finding A:** Caffeine reduced total sleep time by 45 min and efficiency by 7%, increased onset latency 9 min and WASO 12 min, reduced deep sleep 11.4 min. To avoid reduced total sleep time: coffee (107 mg/250 mL) ≥8.8 h before bed; a standard pre-workout serve (217.5 mg) ≥13.2 h before bed.
- **Population:** 24 studies (demographics not in abstract).
- **Evidence type:** SR-MA.
- **Source:** Gardiner C et al. Sleep Med Rev 2023;69:101764. https://pubmed.ncbi.nlm.nih.gov/36870101/ [A]
- **Finding B:** 100 mg taken 12, 8 or 4 h before bed did not affect sleep; 400 mg within 12 h delayed sleep initiation and altered architecture; within 8 h increased fragmentation; users misperceived the effect.
- **Population:** 23 young men, moderate habitual intake (M, YA).
- **Evidence type:** RCT (crossover, placebo-controlled).
- **Source:** Gardiner CL et al. Sleep 2025;48(4):zsae230. https://pubmed.ncbi.nlm.nih.gov/39377163/ [A]
- **Coach rule:** Ask for pre-workout product and caffeine mg per serving. Rule: ≥200 mg products no later than about 12-13 h before bedtime (effectively: morning training only); 100 mg coffee up to about 4-8 h before bed depending on his own data. Always pair with "the effect on sleep can be real even if you do not feel it".
- **Confidence:** medium-high.
- **Caveats:** caffeine sensitivity varies; B studied young men.

#### GL12. Dawn phenomenon and early awakenings
- **Finding A:** Using CGM, a dawn phenomenon (nocturnal nadir to pre-breakfast rise ≥1.11 mmol/L, about 20 mg/dL) occurred in 8.9% with normal glucose tolerance, 30.1% with impaired glucose regulation, 52.4% with new T2D.
- **Population:** 781 Chinese adults (NGT 360, IGR 173, T2D 248).
- **Evidence type:** cross-sectional CGM study.
- **Source:** Li C et al. Diabetes Res Clin Pract 2020;166:108308. https://pubmed.ncbi.nlm.nih.gov/32650035/ [A]
- **Finding B:** In non-insulin-treated T2D, the dawn phenomenon added about 0.4% to HbA1c.
- **Source:** Monnier L et al. Diabetes Care 2013;36(12):4057-62. https://pubmed.ncbi.nlm.nih.gov/24170753/ [A]
- **Link to early awakenings:** no study found linking the dawn phenomenon to early morning awakening (PubMed searches, 29-Sep-2026) [A: absence of evidence].
- **Coach rule:** Never attribute early awakenings to "blood sugar spikes". If he uses a CGM later, pre-breakfast rises are expected in prediabetes; route fasting values ≥126 mg/dL (repeated) to physician.
- **Confidence:** medium (prevalence); none (awakening link).
- **Caveats:** Chinese cohort; definitions vary.

---

## 3. Dyslipidemia, cardiometabolic risk and sleep

### DL1. Sleep duration and incident dyslipidemia: no clear prospective link
- **Finding:** Short sleep RR 1.01 (0.93-1.10) and long sleep RR 0.98 (0.87-1.10) for developing dyslipidemia.
- **Population:** general-population prospective studies; pooled duration analysis 6 studies, 16 cohort samples, 30,033 participants, 2.6-10 y follow-up.
- **Evidence type:** SR-MA of prospective studies.
- **Source:** Kruisbrink M et al. BMJ Open 2017;7(12):e018585. https://pubmed.ncbi.nlm.nih.gov/29247105/ [A]. Umbrella MAs found insufficient data for dyslipidemia: Itani 2017, Jike 2018 [A].
- **Coach rule:** Do not claim that better sleep will lower LDL, TG, or ApoB. No sleep-specific ApoB evidence was found in this search.
- **Confidence:** medium.
- **Caveats:** heterogeneity, few studies, publication bias for short sleep.

### DL2. Experimental mild sleep restriction did not raise atherogenic lipids
- **Finding:** Six weeks of about 1.5 h/night less sleep (crossover) increased HDL slightly (+1.2 mg/dL); LDL and total cholesterol fell in premenopausal women; no increase in atherogenic lipids overall.
- **Population:** 78 adults (56 women), age 34 (W, YA).
- **Evidence type:** pooled analysis of 2 RCTs.
- **Source:** Barragan R et al. J Am Heart Assoc 2023;12(20):e032078. https://pubmed.ncbi.nlm.nih.gov/37815115/ [A]
- **Coach rule:** Same as DL1.
- **Confidence:** medium.
- **Caveats:** mostly women; mild restriction.

### DL3. OSA, CPAP and lipids
- **Finding:** CPAP modestly improved insulin sensitivity (fasting insulin -1.33 mU/L, HOMA-IR -0.287) and total cholesterol (-0.064 mmol/L, about 2.5 mg/dL); no change in HbA1c, TG, HDL or LDL. Greater glucose response in prediabetes/T2D and sleepy OSA.
- **Population:** 31 RCTs, OSA patients (CLIN).
- **Evidence type:** SR-MA of RCTs.
- **Source:** Cattazzo F et al. Arch Bronconeumol 2023;59(6):370-376. https://pubmed.ncbi.nlm.nih.gov/37024342/ [A]
- **Coach rule:** OSA referral is justified by symptoms and cardiometabolic risk overall, not by expected lipid changes.
- **Confidence:** medium.

### DL4. OSA and fatty liver (relevant to ALT/AST uploads)
- **Finding:** OSA associated with NAFLD OR 2.15 (1.47-3.13); Mendelian randomization supports causality (OR 1.19); insomnia OR 1.40 but not supported by MR.
- **Population:** 13 studies, 537,497 participants + MR.
- **Evidence type:** SR-MA + MR.
- **Source:** Wang H et al. J Prev 2026;47(3):467-482. https://pubmed.ncbi.nlm.nih.gov/41461616/ [A]
- **Coach rule:** If ALT is above range AND OSA symptoms present, the referral message mentions both (for physician to consider); coach does not name NAFLD/MASLD.
- **Confidence:** medium.

### DL5. Guideline statements on sleep and lifestyle in lipid/cardiovascular guidance
- **AHA Life's Essential 8 (2022):** sleep health added as one of 8 metrics; "The ideal level is 7-9 hours daily for adults." Scoring: 7-<9 h = 100 points; 9-<10 = 90; 6-<7 = 70; 5-<6 or ≥10 = 40; 4-<5 = 20; <4 = 0 [S for the point table]. Source: Lloyd-Jones DM et al. Circulation 2022;146(5):e18-e43. https://pubmed.ncbi.nlm.nih.gov/35766027/ [A]; AHA newsroom 2022, https://newsroom.heart.org/news/american-heart-association-adds-sleep-to-cardiovascular-health-checklist [A].
- **AHA scientific statement 2025 (multidimensional sleep health):** poor sleep health associated with heart disease, stroke, BP, lipid levels, inflammation, glucose intolerance; proposes duration, continuity, timing, regularity, daytime functioning, architecture, absence of disorders as dimensions. Source: St-Onge MP et al. Circ Cardiovasc Qual Outcomes 2025;18(5):e000139. https://pubmed.ncbi.nlm.nih.gov/40223596/ [A]
- **ACC/AHA multisociety dyslipidemia guideline 2026 (published 13-Mar-2026; replaces 2018):** lifestyle includes "Prioritizing healthy sleep habits" alongside weight, activity, tobacco avoidance; LDL-C goals <100 mg/dL (borderline/intermediate risk), <70 (high risk), <55 (very high risk/secondary prevention); Lp(a) measured at least once in adulthood, ≥125 nmol/L (≥50 mg/dL) about 1.4-fold risk, ≥250 nmol/L ≥2-fold; ApoB useful for residual risk (e.g., T2D, elevated TG) after LDL-C/non-HDL-C goals met; PREVENT equations replace Pooled Cohort Equations; TG-lowering therapy especially when TG ≥1,000 mg/dL for pancreatitis prevention. Source: Blumenthal RS et al. J Am Coll Cardiol 2026;87(19):2624-2757. https://pubmed.ncbi.nlm.nih.gov/41824590/ [A: record]; ACC press release 2026, https://www.acc.org/about-acc/press-releases/2026/03/13/18/01/accaha-issue-updated-guideline-for-managing-lipids-cholesterol [A]; ACC journal scan 2026, https://www.acc.org/latest-in-cardiology/journal-scans/2026/03/13/15/20/acc-aha-release-new-clinical-guideline-for-managing-dyslipidemia [A]. Full guideline text not opened [U for recommendation classes and any statin-intolerance algorithm].
- **ESC/EAS 2025 focused update:** obstructive sleep apnoea syndrome listed among risk modifiers (with persistently elevated hs-CRP >2 mg/L and Lp(a) >50 mg/dL, >105 nmol/L); Lp(a) measured at least once in each adult; "Dietary supplements or vitamins without documented safety and significant LDL-C-lowering efficacy are not recommended to lower the risk of ASCVD" (Class III, Level B); EU prohibited food supplements with ≥3 mg/day red-yeast-rice monacolins (2022). Source: Mach F et al. Eur Heart J 2025, doi:10.1093/eurheartj/ehaf190; PDF https://api.iscpcardio.org/storage/guidelines/___25_Dyslipidemia_ESC.pdf [A]; ESC summary https://www.escardio.org/communities/councils/cardiology-practice/education/cardiopractice/what-is-new-in-the-2025-focused-update-of-the-2019-esc-eas-guidelines-for-the-m/ [A].
- **2018 AHA/ACC cholesterol guideline (superseded, still useful thresholds):** severe primary hypercholesterolemia LDL-C ≥190 mg/dL; risk enhancers include persistent TG ≥175 mg/dL, ApoB ≥130 mg/dL, hs-CRP ≥2.0 mg/L, Lp(a) ≥50 mg/dL or 125 nmol/L. Source: Grundy SM et al. Circulation 2019;139(25):e1082-e1143. https://pubmed.ncbi.nlm.nih.gov/30586774/ [A]
- **Coach rule:** Use LE8 framing (7-9 h) for the sleep goal; cite "healthy sleep habits" as part of the heart-health lifestyle his cardiologist/GP also endorses; never reference LDL goals to judge his treatment (that is the physician's domain).
- **Confidence:** high (what guidelines say).

---

## 4. Supplements, drugs and food interactions

### 4.1 Entries

#### SP1. Melatonin
- **Finding (efficacy):** Dose-response MA (26 RCTs, 1,689 observations): sleep onset latency reduction and total sleep time increase peaked around 4 mg/day; effect larger in insomnia and when taken about 3 h before desired bedtime.
- **Source:** Cruz-Sanabria F et al. J Pineal Res 2024;76(5):e12985. https://pubmed.ncbi.nlm.nih.gov/38888087/ [A]
- **Finding (guidelines):** AASM 2017 suggests clinicians not use melatonin for sleep onset or maintenance insomnia (weak). ESRS 2023: fast-release melatonin not recommended for insomnia (A); prolonged-release melatonin can be used for up to 3 months in patients ≥55 (B) (he is 47). ACP 2016: CBT-I first-line for all adults with chronic insomnia (strong).
- **Source:** Sateia MJ et al. J Clin Sleep Med 2017;13(2):307-349. https://pubmed.ncbi.nlm.nih.gov/27998379/ [A]; Riemann D et al. J Sleep Res 2023;32(6):e14035. https://pubmed.ncbi.nlm.nih.gov/38016484/ [A]; Qaseem A et al. Ann Intern Med 2016;165(2):125-33. https://pubmed.ncbi.nlm.nih.gov/27136449/ [A].
- **Finding (glucose):** 5 mg melatonin 15 min before an OGTT increased glucose AUC by 186% (morning) and 54% (evening) in 21 young women; acute 4x10 mg reduced insulin sensitivity in 20 young men; 10 mg nightly for 3 months reduced clamp insulin sensitivity by 12% in 17 men with T2D. A meta-analysis of ≥2-week use found no change in fasting glucose (g=-0.07) or HbA1c (g=0.14) and slightly lower fasting insulin (g=-0.27).
- **Source:** Rubio-Sastre P et al. Sleep 2014;37(10):1715-9. https://pubmed.ncbi.nlm.nih.gov/25197811/ [A]; Kampmann U et al. J Pineal Res 2021;70(2):e12706. https://pubmed.ncbi.nlm.nih.gov/33220095/ [A]; Lauritzen ES et al. J Pineal Res 2022;73(1):e12809. https://pubmed.ncbi.nlm.nih.gov/35619221/ [A]; Lauritzen ES et al. Clin Endocrinol 2021;95(5):691-701. https://pubmed.ncbi.nlm.nih.gov/34370338/ [A].
- **Finding (product quality/safety):** content ranged -83% to +478% of label (31 products); 22 of 25 US gummy products inaccurately labeled, up to about 3.5x; long-term safety data lacking (NCCIH). A heart-failure signal with long-term use among adults with insomnia, from an EHR study presented at AHA Scientific Sessions 2025 (as described by Khan and Lima 2026 [A]; the original abstract was not opened), is contested; their NHANES analysis found no association of recent melatonin use with prevalent CVD or heart failure and highlights confounding by insomnia severity and depression.
- **Source:** Erland LA, Saxena PK. J Clin Sleep Med 2017;13(2):275-281. https://pubmed.ncbi.nlm.nih.gov/27855744/ [A]; Cohen PA et al. JAMA 2023;329(16):1401-1402. https://pubmed.ncbi.nlm.nih.gov/37097362/ [A]; NCCIH 2024, https://www.nccih.nih.gov/health/melatonin-what-you-need-to-know [A]; Khan B, Lima BB. Open Heart 2026;13(1):e004108. https://pubmed.ncbi.nlm.nih.gov/42167796/ [A].
- **Evidence rating for sleep:** moderate for a small onset-latency effect; weak for chronic insomnia outcomes.
- **Coach rule:** Category B (section 4.2). Never suggest. If he takes or asks: W4 plus "AASM advises against melatonin for chronic insomnia; in prediabetes, melatonin close to a meal may worsen glucose handling; discuss dose and timing with your doctor". Avoid any wording implying melatonin is "natural, therefore safe".
- **Confidence:** medium.
- **Caveats:** glucose studies used 5-10 mg; effects at lower doses not established [U]; the T2D trial enrolled only men (relevant to this user) but people with diabetes, not prediabetes.

#### SP2. Magnesium
- **Finding:** 3 RCTs, 151 older adults with insomnia: sleep onset latency -17.36 min (-27.27 to -7.44); total sleep time +16 min (NS); moderate-to-high risk of bias, low to very low certainty. Not effective for idiopathic cramps (Cochrane, ST10). IOM set the supplemental-magnesium UL at 350 mg/day (diarrhea as limiting effect); a 2023 perspective argues the UL should be re-evaluated.
- **Population:** OA (sleep); OA (cramps).
- **Source:** Mah J, Pitre T. BMC Complement Med Ther 2021;21(1):125. https://pubmed.ncbi.nlm.nih.gov/33865376/ [A]; Costello R et al. Adv Nutr 2023;14(5):973-982. https://pubmed.ncbi.nlm.nih.gov/37487817/ [A].
- **Evidence rating for sleep:** weak.
- **Coach rule:** Category A (may be mentioned as "evidence is weak; if you want to try it, check the dose with your doctor or pharmacist"; kidney-function relevance [U: not sourced here]). No statin-specific interaction was identified in the sources reviewed [U: interaction databases not checked].
- **Confidence:** low.

#### SP3. Glycine (and glycine-rich collagen peptides)
- **Finding:** 3 g glycine before bed improved next-day fatigue/sleepiness and psychomotor vigilance after mild sleep restriction; earlier work reported subjective sleep-quality improvement in people with insomniac tendencies. 15 g collagen peptides for 7 nights reduced PSG awakenings (21.3 vs 29.3) without changing sleep duration, latency or efficiency in 13 trained young men with sleep complaints (supplier-funded).
- **Source:** Bannai M et al. Front Neurol 2012;3:61. https://pubmed.ncbi.nlm.nih.gov/22529837/ [A]; Bannai M, Kawai N. J Pharmacol Sci 2012;118(2):145-8. https://pubmed.ncbi.nlm.nih.gov/22293292/ [A]; Thomas C et al. Eur J Nutr 2024;63(1):323-335. https://pubmed.ncbi.nlm.nih.gov/37874350/ [A].
- **Evidence rating:** weak.
- **Coach rule:** Category A (only if asked; "small, industry-linked studies").
- **Confidence:** low.

#### SP4. L-theanine
- **Finding:** 200 mg/day for 4 weeks lowered PSQI and improved some cognitive scores vs placebo in 30 adults (9 men, age 48); tablets supplied by the manufacturer.
- **Source:** Hidese S et al. Nutrients 2019;11(10):2362. https://pubmed.ncbi.nlm.nih.gov/31623400/ [A]
- **Evidence rating:** weak.
- **Coach rule:** Category A (only if asked).
- **Confidence:** low.

#### SP5. Valerian
- **Finding:** A 2020 SR-MA (60 studies; 10 in sleep-quality MA) concluded valerian could be safe and effective but outcomes inconsistent, likely due to extract variability. AASM 2017 suggests not using valerian for insomnia (weak); ESRS 2023: phytotherapeutics not recommended (A); AASM 2025 RLS guideline suggests against valerian for RLS. Case reports of hepatotoxicity exist.
- **Source:** Shinjyo N et al. J Evid Based Integr Med 2020;25:2515690X20967323. https://pubmed.ncbi.nlm.nih.gov/33086877/ [A]; AASM 2017 [A]; ESRS 2023 [A]; Winkelman JW et al. J Clin Sleep Med 2025;21(1):137-152. https://pubmed.ncbi.nlm.nih.gov/39324694/ [A]; Vassiliadis T et al. Sleep Med 2009;10(8):935. https://pubmed.ncbi.nlm.nih.gov/19138557/ [A: record only, letter].
- **Evidence rating:** weak/conflicting.
- **Coach rule:** Category B.
- **Confidence:** low.

#### SP6. Ashwagandha
- **Finding (efficacy):** 5 RCTs, 400 participants: small overall sleep benefit (SMD -0.59, -0.75 to -0.42; I2 62%), larger with insomnia, ≥600 mg/day, ≥8 weeks.
- **Source:** Cheah KL et al. PLoS One 2021;16(9):e0257843. https://pubmed.ncbi.nlm.nih.gov/34559859/ [A]
- **Finding (safety):** cholestatic/mixed liver injury with severe jaundice, latency 2-12 weeks (5-case series, Iceland + US DILIN); in subclinical hypothyroidism, 600 mg/day for 8 weeks changed TSH, T3 and T4 vs placebo (i.e., it is thyroid-active).
- **Source:** Bjornsson HK et al. Liver Int 2020;40(4):825-829. https://pubmed.ncbi.nlm.nih.gov/31991029/ [A]; Sharma AK et al. J Altern Complement Med 2018;24(3):243-248. https://pubmed.ncbi.nlm.nih.gov/28829155/ [A].
- **Evidence rating:** moderate-low for sleep.
- **Coach rule:** Category B. Relevance: liver injury would confound statin liver monitoring; thyroid activity interacts with statin-myopathy risk factors. Physician discussion mandatory.
- **Confidence:** medium (safety signal), low (efficacy).

#### SP7. Tart cherry
- **Finding:** 7 interventional studies; 3 reported improved sleep indicators; heterogeneous doses and populations; evidence "limited and heterogeneous".
- **Source:** Barforoush F et al. Food Sci Nutr 2025;13(9):e70923. https://pubmed.ncbi.nlm.nih.gov/40964149/ [A]
- **Evidence rating:** weak.
- **Coach rule:** Category A (as food, not supplement); if juice products are used, log them as carbohydrate-containing drinks in the meal log (design rule, not an evidence claim).
- **Confidence:** low.

#### SP8. Kiwifruit
- **Finding:** 2 kiwifruits 1 h before bed for 4 weeks: PSQI -42%, WASO -29%, sleep onset latency -35%, TST +13% (uncontrolled, self-controlled design).
- **Population:** 24 adults 20-55 with sleep problems (22 women) (W).
- **Evidence type:** uncontrolled before-after (seminal, older).
- **Source:** Lin HH et al. Asia Pac J Clin Nutr 2011;20(2):169-74. https://pubmed.ncbi.nlm.nih.gov/21669584/ [A]
- **Evidence rating:** weak (very low certainty).
- **Coach rule:** Category A (as food; fits a fiber-rich evening snack if he wants one, still within the ≥3 h dinner rule [U: whether a small fruit snack counts as a "meal" is not studied]).
- **Confidence:** low.

#### SP9. Omega-3 fatty acids
- **Finding:** 8 studies: improved sleep efficiency and subjective sleep; high heterogeneity. In CV outcome RCTs, marine omega-3 increased AF risk (HR 1.25, 1.07-1.46), more with >1 g/day (HR 1.49) vs ≤1 g/day (HR 1.12). ESC/EAS 2025: no evidence that PUFA supplements lower LDL-C or CV events, except high-dose purified icosapent ethyl in the context of hypertriglyceridaemia (a prescription product [U]).
- **Source:** Shimizu K et al. J Clin Biochem Nutr 2024;75(3):204-212. https://pubmed.ncbi.nlm.nih.gov/39583980/ [A]; Gencer B et al. Circulation 2021;144(25):1981-1990. https://pubmed.ncbi.nlm.nih.gov/34612056/ [A]; ESC/EAS 2025 [A].
- **Evidence rating:** weak.
- **Coach rule:** Category B (dose-dependent AF signal; cardiovascular prescribing decisions belong to the physician).
- **Confidence:** low (sleep); medium (AF signal).

#### SP10. Vitamin D
- **Finding (sleep):** 5 trials: PSQI improved (MD -1.32, -2.55 to -0.09), high heterogeneity. Cross-sectional data link low 25(OH)D to more severe OSA (the review's supplementation suggestion goes beyond its data).
- **Source:** Mirzaei-Azandaryani Z et al. Nutr Health 2022;28(4):515-526. https://pubmed.ncbi.nlm.nih.gov/35578558/ [A]; Serafin M et al. Sleep Breath 2024;29(1):53. https://pubmed.ncbi.nlm.nih.gov/39652226/ [A].
- **Finding (guideline):** Endocrine Society 2024 suggests against routine 25(OH)D testing and against empiric supplementation above the DRI in healthy adults <75, but suggests empiric vitamin D for people with high-risk prediabetes to reduce progression to diabetes; definition of "high-risk prediabetes" not verified [U].
- **Source:** Demay MB et al. J Clin Endocrinol Metab 2024;109(8):1907-1947. https://pubmed.ncbi.nlm.nih.gov/38828931/ [A]
- **Finding (statins):** EAS does not recommend vitamin D (or CoQ10) to treat or prevent SAMS.
- **Source:** EAS 2015 [A].
- **Evidence rating:** weak (sleep).
- **Coach rule:** Category A-with-physician: "Vitamin D is a physician topic for you specifically because guidance mentions it in some prediabetes cases; not a sleep aid."
- **Confidence:** medium (guideline), low (sleep).

#### SP11. Creatine
- **Finding (sleep-loss performance):** A single high dose (0.35 g/kg) during 21 h sleep deprivation improved cognitive performance and brain energy markers. No sleep-quality evidence found.
- **Source:** Gordji-Nejad A et al. Sci Rep 2024;14(1):4937. https://pubmed.ncbi.nlm.nih.gov/38418482/ [A]
- **Finding (labs):** Creatine raised serum creatinine (MD +0.13 mg/dL) without significant change in eGFR or urea (19 RCTs); KDIGO 2024 lists creatine supplements, high-protein diets and bodybuilding/extreme exercise as non-GFR determinants of serum creatinine (cystatin C may be appropriate).
- **Source:** Tsiaras A et al. J Ren Nutr 2026 (online). https://pubmed.ncbi.nlm.nih.gov/42035842/ [A]; KDIGO 2024 CKD Guideline, https://kdigo.org/wp-content/uploads/2024/03/KDIGO-2024-CKD-Guideline.pdf [A]; synopsis Ann Intern Med 2025;178(5):705-713, https://pubmed.ncbi.nlm.nih.gov/40063957/ [A].
- **Evidence rating for sleep:** none.
- **Coach rule:** Category A for training context; mandatory lab-context note: "If you take creatine or eat very high protein, tell the doctor before interpreting creatinine/eGFR."
- **Confidence:** medium.

#### SP12. Casein/protein before bed
- **Finding:** Pre-sleep casein (30-40 g) increases overnight muscle protein synthesis and metabolic rate (ISSN position stand). No trials with sleep outcomes found (PubMed searches, 29-Sep-2026).
- **Source:** Jäger R et al. (ISSN position stand). J Int Soc Sports Nutr 2017;14:20. https://pubmed.ncbi.nlm.nih.gov/28642676/ [A]
- **Evidence rating for sleep:** none.
- **Coach rule:** Category A for muscle recovery only; never as a sleep aid; in prediabetes count it within the evening intake and dinner-gap logic [U: glycemic effect of pre-sleep casein not reviewed here].

#### SP13. Multi-ingredient "sleep blends"
- **Finding:** A blend of tryptophan, glycine, magnesium, tart cherry powder and L-theanine improved actigraphic sleep over 3 days in 16 young adults (deception design).
- **Source:** Langan-Evans C et al. Med Sci Sports Exerc 2023;55(2):289-300. https://pubmed.ncbi.nlm.nih.gov/36094342/ [A]; a 2025 MA of 28 supplement RCTs reported small pooled improvements (PSQI MD -0.70) across heterogeneous products. Mei M et al. Nutrients 2025;17(24):3952. https://pubmed.ncbi.nlm.nih.gov/41470897/ [A].
- **Evidence rating:** weak.
- **Coach rule:** Category B (blends often include melatonin, valerian or herbs; ingredient check by pharmacist).

#### SP14. Grapefruit and related citrus with statins
- **Finding:** FDA: grapefruit juice blocks intestinal CYP3A4; "some statin drugs... such as Zocor (simvastatin) and Lipitor (atorvastatin)" affected; "Seville oranges... pomelos, and tangelos... might have the same effect". Zocor: avoid grapefruit juice (high-dose juice: simvastatin acid about 7x, simvastatin about 16x; 237 mL single-strength: about 1.3x and 1.9x). Lovastatin: grapefruit juice increases myopathy risk. Lipitor: avoid >1.2 L/day. NHS: no more than 1-2 small glasses/day on atorvastatin. Pravastatin label: negligible PK effect. Crestor label: no grapefruit warning in text reviewed. EAS lists excessive grapefruit or cranberry juice as SAMS risk factors.
- **Source:** FDA consumer update (content current as of 07/01/2021), https://www.fda.gov/consumers/consumer-updates/grapefruit-juice-and-some-drugs-dont-mix [A]; Zocor, Lipitor, Crestor, pravastatin, lovastatin labels [A]; NHS atorvastatin [A]; EAS 2015 [A].
- **Coach rule:** Until the statin name is confirmed: meal-photo analysis flags grapefruit, pomelo, Seville/bitter orange, tangelo and grapefruit-pomelo hybrids [U: hybrid content not verified] with W4. After confirmation: simvastatin/lovastatin = avoid; atorvastatin = avoid large amounts; rosuvastatin/pravastatin = "label shows no meaningful interaction, still confirm with pharmacist".
- **Confidence:** high.

#### SP15. Red yeast rice
- **Finding:** Monacolin K is structurally identical to lovastatin; FDA treats products with added/enhanced lovastatin as unapproved new drugs; 28 US brands varied more than 60-fold in monacolin K (0.09 to 5.48 mg per 1,200 mg) and none labeled the quantity; in a 2021 analysis only 1 of 37 products had citrinin (a kidney toxin) below the EU maximum; 2023-2024 Japanese beni-koji product incident: 192 patients with kidney injury, 94% eGFR <60 at presentation, Fanconi-syndrome features, 87% still eGFR <60 at last observation; ESC/EAS 2025 notes EU ban at ≥3 mg/day monacolins and does not recommend supplements (III-B).
- **Source:** NCCIH (updated Nov 2022), https://www.nccih.nih.gov/health/red-yeast-rice [A]; Shinzawa M et al. Kidney Int 2025;107(3):530-540. https://pubmed.ncbi.nlm.nih.gov/39708997/ [A]; ESC/EAS 2025 [A]; EAS 2015 [A].
- **Evidence rating for sleep:** none.
- **Coach rule:** Category C (never mention as an option). If he mentions it: W4 plus "it contains the same compound as a statin drug; combining it with your statin is a question for your doctor or pharmacist before use."
- **Confidence:** high.

#### SP16. Niacin
- **Finding:** Adding ER niacin 2 g (+ laropiprant) to statin-based therapy did not reduce major vascular events (RR 0.96, 0.90-1.03) but increased serious disturbances of diabetes control (+3.7 percentage points), new diabetes diagnoses (+1.3 pp), serious GI, musculoskeletal, skin, infection and bleeding events; myopathy RR 4.4 (2.6-7.5) with simvastatin 40 mg, especially in Chinese participants. Zocor label: lipid-modifying doses (≥1 g/day) of niacin may increase myopathy risk.
- **Population:** 25,673 adults with vascular disease (CLIN, MX, OA).
- **Evidence type:** RCT.
- **Source:** HPS2-THRIVE. N Engl J Med 2014;371(3):203-12. https://pubmed.ncbi.nlm.nih.gov/25014686/ [A]; Eur Heart J 2013;34(17):1279-91. https://pubmed.ncbi.nlm.nih.gov/23444397/ [A]; Zocor PI [A].
- **Coach rule:** Category C (never suggest; if raised, W4). Especially relevant for prediabetes (glycemic worsening).
- **Confidence:** high.

#### SP17. St John's wort
- **Finding:** SJW (an herbal antidepressant) activates PXR and induces CYP3A4 and P-glycoprotein; it has been shown to alter the pharmacokinetics of drugs including simvastatin; the degree of CYP3A4 induction correlates with hyperforin content. (Induction implies lower exposure of CYP3A4-metabolized statins [inference].)
- **Source:** Nicolussi S et al. Br J Pharmacol 2020;177(6):1212-1226. https://pubmed.ncbi.nlm.nih.gov/31742659/ [A] (three authors are employees of an SJW manufacturer).
- **Coach rule:** Category C for recommendation; W4 if mentioned (may appear in mood or sleep blends [U]).
- **Confidence:** high (interaction exists).

#### SP18. Berberine
- **Finding:** Popular "metabolic" supplement ("nature's Ozempic"); inhibits and can induce CYP3A4, inhibits CYP2D6/2C9, modulates P-gp/OCT/MATE; pharmacodynamic additivity with glucose-lowering drugs (hypoglycemia), hypotension, QT; human interaction data limited; product quality variable.
- **Source:** Dumitru CN et al. Pharmaceuticals 2026;19(8):1313. https://pubmed.ncbi.nlm.nih.gov/42653808/ [A] (narrative review).
- **Coach rule:** Category C for recommendation; W4 if mentioned (statin metabolism for simvastatin, lovastatin, atorvastatin runs through CYP3A4 per labels).
- **Confidence:** medium (mechanistic).

#### SP19. OTC sedating antihistamines (diphenhydramine, doxylamine)
- **Finding:** AASM 2017 suggests not using diphenhydramine for insomnia (weak); ESRS 2023: antihistaminergic drugs not recommended (A). Tolerance to diphenhydramine sedation was complete by day 4 in healthy men 18-50 (50 mg twice daily). Cumulative strong anticholinergic use associated with dementia (HR 1.54 for highest exposure) in adults ≥65. AASM 2025 RLS guideline names antihistaminergic medications as RLS exacerbators.
- **Source:** AASM 2017 [A]; ESRS 2023 [A]; Richardson GS et al. J Clin Psychopharmacol 2002;22(5):511-5. https://pubmed.ncbi.nlm.nih.gov/12352276/ [A]; Gray SL et al. JAMA Intern Med 2015;175(3):401-7. https://pubmed.ncbi.nlm.nih.gov/25621434/ [A]; Winkelman 2025 [A].
- **Coach rule:** Category C (never suggest). If he uses them: neutral note on tolerance and next-day effects plus pharmacist check; never tell him to stop a medicine prescribed by a doctor.
- **Confidence:** high.

#### SP20. Z-drugs and benzodiazepines (prescription)
- **Finding:** FDA added a boxed warning and contraindication after complex sleep behaviors (sleepwalking, sleep-driving) with eszopiclone, zaleplon, zolpidem: 66 FAERS/literature cases, 20 deaths. FDA 2020 benzodiazepine boxed warning: abuse, addiction, dependence, withdrawal; do not stop suddenly without a plan; do not combine with alcohol. ESRS 2023: BZ/BZRA short-term (≤4 weeks) after CBT-I, longer only case by case.
- **Source:** Harbourt K et al. Pharmacoepidemiol Drug Saf 2020;29(6):684-691. https://pubmed.ncbi.nlm.nih.gov/32323442/ [A]; FDA Drug Safety Communication 23-Sep-2020, https://www.fda.gov/drugs/drug-safety-and-availability/fda-requiring-boxed-warning-updated-improve-safe-use-benzodiazepine-drug-class [A]; ESRS 2023 [A].
- **Coach rule:** Category C for suggestions. If he is prescribed one: coach never comments on dose/timing/tapering; alcohol-same-night logged with W4-style caution referencing the FDA advice; unusual night behaviors = red tier.
- **Confidence:** high.

#### SP21. CoQ10 for statin muscle symptoms
- **Finding:** EAS: an RCT and a meta-analysis failed to show CoQ10 reduces SAMS; Panel does not recommend CoQ10 or vitamin D to treat or prevent SAMS.
- **Source:** EAS 2015 [A].
- **Coach rule:** Category B (do not suggest; if asked, "evidence does not support it; discuss with your doctor").
- **Confidence:** medium.

### 4.2 Mention categories and summary

- **Category A:** may be mentioned when relevant, always with the evidence strength and "check with your doctor or pharmacist if you take other medicines".
- **Category B:** never initiated by the coach; only if the user raises it, respond with a balanced one-paragraph summary and a mandatory physician/pharmacist referral (W4).
- **Category C:** never presented as an option; if the user raises it, respond with the safety issue and W4; no dosing information.

| Item | Sleep evidence | Key risk for this user | Category |
|---|---|---|---|
| Melatonin | moderate (small SOL effect), weak for chronic insomnia; AASM against | glucose tolerance, label inaccuracy, unknown long-term safety | B |
| Magnesium | weak | GI effects (11-37% in cramp trials); kidney function [U] | A |
| Glycine / collagen | weak | minimal data | A |
| L-theanine | weak | minimal data | A |
| Valerian | weak/conflicting; AASM/ESRS against | liver case reports, product variability | B |
| Ashwagandha | moderate-low | liver injury, thyroid activity | B |
| Tart cherry | weak | carbohydrate in juice products | A (as food) |
| Kiwifruit | weak (very low certainty) | none relevant | A (as food) |
| Omega-3 | weak | dose-related AF | B |
| Vitamin D | weak (sleep) | physician topic in prediabetes | A with physician |
| Creatine | none (sleep) | creatinine confounding | A (training only) |
| Casein before bed | none (sleep) | evening intake with prediabetes [U] | A (muscle only) |
| Sleep blends | weak | hidden melatonin/herbs | B |
| Caffeine pre-workout | harmful dose-timing effect | sleep loss | Timing rule (GL11) |
| Grapefruit/pomelo/Seville orange | n/a | statin exposure (drug-specific) | C for simvastatin/lovastatin; caution others |
| Red yeast rice | none | duplicate statin, kidney injury | C |
| Niacin | none | myopathy with statin, worse glycemia | C |
| St John's wort | none reviewed | lowers statin exposure | C |
| Berberine | none reviewed | CYP interactions, additive glucose effects | C |
| Diphenhydramine/doxylamine | against (AASM, ESRS) | tolerance, anticholinergic, RLS worsening | C |
| Z-drugs/benzodiazepines | prescription only | complex sleep behaviors, dependence | C |
| CoQ10 (for SAMS) | not recommended (EAS) | none major | B |

---

## 5. Blood-test markers: thresholds, sleep links, coach behavior

### 5.1 Entries

#### BM1. HbA1c, fasting glucose, OGTT
- **Thresholds:** normal <5.7% / FPG <100 mg/dL; prediabetes 5.7-6.4% / FPG 100-125 mg/dL / 2-h 140-199 mg/dL; diabetes range ≥6.5% / FPG ≥126 mg/dL / 2-h ≥200 mg/dL (ADA 2026) [A].
- **Sleep link:** experimental sleep restriction lowers insulin sensitivity (GL1, high); short sleep predicts progression (GL3, medium); HbA1c higher with <5 or >8 h in prediabetes (GL3D, cross-sectional); statins raise HbA1c by about 0.06-0.08% (CTT 2024).
- **Statin link source:** CTT Collaboration. Lancet Diabetes Endocrinol 2024;12(5):306-319. https://pubmed.ncbi.nlm.nih.gov/38554713/ [A]: new-onset diabetes RR 1.10 (1.04-1.16) with low/moderate intensity (1.3% vs 1.2% per year) and RR 1.36 (1.25-1.48) with high intensity (4.8% vs 3.5% per year); HbA1c +0.06% (0.00-0.12) and +0.08% (0.07-0.09); mean glucose +0.04 mmol/L (about 0.7 mg/dL); about 62% of new cases were already in the top quarter of baseline glycemia; authors: CV benefit already accounts for this. Labels advise lifestyle optimization.
- **Coach behavior:** trend HbA1c across uploads; if a value enters the diabetes range, W3 "soon" (confirmation testing is the physician's job; never say "you have diabetes").

#### BM2. Fasting insulin, HOMA-IR
- **Thresholds:** no standardized clinical cut-off; insulin immunoassays disagree (bias >15.5% vs reference method for 7 of 10 methods in 36-100% of samples).
- **Source:** Miller WG et al. (ADA workgroup). Clin Chem 2009;55(5):1011-8. https://pubmed.ncbi.nlm.nih.gov/19325009/ [A]
- **Sleep link:** HOMA-IR rises with sleep restriction (Sondrup 2022) and falls modestly with CPAP in OSA (Cattazzo 2023).
- **Coach behavior:** show trend only when same lab/method; never label "insulin resistant" from a single HOMA-IR.

#### BM3. LDL-C, non-HDL-C, ApoB, TG, HDL-C, Lp(a)
- **Thresholds:** LDL-C ≥190 mg/dL severe (2018 guideline); treatment goals are risk-dependent (2026: <100 / <70 / <55 mg/dL) and belong to the physician; ApoB ≥130 mg/dL risk enhancer (2018); TG ≥175 mg/dL persistent risk enhancer (2018); TG-lowering therapy especially at ≥1,000 mg/dL (2026 journal-scan summary); ESC 2025 names severe hypertriglyceridaemia >750 mg/dL in the volanesorsen context; Lp(a) ≥125 nmol/L (≥50 mg/dL) high, ≥250 nmol/L very high (2026), >50 mg/dL (>105 nmol/L) ESC 2025; measure Lp(a) once in adulthood (both). HDL <40 mg/dL in men is a metabolic-syndrome component in harmonized criteria [U: cut-points not in abstract; Alberti 2009, https://pubmed.ncbi.nlm.nih.gov/19805654/]. TG ≥500 mg/dL as "severe" [U].
- **Sleep link:** weak (DL1-DL3); Lp(a) is genetically determined and minimally affected by lifestyle (ACC 2026 summary).
- **Coach behavior:** do not comment on whether LDL is "at goal"; do not link lipid changes to sleep; W3 for LDL ≥190 or TG ≥1,000 (urgent-soon) and for first-ever Lp(a) ≥125 nmol/L (next routine visit).

#### BM4. ALT/AST
- **Thresholds:** ACG: true healthy normal ALT 29-33 IU/L in males; levels above should be assessed. Statin labels: persistent transaminase increases >3x ULN in about 1% (simvastatin), 1.1% vs 0.5% placebo (rosuvastatin); "Consider liver enzyme testing before initiation and when clinically indicated thereafter"; patients should promptly report fatigue, anorexia, right upper abdominal discomfort, dark urine or jaundice.
- **Source:** Kwo PY et al. Am J Gastroenterol 2017;112(1):18-35. https://pubmed.ncbi.nlm.nih.gov/27995906/ [A]; Zocor, Lipitor, Crestor PIs [A]. CTT 2026: abnormal transaminases RR 1.41 (one of 4 confirmed label effects) [A].
- **Sleep link:** OSA associated with NAFLD (DL4, medium); resistance training can raise AST/ALT transiently [U: not sourced here].
- **Coach behavior:** ALT above lab range: W3 (routine-soon); >3x ULN or with symptoms above: red/amber (W2 wording for symptoms). Remind that alcohol, ashwagandha, valerian and heavy training are relevant history to tell the doctor.

#### BM5. CK
- **Thresholds (EAS):** symptoms + normal CK = "myalgia"; CK >ULN to <4x ULN often exercise-related; >4 to <10x ULN clinically relevant; >10x ULN "myositis/myopathy"; >40x ULN with renal impairment/myoglobinuria = rhabdomyolysis; routine CK monitoring on statins not recommended; if CK >10x ULN with no secondary cause (e.g., exercise), statin should be stopped by the clinician.
- **Source:** EAS 2015 [A]; STOMP (CK +20.8 U/L average on atorvastatin 80 mg) [A].
- **Sleep link:** none direct.
- **Coach behavior:** any CK upload: ask about training in prior days; >ULN with muscle symptoms = W1 (soon); >10x ULN or any CK with dark urine/weakness = red tier (W2).

#### BM6. TSH and free T4
- **Thresholds:** TSH is the single best screening test for primary thyroid dysfunction; treatment decisions for subclinical hypothyroidism with TSH <10 mIU/L are individualized (ATA/AACE). Use lab range for flags.
- **Source:** Garber JR et al. Thyroid 2012;22(12):1200-35. https://pubmed.ncbi.nlm.nih.gov/22954017/ [A] (seminal, older).
- **Sleep link:** hyperthyroidism symptoms include "trouble sleeping" (NIDDK 2021, https://www.niddk.nih.gov/health-information/endocrine-diseases/hyperthyroidism [A]); thyroid hormone levels did not differ between OSA patients and controls in a 2023 MA (Xiong J et al. Medicine 2023;102(49):e36531, https://pubmed.ncbi.nlm.nih.gov/38065875/ [A]). Uncontrolled hypothyroidism is a statin-myopathy risk factor (labels, EAS).
- **Coach behavior:** out-of-range TSH = W3 (soon) with the added note about statin muscle relevance.

#### BM7. Ferritin, iron, transferrin saturation
- **Thresholds (RLS context):** AASM 2025: in clinically significant RLS, check ferritin and TSAT in the morning, avoiding iron-containing supplements/foods ≥24 h before; consensus suggests iron if ferritin ≤75 ng/mL or TSAT <20% (IV only if 75-100 ng/mL); these thresholds differ from general-population ones.
- **Source:** Winkelman JW et al. J Clin Sleep Med 2025;21(1):137-152. https://pubmed.ncbi.nlm.nih.gov/39324694/ [A]
- **General thresholds:** ferritin is an acute-phase reactant; optimal cut-offs varied between studies (Cochrane 2021, https://pubmed.ncbi.nlm.nih.gov/34028001/ [A]). WHO 2020 ferritin guideline exists (https://pubmed.ncbi.nlm.nih.gov/33909381/ [A: record]); specific cut-offs not extracted [U]. AGA 2020 guidance on GI evaluation of iron deficiency anemia (https://pubmed.ncbi.nlm.nih.gov/32810434/) not opened [U].
- **Sleep link:** RLS (urge to move legs in the evening, relieved by movement) with low iron stores (strong, guideline-level).
- **Coach behavior:** if he reports RLS-like evening leg symptoms: "worth checking iron studies with your doctor"; low ferritin in an adult man = W3 (soon) because the cause needs medical evaluation [U: the "man = GI evaluation" rule rests on AGA 2020, not opened]. Never suggest self-supplementing iron.

#### BM8. Vitamin D (25-OH-D)
- **Thresholds:** Endocrine Society 2024 suggests against routine testing; no clear optimal target level established (source SP10) [A]. Deficiency cut-offs not verified here [U].
- **Sleep link:** weak (SP10).
- **Coach behavior:** if uploaded, show value and lab flag; route to physician rather than dosing advice.

#### BM9. Vitamin B12
- **Thresholds (NICE NG239, 2024):** total B12 <180 ng/L (133 pmol/L) or active B12 <25 pmol/L = confirmed deficiency; 180-350 ng/L (25-70 pmol/L active) = indeterminate; >350 ng/L (>70 pmol/L) = deficiency unlikely; use local lab thresholds where validated. Metformin, PPIs and H2 blockers listed among risk factors.
- **Source:** NICE NG239, https://www.nice.org.uk/guidance/ng239/chapter/Recommendations [A]; BMJ summary 2024, https://pubmed.ncbi.nlm.nih.gov/38871397/ [A].
- **Sleep link:** none robust found in this search.
- **Coach behavior:** <180 ng/L = W3 (soon); indeterminate = mention at next visit. Note for future: if metformin is ever prescribed, B12 becomes a monitoring topic (physician).

#### BM10. Testosterone, SHBG
- **Thresholds:** Endocrine Society 2018: diagnose hypogonadism only with symptoms plus unequivocally and consistently low morning fasting total T on repeat testing; use free T when near the lower limit or SHBG altered; untreated severe OSA is a condition where T therapy should not be started. Harmonized reference range (CDC-calibrated assays), healthy nonobese men 19-39: 264-916 ng/dL.
- **Source:** Bhasin S et al. J Clin Endocrinol Metab 2018;103(5):1715-1744. https://pubmed.ncbi.nlm.nih.gov/29562364/ [A]; Travison TG et al. J Clin Endocrinol Metab 2017;102(4):1161-1173. https://pubmed.ncbi.nlm.nih.gov/28324103/ [A]. AUA 2018 guideline (https://pubmed.ncbi.nlm.nih.gov/29601923/) cut-off of 300 ng/dL not verified from abstract [U].
- **Sleep link:** one week of 5-h sleep lowered daytime testosterone in young healthy men (Leproult R, Van Cauter E. JAMA 2011;305(21):2173-4, https://pubmed.ncbi.nlm.nih.gov/21632481/ [A: record; research letter without abstract; magnitude 10-15% [U]]); OSA and T therapy interplay per Endocrine Society.
- **Coach behavior:** if a low value is uploaded, first check draw time (morning, fasting) and recent sleep loss or illness; W3 (routine) and suggest the physician-directed repeat test. Never suggest testosterone products.

#### BM11. hs-CRP
- **Thresholds:** hs-CRP ≥2.0 mg/L = risk enhancer (2018 AHA/ACC); persistently >2 mg/L = risk modifier (ESC/EAS 2025). AHA/CDC 2003 categories (<1, 1-3, >3 mg/L; values >10 mg/L suggest acute inflammation, repeat) [U: statement opened as record only, https://pubmed.ncbi.nlm.nih.gov/12551878/].
- **Sleep link:** sleep disturbance associated with higher CRP (ES 0.12) and IL-6; long sleep with higher CRP; experimental sleep deprivation not associated with CRP.
- **Source:** Irwin MR et al. Biol Psychiatry 2016;80(1):40-52. https://pubmed.ncbi.nlm.nih.gov/26140821/ [A]
- **Coach behavior:** single value after hard training or illness is uninterpretable; suggest the physician repeat when well [U: exercise effect on CRP not sourced here].

#### BM12. PSA (and nocturia)
- **Guidance:** USPSTF 2018: men 55-69 individual decision (C); ≥70 against (D); inadequate evidence for baseline screening in younger men; update in progress. AUA/SUO 2023: PSA screening with shared decision-making recommended; specific starting-age statements (e.g., baseline at 45-50) not verified [U].
- **Source:** USPSTF, https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/prostate-cancer-screening [A]; Wei JT et al. J Urol 2023;210(1):46-53. https://pubmed.ncbi.nlm.nih.gov/37096582/ [A].
- **Sleep link:** nocturia disrupts sleep; CPAP reduced nocturia frequency and volume in OSA (5 studies, 307 patients). Pravastatin label lists nocturia among postmarketing urinary reports.
- **Source:** Wang T et al. Int Neurourol J 2015;19(3):178-84. https://pubmed.ncbi.nlm.nih.gov/26620900/ [A]; pravastatin label [A].
- **Coach behavior:** log nocturia (count, evening fluids/alcohol/caffeine timing); ≥2 episodes/night persisting 2+ weeks = "discuss with your doctor", listing possible contributors (fluids, alcohol, sleep apnea, prostate) without ranking them [U: 2-episode trigger is a design heuristic]. PSA itself = physician decision; W3 if flagged.

#### BM13. Creatinine, eGFR
- **Thresholds:** KDIGO 2024: CKD = abnormalities of kidney structure or function for ≥3 months; eGFR <60 mL/min/1.73 m2 (G3a 45-59) or ACR ≥30 mg/g; cystatin C recommended in more situations; creatine supplements, high-protein diets, bodybuilding/extreme exercise and muscle mass are non-GFR determinants of creatinine. Rosuvastatin: exposure about 3-fold higher in severe renal impairment (CLcr <30), start 5 mg (label).
- **Source:** KDIGO 2024 PDF [A]; Madero M et al. Ann Intern Med 2025 [A]; Crestor PI [A]; Tsiaras 2026 [A].
- **Sleep link:** RLS in ESRD has specific guidance (AASM 2025), otherwise none relevant to him.
- **Coach behavior:** eGFR <60 = W3 (soon) plus the creatine/protein/training context question.

### 5.2 Compact threshold table (lab range first; these are context)

| Marker | Value that triggers "see your physician soon" wording | Tier | Source tag |
|---|---|---|---|
| HbA1c | ≥6.5% | amber (soon) | ADA 2026 [A] |
| Fasting glucose | ≥126 mg/dL | amber | ADA 2026 [A] |
| LDL-C | ≥190 mg/dL | amber | AHA/ACC 2018 [A] |
| TG | ≥1,000 mg/dL (pancreatitis context); ≥500 [U] | amber-red | ACC 2026 scan [A]; [U] |
| Lp(a) | ≥125 nmol/L or ≥50 mg/dL (first time) | routine | ACC 2026 [A]; ESC 2025 [A] |
| ALT/AST | above lab range: routine-soon; >3x ULN or symptoms: soon/urgent | amber/red | ACG 2017, labels [A] |
| CK | >ULN with symptoms: soon; >10x ULN or with dark urine/weakness: urgent | amber/red | EAS 2015, labels [A] |
| TSH | outside lab range | amber | ATA 2012 [A] |
| Ferritin | low per lab in a man; ≤75 ng/mL with RLS symptoms | amber | AASM 2025 [A]; [U] |
| B12 | <180 ng/L | amber | NICE 2024 [A] |
| Total testosterone | below lab range or <264 ng/dL on a morning fasting sample | routine (repeat) | Endocrine Society 2018; Travison 2017 [A] |
| hs-CRP | >10 mg/L | routine repeat when well | [U] |
| PSA | flagged by lab | amber | USPSTF, AUA [A] |
| eGFR | <60 mL/min/1.73 m2 | amber | KDIGO 2024 [A] |

### 5.3 Symptom red flags (override everything, same-day medical contact)

- Unexplained muscle pain, tenderness or weakness with malaise/fever; dark urine (possible rhabdomyolysis) [labels A; NHS: call 111 for serious side effects A].
- Yellowing skin/eyes, dark urine, right upper abdominal pain, marked fatigue/anorexia on a statin (hepatic) [labels A].
- Falling asleep while driving or severe daytime sleepiness with witnessed apneas [AHA 2021 and USPSTF 2022 list crash risk and adverse outcomes; urgency tier is a design choice U].
- Complex sleep behaviors (sleepwalking, sleep-driving) on any hypnotic [FDA/Harbourt 2020 A].

---

## 6. Things NOT to say

1. "Your statin is causing your insomnia/nightmares." (ST1-ST5: causality not established; say W1.)
2. "Statins don't affect sleep at all." (ST3-ST5: individual susceptibility not excluded.)
3. "Take your statin in the morning/evening to sleep better", "skip your statin", "take half", "switch to a hydrophilic statin". (Prescriber decision; no sleep-timing trial.)
4. "Stop your statin for a few weeks to see if your sleep or muscles improve." (Only a clinician can run dechallenge/rechallenge, EAS 2015.)
5. "The statin gave you prediabetes; it is not worth it." (CTT 2024: small HbA1c shift; benefit already accounts for it.)
6. "Muscle pain on statins is all in your head / nocebo." (Nocebo explains most but not all; red flags exist.)
7. "Take CoQ10 / vitamin D for statin muscle pain." (EAS 2015 does not recommend.)
8. "Magnesium will fix night cramps." (Cochrane 2020: unlikely.)
9. "Melatonin is natural and safe", "melatonin is the best sleep supplement". (AASM advises against for chronic insomnia; glucose effects; label inaccuracy; long-term safety unknown.)
10. "Red yeast rice is a natural statin you can use instead or on top." (Duplicate lovastatin, kidney injury reports, ESC III-B.)
11. "A drink helps you sleep" or "moderate alcohol protects against diabetes." (REM reduction; no protective association in men.)
12. "Sleep 8 hours and your blood sugar will normalize." (Beals 2026 null; associations are not guarantees.)
13. "Your early waking is caused by blood sugar spikes / the dawn phenomenon." (No evidence found.)
14. "You have sleep apnea / insomnia / diabetes / low testosterone / hypothyroidism / fatty liver." (No diagnosis, R-DX-1.)
15. "Your wearable shows apneas / your REM is abnormal." (Consumer wearables are not diagnostic for OSA [U: validation is outside this track, see track A].)
16. "Better sleep will lower your LDL." (DL1-DL3.)
17. "Intermittent fasting will improve your sleep." (GL7.)
18. "Evening workouts ruin sleep." (GL9: depends on intensity and timing.)
19. "Coffee after lunch is fine for everyone." (GL11: dose-timing effect, misperception.)
20. "Diphenhydramine/doxylamine is a safe OTC sleep aid." (AASM, ESRS against; tolerance; RLS worsening.)
21. Any HOMA-IR label ("insulin resistant") from one test (BM2).
22. Any statement that a specific supplement "boosts testosterone", "lowers cholesterol naturally" or "reverses prediabetes" (ESC 2025 III-B on supplements for ASCVD risk).
23. Dosing numbers for any supplement or drug (e.g., "take 3 mg melatonin"), except caffeine timing rules framed as habits.

---

## 7. Conflicting evidence

| Topic | Evidence pointing one way | Evidence pointing the other way | Working position for the coach |
|---|---|---|---|
| Statins and sleep | CTT 2026 IPD (no causal support); Broncel 2015 PSG (no TST loss, fewer awakenings); label trial rates near placebo | UCSD RCT abstract 2007 (simvastatin worse sleep); UK Biobank OR 1.07; EudraVigilance insomnia/nightmare reports [S]; postmarketing listings incl. rosuvastatin and pravastatin | Unlikely cause on average; possible in individuals; W1 when timeline fits |
| Lipophilic vs hydrophilic | UCSD: simvastatin yes, pravastatin no; BBB hypothesis (Salari 2026) | Hydrophilic labels also list sleep disorders/nightmares; UK Biobank HMGCR genetics discordant | Do not promise switching helps; prescriber decides |
| Statins and training adaptation | Mikus 2013 (blunted VO2 gain, sedentary OW) | STOMP 2013 (no strength/performance loss); Mangone 2024 MA (VO2max NS, P=0.06); Kokkinos 2013 (fit + statin lowest mortality) | Keep training; watch for symptoms, not for "blunted gains" |
| Muscle symptoms | CTT 2022: >90% not statin-caused; SAMSON/StatinWISE nocebo | STOMP: more myalgia on atorvastatin 80 mg; CK rises on average; rare true myopathy | Log, do not dismiss, red flags |
| Melatonin and glucose | Rubio-Sastre 2014, Kampmann 2021 (acute impairment); Lauritzen 2022 (-12% insulin sensitivity, 10 mg, 3 months, T2D men) | Lauritzen 2021 MA (≥2 weeks: fasting glucose and HbA1c unchanged, fasting insulin slightly lower) | Physician topic in prediabetes; never initiated by coach |
| Melatonin and heart failure | AHA 2025 EHR abstract signal (as described by Khan and Lima 2026 [A]; original not opened) | NHANES 2026 analysis null; confounding by indication | Not a talking point; no alarm, no reassurance |
| Sleep and insulin sensitivity | Restriction and misalignment worsen it (Sondrup 2022) | Extension does not improve it in short sleepers with OW (Beals 2026) | Protect sleep; do not promise glucose gains |
| Short vs long sleep and diabetes | U-shaped cohort risk (Shan 2015; Itani, Jike) | Long-sleep link likely reverse causation/illness [U]; prediabetes progression NS for long sleep (Mostafa 2022) | Target 7-9 h; long sleep + sleepiness = referral cue |
| Dinner GI | High GI shortened SOL (Afaghi 2007, young men) | High dietary GI linked to incident insomnia (Gangwisch 2020, women); glycemic cost in prediabetes | No high-GI dinner advice |
| Late dinner and sleep | Late dinner raises nocturnal glucose (Gu 2020, Garaulet 2022); longer meal-bed gap linked to better PSQI (Chong 2026) | Gu 2020: no change in sleep architecture | ≥3 h gap mainly for glucose/cardiometabolic reasons |
| TRE and sleep | Non-Ramadan TRF increased TST (Lima 2025) | No overall effect (Yong 2025); Ramadan worsened sleep | Not a sleep tool |
| Evening exercise | Lab MAs: no harm except vigorous ≤1 h (Stutz 2019); 2-4 h OK (Frimpong 2021) | Wearable data: strain within 4 h linked to worse sleep, HRV, RHR (Leota 2025, WHOOP-affiliated) | Default ≥4 h for hard sessions; personalize |
| Caffeine cutoff | MA: coffee ≥8.8 h, pre-workout ≥13.2 h (Gardiner 2023) | RCT: 100 mg fine at 4 h; 400 mg harmful within 12 h (Gardiner 2025) | Dose-scaled rule |
| Sleep and lipids | AHA 2025 statement lists lipid associations; guidelines include sleep in lifestyle | Kruisbrink 2017 null; Barragan 2023 RCT not atherogenic; CPAP minimal lipid effect | Sleep advice for overall CV health, not lipid numbers |
| Valerian | Shinjyo 2020 MA positive | AASM 2017 and ESRS 2023 against; product variability; liver case reports | Category B |
| Ashwagandha | Cheah 2021 MA small benefit | Liver injury case series; thyroid activity | Category B |
| Vitamin D | Endocrine Society: empiric use suggested in high-risk prediabetes; small sleep MA benefit | No routine testing; no supplementation above DRI in healthy <75; EAS: no role for SAMS | Physician topic |
| Magnesium | Mah 2021: SOL -17 min (older adults, low certainty) | Cochrane cramps null; UL debate | Category A with caveats |
| OSA screening | ADA 2026 5.56 (screen sleep health incl. disorders in prediabetes); prediabetes-OSA OR 2.78 | USPSTF 2022 I statement for general asymptomatic adults | Symptom-based screen in app, physician decides testing |

---

## 8. What remains uncertain or unverified

- Exact statin name, dose and timing for this user (drives grapefruit and timing notes).
- CTT 2026 sleep-disturbance effect size (main text opened: not significant; outcome-specific RR is in the appendix, not opened).
- ADA 2025 sleep-recommendation wording; full ADA 2026 Section 5 narrative (paywalled); ADA OSA-tool wording (secondary sources only).
- ACC/AHA 2026 full recommendation classes, statin-intolerance algorithm, and TG categories below 1,000 mg/dL.
- AUA 2023 age-specific PSA statements; AUA 2018 testosterone cut-off; AGA 2020 ferritin threshold for men; WHO 2020 ferritin cut-offs; AHA/CDC 2003 hs-CRP categories; NIH ODS fact sheets (blocked by bot protection, not accessed).
- Leproult 2011 effect size (no abstract).
- Endocrine Society definition of "high-risk prediabetes".
- Sutton 2018 sample size (not in abstract).
- Whether lean, trained men with prediabetes respond like the mostly overweight samples in the glycemia and TRE literature (population gap across section 2).
- No trial on statin dosing time and sleep; no study linking dawn phenomenon to early awakening; no sleep-outcome trials for pre-sleep casein.
- Israel-specific regulatory status of melatonin and red yeast rice products: not researched [U].

---

## 9. Source index (all URLs cited above)

Statins: CTT Lancet 2026 https://pubmed.ncbi.nlm.nih.gov/41655587/ ; DTB 2026 https://pubmed.ncbi.nlm.nih.gov/42055595/ ; MedShadow 2026 https://medshadow.org/conditions-treatments/cardiovascular-disease/2026-lancet-statin-meta-analysis-side-effects-data-access/ ; Broncel 2015 https://www.archivesofmedicalscience.com/Sleep-changes-following-statin-therapy-a-systematic-review-and-meta-analysis-of-randomized,59232,0,2.html ; UCSD 2007 https://www.ahajournals.org/doi/10.1161/circ.116.suppl_16.II_847 and https://www.sciencedaily.com/releases/2007/11/071107093606.htm ; Alsehli 2021 https://www.imrpress.com/journal/FBL/26/12/10.52586/5039 ; Salari 2026 https://pubmed.ncbi.nlm.nih.gov/41742773/ ; Zocor PI https://www.organon.com/product/usa/pi_circulars/z/zocor/zocor_pi.pdf ; Lipitor PI https://www.accessdata.fda.gov/drugsatfda_docs/label/2022/020702Orig1s079correctedlbl.pdf ; Crestor PI https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/021366s046lbl.pdf ; pravastatin https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=678dfe58-3200-4c3d-9718-365aa47d070f ; lovastatin https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=9438d8a0-ca5b-4676-aab9-d0241ccff6c9 ; Awad 2017 https://pubmed.ncbi.nlm.nih.gov/28826569/ ; Maqsood 2022 https://academic.oup.com/eurjpc/article/29/14/e319/6581268 ; CTT 2022 https://pubmed.ncbi.nlm.nih.gov/36049498/ ; SAMSON https://pubmed.ncbi.nlm.nih.gov/33196154/ and BHF https://www.bhf.org.uk/what-we-do/news-from-the-bhf/news-archive/2020/november/no-difference-in-side-effects-with-a-statin-or-dummy-pill ; StatinWISE https://pubmed.ncbi.nlm.nih.gov/33627334/ ; NLA 2023 https://pubmed.ncbi.nlm.nih.gov/36115813/ ; EAS 2015 https://pubmed.ncbi.nlm.nih.gov/25694464/ ; STOMP https://pubmed.ncbi.nlm.nih.gov/23183941/ ; Mikus https://pubmed.ncbi.nlm.nih.gov/23583255/ ; Mangone https://pubmed.ncbi.nlm.nih.gov/38384718/ ; Kokkinos https://pubmed.ncbi.nlm.nih.gov/23199849/ ; Garrison 2012 https://pubmed.ncbi.nlm.nih.gov/22157068/ ; Cochrane Mg https://www.cochrane.org/evidence/CD009402_magnesium-muscle-cramps ; Brown 2015 https://pubmed.ncbi.nlm.nih.gov/26329449/ ; Peersen 2021 https://pubmed.ncbi.nlm.nih.gov/34915854/ ; CTT 2026 full text Europe PMC PMC7619005 ; NHS atorvastatin https://www.nhs.uk/medicines/atorvastatin/ ; NHS statins https://www.nhs.uk/medicines/statins/ ; FDA grapefruit https://www.fda.gov/consumers/consumer-updates/grapefruit-juice-and-some-drugs-dont-mix ; CTT 2024 diabetes https://pubmed.ncbi.nlm.nih.gov/38554713/

Glycemia: ADA 2026 https://pubmed.ncbi.nlm.nih.gov/41358898/ and https://www.guidelinecentral.com/guideline/14119/ ; ADA 2025 https://pubmed.ncbi.nlm.nih.gov/39651983/ ; diabetesed.net https://diabetesed.net/sleep-diabetes-care/ ; DiabetesInControl https://www.diabetesincontrol.com/ada-2026-diabetes-sleep-guidelines/ ; Sondrup https://pubmed.ncbi.nlm.nih.gov/35189549/ ; Beals https://pubmed.ncbi.nlm.nih.gov/41564347/ ; Shan https://pubmed.ncbi.nlm.nih.gov/25715415/ ; Itani https://pubmed.ncbi.nlm.nih.gov/27743803/ ; Jike https://pubmed.ncbi.nlm.nih.gov/28890167/ ; Mostafa https://pubmed.ncbi.nlm.nih.gov/35616501/ ; Mokhlesi https://pubmed.ncbi.nlm.nih.gov/31048411/ ; Kianersi https://pubmed.ncbi.nlm.nih.gov/39017683/ ; Windred https://pubmed.ncbi.nlm.nih.gov/37738616/ ; Anothaisintawee https://pubmed.ncbi.nlm.nih.gov/28128995/ ; Clavero-Jimeno https://pubmed.ncbi.nlm.nih.gov/41852244/ ; timing RCT protocol https://pubmed.ncbi.nlm.nih.gov/38997765/ ; Gu https://pubmed.ncbi.nlm.nih.gov/32525525/ ; Garaulet https://pubmed.ncbi.nlm.nih.gov/35015083/ ; Grimaldi https://pubmed.ncbi.nlm.nih.gov/41674465/ ; Chong https://pubmed.ncbi.nlm.nih.gov/41780086/ ; Afaghi https://pubmed.ncbi.nlm.nih.gov/17284739/ ; Gangwisch https://pubmed.ncbi.nlm.nih.gov/31828298/ ; Sutton https://pubmed.ncbi.nlm.nih.gov/29754952/ ; Lima https://pubmed.ncbi.nlm.nih.gov/41208478/ ; Yong https://pubmed.ncbi.nlm.nih.gov/41202521/ ; Buffey https://pubmed.ncbi.nlm.nih.gov/35147898/ ; Stutz https://pubmed.ncbi.nlm.nih.gov/30374942/ ; Frimpong https://pubmed.ncbi.nlm.nih.gov/34416428/ ; Leota https://pubmed.ncbi.nlm.nih.gov/40234380/ ; Gardiner alcohol https://pubmed.ncbi.nlm.nih.gov/39631226/ ; Llamosas-Falcon https://pubmed.ncbi.nlm.nih.gov/37890103/ ; Steiner https://pubmed.ncbi.nlm.nih.gov/26426068/ ; Gardiner caffeine MA https://pubmed.ncbi.nlm.nih.gov/36870101/ ; Gardiner caffeine RCT https://pubmed.ncbi.nlm.nih.gov/39377163/ ; Li dawn https://pubmed.ncbi.nlm.nih.gov/32650035/ ; Monnier https://pubmed.ncbi.nlm.nih.gov/24170753/ ; USPSTF OSA https://pubmed.ncbi.nlm.nih.gov/36378202/ ; AHA OSA https://pubmed.ncbi.nlm.nih.gov/34148375/ ; Miao https://pubmed.ncbi.nlm.nih.gov/42597420/ ; Wang 2022 https://pubmed.ncbi.nlm.nih.gov/35302714/ ; Sun 2026 https://pubmed.ncbi.nlm.nih.gov/42607927/ ; AASM/SRS duration https://pubmed.ncbi.nlm.nih.gov/25979105/

Dyslipidemia: Kruisbrink https://pubmed.ncbi.nlm.nih.gov/29247105/ ; Barragan https://pubmed.ncbi.nlm.nih.gov/37815115/ ; Cattazzo https://pubmed.ncbi.nlm.nih.gov/37024342/ ; Wang 2026 NAFLD https://pubmed.ncbi.nlm.nih.gov/41461616/ ; LE8 https://pubmed.ncbi.nlm.nih.gov/35766027/ and https://newsroom.heart.org/news/american-heart-association-adds-sleep-to-cardiovascular-health-checklist ; AHA 2025 https://pubmed.ncbi.nlm.nih.gov/40223596/ ; ACC/AHA 2026 https://pubmed.ncbi.nlm.nih.gov/41824590/ , https://www.acc.org/about-acc/press-releases/2026/03/13/18/01/accaha-issue-updated-guideline-for-managing-lipids-cholesterol , https://www.acc.org/latest-in-cardiology/journal-scans/2026/03/13/15/20/acc-aha-release-new-clinical-guideline-for-managing-dyslipidemia ; ESC/EAS 2025 https://api.iscpcardio.org/storage/guidelines/___25_Dyslipidemia_ESC.pdf and https://www.escardio.org/communities/councils/cardiology-practice/education/cardiopractice/what-is-new-in-the-2025-focused-update-of-the-2019-esc-eas-guidelines-for-the-m/ ; AHA/ACC 2018 https://pubmed.ncbi.nlm.nih.gov/30586774/ ; MetS 2009 https://pubmed.ncbi.nlm.nih.gov/19805654/

Supplements/drugs: AASM 2017 https://pubmed.ncbi.nlm.nih.gov/27998379/ ; ACP 2016 https://pubmed.ncbi.nlm.nih.gov/27136449/ ; ESRS 2023 https://pubmed.ncbi.nlm.nih.gov/38016484/ ; Cruz-Sanabria https://pubmed.ncbi.nlm.nih.gov/38888087/ ; Rubio-Sastre https://pubmed.ncbi.nlm.nih.gov/25197811/ ; Kampmann https://pubmed.ncbi.nlm.nih.gov/33220095/ ; Lauritzen 2022 https://pubmed.ncbi.nlm.nih.gov/35619221/ ; Lauritzen 2021 https://pubmed.ncbi.nlm.nih.gov/34370338/ ; Erland https://pubmed.ncbi.nlm.nih.gov/27855744/ ; Cohen https://pubmed.ncbi.nlm.nih.gov/37097362/ ; NCCIH melatonin https://www.nccih.nih.gov/health/melatonin-what-you-need-to-know ; Khan and Lima https://pubmed.ncbi.nlm.nih.gov/42167796/ ; Mah https://pubmed.ncbi.nlm.nih.gov/33865376/ ; Costello https://pubmed.ncbi.nlm.nih.gov/37487817/ ; Bannai https://pubmed.ncbi.nlm.nih.gov/22529837/ and https://pubmed.ncbi.nlm.nih.gov/22293292/ ; Thomas https://pubmed.ncbi.nlm.nih.gov/37874350/ ; Hidese https://pubmed.ncbi.nlm.nih.gov/31623400/ ; Shinjyo https://pubmed.ncbi.nlm.nih.gov/33086877/ ; Vassiliadis https://pubmed.ncbi.nlm.nih.gov/19138557/ ; Cheah https://pubmed.ncbi.nlm.nih.gov/34559859/ ; Bjornsson https://pubmed.ncbi.nlm.nih.gov/31991029/ ; Sharma https://pubmed.ncbi.nlm.nih.gov/28829155/ ; Barforoush https://pubmed.ncbi.nlm.nih.gov/40964149/ ; Lin https://pubmed.ncbi.nlm.nih.gov/21669584/ ; Shimizu https://pubmed.ncbi.nlm.nih.gov/39583980/ ; Gencer https://pubmed.ncbi.nlm.nih.gov/34612056/ ; Mirzaei-Azandaryani https://pubmed.ncbi.nlm.nih.gov/35578558/ ; Serafin https://pubmed.ncbi.nlm.nih.gov/39652226/ ; Demay https://pubmed.ncbi.nlm.nih.gov/38828931/ ; Gordji-Nejad https://pubmed.ncbi.nlm.nih.gov/38418482/ ; Tsiaras https://pubmed.ncbi.nlm.nih.gov/42035842/ ; ISSN 2017 https://pubmed.ncbi.nlm.nih.gov/28642676/ ; Langan-Evans https://pubmed.ncbi.nlm.nih.gov/36094342/ ; Mei https://pubmed.ncbi.nlm.nih.gov/41470897/ ; NCCIH red yeast rice https://www.nccih.nih.gov/health/red-yeast-rice ; Shinzawa https://pubmed.ncbi.nlm.nih.gov/39708997/ ; HPS2-THRIVE https://pubmed.ncbi.nlm.nih.gov/25014686/ and https://pubmed.ncbi.nlm.nih.gov/23444397/ ; Nicolussi https://pubmed.ncbi.nlm.nih.gov/31742659/ ; Dumitru https://pubmed.ncbi.nlm.nih.gov/42653808/ ; Richardson https://pubmed.ncbi.nlm.nih.gov/12352276/ ; Gray https://pubmed.ncbi.nlm.nih.gov/25621434/ ; Harbourt https://pubmed.ncbi.nlm.nih.gov/32323442/ ; FDA benzodiazepines https://www.fda.gov/drugs/drug-safety-and-availability/fda-requiring-boxed-warning-updated-improve-safe-use-benzodiazepine-drug-class ; AASM RLS 2025 https://pubmed.ncbi.nlm.nih.gov/39324694/

Blood markers: Miller 2009 https://pubmed.ncbi.nlm.nih.gov/19325009/ ; ACG 2017 https://pubmed.ncbi.nlm.nih.gov/27995906/ ; ATA 2012 https://pubmed.ncbi.nlm.nih.gov/22954017/ ; NIDDK https://www.niddk.nih.gov/health-information/endocrine-diseases/hyperthyroidism ; Xiong 2023 https://pubmed.ncbi.nlm.nih.gov/38065875/ ; Cochrane ferritin https://pubmed.ncbi.nlm.nih.gov/34028001/ ; WHO ferritin https://pubmed.ncbi.nlm.nih.gov/33909381/ ; AGA 2020 https://pubmed.ncbi.nlm.nih.gov/32810434/ ; NICE NG239 https://www.nice.org.uk/guidance/ng239/chapter/Recommendations ; BMJ NICE summary https://pubmed.ncbi.nlm.nih.gov/38871397/ ; Endocrine Society T https://pubmed.ncbi.nlm.nih.gov/29562364/ ; Travison https://pubmed.ncbi.nlm.nih.gov/28324103/ ; AUA T 2018 https://pubmed.ncbi.nlm.nih.gov/29601923/ ; Leproult https://pubmed.ncbi.nlm.nih.gov/21632481/ ; Irwin https://pubmed.ncbi.nlm.nih.gov/26140821/ ; AHA/CDC CRP https://pubmed.ncbi.nlm.nih.gov/12551878/ ; USPSTF prostate https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/prostate-cancer-screening ; AUA/SUO 2023 https://pubmed.ncbi.nlm.nih.gov/37096582/ ; Wang 2015 nocturia https://pubmed.ncbi.nlm.nih.gov/26620900/ ; KDIGO 2024 https://kdigo.org/wp-content/uploads/2024/03/KDIGO-2024-CKD-Guideline.pdf and https://pubmed.ncbi.nlm.nih.gov/40063957/

*B2 v1, 2026-09-29.*
