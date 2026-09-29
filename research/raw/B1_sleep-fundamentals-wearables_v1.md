# B1 - Sleep fundamentals, norms for men 45-50, wearable validity, HRV/RHR, sleep-disorder screening (v1)

Track: B1. Compiled 2026-09-29 for the private sleep-coach app (single user: man, 47 y, 68 kg, lean, trains 4x/week, dyslipidemia on a statin, prediabetes, Fitbit Air data via Google Health app, Israel, Asia/Jerusalem).

How to read:
- Each finding = one entry with fixed keys: Finding / Population / Evidence type / Numbers / Source / Coach rule / Confidence / Caveats.
- "Coach rule" thresholds are PROPOSALS derived from the cited evidence unless the source itself states the threshold. Anything computed by me (arithmetic, interpolation, design inference) is tagged [derived].
- [UNVERIFIED] = could not confirm in an opened source; do not use as fact.
- [secondary] = the number appeared in a search-result summary or secondary page (e.g., society news, blog summary of a paper), not in the primary paper text I opened.
- Applicability flags: UKB = UK Biobank (mostly 55-70 y, ~55% women). AoU = All of Us Fitbit cohort (71% women). Most wearable validation studies are small and mixed-sex.
- Search note: the web-search budget ran out late in the session; the last items were verified through Europe PMC REST abstracts (europepmc.org) and full texts opened via NCBI E-utilities. All DOIs/PMIDs below came from those records.

---

## 0. Executive summary: the 15 rules that matter most for this user

1. Regularity first, duration second. In accelerometer cohorts, sleep regularity predicts all-cause mortality better than duration (Windred 2024) and meeting 7 h does NOT cancel the T2D or MACE risk of irregular sleep (Chaput 2024, 2025). For a man with prediabetes this is the #1 sleep lever. Weekly SD of nightly sleep duration: green <=30 min, amber 31-60, red >60 (Kianersi 2024 dose-response).
2. Duration floor: weekly mean >=7 h (AASM/SRS). Wearable-measured 6.5-7.0 h is "near target", not failure, because the 7 h cut-offs come mostly from self-report, which exceeds measured sleep by ~0.4-1.2 h (Lauderdale 2008) [derived].
3. Anchor wake time 7 days/week; keep free-day vs work-day mid-sleep difference (social jetlag) <1 h; flag >=2 h (MetS OR 1.52 at >=2 h vs <1 h).
4. Sleep-onset window ~22:00-23:30 as a regularity anchor, not a moral rule (lowest CVD incidence at 22:00-22:59 in UKB; in men only onset before 22:00 was significantly worse).
5. Never interpret one night of deep/REM minutes. Fitbit individual-night limits of agreement vs PSG are about +/-60 min for deep and for REM (Schyvens 2025, sample 84% men, mean age 46). Use 4-week averages only, and only as "trend", never as a grade.
6. Trust ladder: sleep timing/regularity and TST trends (good) > nightly RHR, breathing rate (good) > nightly HRV (moderate, noisy) > WASO/wake (weak: wake specificity ~48% on Fitbit) > stage minutes, SpO2, skin temperature (weak, trend only).
7. HRV: compare him only to himself. Use ln(RMSSD), 7-day rolling mean vs his own 30-60 day band; ignore single-night moves <~15% (typical measurement error ~12%).
8. Expected, explainable HRV/RHR hits: alcohol (dose-dependent; >0.75 g/kg: RMSSD -12.9 ms, HR +8.7 bpm in first 3 h of sleep, cohort mean age 45), hard exercise ending <4 h before sleep (HRV -14%, RHR +3.9 bpm, sleep onset +36 min), sickness (HRV -10%, HR +6%), sleep loss (RMSSD down).
9. Illness flag = convergence: breathing rate >=3/min above his baseline + RHR up + HRV down + symptoms. Not HRV alone.
10. Orthosomnia guardrails: weekly framing, no daily grade, no population comparisons, always pair data with how he feels; guided interpretation helps (Spina 2023, d=0.51 on ISI) while bare negative feedback harms (Gavriloff 2018, d=0.79 on alertness).
11. OSA: lean lowers but does not remove risk. Men 30-49: ~10% have AHI>=15 (Peppard 2013); HypnoLaus men: 49.7% (modern scoring). STOP-Bang under-scores lean men (BMI, neck, age items score 0). Refer on symptoms (EDS + >=2 of loud habitual snoring, witnessed apnea/gasping, hypertension; or nocturia >=2/night, morning headaches), not on a questionnaire score, and never on Fitbit SpO2.
12. Insomnia: >=3 nights/week for >=3 months with daytime impairment, or ISI >=10 -> recommend CBT-I (first line in AASM 2021, ESRS 2023, ACP 2016), stop adding tracking.
13. Blood tests: if restless-legs symptoms and ferritin <=75 ng/mL or TSAT <20% -> "discuss iron with your physician" (AASM 2025 RLS guideline). No self-dosing.
14. Naps: <=20-30 min if any; habitual naps >=60 min are a flag (associated with T2D and CVD risk, likely partly reverse causation).
15. Fitbit Air: no device-specific peer-reviewed validation found as of 2026-09-29. Google's 2026 algorithm white paper (not peer reviewed) reports 4-stage kappa 0.63 for the new Fitbit/Pixel algorithm; treat as promising but unconfirmed.

---

## 1. Duration, timing and regularity targets (adults ~40-60)

### 1.1 AASM/SRS consensus: >=7 h
- Finding: Adults should sleep 7 or more hours per night on a regular basis. Regular <7 h is associated with weight gain/obesity, diabetes, hypertension, heart disease and stroke, depression, higher death risk, impaired immunity, pain, performance, errors, accidents. >9 h may be appropriate for young adults, people recovering from sleep debt, and ill people; for others it is uncertain whether >9 h carries risk.
- Population: healthy adults 18-60.
- Evidence type: guideline/consensus (modified RAND Appropriateness Method, 15 experts).
- Numbers: threshold 7 h; upper bound statement 9 h.
- Source: Watson NF et al., Sleep 2015 and J Clin Sleep Med 2015;11(6):591-592. https://www.aasm.org/resources/pdf/adultsleepdurationconsensus.pdf ; https://doi.org/10.5665/sleep.4716
- Coach rule: weekly mean sleep >=7 h is the duration target. Flag only when the 7-day mean is <6.5 h (wearable-measured) for 2 consecutive weeks [derived, see 1.9]. Never flag a single short night.
- Confidence: high (target); medium (exact wearable cut-off).
- Caveats: consensus, not RCT; evidence base mostly self-reported sleep; individual need varies.

### 1.2 NSF duration ranges, re-certified 2026
- Finding: Adults 26-64: 7-9 h recommended; 6 h or up to 10 h "may be appropriate" for some people [secondary: "may be appropriate" range seen in search-result text of NSF/press coverage; NSF page itself lists 7-9 h]. A 2026 NSF systematic review of 133 meta-analyses: 74% consistent with the recommendations, 26% inconclusive, none contradictory; most meta-analyses found non-significant sex differences.
- Population: healthy adults without sleep disorders.
- Evidence type: guideline (RAND/UCLA, 18 experts) + systematic review of meta-analyses.
- Numbers: 7-9 h recommended; 99/133 consistent.
- Source: Hirshkowitz M et al., Sleep Health 2015, https://doi.org/10.1016/j.sleh.2014.12.010 ; Dzierzewski JM et al., Sleep Health 2026, https://doi.org/10.1016/j.sleh.2026.05.011 ; NSF page updated 2026-06-10, https://www.thensf.org/sleep-duration-recommendations/
- Coach rule: 6.0-6.9 h with good daytime function = "lower end", coach toward 7 h gently; >9 h on most nights plus fatigue = ask about illness, mood, OSA.
- Confidence: high.
- Caveats: ranges are population-level; the NSF itself states needs vary between people.

### 1.3 AHA Life's Essential 8 (LE8) sleep metric and 2025 AHA statement
- Finding: LE8 scores sleep by average hours/night: 7 to <9 h = 100; 9 to <10 = 90; 6 to <7 = 70; 5 to <6 or >=10 = 40; 4 to <5 = 20; <4 = 0 [secondary: point table from search-result text; advisory abstract opened]. The 2025 AHA scientific statement defines multidimensional sleep health (duration, continuity, timing, satisfaction, regularity, daytime functioning, architecture) and keeps duration as the only LE8 sleep measure because other dimensions lack validated assessment; it notes bedtimes before midnight associate with better outcomes and consistent sleep-wake timing with 22-57% lower cardiovascular death risk.
- Population: US adults (LE8 construct); statement is a narrative/expert synthesis.
- Evidence type: scientific statement / presidential advisory.
- Numbers: see scoring above.
- Source: Lloyd-Jones DM et al., Circulation 2022, https://doi.org/10.1161/CIR.0000000000001078 (PMID 35766027); St-Onge MP et al., Circ Cardiovasc Qual Outcomes 2025, https://doi.org/10.1161/HCQ.0000000000000139 ; AHA newsroom 2025-04-14, https://newsroom.heart.org/news/sleep-matters-duration-timing-quality-and-more-may-affect-cardiovascular-disease-risk
- Coach rule: show a weekly "LE8 sleep points" number (cardiology-aligned, easy to share with his physician), always next to a regularity metric.
- Confidence: high (that this is the AHA metric); medium (clinical value of duration-only scoring).
- Caveats: LE8 was built on self-report; wearable-measured hours read lower (see 1.9).

### 1.4 Sleep Regularity Index (SRI) and mortality (UK Biobank)
- Finding: Sleep regularity was a stronger predictor of all-cause mortality than sleep duration. Top four SRI quintiles (SRI 71.6-98.5) had 20-48% lower all-cause mortality, 16-39% lower cancer mortality and 22-57% lower cardiometabolic mortality than the least regular quintile (SRI <71.6). For cardiometabolic mortality, SRI was no longer significant once duration was added (both matter). SRI rose with duration up to 7.83 h (SRI 81.76) then fell.
- Population: 60,977 UKB, mean age 62.8 y, 55% women; 7-day wrist accelerometry.
- Evidence type: prospective cohort.
- Numbers: median SRI 81.0 (IQR 73.8-86.3); SRI needs >=120 h (5 days) of 24-h-separated epoch pairs.
- Source: Windred DP et al., Sleep 2024;47(1):zsad253, https://doi.org/10.1093/sleep/zsad253
- Coach rule: compute SRI weekly from minute-level sleep/wake (>=5 valid days). Red <71.6 (bottom UKB quintile), amber 71.6-81, green >81, "regular" >87.3 (see 1.5) [derived bands].
- Confidence: medium-high.
- Caveats: older population; one week of data; observational; SRI from research accelerometer, not Fitbit. Fischer 2021 simulations: SRI needs larger samples than SD-based metrics to detect differences (https://doi.org/10.1093/sleep/zsab103), so a single-person weekly SRI is noisy; prefer 14-day windows.

### 1.5 Regularity and major adverse cardiovascular events (MACE)
- Finding: Irregular sleepers (SRI <71.6) HR 1.26 (1.16-1.37); moderately irregular (71.6-87.3) HR 1.08 (lower CI 1.01; upper bound not verified) vs regular (>87.3). Near-linear dose-response. Meeting sleep-duration recommendations offset the risk for moderately irregular but NOT for irregular sleepers.
- Population: 72,269 UKB, aged 40-79, 8 y follow-up.
- Evidence type: prospective cohort.
- Numbers: as above.
- Source: Chaput JP et al., J Epidemiol Community Health 2025, https://doi.org/10.1136/jech-2024-222795 (PMID 39603689)
- Coach rule: "7 h does not rescue very irregular sleep." Prioritize SRI >87 or duration SD <=30 min over squeezing extra minutes.
- Confidence: medium.
- Caveats: observational; residual confounding (shift work, illness).

### 1.6 Regularity and incident type 2 diabetes (key for prediabetes)
- Finding: vs regular sleepers, irregular HR 1.38 (1.20-1.59) and moderately irregular HR 1.35 (1.19-1.53) for T2D; meeting duration recommendations did not counteract it (HR 1.35 [1.09-1.66] and 1.29 [1.08-1.54]).
- Population: 73,630 UKB adults, ~8 y follow-up.
- Evidence type: prospective cohort.
- Source: Chaput JP et al., Diabetes Care 2024, https://doi.org/10.2337/dc24-1208 (PMID 39388339)
- Coach rule: in the weekly review, lead with regularity when HbA1c/fasting glucose are in the prediabetes range.
- Confidence: medium.
- Caveats: association; not tested as an intervention.

### 1.7 Night-to-night SD of sleep duration and diabetes risk (simplest Fitbit metric)
- Finding: vs SD <=30 min: SD 31-45 min HR 1.15 (0.99-1.33); 46-60 min 1.28 (1.10-1.48); 61-90 min 1.54 (1.32-1.80); >=91 min 1.59 (1.33-1.90). SD >60 vs <=60 min: 34% higher diabetes risk (basic adjustment). Non-linear.
- Population: 84,421 UKB, mean age 62, diabetes-free; 7-day accelerometry.
- Evidence type: prospective cohort.
- Source: Kianersi S et al., Diabetes Care 2024;47(9):1647, https://doi.org/10.2337/dc24-0213 (PMID 39017683)
- Coach rule: weekly SD of nightly sleep duration: green <=30 min, amber 31-60, red >60 [bands from the paper's categories].
- Confidence: medium-high.
- Caveats: 7-day window; associations attenuate with full adjustment.

### 1.8 Fitbit-measured irregularity and chronic disease (All of Us)
- Finding: Per 1-hour increase in SD of daily sleep duration: incident obesity OR 1.49 (1.28-1.73), hyperlipidemia 1.39 (1.20-1.61), hypertension 1.56 (1.35-1.81), major depression 1.75 (1.52-2.01), generalized anxiety 1.55 (1.35-1.78). J-shaped duration curves (vs 6.8 h reference: 5 h -> hypertension +29%; 10 h -> hypertension +61%). Higher REM% and deep% inversely associated with incident atrial fibrillation (OR ~0.86-0.87; the paper states stage ORs are per 10% change).
- Population: 6,785 Fitbit users, 71% women, 84% white, median age 50.2, median 4.5 y monitoring.
- Evidence type: prospective cohort (EHR-linked).
- Numbers (cohort medians): sleep 6.7 h (IQR 6.2-7.2); REM 20.7% (17.8-23.1); light 64.2% (60.3-68.5); deep 15.1% (12.7-17.5); SD of daily sleep duration 1.5 h (1.2-1.8).
- Source: Zheng NS et al., Nat Med 2024, https://doi.org/10.1038/s41591-024-03155-8 (PMID 39030265; full text PMC11405268)
- Coach rule: Fitbit-derived irregularity is prognostically meaningful, and the hyperlipidemia link is relevant to his dyslipidemia. Use Fitbit TST SD as a core KPI.
- Confidence: medium.
- Caveats: mostly women; long-term SD (includes travel, holidays) is larger than 7-day SD, so do not compare his 7-day SD to the 1.5 h median.

### 1.9 Self-report vs measured duration (why wearable 6.5-7 h is "near target")
- Finding: Actigraphy-measured sleep averaged 6.0 h vs 6.8 h self-reported; people sleeping 5 h over-reported by 1.2 h, those sleeping 7 h by 0.4 h; r=0.47.
- Population: 669 middle-aged adults (actigraphy plus sleep logs).
- Evidence type: cohort (measurement comparison).
- Source: Lauderdale DS et al., Epidemiology 2008, https://doi.org/10.1097/EDE.0b013e318187a7b0 (PMID 18854708) (seminal, older).
- Coach rule: label 6.5-6.9 h measured as "near target" [derived]. Never tell him he "only slept 6.7 h, below the 7 h minimum".
- Confidence: medium.
- Caveats: actigraphy is not Fitbit; Fitbit's own bias vs PSG is small on average but individual-night error is large (section 3).

### 1.10 Social jetlag (free-day vs work-day timing mismatch)
- Finding: Social jetlag is associated with higher BMI beyond sleep duration (seminal); meta-analysis of 68 studies: BMI +0.49 kg/m2, waist +1.11 cm, SBP +0.37 mmHg, HbA1c +0.42% (I2 up to 100%), but no significant association with diagnosed MetS or T2D; 43 studies (n=231,648): BMI r=0.12, overweight/obesity OR 1.20; social jetlag >=2 h vs <1 h: MetS OR 1.52, waist +2.17 cm.
- Population: mixed adult populations, mostly cross-sectional.
- Evidence type: SR-MA (3) + large cross-sectional (Roenneberg).
- Sources: Roenneberg T et al., Curr Biol 2012, https://doi.org/10.1016/j.cub.2012.03.038 (seminal, older); Bouman EJ et al., J Sleep Res 2023, https://doi.org/10.1111/jsr.13770 ; Arab A et al., Obes Rev 2024, https://doi.org/10.1111/obr.13664 ; Lin MY et al., J Nurs Res 2024, https://doi.org/10.1097/jnr.0000000000000628
- Coach rule: compute mid-sleep on free days (in Israel typically Thu/Fri nights and Fri/Sat nights; confirm his work week) minus work days. Target <1 h; flag >=2 h [thresholds follow Lin 2024 categories].
- Confidence: medium (association), low (causality).
- Caveats: heterogeneity very high; cross-sectional.

### 1.11 Sleep timing window
- Finding: Sleep onset 22:00-22:59 had the lowest CVD incidence. vs that window: <22:00 HR 1.24, 23:00-23:59 HR 1.12, >=midnight HR 1.25. Stronger in women; in men only onset <22:00 was significant.
- Population: 103,712 UKB, 5.7 y follow-up, accelerometer-derived onset.
- Evidence type: prospective cohort.
- Source: Nikbakhtian S et al., Eur Heart J Digit Health 2021, https://doi.org/10.1093/ehjdh/ztab088 (PMID 36713092); AHA 2025 statement (1.3): bedtimes before midnight associate with better outcomes.
- Coach rule: suggest a habitual onset window of ~22:00-23:30 [derived], used as a regularity anchor. Do not push a man earlier than 22:00 to "optimize".
- Confidence: low-medium.
- Caveats: one cohort; timing confounded by chronotype and work.

### 1.12 Weekend catch-up sleep
- Finding: (a) RCT: ad libitum weekend recovery sleep did NOT prevent metabolic dysregulation; whole-body insulin sensitivity fell ~13% with insufficient sleep and 9-27% (whole-body, hepatic, muscle) during recurrent insufficient sleep after the weekend. (b) Cohort: among people <65 y, short weekday sleep plus long weekend sleep was not associated with higher mortality vs consistent 6-7 h; consistently <=5 h HR 1.65 (1.22-2.23).
- Population: (a) healthy young adults, n=36; (b) 43,880 Swedes, 13 y follow-up.
- Evidence type: RCT (lab) + prospective cohort.
- Sources: Depner CM et al., Curr Biol 2019, https://doi.org/10.1016/j.cub.2019.01.069 ; Akerstedt T et al., J Sleep Res 2019, https://doi.org/10.1111/jsr.12712
- Coach rule: for prediabetes, "catch-up is better than nothing, but it does not fix the glucose side, and it widens social jetlag." Push weekday consistency instead.
- Confidence: medium.
- Caveats: RCT in young adults; see Conflicting evidence.

### 1.13 Wake-time anchor
- Finding: CDC lists "Going to bed and getting up at the same time every day" first among better-sleep habits; CDC recommends 7 or more hours for adults 18-60. Stimulus control and sleep restriction (which use a fixed rise time) carry conditional AASM recommendations for chronic insomnia (component detail not verified in opened text).
- Population: general adults.
- Evidence type: agency guidance + guideline.
- Sources: CDC, https://www.cdc.gov/sleep/about/index.html ; Edinger JD et al., J Clin Sleep Med 2021, https://doi.org/10.5664/jcsm.8986
- Coach rule: primary behavior target = wake time within +/-30 min, 7 days/week [derived]; bedtime flexes with sleepiness.
- Confidence: medium.
- Caveats: the +/-30 min band is a design choice, not a tested threshold.

### 1.14 Which single metric matters most?
- Finding (synthesis): In large objective cohorts, regularity (SRI or SD of duration) outperforms duration for all-cause mortality, and irregularity drives T2D and MACE risk even when duration is adequate (1.4-1.7). The AHA still uses duration alone because only duration has validated, scalable measurement (1.3).
- Coach rule [derived]: north-star = "Regular sleep, enough of it": weekly SD of sleep duration (and SRI when minute data allow) as the primary KPI, gated by a weekly mean duration floor (>=7 h target, >=6.5 h measured acceptable).
- Confidence: medium.
- Caveats: no RCT shows that improving regularity lowers hard outcomes.

---

## 2. Normative sleep architecture and efficiency for men ~45-55

### 2.1 Lifespan meta-analysis (seminal, older)
- Finding: In adults, TST, sleep efficiency (SE), slow-wave sleep % and REM % decrease with age; sleep latency, N1 %, N2 % and WASO increase. Only SE keeps declining after 60. Subject-screening quality substantially changes effect sizes; middle-aged adults are under-studied.
- Population: 65 studies, 3,577 healthy subjects, 5-102 y (PSG or actigraphy, 1960-2003).
- Evidence type: SR-MA.
- Source: Ohayon MM et al., Sleep 2004, https://doi.org/10.1093/sleep/27.7.1255 (PMID 15586779).
- Coach rule: frame changes at 47 as normal ageing, not pathology.
- Confidence: medium. Caveats: old scoring rules (R&K).

### 2.2 Modern PSG norms (AASM 2007/2012 scoring)
- Finding: Per decade of age: TST -10.1 min, SE -2.1%, arousal index +2.1/h; WASO +9.7 min/decade and sleep latency +1.1 min/decade [secondary: blog summary of the paper]; age changes in N3 % and REM % not significant [secondary: search-result summary]. More male participants -> shorter REM latency, slightly lower mean SpO2, higher arousal index and AHI.
- Population: 169 studies, 5,273 healthy adults, level-1 lab PSG.
- Evidence type: SR-MA.
- Source: Boulos MI et al., Lancet Respir Med 2019, https://doi.org/10.1016/S2213-2600(19)30057-8 (PMID 31006560); secondary summary https://thoracicandsleep.com.au/blog/normal-polysomnography-parameters-in-healthy-adults/
- Coach rule: expected drift is small per decade; big week-to-week changes are measurement or behavior, not age.
- Confidence: medium-high. Caveats: age x sex tables not opened; lab first-night effects.

### 2.3 AASM-scored healthy sleepers, age contrasts
- Finding (medians, young <=30 y vs >60 y): SE 87.0% vs 79.7%; TST 413.5 vs 378.3 min; N3 20.7% vs 14.9%; REM 15.5% vs 10.3%; WASO 6.0% vs 15.2% (units as reported). 8% of these screened "healthy" sleepers had AHI >15/h.
- Population: 100 healthy sleepers, 19-77 y, selected from a representative population sample, 1 lab PSG night.
- Evidence type: cross-sectional normative.
- Source: Mitterling T et al., Sleep 2015, https://doi.org/10.5665/sleep.4730 (PMID 25515109).
- Coach rule: typical values at ~47 lie between these anchors (see table 2.12) [derived].
- Confidence: medium. Caveats: small n per age band; 41-60 y table not opened.

### 2.4 Reference data and a warning about "norm" feedback
- Finding: With age, sleep becomes shorter and lighter; women sleep deeper (higher N3 %) than men; all parameters show high SDs. Authors: "giving patients feedback about deviations from the norm in their sleep profile may give rise to ill-founded concerns and worry."
- Population: 206 healthy adults, 19-73 y, Freiburg.
- Evidence type: cross-sectional normative.
- Source: Hertenstein E et al., J Clin Sleep Med 2018, https://doi.org/10.5664/jcsm.7036 (PMID 29609718).
- Coach rule: never show "your deep sleep is below the norm for your age".
- Confidence: high (for the variability point).

### 2.5 Sex differences in middle and older age (SHHS)
- Finding: Men sleep lighter than women; women have substantially more slow-wave sleep; men (not women) show poorer sleep with ageing; SDB effects on architecture are smaller than demographic effects; current smokers sleep lighter.
- Population: 2,685 community adults, 37-92 y (Sleep Heart Health Study).
- Evidence type: cross-sectional (home PSG).
- Source: Redline S et al., Arch Intern Med 2004, https://doi.org/10.1001/archinte.164.4.406 (seminal, older).
- Coach rule: do not import women-weighted "deep sleep" benchmarks.
- Confidence: medium-high.

### 2.6 General-population home-PSG values (HypnoLaus, mean age 58)
- Finding: In participants without PLMS >15/h: N2 45.5 +/- 9.8%, N3 20.6 +/- 8.4%, REM 22.4 +/- 6.0%; subjective sleep latency 16.1 +/- 14.3 min.
- Population: 2,162 adults, mean 58.4 +/- 11.1 y, 51% women, Lausanne.
- Evidence type: cross-sectional (home PSG).
- Source: Haba-Rubio J et al., Sleep Med 2018, https://doi.org/10.1016/j.sleep.2017.09.014 (PMID 29425577).
- Coach rule: the SD of N3 (~8 percentage points) shows how wide "normal" is.
- Confidence: medium. Caveats: mixed sex; older than the user.

### 2.7 Population self-report charts (1.1 million people)
- Finding: 1 in 4 sleep less than age-specific recommendations but only 5.8% sleep outside the "acceptable" range; in adults, poor sleep quality 13.3%, insomnia symptoms 9.6-19.4%, TST <6 h 6.5%. Women >=41 y report shorter/less efficient sleep, but actigraphy shows they sleep longer and more efficiently than men.
- Population: NL, UK (40-69 y), US adults; questionnaire data.
- Evidence type: SR-MA with individual participant data.
- Source: Kocevska D et al., Nat Hum Behav 2021, https://doi.org/10.1038/s41562-020-00965-x (PMID 33199855).
- Confidence: high (prevalence). Caveats: self-report.

### 2.8 Global wearable data on sex and age
- Finding: Men sleep less than women across the lifespan; women have more night awakenings, largest gap in early-mid adulthood; sleep onset and offset advance with age.
- Population: 11.14 million nights, 69,650 non-shift workers, 19-67 y, 47 countries.
- Evidence type: cross-sectional (consumer wearables).
- Source: Jonasdottir SS et al., Sleep 2021;44(2):zsaa169, https://academic.oup.com/sleep/article/44/2/zsaa169/5901589
- Confidence: medium. Caveats: device/brand not stated in abstract; numeric age-sex tables not opened.

### 2.9 Ring-based age and sex trends (conference abstract)
- Finding: TST 441 +/- 78 min at 20-25 y vs 403 +/- 68 at 80-85; women +16.2 min vs men; deep % roughly halves across adulthood; REM declines after ~35; light rises to 70-75% in the oldest; men show earlier "stability" declines (~40-45 y) than women (~55-60 y).
- Population: 25,918 Oura users, 20-85 y, 1:1 sex.
- Evidence type: cross-sectional (abstract, industry authors).
- Source: Alikhani I, Karsikas M, de Zambotti M. Sleep 2025;48(Suppl 1):A146, https://academic.oup.com/sleep/article/48/Supplement_1/A146/8135140
- Confidence: low-medium (abstract only; Oura not Fitbit).

### 2.10 What "Deep" means on the new Fitbit algorithm
- Finding: Google re-scored the PSG training/test "N3" labels using slow-wave power because strict 75 microvolt amplitude scoring under-labels N3; this raised average deep sleep in their set from 10.3% to 17.3%. Fitbit "Deep" is therefore calibrated to a physiology-based definition, not strict AASM N3.
- Source: Charton A et al. (Google Research), white paper 2026-03-17, https://storage.googleapis.com/gweb-research2023-media/pubtools/1034544.pdf
- Coach rule: never compare his Fitbit "deep %" with PSG literature values as if identical.
- Confidence: medium (company white paper, not peer reviewed).

### 2.11 Measurement offsets that shift "norms"
- Finding: Lab PSG TST and SE are lower than home wearable estimates; wearables mostly miss quiet wake (section 3). A wearable "85% efficiency" is not a PSG 85%.
- Coach rule: store and display his own 4-week medians; do not show PSG norms in the UI.

### 2.12 Reference card: typical values for a healthy man ~45-55
| Metric | Lab/home PSG (healthy) | Fitbit/consumer | Between-person spread | Coach use |
|---|---|---|---|---|
| TST | ~380-415 min [derived: between Mitterling 413.5 (<=30 y) and 378.3 (>60 y); Boulos -10 min/decade] | AoU Fitbit median 6.7 h (IQR 6.2-7.2) (71% women; men likely lower, women +16 min in Oura abstract) | Mitterling range at >60 y: 216-440 min | Trend only |
| Sleep efficiency | ~82-86% [derived: 87.0% young to 79.7% >60; -2.1%/decade] | Wearables overestimate SE when wake is missed; Pixel Watch SE bias +12.8 points in Lee T 2023 | wide; >60 y range 44.5-90.9% | Do not display as a grade |
| Sleep latency | ~15-20 min subjective in HypnoLaus (16.1 +/- 14.3) | Fitbit latency longer than other devices (Lee YJ 2025) | large | Use his own diary too |
| WASO | ~8-12% of time in bed [derived from 6.0% to 15.2%] ; +9.7 min/decade | Fitbit under-counts WASO by ~12-17 min on average (Schyvens) | large | Weak metric |
| N3 / Deep % | ~15-21% (HypnoLaus 20.6 +/- 8.4 at mean 58; Mitterling 20.7 young vs 14.9 old); men lower than women | AoU Fitbit 15.1% (IQR 12.7-17.5); Google re-scored mean 17.3% | SD ~8 points | 4-week trend only |
| REM % | ~18-23% (HypnoLaus 22.4 +/- 6.0) | AoU Fitbit 20.7% (IQR 17.8-23.1) | SD ~6 points | 4-week trend only |
| Light (N1+N2) % | ~50-60% [derived] | AoU Fitbit 64.2% (IQR 60.3-68.5) | | Ignore |
| Arousal index | rises ~2/h per decade (Boulos) | not measured | | n/a |
| RMSSD (HRV) | n/a | Fitbit men age 45: median 34 ms (IQR 25-48), age 50: 31 (23-42), 06:00-07:00 window (section 4.2) | very large | Personal baseline only |
| RHR | n/a | Fitbit population mean 65 bpm, range 40-109 (all ages) | up to 70 bpm between people | Personal baseline only |
| Breathing rate | n/a | healthy adults 90% range 11.8-19.2/min, mean 15.4 | | Personal baseline only |

---

## 3. Consumer wearable validity vs polysomnography

### 3.1 Society positions
- Finding: (a) SRS state of the science 2024: consumer multi-sensor devices can exceed traditional actigraphy but misclassify wake during the sleep period; concerns about disparities. (b) World Sleep Society 2025: standardize "fundamental sleep measures" (e.g., TST, sleep timing/regularity, continuity) and separate them from proprietary exploratory metrics; interpret alongside how you feel and daytime function, with more emphasis on trends than single scores or stage estimates; reduce or pause monitoring if it becomes problematic [details secondary: society-paper abstract opened; user-facing points from secondary summaries]. (c) NSF 2026 position statement: CST promising for individualized insight; calls for stakeholder action (abstract). (d) AASM 2018: CSTs cannot be used for diagnosis or treatment of sleep disorders; may enhance patient-clinician interaction.
- Evidence type: society statements.
- Sources: de Zambotti M et al., Sleep 2024, https://doi.org/10.1093/sleep/zsad325 ; Chee MWL et al., Sleep Med 2025;131:106506, https://doi.org/10.1016/j.sleep.2025.106506 ; secondary summary https://thoracicandsleep.com.au/blog/wearable-sleep-trackers-and-orthosomnia/ ; Dzierzewski JM et al., Sleep Health 2026, https://doi.org/10.1016/j.sleh.2026.02.003 ; Khosla S et al., J Clin Sleep Med 2018, https://doi.org/10.5664/jcsm.7128
- Coach rule: the app is a behavior coach using fundamental measures; any disorder suspicion ends in "talk to a clinician", never a diagnosis.
- Confidence: high.

### 3.2 Pooled accuracy of wrist devices
- Finding: vs PSG, wrist wearables differed significantly for TST (pooled MD -16.9 min, 95% CI -26.3 to -7.4), SE (MD -4.7%), sleep latency (MD +2.6 min) and WASO (MD +13.3 min); direction convention not stated in the text I opened. Fitbit subgroup: WASO not significantly different from PSG; Fitbit measured sleep latency longer than other devices. Separately: wearables detect sleep with high sensitivity but 4-stage accuracy is much lower [secondary].
- Population: 24 studies, 798 participants (Fitbit, Garmin, WHOOP, Apple, Xiaomi, Jawbone).
- Evidence type: SR-MA.
- Source: Lee YJ et al., J Clin Sleep Med 2025;21(3):573-582, https://doi.org/10.5664/jcsm.11460 (PMID 39484805).
- Coach rule: expect roughly 15-20 min average TST error; individual-night error is far larger (3.3).
- Confidence: high (that error exists); low (direction).

### 3.3 Fitbit Charge 5 and Fitbit Sense vs PSG (closest demographic match)
- Finding: 4-stage kappa 0.41 (Charge 5) and 0.42 (Sense); sleep sensitivity 92-93% but wake specificity only ~48%. Mean biases: TST +11 min (Charge 5) / +6 min (Sense); WASO -17 / -12 min; light +17 / +18 min; deep -2 / -4 min (NS); REM -0.2 / +3 min (NS). Bland-Altman limits of agreement: deep -66 to +62 min (Charge 5), -72 to +64 (Sense); REM -58 to +58 (Charge 5), -62 to +68 (Sense); TST -70 to +93 (Charge 5), -125 to +137 (Sense); WASO -117 to +83 (Charge 5). Authors: devices with kappa ~0.4-0.5 can track "prolonged and significant changes in sleep architecture".
- Population: 62 adults, 52 men, mean 46.0 +/- 12.6 y; mix of healthy and suspected OSA.
- Evidence type: validation study (in-lab PSG).
- Source: Schyvens AM et al., Sleep Adv 2025, https://doi.org/10.1093/sleepadvances/zpaf021 (PMID 40303381; full text PMC12038347).
- Coach rule: nightly deep or REM minutes can be off by about 1 hour either way -> never comment on a single night's stages; use >=4-week averages and only report changes larger than ~10 min/night sustained over a month [derived].
- Confidence: high.
- Caveats: pre-2026 Fitbit algorithm; one PSG night.

### 3.4 Multi-device study incl. Google Pixel Watch and Fitbit Sense 2
- Finding: Fitbit Sense 2: macro F1 0.58, accuracy 0.65, kappa 0.42; per-stage F1 wake 0.38, light 0.73, deep 0.56, REM 0.66. Pixel Watch: macro F1 0.57, kappa 0.40; F1 wake 0.35, deep 0.59, REM 0.61; SE bias +12.8 points; REM latency bias +65 min. Wearables showed high proportional bias in SE; performance varied with BMI, SE and AHI.
- Population: 75 adults, 52% men, mean 43.6 y, BMI 23.9, mean AHI 18.2 (many with OSA), Korea.
- Evidence type: prospective multicenter validation.
- Source: Lee T et al., JMIR Mhealth Uhealth 2023, https://doi.org/10.2196/50983 (PMID 37917155).
- Coach rule: wake detection is the weakest class; do not coach on "awake minutes".
- Confidence: high.

### 3.5 Older and supporting validations
- Finding: (a) 7 devices, healthy young adults: sleep sensitivity >=0.93, specificity 0.18-0.54; Fitbit Alta HR as good as or better than actigraphy; accuracy falls on disrupted nights. (b) Fitbit meta-analysis: non-staging models overestimated TST by ~7-67 min and underestimated WASO by ~6-44 min; staging models sensitivity 0.95-0.96, specificity 0.58-0.69. (c) Fitbit Sense 2 overestimated light and underestimated deep sleep; Oura not different from PSG for stages (35 adults 20-50 y, single night). (d) In older adults (56-80 y) devices (incl. Fitbit Sense 2) underestimated TST and WASO, overestimated deep, and performed poorly at identifying individual stages. (e) During simulated in-bed smartphone use, Oura and Fitbit (Sense) detected sleep/wake transitions better than actigraphy and cheaper trackers; worse at lower SE (63 adults, 20-68 y).
- Evidence type: validation studies / SR-MA.
- Sources: Chinoy ED et al., Sleep 2021, https://doi.org/10.1093/sleep/zsaa291 ; Haghayegh S et al., J Med Internet Res 2019, https://doi.org/10.2196/16273 (seminal, older); Robbins R et al., Sensors 2024, https://doi.org/10.3390/s24206532 ; Searles ME et al., Sleep Adv 2026, https://doi.org/10.1093/sleepadvances/zpag006 ; Willoughby AR et al., Sleep Health 2024, https://doi.org/10.1016/j.sleh.2024.02.007
- Coach rule: the direction of stage bias differs between studies and populations -> use within-person trends only.
- Confidence: high (limitations), low (direction of stage bias).

### 3.6 Google/Fitbit 2026 algorithm update (applies to the Fitbit/Pixel family)
- Finding: New sleep-session and sleep-stage models (accelerometer + PPG inter-beat intervals), rolled out across Fitbit and Pixel devices in early 2026. On 50 withheld PSG nights: 4-stage kappa 0.47 (original) -> 0.56 (July 2025 model) -> 0.63 (new); accuracy 67% -> 71% -> 77%. On average 69% of wake epochs labeled wake; largest errors Deep vs Light and Wake labeled Light. Deep showed proportional bias (slope -0.822, intercept 52.7 min), i.e., estimates compressed toward the group mean. Kappa lower with higher AHI and more stage transitions. Inter-scorer ceiling ~0.7-0.8. Session detection: >=95% overlap with expert "time attempting to sleep" in 94% of healthy nights; naps >=20 min count as sessions. Test set: 50 nights (12 no OSA, 16 mild, 22 moderate-severe), 50% BMI >=30. Insomnia results promised for future work.
- Evidence type: company white paper (not peer reviewed).
- Source: Charton A, Heneghan C, et al. Google Research, 2026-03-17, https://storage.googleapis.com/gweb-research2023-media/pubtools/1034544.pdf
- Coach rule: the newer algorithm is better but the proportional deep bias means individual differences in deep sleep are shrunk; trends in "deep" are especially unreliable for him. Historical data before ~early 2026 used older algorithms: mark an algorithm-change breakpoint in baselines [derived].
- Confidence: medium.
- Caveats: company-run; Fitbit Air not named in the paper.

### 3.7 Fitbit Air and the Google Health app (device facts)
- Finding: Fitbit Air announced 2026-05-07: screenless tracker with 24/7 HR, AFib alerts, SpO2, RHR, HRV, sleep stages; "Not intended for medical purposes." Fitbit app renamed Google Health app (from 2026-05-19): improved sleep score and sleep tracking algorithms; Estimated Oxygen Variation (EOV) discontinued; skin-temperature minute data removed (daily/weekly trends remain); Gemini-powered Google Health Coach for Premium users. Vitals: HRV by RMSSD requiring >=3 h of quality sleep; breathing rate during sleep; SpO2 at night; skin temperature variation needs 3 nights for baseline; personal ranges based on up to 30 days. HRV comes from the longest sleep period (>3 h) in the past 24 h [secondary: help-page text in search results].
- Evidence type: manufacturer documentation.
- Sources: https://blog.google/products-and-platforms/devices/fitbit/fitbit-air/ ; https://support.google.com/googlehealth/answer/17068213?hl=en ; https://support.google.com/fitbit/answer/14236917?hl=en
- Coach rule: align the app's baseline window with Google's (30 days) to avoid contradicting the Google Health app; tell the user when the two disagree and why.
- Confidence: high (facts), n/a (accuracy).
- Caveats: NO peer-reviewed Fitbit Air validation found (searched through 2026-09-29).

### 3.8 HRV and RHR validity
- Finding: (a) Nocturnal RHR vs ECG: MAPE 1.7-3.0% across Oura/WHOOP/Polar; nocturnal HRV MAPE 6-16% (Oura best, Polar worst); Fitbit not tested. (b) Fitbit PPG vs chest-strap ECG (~30 people at rest): HRV total power r=0.96 after artifact cleaning vs r=0.39 raw [preprint]. (c) Fitbit Versa 4 pilot (n=8): median nocturnal RMSSD 21.7 ms vs 20.6 ms reference (NS).
- Evidence type: validation studies (small).
- Sources: Dial MB et al., Physiol Rep 2025, https://doi.org/10.14814/phy2.70527 ; Natarajan A et al. preprint, https://doi.org/10.1101/772285 ; Nasr A et al., Digit Health 2025, https://doi.org/10.1177/20552076251394960
- Coach rule: RHR is the most trustworthy physiological signal; HRV is usable as a within-person trend.
- Confidence: medium (RHR high).
- Caveats: no large Fitbit nocturnal HRV validation found; do not mix HRV values from different devices.

### 3.9 Breathing rate
- Finding: Fitbit estimates respiratory rate from respiratory sinus arrhythmia; vs sleep-study reference RMSE 0.648/min, MAE 0.46/min, MAPE 3%. Healthy adults: 90% of values 11.8-19.2/min, mean 15.4; minimum at BMI ~25; slightly declines with age; 14-day coefficient of variation 90% range for men 2.3-9.5% (20-24 y) to 2.7-21.7% (65-69 y). In COVID-19, 36.4% of symptomatic (23.7% asymptomatic) people had at least one nightly value >=3/min above their usual rate between day -1 and day +5.
- Population: Fitbit users; validation on sleep-study data.
- Evidence type: validation + large cross-sectional.
- Source: Natarajan A et al., npj Digit Med 2021, https://doi.org/10.1038/s41746-021-00493-6 (PMID 34526602).
- Coach rule: breathing rate >=3/min above his 30-day median on >=2 nights = illness-watch signal (combine with RHR/HRV and symptoms).
- Confidence: medium-high.
- Caveats: not an apnea detector (average rate, not events).

### 3.10 SpO2
- Finding: Consumer smartwatch SpO2 vs clinical oximetry: MAE 2.2% (Apple Watch 7) to 5.8% (Garmin Venu 2s); missing data up to ~30% (Withings). In hospitalized COVID-19 patients, hypoxia detection sensitivity was 34.8% (Apple) and 68.5% (Withings). Google: night SpO2 usually lower than daytime, typically above 90%. No peer-reviewed Fitbit-specific SpO2 validation found [UNVERIFIED for Fitbit].
- Evidence type: validation studies.
- Sources: Jiang Y et al., PLOS Digit Health 2023, https://doi.org/10.1371/journal.pdig.0000296 ; Rajakariar K et al., Mayo Clin Proc Digit Health 2024, https://doi.org/10.1016/j.mcpdig.2024.02.001 ; Google Health Help (3.7).
- Coach rule: SpO2 is display-only context; never reassure ("your oxygen is fine, so no apnea") and never alarm on one night.
- Confidence: medium (limits), low (Fitbit specifics).

### 3.11 Skin temperature
- Finding: Fitbit reports nightly wrist skin-temperature variation vs a personal baseline (needs 3 nights). Peer-reviewed wearable skin-temperature evidence found is mainly finger temperature for menstrual-cycle tracking in women (e.g., luteal vs follicular ~0.30 C). No verified validation for illness detection in men with Fitbit wrist temperature.
- Sources: Google Help (3.7); Maijala A et al., BMC Womens Health 2019, https://doi.org/10.1186/s12905-019-0844-9
- Coach rule: use only as a corroborating signal in the illness-watch rule, never alone.
- Confidence: low.

### 3.12 Trust ladder for the coach (synthesis)
| Signal | Reliability for this app | Use |
|---|---|---|
| Sleep onset/offset timing, regularity (SD, SRI) | Good (session detection strong) | Primary KPI |
| TST weekly mean | Good for trends; single night +/-1-2 h LoA | Weekly target |
| Nightly RHR | Good (MAPE ~2-3% in validated devices) | Recovery/illness trend |
| Breathing rate | Good as trend (MAE ~0.5/min) | Illness watch |
| Nightly HRV (RMSSD) | Moderate; noisy (~12% typical error) | 7-day rolling vs own band |
| WASO / awake minutes | Weak (wake specificity ~48-69%) | Do not coach on it |
| Deep / REM / light minutes | Weak per night (LoA ~+/-60 min); proportional bias | 4-week trend at most |
| Sleep score (proprietary) | Unknown validity | Do not anchor coaching on it |
| SpO2, skin temperature | Weak / unvalidated for Fitbit | Context only |

---

## 4. HRV and resting HR: interpretation for training and recovery

### 4.1 What Fitbit HRV is
- Finding: RMSSD in ms, computed overnight; requires >=3 h of quality sleep; taken from the longest sleep period [secondary]; personal range from up to 30 days.
- Source: Google Health Help (3.7). Confidence: high.
- Coach rule: one value per night; treat nights with <3 h main sleep as missing.

### 4.2 Population distribution (men mid-40s)
- Finding: HRV declines with age; parasympathetic indices (RMSSD, HF) decline faster than sympathetic ones; from 20 to 60 y HF power fell 82.0% in men. Physical activity was dose-dependently associated with higher HRV; at 50-54 y men needed ~300 extra daily steps per 1 ms2 of HF power vs ~30 at 20-24 y [preprint]. Fitbit RMSSD, 06:00-07:00 window: men age 45: mean 38, median 34 ms (IQR 25-48); age 50: mean 34, median 31 (23-42). At 18:00-19:00, age 45: median 24 (IQR 18-34) [preprint Table S2].
- Population: 8,203,261 Fitbit users.
- Evidence type: cross-sectional.
- Sources: Natarajan A et al., Lancet Digit Health 2020, https://doi.org/10.1016/S2589-7500(20)30246-6 (PMID 33328029); preprint tables https://doi.org/10.1101/772285
- Coach rule: if he asks "is my HRV good?", answer that his number sits within (or outside) the very broad typical band for his age and that only his own trend matters. Never score him against the population.
- Confidence: medium.
- Caveats: the app's nightly HRV is not the same window as the preprint tables; values not directly comparable.

### 4.3 Everyday stressors and their typical size
- Finding: HRV r=-0.35 with age at population level. Within-person responses: day after hard training vs rest: HRV -4.6% (d=0.36), HR +1.3%; after high alcohol intake: HRV -12% (d=0.55), HR +6% (d=0.97); sickness: HRV -10% (d=0.47), HR +6% (d=0.97). The paper cites typical errors of estimate of ~12% for rMSSD (and ~10% for HR) [value as extracted; treat cautiously].
- Population: 28,175 app users (22,750 men), mean age 37 +/- 12; morning 1-5 min readings (camera or chest strap).
- Evidence type: large observational (free-living).
- Source: Altini M, Plews DJ. Sensors 2021, https://doi.org/10.3390/s21237932 (PMID 34883936).
- Coach rule: single-night HRV changes <~15% are noise [derived]; changes of 10-15% with a logged cause (alcohol, hard session, illness) are "expected".
- Confidence: medium.
- Caveats: morning spot readings, not nocturnal Fitbit HRV; self-reported tags.

### 4.4 Alcohol, dose-response (best-matched age)
- Finding: In the first 3 h of sleep, RMSSD fell 2.0 / 5.7 / 12.9 ms and HR rose 1.4 / 4.0 / 8.7 bpm for low (<=0.25 g/kg), moderate (>0.25-0.75 g/kg) and high (>0.75 g/kg) intake; HRV-based recovery fell 9.3 / 24.0 / 39.2 percentage units. Effects larger in younger people and those with lower baseline sleep HR (fitter).
- Population: 4,098 Finnish employees, mean 45.1 y, 55.8% women; ECG (Firstbeat Bodyguard).
- Evidence type: observational (real-world, within-person).
- Source: Pietila J et al., JMIR Ment Health 2018, https://doi.org/10.2196/mental.9519 (PMID 29549064).
- Coach rule: for 68 kg, 0.25 g/kg = 17 g ethanol and 0.75 g/kg = 51 g [derived] (a 330 mL 5% beer ~13 g; 150 mL 12% wine ~14 g [derived arithmetic]). When he logs alcohol, pre-explain the next night's HRV/RHR shift; in the weekly look-back quantify "your drink nights vs dry nights" from his own data.
- Confidence: high (direction and dose-response).
- Caveats: lean, fit men may show larger effects (per the paper's lower-HR finding).

### 4.5 Evening exercise timing and strain
- Finding: Exercise ending 2 h before habitual sleep onset at maximal vs light strain: sleep onset +36.0 min, sleep duration -22.2 min (-5.4%), nocturnal RHR +3.9 bpm (+6.8%), nocturnal HRV -8.3 units (-14.1%). Exercise ending >=4 h before sleep onset was not associated with sleep changes regardless of strain.
- Population: 14,689 physically active users of a wrist-worn biometric device (WHOOP per the study team [UNVERIFIED in opened text]), 73.8% men, mean 37.9 +/- 10.8 y; 4.08 million nights.
- Evidence type: large observational (within-person).
- Source: Leota J et al., Nat Commun 2025, https://doi.org/10.1038/s41467-025-58271-x (PMID 40234380; full text PMC12000559).
- Coach rule: when a hard workout ends <4 h before his usual bedtime, pre-annotate the night ("expect later sleep, higher RHR, lower HRV; not a recovery problem"). If sleep is the priority, move hard sessions to end >=4 h before bedtime; light sessions late are fine.
- Confidence: medium-high.
- Caveats: observational; that device's HRV units/scale may differ from Fitbit RMSSD, so apply the percentages, not the absolute values.

### 4.6 Exercise load and nocturnal autonomic recovery (mechanistic)
- Finding: In 14 healthy men, higher intensity raised nocturnal HR; 90-min duration lowered nocturnal HRV vs control. After supramaximal intermittent exercise, vagal HRV stayed suppressed at 12 h with partial recovery by 36 h.
- Evidence type: small experimental studies (seminal, older).
- Sources: Myllymaki T et al., Eur J Appl Physiol 2012, https://doi.org/10.1007/s00421-011-2034-9 ; Al Haddad H et al., Int J Sports Physiol Perform 2009, https://doi.org/10.1123/ijspp.4.4.435
- Coach rule: after unusually long/intense sessions allow 24-48 h before calling HRV "unrecovered".
- Confidence: medium.

### 4.7 Sleep loss
- Finding: Sleep deprivation significantly decreased RMSSD and increased LF and LF/HF; SDNN and HF changes not significant.
- Population: 11 RCTs, n=549.
- Evidence type: SR-MA.
- Source: Zhang S et al., Front Neurol 2025, https://doi.org/10.3389/fneur.2025.1556784 (PMID 40895095).
- Coach rule: a short night explains a lower next-night HRV; do not double-count it as "poor recovery".
- Confidence: medium. Caveats: mostly total deprivation in young adults; effect sizes not extracted.

### 4.8 Illness and RHR behavior
- Finding: Illness raises breathing rate and HR and lowers HRV (COVID-19, 2,745 PCR-positive wearable users in a Fitbit Research study; illness-day AUC 0.77 from physiological signs). RHR: population mean 65 bpm (range 40-109); a person's normal can differ from another's by up to 70 bpm; within-person RHR is stable, with a small seasonal pattern (minimum July, maximum January); 20% of people had at least one week with RHR fluctuating by >=10 bpm.
- Population: Fitbit users (COVID study); 92,457 US adults over 2 years (RHR study).
- Evidence type: cohort.
- Sources: Natarajan A et al., npj Digit Med 2020, https://doi.org/10.1038/s41746-020-00363-7 ; Quer G et al., PLoS One 2020, https://doi.org/10.1371/journal.pone.0227709
- Coach rule: illness-watch fires only on convergence: RHR >= +5 bpm above 30-day median [derived] AND (HRV below band OR breathing rate >= +3/min) on >=2 consecutive nights, or any of these plus logged symptoms. RHR >= +10 bpm for a week with no explanation -> suggest a physician check [derived].
- Confidence: medium.
- Caveats: thresholds are design proposals.

### 4.9 Baseline methods from the literature
- Finding: (a) 7-day rolling average of ln rMSSD and its coefficient of variation (CV) tracked progression to non-functional overreaching in an elite triathlete (case comparison: rolling mean fell, CV fell). (b) Review: use averaging, individual "fingerprint", beware HRV saturation in very fit people. (c) HRV-guided training in 40 recreational runners: hard sessions only when HRV was within an individual smallest worthwhile change (SWC); fewer MOD/HIT sessions (13.2 vs 17.7), 3000 m improved 2.1% vs 1.1% (NS in control), VO2max improved in both. SWC is commonly defined as baseline mean +/- 0.5 SD of ln rMSSD [secondary: protocol text in search results]. (d) Meta-analysis: HRV-guided training improved vagal HRV (SMD 0.50, 0.09-0.91) but not resting HR (SMD 0.04); small non-significant gains in VO2max (SMD 0.20) and performance (0.20); fewer negative responders; best baseline method (fixed vs rolling) unresolved.
- Evidence type: case study; review; RCT; SR-MA.
- Sources: Plews DJ et al., Eur J Appl Physiol 2012, https://doi.org/10.1007/s00421-012-2354-4 ; Plews DJ et al., Sports Med 2013, https://doi.org/10.1007/s40279-013-0071-8 ; Vesterinen V et al., Med Sci Sports Exerc 2016, https://doi.org/10.1249/MSS.0000000000000910 ; Manresa-Rocamora A et al., Int J Environ Res Public Health 2021, https://doi.org/10.3390/ijerph181910299
- Confidence: medium (method), low (benefit on fitness).
- Caveats: mostly young endurance athletes; he is 47 and does mixed resistance/aerobic training.

### 4.10 Late meals
- Finding: No peer-reviewed study quantifying the effect of late meals on nocturnal HRV/RHR was found in this search [UNVERIFIED]. Related: in 26,902 male health professionals (45-82 y), eating late at night was associated with 55% higher CHD risk (observational, not HRV). CDC advises avoiding large meals and alcohol before bedtime.
- Sources: Cahill LE et al., Circulation 2013, https://doi.org/10.1161/CIRCULATIONAHA.113.001474 ; CDC (1.13).
- Coach rule: log dinner end-time and run an n-of-1 comparison in his own data (e.g., dinner ending >=3 h vs <2 h before bed) before claiming an effect [derived].
- Confidence: low.

### 4.11 Proposed HRV/RHR algorithm spec for the app [derived, to be tested]
1. Inputs per night: RMSSD, RHR, breathing rate, TST, onset/offset, plus logs (alcohol grams, workout end-time and RPE/strain, symptoms, travel, meds).
2. Transform: x = ln(RMSSD).
3. Short-term signal: 7-day rolling mean of x (Plews). Require >=4 valid nights in the window.
4. Personal band: mean +/- 0.5 SD of daily x over the previous 30-60 days (SWC convention), excluding flagged nights (illness, travel >=3 time zones, algorithm-change dates). Also keep the 7-day CV of x.
5. States: "in band" -> silent. "Below band with a logged explanation" -> explain in look-back only. "Below band >=3 days and unexplained" -> ask about stress, symptoms, training load; suggest an easier day. "Below band + RHR >= +5 bpm or breathing >= +3/min" -> illness-watch message. "Above band" -> neutral (can reflect fitness or, in very fit people, saturation; do not praise).
6. Never show day-level HRV as good/bad colors; show the 7-day line inside the band.
7. Re-baseline after statin change or any new medication (drug effects on HRV/RHR not researched here) [UNVERIFIED effect].
- Confidence: low-medium (rules extrapolated from athletes and wellness datasets).

---

## 5. Orthosomnia and tracker-induced anxiety

### 5.1 Origin and definition
- Finding: Case series: patients seeking treatment for self-diagnosed problems based on tracker data; perfectionistic quest for ideal sleep; tracker data may feel more credible to patients than PSG/actigraphy; recommends incorporating trackers into CBT-I.
- Evidence type: case series (seminal).
- Source: Baron KG et al., J Clin Sleep Med 2017, https://doi.org/10.5664/jcsm.6472
- Confidence: low (evidence level), high (clinical relevance).

### 5.2 Prevalence
- Finding: 35.8% regularly used sleep trackers; algorithm-defined orthosomnia 3.0% (conservative), 8.6% (moderate), 14.0% (lenient); cases had higher insomnia scores; no age/sex difference.
- Population: 523 adults (general population sample).
- Evidence type: cross-sectional.
- Source: Jahrami H et al., Brain Sci 2024, https://doi.org/10.3390/brainsci14111123
- Confidence: low-medium.

### 5.3 Measurement: Bergen Orthosomnia Scale (BOS)
- Finding: 12 items, two factors: "interference" and "rigidity" (alphas 0.87/0.88; 3-week test-retest 0.74/0.82). Both correlate with sleep effort, dysfunctional beliefs about sleep, perfectionism, OCD and health anxiety; interference correlates with insomnia and neuroticism; rigidity with conscientiousness.
- Population: 994 + 473 survey respondents, mean age ~41-42.
- Evidence type: psychometric development.
- Source: Guldbrandsen BV et al., Front Sleep 2025, https://doi.org/10.3389/frsle.2025.1640355
- Coach rule: a conscientious, data-driven user is at risk of the "rigidity" pattern; screen gently every ~8 weeks with 2-3 BOS-style questions (item wording to be licensed/checked) [derived].
- Confidence: medium.

### 5.4 Negative feedback harms, guided feedback helps
- Finding: (a) Randomized sham feedback in insomnia disorder: "negative" sleep feedback reduced evening alert cognition (d=0.79) and increased sleepiness/fatigue (d=0.55) vs "positive" feedback; no effect on attentional bias or vigilance. (b) RCT: 5 weeks of wearable feedback (Fitbit + EEG headband) with guidance on interpreting sensor vs perceived sleep lowered ISI (d=0.51) and sleep disturbance (d=0.42) vs sleep hygiene/education; no change in sleep-wake state discrepancy.
- Population: (a) 63 adults with DSM-5 insomnia; (b) 113 adults with ISI >=10, mean 47.5 y, 64.9% women.
- Evidence type: RCTs.
- Sources: Gavriloff D et al., J Sleep Res 2018, https://doi.org/10.1111/jsr.12726 ; Spina MA et al., Sleep 2023, https://doi.org/10.1093/sleep/zsad167
- Coach rule: every data message must be interpretive and framed with uncertainty; the morning message never opens with a negative verdict.
- Confidence: medium-high.

### 5.5 Clinical guideline angle
- Finding: European guideline: actigraphy is not recommended for routine evaluation of insomnia (grade C) but can help differential diagnosis (A).
- Source: Riemann D et al., J Sleep Res 2023, https://doi.org/10.1111/jsr.14035
- Coach rule: wearable data cannot establish or exclude insomnia; use a diary/ISI.

### 5.6 Design mitigations for this app [derived from 2.4, 3.1, 5.1-5.5]
1. Weekly framing: one main look-back per week; daily screen limited to 1 observation + 1 suggestion, no score, no color grades.
2. No population comparisons in UI (Hertenstein 2018).
3. Stages shown only as 4-week trend lines with an explicit "estimate" label; never "you got too little deep sleep".
4. Every morning pair data with his 1-5 "how rested" rating and daytime function; when device and feeling disagree, coach sides with function and explains the device's wake-detection limits (Spina 2023 approach).
5. "Noise band" visual for HRV/RHR; explanations pre-attached to expected dips (alcohol, late training).
6. Detect rigidity: >=3 in-app checks before 09:00, repeated "why was my sleep bad" questions, lengthening time in bed to chase scores -> offer a "data-light week" (tracker on, app summary only on Friday) [derived]; WSS suggests reducing or pausing monitoring when it becomes problematic [secondary].
7. Never recommend longer time in bed to raise a sleep score (can worsen continuity).
8. If insomnia criteria met (6.5), route to CBT-I instead of more metrics.
- Confidence: medium (principles), low (specific thresholds).

---

## 6. Screening for sleep disorders in a 47-year-old lean man

### 6.1 OSA prevalence and relevance
- Finding: (a) Globally ~936 million adults 30-69 y have OSA (AHI >=5) and ~425 million moderate-severe. (b) US (Wisconsin cohort, modeled): AHI >=15 in 10% (7-12) of men 30-49 and 17% (15-21) of men 50-70. (c) HypnoLaus (median age 57, mean BMI 25.6, AASM 2012 scoring): AHI >=15 in 49.7% of men; top AHI quartile associated with hypertension OR 1.60, diabetes 2.00, metabolic syndrome 2.80, depression 1.92. (d) 8% of carefully screened "healthy" sleepers had AHI >15 (Mitterling 2015). (e) AASM lists type 2 diabetes among populations with increased OSA rates. (f) Non-obese OSA may involve a low arousal threshold and fewer desaturations (review).
- Evidence type: population cohorts, literature-based estimate, review, guideline.
- Sources: Benjafield AV et al., Lancet Respir Med 2019, https://doi.org/10.1016/S2213-2600(19)30198-5 ; Peppard PE et al., Am J Epidemiol 2013, https://doi.org/10.1093/aje/kws342 ; Heinzer R et al., Lancet Respir Med 2015, https://doi.org/10.1016/S2213-2600(15)00043-0 ; Kapur VK et al., J Clin Sleep Med 2017, https://doi.org/10.5664/jcsm.6506 ; Antonaglia C et al., Sleep Breath 2022, https://doi.org/10.1007/s11325-021-02412-1
- Coach rule: never say "you're lean, so apnea is unlikely". Lean lowers risk; it does not remove it, and prediabetes/dyslipidemia are OSA-associated.
- Confidence: high (prevalence); [UNVERIFIED] lean-specific prevalence for men 45-50 (not found in opened sources).
- Caveats: prevalence depends heavily on hypopnea scoring rules.

### 6.2 Questionnaires and their limits in lean men
- Finding: (a) STOP-Bang >=3: sensitivity 93% for moderate-severe and 100% for severe OSA, NPV 90%/100% (validation cohorts as summarized by the authors; population mix [UNVERIFIED], likely high pretest probability). (b) For this user, B (BMI >35), A (age >50) and N (neck >40 cm) score 0; "G" (male) = 1, so his score depends entirely on Snoring, Tiredness, Observed apneas, Pressure (hypertension) [derived]. (c) NoSAS (>=8 of 17: neck >40 cm = 4, BMI categories 3-5 points, snoring 2, age >55 = 4, male 2; exact BMI category cut-offs [UNVERIFIED]) cannot reach 8 for a 47-y man with neck <=40 cm and normal BMI even with snoring (2+2=4), nor with an overweight-category BMI (4+3=7) [derived arithmetic]. (d) In people with BMI <35, modified cut-offs (age >=40, BMI >=23, neck >=35 cm) raised STOP-Bang sensitivity (score 3: 95.9% for AHI >=15) (Thai sample). (e) AASM: clinical tools, questionnaires and prediction algorithms should not be used to diagnose OSA without PSG/HSAT (STRONG); PSG or technically adequate HSAT for uncomplicated adults with increased risk of moderate-severe OSA = excessive daytime sleepiness plus >=2 of: habitual loud snoring; witnessed apnea or gasping/choking; diagnosed hypertension. (f) USPSTF 2022: insufficient evidence to screen asymptomatic adults (I statement) [secondary: search-result text].
- Evidence type: diagnostic accuracy studies, guideline, USPSTF statement.
- Sources: Chung F et al., Chest 2016, https://doi.org/10.1378/chest.15-0903 ; Marti-Soler H et al., Lancet Respir Med 2016, https://doi.org/10.1016/S2213-2600(16)30075-3 ; Sinsopa N et al., PeerJ 2025, https://doi.org/10.7717/peerj.20310 ; Kapur 2017 (above) ; USPSTF, https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/obstructive-sleep-apnea-in-adults-screening
- Coach rule: symptom-driven referral, not score-driven. Ask once at onboarding and every ~3 months: partner-reported loud/habitual snoring, witnessed pauses/gasping, unrefreshing sleep, daytime sleepiness (Epworth), morning headaches, nocturia >=2/night, BP status.
- Confidence: high.
- Caveats: Epworth Sleepiness Scale is validated for sleepiness (Johns 1991, https://doi.org/10.1093/sleep/14.6.540); the common >10 cut-off is not stated in the abstract I opened [UNVERIFIED cut-off].

### 6.3 What wearable signals can and cannot say about OSA
- Finding: (a) Apple Watch "Breathing Disturbances" uses the accelerometer; every 30 days it analyzes data and notifies consistent signs of moderate-severe OSA; FDA 510(k) clearance Sept 2024 for adults 18+ without prior diagnosis [secondary: clearance details from news text in search results; Apple's page, opened, only anticipated authorization]; Apple states every participant flagged by the algorithm had at least mild sleep apnea (sensitivity/specificity [UNVERIFIED]). (b) Samsung Galaxy Watch OSA feature: FDA De Novo Feb 2024, adults 22+, requires 2 nights >4 h within 10 days; FDA study sensitivity 82.7% and specificity 87.7% for moderate-severe OSA [secondary: numbers from search-result text]; independent 2026 study (152 adults with known/suspected OSA): AUROC 0.94; default threshold sensitivity 94.1%, specificity 66.7%. (c) Google/Fitbit: Health Guardian "Sleep Breathing Quality Trends" (Aug 2026, Pixel Watch and Fitbit Air) is "not a prescreener for sleep apnea", general wellness only; EOV was discontinued in May 2026. (d) Fitbit breathing rate is a nightly average from RSA, not an event count. (e) Smartwatch SpO2 has limited accuracy (3.10).
- Evidence type: regulatory announcements, validation study, manufacturer docs.
- Sources: Apple newsroom 2024-09, https://www.apple.com/newsroom/2024/09/apple-introduces-groundbreaking-health-features/ ; AASM news, https://aasm.org/apple-watch-series-10-features-sleep-apnea-notifications/ and https://aasm.org/samsung-galaxy-watch-sleep-apnea-feature-receives-fda-authorization/ ; Alavi A et al., J Clin Sleep Med 2026, https://doi.org/10.1007/s44470-026-00159-8 ; Google blog 2026-08-12, https://blog.google/products-and-platforms/products/google-health/pixel-watch-health-guardian/
- Coach rule: Fitbit Air data cannot rule OSA in or out. Signals that should raise the question (not answer it): persistently elevated nocturnal RHR or suppressed HRV without explanation, frequent long wake bouts with gasping reports, habitual long naps, high ESS. Recommend HSAT/PSG through a physician when symptoms exist.
- Confidence: high.

### 6.4 Referral wording (for the app)
- English: "Your watch can't diagnose sleep apnea, and it can't rule it out either. Together with what you told me (loud snoring, feeling tired during the day), it's worth checking. Please mention it to your family doctor and ask whether a home sleep apnea test or a sleep-lab study makes sense. It's a simple test, and treating apnea when present can help sleep, blood pressure and glucose."
- Hebrew draft for UI: "השעון לא יכול לאבחן דום נשימה בשינה, וגם לא לשלול אותו. יחד עם מה שסיפרת (נחירות חזקות, עייפות במהלך היום), שווה לבדוק. כדאי להזכיר את זה לרופא/ת המשפחה ולשאול אם מתאימה בדיקת שינה ביתית או בדיקה במעבדת שינה. זו בדיקה פשוטה, ואם יש דום נשימה, הטיפול בו יכול לשפר שינה, לחץ דם וסוכר."
- Urgent variant (drowsy driving or near-miss): "Please don't drive when drowsy, and contact your doctor soon about this." [derived; no source-specific wording]
- Note: the claim that OSA treatment helps glucose is not researched in this track [UNVERIFIED]; soften to "can help sleep and daytime energy" if the B-track on metabolism does not confirm it.

### 6.5 Insomnia disorder and when CBT-I / a physician is warranted
- Finding: (a) Chronic insomnia (ICSD-3): difficulty initiating or maintaining sleep or early waking, with daytime consequences, >=3 times/week for >=3 months despite adequate opportunity [secondary: criteria summarized in search results]. (b) AASM 2021: multicomponent CBT-I (STRONG); brief therapies, stimulus control, sleep restriction, relaxation (each CONDITIONAL); sleep hygiene alone not recommended (CONDITIONAL). (c) ESRS 2023: CBT-I first line for all ages, in person or digital (A); PSG if other sleep disorders (PLMD, SDB) or treatment-resistant insomnia suspected (A); hypnotics short-term (<=4 weeks); fast-release melatonin, antihistamines, antipsychotics, phytotherapeutics not recommended (A); prolonged-release melatonin up to 3 months only if >=55 y (B); light therapy and exercise as adjuncts (B). (d) ACP 2016: CBT-I as initial treatment [secondary: search-result text]. (e) ISI >=10 was the entry threshold for "significant insomnia symptoms" in the Spina 2023 RCT.
- Sources: Edinger JD et al., J Clin Sleep Med 2021, https://doi.org/10.5664/jcsm.8986 ; Riemann D et al., J Sleep Res 2023, https://doi.org/10.1111/jsr.14035 ; Qaseem A et al., Ann Intern Med 2016, https://www.acpjournals.org/doi/10.7326/M15-2175 ; Spina 2023 (5.4).
- Coach rule: if he reports difficulty sleeping >=3 nights/week for >=3 months with daytime impact, or ISI >=10: recommend CBT-I (digital or clinician) and a physician visit; the app may support stimulus control and a fixed rise time but must not run sleep restriction therapy unsupervised [derived]. Do not suggest melatonin for insomnia at age 47.
- Confidence: high.

### 6.6 Nocturia and prostate-related awakenings
- Finding: (a) ICS 2019: nocturia = number of voids during the main sleep period, each followed by sleep [secondary]. (b) Community prevalence: ages 20-40: >=1 void 11-35.2%, >=2 voids 2-16.6%; ages >=70: 68.9-93% and 29-59.3% (40-49 y figures not extracted). (c) OSA associated with nocturia RR 1.41 (1.26-1.59); in men RR 1.49 (1.09-2.03); severe OSA higher risk. (d) Nocturia associated with mortality (pooled RR 1.78, 1.50-2.10) and poor sleep quality (OR 3.05).
- Evidence type: SR, SR-MA.
- Sources: Hashim H et al., Neurourol Urodyn 2019, https://doi.org/10.1002/nau.23917 ; Bosch JL, Weiss JP, J Urol 2010/2013, https://doi.org/10.1016/j.juro.2010.04.011 ; Zhou J et al., Sleep Breath 2020, https://doi.org/10.1007/s11325-019-01981-6 ; Lavadia AC et al., World J Mens Health 2026, https://doi.org/10.5534/wjmh.240237
- Coach rule: add a 2-tap morning log "times up to urinate". >=2 voids on most nights for 2+ weeks -> physician check (prostate/LUTS, OSA, glucose control, evening fluids/alcohol/caffeine, medications) [derived]. Wake bouts on Fitbit cannot identify the cause.
- Confidence: medium.
- Caveats: mortality link is associative (nocturia is a marker of comorbidity).

### 6.7 Restless legs (RLS), iron, and periodic limb movements (PLMS)
- Finding: (a) AASM 2025 guideline: iron supplementation (oral or IV) in adults with RLS when ferritin <=75 ng/mL or transferrin saturation <20%; strong recommendations for gabapentin enacarbil, gabapentin, pregabalin and IV ferric carboxymaltose; conditional recommendation against standard use of dopamine agonists and levodopa (augmentation). First step: address exacerbating factors (alcohol, caffeine, some antidepressants and antihistamines, untreated OSA) [exacerbators secondary: society news text]. (b) HypnoLaus: PLMS index >15/h in 28.6% (31.3% of men; mean age 58); predictors age, male sex, RLS, antidepressants, BTBD9/TOX3/MEIS1 variants; ferritin similar between groups. PLMS >15/h associated with lower N3 (17.6 vs 20.6%) and REM (20.3 vs 22.4%) and longer subjective latency, but NOT with sleepiness or cardiovascular risk factors after adjustment.
- Evidence type: guideline (GRADE); population cohort.
- Sources: Winkelman JW et al., J Clin Sleep Med 2025, https://doi.org/10.5664/jcsm.11390 ; Haba-Rubio J et al., Ann Neurol 2016, https://doi.org/10.1002/ana.24593 ; Haba-Rubio J et al., Sleep Med 2018, https://doi.org/10.1016/j.sleep.2017.09.014
- Coach rule: when blood tests are uploaded, extract ferritin and TSAT. If he reports an evening urge to move the legs relieved by movement AND ferritin <=75 ng/mL or TSAT <20% -> "discuss iron and RLS with your physician". No self-supplementation advice [derived]. Do not attribute his fragmentation to PLMS without PSG (PLMS are common and often silent).
- Confidence: high (thresholds), medium (coach logic).
- Caveats: ferritin rises with inflammation; RLS prevalence for his age not verified here.

### 6.8 Other red flags that end in "see a physician" [derived list; each item grounded above]
- Excessive sleepiness with loud habitual snoring, witnessed apneas or gasping (6.2).
- Drowsy driving or near-misses (safety).
- Insomnia meeting chronic criteria or ISI >=10 (6.5).
- Nocturia >=2/night most nights (6.6).
- RLS symptoms, especially with low ferritin/TSAT (6.7).
- Unexplained RHR >= +10 bpm for a week, or AFib alerts from Fitbit Air (3.7, 4.8).
- Habitual naps >=60 min with fatigue (7.1).

---

## 7. Napping, chronotype, travel and clock changes (coaching-relevant only)

### 7.1 Naps
- Finding: Umbrella review: naps >=30 min associated with higher all-cause mortality, CVD and metabolic risk; <30 min no significant risk. Nap duration vs T2D is J-shaped, risk rising beyond ~40 min/day; >=60 min OR 1.46 for T2D. Long naps (>=60 min) CVD RR 1.82, all-cause mortality RR 1.27. Short naps improve cognition (ES 0.18) and alertness (ES 0.29). Fitbit counts sessions >=20 min; Google notes a 1 h nap reduces later sleep pressure.
- Evidence type: umbrella review, SR-MA.
- Sources: Yang YB et al., Sleep Med Rev 2024, https://doi.org/10.1016/j.smrv.2024.101989 ; Yamada T et al., Sci Rep 2016, https://doi.org/10.1038/srep38075 ; Yamada T et al., Sleep 2015, https://doi.org/10.5665/sleep.5246 ; Dutheil F et al., Int J Environ Res Public Health 2021, https://doi.org/10.3390/ijerph181910212 ; Google white paper (3.6).
- Coach rule: if napping, <=20-30 min, and not late in the afternoon (exact cut-off time [UNVERIFIED]); frequent naps >=60 min are a question about night sleep quality or OSA, not a recommendation.
- Confidence: medium. Caveats: reverse causation (illness causes long naps).

### 7.2 Chronotype
- Finding: "Definite evening" chronotype: 79% higher prevalence of poor LE8 (<50); CVD HR 1.16 (1.10-1.22) vs intermediate; LE8 explained 75% of the association. Chronotype depends on genetics, age, sex and environment (light).
- Population: 322,777 UKB, 39-74 y, 13.8 y follow-up.
- Evidence type: prospective cohort (+ seminal review statement).
- Sources: Kianersi S et al., J Am Heart Assoc 2026, https://doi.org/10.1161/JAHA.125.044189 ; Roenneberg 2012 (1.10).
- Coach rule: do not force a morning schedule; for an evening type, lock regularity and the LE8 factors (diet, activity, lipids, glucose) rather than bedtime alone.
- Confidence: medium.

### 7.3 Long-haul travel and jet lag
- Finding: Melatonin taken close to target bedtime at destination (22:00-24:00) reduces jet lag when crossing >=5 time zones; 0.5-5 mg similarly effective; NNT 2; no added benefit above 5 mg; occasional short-term use appears safe.
- Evidence type: Cochrane SR (seminal, older, 2002).
- Source: Herxheimer A et al., Cochrane Database Syst Rev 2002, https://doi.org/10.1002/14651858.CD001520
- Coach rule: Israel -> Europe (1-2 zones) rarely needs intervention; Israel -> Americas or East Asia (>=5 zones) may justify melatonin, cleared with his physician (drug interactions not reviewed here). Exclude travel days and 3-5 days after >=3-zone trips from all baselines [derived].
- Confidence: medium. Caveats: old review; light-timing advice not verified here.

### 7.4 Clock changes (DST)
- Finding: AASM: the acute transition to daylight saving time carries public health and safety risks (cardiovascular events, mood disorders, motor vehicle crashes).
- Source: Rishi MA et al., J Clin Sleep Med 2020, https://doi.org/10.5664/jcsm.8780
- Coach rule: Israel switches back to standard time in late October 2026 (exact date [UNVERIFIED]); keep wake time anchored by the clock, expect ~1 week of shifted metrics, exclude that week from baselines [derived].
- Confidence: medium.

### 7.5 AI coaching context (relevant to the Gemini chat)
- Finding: A fine-tuned Gemini model (PH-LLM) scored 79% vs 76% for human experts on sleep-medicine multiple-choice exams and improved over base Gemini for personalized sleep insights across 857 case studies.
- Source: Khasentino J et al., Nat Med 2025, https://doi.org/10.1038/s41591-025-03888-0
- Coach rule: an LLM can produce expert-sounding sleep advice; guard it with the rules in sections 8-9 (no stage verdicts, no diagnosis, referral triggers).
- Confidence: medium.

---

## 8. Things NOT to say (overclaims and myths)

1. "You got too little deep/REM sleep last night" or any single-night stage verdict. Individual-night error is about +/-1 h (Schyvens 2025).
2. "Your deep sleep is below normal for your age." Norms are wide, Fitbit "Deep" is not AASM N3, and norm feedback can create worry (Hertenstein 2018; Google 2026).
3. "Everyone needs 8 hours" or "under 7 h tonight is dangerous." Targets are weekly and population-based; measured 6.5-7 h is near target (1.1, 1.9).
4. "Your HRV of 30 ms is bad for a 47-year-old." Population HRV spread is huge; only his trend matters (4.2).
5. "Low HRV means you are overtrained" on one night. Alcohol, late hard training, short sleep and illness all lower HRV; single-night changes <~15% are noise (4.3-4.7).
6. "HRV-guided training will raise your VO2max." Meta-analysis: small, non-significant fitness gains; benefit mainly on HRV itself and fewer negative responders (4.9).
7. "Your oxygen and breathing look normal, so you don't have sleep apnea." Fitbit SpO2/breathing rate cannot rule OSA out; Google says its breathing feature is not a prescreener (6.3).
8. "You're lean, so apnea is unlikely." ~10% of men 30-49 have moderate-severe OSA; questionnaires under-score lean men (6.1-6.2).
9. "Your tracker shows you have insomnia / PLMD / RLS / apnea." Consumer devices cannot diagnose (AASM 2018; ESRS 2023).
10. "Sleep in on the weekend to pay back the debt." Recovery sleep does not restore insulin sensitivity and adds social jetlag (1.10, 1.12).
11. "Evening exercise ruins sleep." Only high-strain sessions ending <4 h before bed showed effects (4.5).
12. "Take melatonin for better sleep." Fast-release melatonin not recommended for insomnia; PR melatonin only >=55 y (ESRS 2023); melatonin evidence is for jet lag (7.3).
13. "Alcohol helps you sleep." Next-night HRV falls and HR rises dose-dependently even at low doses (4.4).
14. "Your sleep score is 85, so you slept well." Proprietary scores are unvalidated composites (3.12).
15. "Fitbit Air is clinically validated." No device-specific peer-reviewed validation found; Google labels it not for medical use (3.7).
16. "Naps are unhealthy" or "long naps are good recovery." Short naps help alertness; habitual long naps are a risk marker (7.1).
17. "Your RHR of 52 is abnormal (below 60)." Trained lean men often sit below generic 60-100 ranges; judge against his own baseline (4.8) [derived].
18. Any statin-sleep claim ("your statin is ruining your sleep"): not researched in this track [UNVERIFIED].

---

## 9. Conflicting evidence

1. Regularity vs duration. Windred 2024: regularity beats duration for all-cause mortality, but for cardiometabolic mortality SRI lost significance after adding duration. AHA LE8 keeps duration only (validated measurement). Resolution for the app: track both; lead with regularity for this prediabetic user.
2. Weekend catch-up. Depner 2019 (RCT): does not prevent metabolic dysregulation. Akerstedt 2019 (cohort): short weekday + long weekend sleep not associated with excess mortality in <65 y. Different outcomes and designs; for glucose risk, trust the RCT.
3. Wearable feedback. Gavriloff 2018: negative feedback worsens daytime symptoms. Spina 2023: guided wearable feedback improves insomnia severity. Difference = interpretation support and framing.
4. Direction of stage bias. Schyvens 2025: Fitbit deep/REM mean bias near zero; Robbins 2024: Fitbit underestimates deep; Searles 2026: devices overestimate deep in older adults; Google 2026: deep compressed toward the mean. Conclusion: bias depends on population and algorithm version; only within-person trends are defensible.
5. What "deep sleep" is. Google re-scored N3 using slow-wave power (10.3% -> 17.3%); AASM amplitude-based scoring gives lower N3. Literature norms and Fitbit values are not interchangeable.
6. Age effect on N3/REM. Ohayon 2004 and Mitterling 2015 show declines; Boulos 2019 found no significant age change in N3 % and REM % in screened healthy adults [secondary]. Screening quality modifies effect sizes (Ohayon).
7. Social jetlag. Associated with BMI, waist and HbA1c (Bouman 2023; Arab 2024) and MetS at >=2 h (Lin 2024), yet not with diagnosed MetS or T2D in Bouman 2023.
8. Bedtime timing in men. AHA 2025: before midnight is better; Nikbakhtian 2021: in men only onset before 22:00 was significantly associated with higher CVD risk.
9. OSA screening by wearables. Samsung feature shows high AUROC (0.94) in a suspected-OSA sample; Google explicitly says its breathing feature is not a prescreener; USPSTF finds insufficient evidence to screen asymptomatic adults.
10. STOP-Bang. Excellent sensitivity in sleep-clinic populations (Chung 2016) vs structural under-scoring in lean, younger men (modified cut-offs proposed, Sinsopa 2025).
11. Napping. Short naps improve alertness (Dutheil 2021) while habitual long naps predict T2D/CVD (Yamada; Yang 2024); likely reverse causation.
12. HRV-guided training. Improves vagal HRV (SMD 0.50) but not fitness significantly (Manresa-Rocamora 2021); Vesterinen 2016 showed similar or better performance with fewer hard sessions.
13. Self-report vs measured sleep. Epidemiological duration cut-offs mostly from self-report, which over-reports by 0.4-1.2 h vs actigraphy (Lauderdale 2008); applying 7 h to wearable TST is stricter than the evidence base.

---

## 10. What remains uncertain (for the build team)
- Fitbit Air: no independent validation of sleep staging, HRV, RHR, SpO2 or temperature. The 2026 Google algorithm paper is not peer reviewed and does not name the Air.
- Normative PSG values specifically for men 45-55 (age x sex tables of Boulos 2019 and Mitterling 2015 not accessible); section 2.12 middle-age values are interpolations.
- Late-meal effects on nocturnal HRV/RHR: no peer-reviewed quantification found.
- Validated HRV decision thresholds for middle-aged recreational (non-endurance) athletes; all thresholds in 4.11 are proposals.
- Statin and prediabetes effects on HRV/RHR and sleep: outside this track.
- Lean-specific OSA prevalence for men 45-50; Epworth cut-off text; Israeli DST date; RLS prevalence at his age.
- Whether improving regularity (an intervention) lowers glucose or CV risk: only observational evidence.

---

## 11. Source index (all opened via publisher, Europe PMC, NCBI E-utilities, or appearing in search results as flagged)
Duration, timing, regularity: Watson 2015 (AASM PDF; doi 10.5665/sleep.4716); Hirshkowitz 2015 (10.1016/j.sleh.2014.12.010); Dzierzewski 2026 duration review (10.1016/j.sleh.2026.05.011); NSF page (thensf.org, updated 2026-06-10); Lloyd-Jones 2022 (10.1161/CIR.0000000000001078); St-Onge 2025 (10.1161/HCQ.0000000000000139); Windred 2024 (10.1093/sleep/zsad253); Chaput 2025 JECH (10.1136/jech-2024-222795); Chaput 2024 Diabetes Care (10.2337/dc24-1208); Kianersi 2024 (10.2337/dc24-0213); Zheng 2024 (10.1038/s41591-024-03155-8); Lauderdale 2008 (10.1097/EDE.0b013e318187a7b0); Roenneberg 2012 (10.1016/j.cub.2012.03.038); Bouman 2023 (10.1111/jsr.13770); Arab 2024 (10.1111/obr.13664); Lin 2024 (10.1097/jnr.0000000000000628); Nikbakhtian 2021 (10.1093/ehjdh/ztab088); Depner 2019 (10.1016/j.cub.2019.01.069); Akerstedt 2019 (10.1111/jsr.12712); Fischer 2021 (10.1093/sleep/zsab103); Lunsford-Avery 2018 (10.1038/s41598-018-32402-5); CDC sleep page.
Norms: Ohayon 2004 (10.1093/sleep/27.7.1255); Boulos 2019 (10.1016/S2213-2600(19)30057-8); Mitterling 2015 (10.5665/sleep.4730); Hertenstein 2018 (10.5664/jcsm.7036); Redline 2004 (10.1001/archinte.164.4.406); Kocevska 2021 (10.1038/s41562-020-00965-x); Jonasdottir 2021 (Sleep 44(2):zsaa169); Alikhani 2025 (Sleep 48 Suppl 1:A146).
Wearables: de Zambotti 2024 (10.1093/sleep/zsad325); Chee 2025 WSS (10.1016/j.sleep.2025.106506); Dzierzewski 2026 CST (10.1016/j.sleh.2026.02.003); Khosla 2018 (10.5664/jcsm.7128); Lee YJ 2025 (10.5664/jcsm.11460); Schyvens 2025 (10.1093/sleepadvances/zpaf021); Lee T 2023 (10.2196/50983); Chinoy 2021 (10.1093/sleep/zsaa291); Haghayegh 2019 (10.2196/16273); Robbins 2024 (10.3390/s24206532); Searles 2026 (10.1093/sleepadvances/zpag006); Willoughby 2024 (10.1016/j.sleh.2024.02.007); Birrer 2024 (10.1038/s41746-024-01016-9); Charton 2026 Google white paper; Google blog Fitbit Air 2026-05-07; Google Health Help pages; Dial 2025 (10.14814/phy2.70527); Nasr 2025 (10.1177/20552076251394960); Natarajan 2020 LDH (10.1016/S2589-7500(20)30246-6) and preprint (10.1101/772285); Natarajan 2021 (10.1038/s41746-021-00493-6); Natarajan 2020 npj (10.1038/s41746-020-00363-7); Jiang 2023 (10.1371/journal.pdig.0000296); Rajakariar 2024 (10.1016/j.mcpdig.2024.02.001); Maijala 2019 (10.1186/s12905-019-0844-9); Quer 2020 (10.1371/journal.pone.0227709).
HRV: Altini & Plews 2021 (10.3390/s21237932); Pietila 2018 (10.2196/mental.9519); Leota 2025 (10.1038/s41467-025-58271-x); Myllymaki 2012 (10.1007/s00421-011-2034-9); Al Haddad 2009 (10.1123/ijspp.4.4.435); Zhang 2025 (10.3389/fneur.2025.1556784); Plews 2012 (10.1007/s00421-012-2354-4); Plews 2013 (10.1007/s40279-013-0071-8); Vesterinen 2016 (10.1249/MSS.0000000000000910); Manresa-Rocamora 2021 (10.3390/ijerph181910299); Cahill 2013 (10.1161/CIRCULATIONAHA.113.001474).
Orthosomnia: Baron 2017 (10.5664/jcsm.6472); Jahrami 2024 (10.3390/brainsci14111123); Guldbrandsen 2025 (10.3389/frsle.2025.1640355); Gavriloff 2018 (10.1111/jsr.12726); Spina 2023 (10.1093/sleep/zsad167).
Disorders: Benjafield 2019 (10.1016/S2213-2600(19)30198-5); Peppard 2013 (10.1093/aje/kws342); Heinzer 2015 (10.1016/S2213-2600(15)00043-0); Kapur 2017 (10.5664/jcsm.6506); Chung 2016 (10.1378/chest.15-0903); Marti-Soler 2016 (10.1016/S2213-2600(16)30075-3); Sinsopa 2025 (10.7717/peerj.20310); Antonaglia 2022 (10.1007/s11325-021-02412-1); Johns 1991 (10.1093/sleep/14.6.540); USPSTF 2022 (uspreventiveservicestaskforce.org); Alavi 2026 (10.1007/s44470-026-00159-8); Apple newsroom 2024; AASM news pages (Apple, Samsung); Google Health Guardian blog 2026-08-12; Edinger 2021 (10.5664/jcsm.8986); Riemann 2023 (10.1111/jsr.14035); Qaseem 2016 (acpjournals 10.7326/M15-2175); Hashim 2019 (10.1002/nau.23917); Bosch & Weiss 2010 (10.1016/j.juro.2010.04.011); Zhou 2020 (10.1007/s11325-019-01981-6); Lavadia 2026 (10.5534/wjmh.240237); Winkelman 2025 (10.5664/jcsm.11390); Haba-Rubio 2016 (10.1002/ana.24593); Haba-Rubio 2018 (10.1016/j.sleep.2017.09.014).
Naps, chronotype, travel, AI: Yang 2024 (10.1016/j.smrv.2024.101989); Yamada 2016 (10.1038/srep38075); Yamada 2015 (10.5665/sleep.5246); Dutheil 2021 (10.3390/ijerph181910212); Kianersi 2026 (10.1161/JAHA.125.044189); Herxheimer 2002 (10.1002/14651858.CD001520); Rishi 2020 (10.5664/jcsm.8780); Khasentino 2025 (10.1038/s41591-025-03888-0).
