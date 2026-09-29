# B3 - Lifestyle levers for sleep in mid-life men (v1)

Date: 2026-09-29. Track B3. Target user: man, 47 y, 68 kg, lean, trains 4x/week (resistance + aerobic), dyslipidemia on a statin, prediabetes, Israel (Asia/Jerusalem), Fitbit Air data via Google Health. App data: meal photos with timestamps, workout log (start, duration, RPE), wearable sleep/HRV/RHR, quick logs of coffee and alcohol.

## Legend (read first)

- **[A]** = record opened with WebFetch (PubMed E-utilities abstract, Europe PMC abstract, publisher or agency page).
- **[S]** = number or statement taken from search-result text that matched the named source; full record not opened.
- **[U]** = UNVERIFIED or a heuristic proposed in this file. Use only as a default to personalize, never as evidence.
- Applicability tags: **YA** young adults, **MA** includes middle-aged adults, **OA** older adults, **W** mostly women, **M** men only, **ATH** trained athletes, **OW** overweight/obese, **CLIN** clinical population, **LAB** laboratory protocol, **RW** real-world wearable data.
- Entry format: Outcome | Effect | Rule thresholds | Population | Evidence type | Source | Confidence | Caveats | App measurement.
- Units: metric, 24 h clock. "Sleep onset" = wearable sleep start. "Bed" = habitual bedtime unless stated.

---

## 0. Bottom line for the coach logic

1. Biggest, most measurable levers for this profile, **if the exposure shows up in his logs**: (a) evening alcohol (dose-dependent RHR up, HRV down, REM down, apnea index up); (b) hard training ending less than 4 h before sleep onset; (c) caffeine dose and timing (dose-scaled cutoff); (d) irregular sleep-wake timing or less than 7 h sleep opportunity; (e) dinner less than 3 h before bed (also raises nocturnal glucose, relevant to prediabetes).
2. Second tier: light (morning outdoor light, evening dimming), bedroom heat (Israel), training-load management, diet quality (fibre up; sugar, saturated fat, ultra-processed food down), warm shower 1-2 h before bed.
3. Weak or unproven for this user: screens and blue-light glasses in adults, yoga nidra / NSDR, slow breathing as a sleep aid, casein before bed for sleep, time-restricted eating for sleep, carbohydrates at night to fall asleep.
4. The statin is not a good default explanation for poor sleep: blinded RCT data do not support a causal link with sleep disturbance (CTT 2026, section 7).
5. Personalize every rule with ABAB N-of-1 blocks of 7 nights after a 14-night baseline, one lever at a time, primary outcome fixed in advance, judged against his own night-to-night SD (section 6). Do not run an experiment across the Israel clock change on Sunday 2026-10-25 (02:00 to 01:00, IANA tz database, checked locally with zdump).

---

## 1. Exercise

### E1. Regular physical activity (any modality)
- **Outcome:** global sleep outcomes (quality, efficiency, duration, onset latency, deep sleep).
- **Effect:** umbrella review for the 2018 US Physical Activity Guidelines, updated: "strong evidence" that acute bouts and regular physical activity improve sleep outcomes; moderate evidence for adults with insomnia symptoms and for OSA; moderate evidence that longer bouts help.
- **Rule thresholds:** keep current 4x/week; no evidence that more volume is needed for sleep in an already active man.
- **Population:** all adult ages, general and clinical.
- **Evidence type:** umbrella review of systematic reviews.
- **Source:** Kline CE et al. Sleep Med Rev 2021;58:101489. https://pubmed.ncbi.nlm.nih.gov/33934046/ [A]
- **Confidence:** high (direction); low (extra benefit for an already trained man).
- **Caveats:** most trials recruited inactive people or poor sleepers; ceiling effect likely.
- **App measurement:** weekly minutes and session load = RPE (0-10) x minutes (session-RPE method, validated against HR-based load: Foster C et al. J Strength Cond Res 2001;15(1):109-15, https://pubmed.ncbi.nlm.nih.gov/11708692/ [A]); correlate 7-day load with 7-day sleep averages.

### E2. Modality and weekly dose (network meta-analysis)
- **Outcome:** subjective sleep quality (mostly PSQI).
- **Effect:** vs control, SMD: aerobic -1.21 (95% CI -1.50 to -0.91), resistance -1.12 (-1.80 to -0.44), combined -1.11, yoga -0.82, Pilates -1.65, traditional Chinese exercise -0.94. Non-linear dose-response; overall optimum about 920 MET-min/week (390 to 1,100 by modality).
- **Rule thresholds:** 920 MET-min/week is about 230 min/week at 4 METs (calculation). He likely already exceeds this.
- **Population:** 86 RCTs, 7,276 participants, mixed ages, many poor sleepers or clinical.
- **Evidence type:** network meta-analysis with dose-response.
- **Source:** Wang H, Xin X, Pan Y. BMC Public Health 2025;25:1371. https://pubmed.ncbi.nlm.nih.gov/40217183/ [A]
- **Confidence:** low-medium.
- **Caveats:** SMDs above 1 are implausibly large for good sleepers; heterogeneous small trials; subjective outcome.
- **App measurement:** estimate MET-min from workout type x duration (MET table needed [U]); check if sleep changes across weeks of very low or very high volume.

### E3. Resistance training specifically
- **Outcome:** sleep quality, duration, efficiency.
- **Effect:** systematic review of 13 RCTs: chronic resistance training "improves all aspects of sleep, with the greatest benefit for sleep quality"; adding aerobic work attenuated the resistance-only benefit (Kovacevic 2018). 12-month RCT (conference data): 406 inactive adults 35-70 y (53% women) with overweight/obesity and elevated BP; sleep duration +13 min with resistance vs -0.6 min aerobic, +2 combined, +4 control; among those sleeping less than 7 h at baseline, +40 min vs +23, +17, +15; sleep efficiency +9.0% resistance vs +0.9% control and +8.0% combined (Brellenthin, AHA EPI|Lifestyle 2022).
- **Rule thresholds:** keep at least his current resistance sessions; no timing penalty for resistance beyond the general intensity buffer (E6).
- **Population:** MA, OW, inactive (trial); mixed (review).
- **Evidence type:** SR of RCTs; conference abstract of RCT.
- **Sources:** Kovacevic A et al. Sleep Med Rev 2018;39:52-68. https://pubmed.ncbi.nlm.nih.gov/28919335/ [A]. AHA news on Brellenthin trial, 2022: https://www.heart.org/en/news/2022/03/03/resistance-exercise-may-improve-sleep-more-than-aerobic-exercise [S]
- **Confidence:** medium (direction); low (magnitude; conference data, inactive OW population).
- **Caveats:** he already lifts; the gain from starting RT does not apply; benefit from adding more is unknown.
- **App measurement:** tag sessions RT vs aerobic vs mixed; compare following-night metrics by type.

### E4. Evening exercise in general (acute)
- **Outcome:** REM latency, slow-wave sleep (SWS), SOL, TST, SE.
- **Effect:** 23 studies (275 healthy adults per search summary [S]): evening exercise increased REM latency +7.7 min and SWS +1.3 percentage points, reduced N1; overall no negative effect; "sleep-onset latency, total sleep time, and SE might be impaired after vigorous exercise ending ≤1 h before bedtime" (heart rate still about 20 bpm above rest per search summary [S]).
- **Rule thresholds:** moderate sessions may end 1-2 h before bed; vigorous sessions must not end within 1 h of bed.
- **Population:** healthy adults, single sessions, LAB.
- **Evidence type:** SR and meta-analysis.
- **Source:** Stutz J, Eiholzer R, Spengler CM. Sports Med 2019;49(2):269-287. https://pubmed.ncbi.nlm.nih.gov/30374942/ [A] (seminal, 2019)
- **Confidence:** medium-high.
- **Caveats:** small studies, mostly moderate intensity, mostly young fit participants.
- **App measurement:** workout end = start + duration; hours from workout end to sleep onset; RPE band.

### E5. Evening high-intensity exercise (acute and regular)
- **Outcome:** REM, SOL, TST, WASO.
- **Effect:** 15 acute studies, 194 participants (18-50 y, good sleepers): high-intensity exercise ending 0.5-4 h before bed decreased REM by 2.34% (p = 0.002); no other significant change; regular evening HIE did not disrupt sleep; "acute evening HIE performed 2-4 h before bedtime does not disrupt nighttime sleep of healthy, young and middle-aged adults."
- **Rule thresholds:** a 2-4 h buffer is acceptable for most sleep metrics; REM cost is small.
- **Population:** YA and MA good sleepers, LAB.
- **Evidence type:** SR and meta-analysis.
- **Source:** Frimpong E et al. Sleep Med Rev 2021;60:101535. https://pubmed.ncbi.nlm.nih.gov/34416428/ [A]
- **Confidence:** medium.
- **Caveats:** small n; PSG in lab; the large wearable study (E6) detects effects that small trials could miss.
- **App measurement:** as E4, plus REM minutes (low accuracy on wearables, see 6.6).

### E6. Dose-response of exercise strain x timing (large real-world wearable study) - the key rule
- **Outcome:** sleep onset time, sleep duration, sleep quality, nocturnal RHR, nocturnal HRV.
- **Effect:** 14,689 physically active WHOOP users, 4,084,354 person-nights (mean age 37.9 y, 73.8% male). Later timing and higher strain were associated with later sleep onset, shorter sleep, lower quality, higher RHR and lower HRV. Maximal vs light strain ending 2 h before sleep onset: sleep onset +36.0 min, duration -22.2 min (-5.4%), quality -0.87 percentage points, RHR +3.9 bpm (+6.8%), HRV -8.3 units (-14.1%). Bouts ending 2 h after habitual onset: onset +80 min, duration -42.6 min, RHR +9.4 bpm, HRV -14.6. "Exercise bouts ending ≥4 hours before sleep onset are not associated with changes in sleep"; at ≥6 h HRV only minimally reduced. Authors: stop exercising "four or more hours before" habitual or actual sleep onset.
- **Rule thresholds:** RPE ≥7/10 (vigorous) or interval/near-failure sessions should END ≥4 h before habitual sleep onset. If unavoidable, lower the intensity (RPE ≤5) rather than skip. Mapping of WHOOP strain to RPE is a heuristic [U].
- **Population:** RW, active adults, mostly men, mean age about 38 (closest large data to this user).
- **Evidence type:** observational within-person cohort.
- **Source:** Leota J et al. Nat Commun 2025, doi 10.1038/s41467-025-58271-x. https://pmc.ncbi.nlm.nih.gov/articles/PMC12000559/ [A]
- **Confidence:** medium-high.
- **Caveats:** observational (people who train late may differ in light, meals, stress); strain is HR-zone based and "may underestimate the relative metabolic strain of strength training"; no light data.
- **App measurement:** late_hard_flag = (RPE ≥7) AND (workout_end > habitual_sleep_onset - 4 h). Expected signature on flagged nights: RHR up about 2-4 bpm and HRV down; the coach should label these nights "explained", not "bad sleep".

### E7. Time of day for resistance vs aerobic sessions (small lab trials)
- **Outcome:** awakenings, WASO, SOL, deep sleep, nocturnal BP.
- **Effect:** Resistance: college-aged subjects did 30 min resistance exercise at 07:00, 13:00 or 19:00; all exercise conditions had fewer awakenings than the no-exercise day; 19:00 had less WASO than control; SOL differed between 07:00 and the later sessions; timing did not affect sleep stages or nocturnal BP (Alley 2015). Aerobic: 20 prehypertensive adults, 30 min moderate treadmill at 07:00, 13:00, 19:00: 07:00 produced a larger nocturnal systolic dip and more deep sleep than 13:00; 19:00 gave the largest diastolic reduction (Fairbrother 2014).
- **Rule thresholds:** none strong; any time of day is acceptable within the E6 buffer.
- **Population:** YA (resistance); prehypertensive adults (aerobic); LAB.
- **Evidence type:** randomized crossover, tiny n.
- **Sources:** Alley JR et al. J Strength Cond Res 2015;29(5):1378-85. https://pubmed.ncbi.nlm.nih.gov/25426516/ [A] (older). Fairbrother K et al. Vasc Health Risk Manag 2014;10:691-698. https://pubmed.ncbi.nlm.nih.gov/25540588/ [A] (older)
- **Confidence:** low.
- **Caveats:** single sessions; consumer devices in some arms.
- **App measurement:** time-of-day bins for workouts vs next-night WASO and deep-sleep minutes.

### E8. Morning vs evening training programmes (chronic) and sleep timing
- **Outcome:** sleep timing (bedtime, mid-sleep), sleep latency, subjective quality.
- **Effect:** 36 sedentary OW/OB adults, 12 weeks, 3 x 90 min/week: morning training advanced bedtime and mid-sleep; evening training delayed them; both groups improved subjective sleep quality, sleepiness, fatigue and quality of life equally (Saidi 2021). 58 sedentary men, 12 weeks, ≥150 min/week moderate aerobic at 06:00-08:00 vs 18:00-20:00 vs control: both shortened sleep latency; morning advanced sleep-wake timing; evening gave larger vascular and systolic BP benefits (Shen 2025).
- **Rule thresholds:** if he wants an earlier sleep schedule, bias sessions to morning; otherwise choose time by glucose and logistics (E11), respecting E6.
- **Population:** OW/OB adults; sedentary men (M).
- **Evidence type:** RCTs, small.
- **Sources:** Saidi O et al. Chronobiol Int 2021;38(11):1537-1548. https://pubmed.ncbi.nlm.nih.gov/34128447/ [A]. Shen B et al. Sci Rep 2025;15:18298. https://pubmed.ncbi.nlm.nih.gov/40419564/ [A]
- **Confidence:** low-medium.
- **Caveats:** untrained populations; he is already trained.
- **App measurement:** mid-sleep time and sleep onset time by week vs share of morning sessions.

### E9. Overreaching and sleep
- **Outcome:** objective sleep efficiency, duration; illness.
- **Effect:** SR/MA of 14 endurance overreaching studies (protocols averaging 16 days): sleep efficiency -2.0% (95% CI -3.2 to -0.8; Glass delta -0.83); subjective sleep quality not significantly changed (Murphy 2024). 27 trained male triathletes: functionally overreached group had sleep duration -7.9%, SE -1.6%, immobile time -7.6%, reversing during taper; upper respiratory infection incidence 67% vs 22% (acutely fatigued) vs 11% (controls) (Hausswirth 2014).
- **Rule thresholds:** a sustained drop in SE of about 2 percentage points or TST of about 8% during a heavy block, without another explanation, is consistent with overreaching (threshold derived from these effect sizes [U]).
- **Population:** ATH, endurance, M (Hausswirth).
- **Evidence type:** SR/MA; controlled trial.
- **Sources:** Murphy C et al. PLoS One 2024;19(5):e0303748. https://pubmed.ncbi.nlm.nih.gov/38809828/ [A]. Hausswirth C et al. Med Sci Sports Exerc 2014;46(5):1036-45. https://pubmed.ncbi.nlm.nih.gov/24091995/ [A] (older)
- **Confidence:** medium (athletes); low for a recreational 47-year-old.
- **Caveats:** subjective sleep does not detect it, so objective data matter; recreational load is usually lower.
- **App measurement:** 7-day rolling SE and TST vs 28-60 day personal baseline, overlaid with 7-day session load.

### E10. HRV and RHR as overtraining markers; deload rule
- **Outcome:** training status markers.
- **Effect:** ECSS/ACSM consensus: overtraining syndrome is a diagnosis of exclusion; hormonal, performance, psychological, biochemical and immunological markers exist but "none of them meet all the criteria to make their use generally accepted" (Meeusen 2013). Meta-analysis of 27 studies: resting RMSSD rose with positive adaptation (SMD 0.58) AND with overreaching (SMD 0.26), so HRV direction alone is ambiguous (Bellenger 2016). In an elite triathlete case, the 7-day rolling lnRMSSD fell and its coefficient of variation showed "large linear reductions towards NFOR" (Plews 2012). HRV-guided training: marginal fitness benefit vs predefined plans, better maintenance of vagal HRV; included studies used 7-day averages and a smallest worthwhile change (SWC) of mean ± 0.5 SD, prescribing high intensity when HRV is within or above baseline and low intensity or rest "when values are suppressed" (Manresa-Rocamora 2021).
- **Rule thresholds (heuristic [U], multi-signal):** Recovery flag when at least 2 of 4 are true for ≥2 consecutive days, after excluding explainers (alcohol, late hard session, hot night, illness, travel): (1) 7-day rolling lnRMSSD below personal baseline mean - 0.5 SD; (2) 7-day rolling nightly RHR ≥ baseline + 3 bpm [U]; (3) 7-day SE down ≥2 points or TST down ≥8% (from E9); (4) RPE of a repeated standard session up ≥1 point, or fatigue rating up. Action: swap the next hard session for easy or rest; if the flag lasts ≥7 days, reduce weekly load (amount [U]) and suggest a check-up if symptoms persist.
- **Population:** mostly ATH endurance.
- **Evidence type:** consensus statement; meta-analyses; case comparison.
- **Sources:** Meeusen R et al. Med Sci Sports Exerc 2013;45(1):186-205. https://pubmed.ncbi.nlm.nih.gov/23247672/ [A] (seminal, older). Bellenger CR et al. Sports Med 2016;46(10):1461-86. https://pubmed.ncbi.nlm.nih.gov/26888648/ [A]. Plews DJ et al. Eur J Appl Physiol 2012;112(11):3729-41. https://pubmed.ncbi.nlm.nih.gov/22367011/ [A] (older). Plews DJ et al. Sports Med 2013;43(9):773-81. https://pubmed.ncbi.nlm.nih.gov/23852425/ [A]. Manresa-Rocamora A et al. IJERPH 2021;18(19):10299. https://pubmed.ncbi.nlm.nih.gov/34639599/ and full text via Europe PMC PMC8507742 [A]
- **Confidence:** low-medium.
- **Caveats:** nightly HRV from a wrist device is not the morning supine RMSSD used in most studies; alcohol, heat and late training shift HRV more than training status does on any single night.
- **App measurement:** nightly RMSSD (log-transform), 7-day rolling mean, personal SWC band; nightly RHR 7-day mean; RPE trend on repeated sessions.

### E11. Exercise timing and glucose in prediabetes (and the trade-off with sleep)
- **Outcome:** glucose, insulin resistance (not sleep).
- **Effect:**
  - Meta-analysis, 20 studies, 680 participants: glucose right after morning exercise 0.26 mmol/L higher than after afternoon exercise; with repeated training, fasting glucose 0.25 mmol/L (95% CI 0.02 to 0.47) higher with morning vs afternoon/evening exercise; evidence "limited and inconclusive" (Schipper 2026) [A].
  - 775 NEO study participants (cross-sectional): vs evenly spread activity, afternoon MVPA -18% insulin resistance (95% CI -33 to -2), evening -25% (-49 to -4), morning -3% (van der Velde 2023) [A].
  - 11 men with type 2 diabetes, 2-week HIIT crossover: afternoon lowered CGM glucose (6.4 to 6.2 mmol/L); morning HIIT raised it (6.9 mmol/L), "an acute, deleterious effect" (Savikj 2019) [A].
  - 24 OW/OB men on a high-fat diet: evening training lowered nocturnal glucose (4.9 vs 5.3 mmol/L) and fasting glucose, insulin, LDL and triglycerides; morning training did not (Moholdt 2021) [A].
  - Post-meal vs pre-meal exercise: 8 RCTs, 116 participants: post-meal beat pre-meal (SMD 0.47) and no exercise (SMD 0.55); benefit larger the sooner after the meal (Engeroff 2023) [A].
  - ADA Standards of Care 2026, Section 3: interrupt prolonged sitting at least every 30 min; ≥150 min/week moderate activity for high-risk adults; Mediterranean or low-carbohydrate eating pattern for prediabetes [S].
- **Rule thresholds:** schedule hard sessions in the afternoon or early evening when they can END ≥4 h before habitual sleep onset (E6); add light walking soon after meals, including after dinner (light intensity does not trigger the E6 flag).
- **Population:** mostly T2D or OW/OB, M in several trials; he is lean, so magnitude is uncertain.
- **Evidence type:** meta-analyses, small RCTs, cross-sectional cohort, guideline.
- **Sources:** Schipper SBJ et al. J Diabetes Metab Disord 2026;25(1):150. https://pubmed.ncbi.nlm.nih.gov/42220558/ [A]. van der Velde JHPM et al. Diabetologia 2023;66(3):461-471. https://pubmed.ncbi.nlm.nih.gov/36316401/ [A]. Savikj M et al. Diabetologia 2019;62(2):233-237. https://pubmed.ncbi.nlm.nih.gov/30426166/ [A]. Moholdt T et al. Diabetologia 2021;64(9):2061-2076. https://pubmed.ncbi.nlm.nih.gov/34009435/ [A]. Engeroff T et al. Sports Med 2023;53(4):849-869. https://pubmed.ncbi.nlm.nih.gov/36715875/ [A]. ADA Standards of Care 2026, Section 3: https://diabetesjournals.org/care/article/49/Supplement_1/S50/163924/ [S]
- **Confidence:** medium (post-meal walking); low-medium (time of day for training).
- **Caveats:** no trial measured both glucose and sleep outcomes of timing in lean prediabetic men.
- **App measurement:** minutes between meal photo and next logged walk or workout; optional CGM would be needed to verify glucose effects (not in current data plan).

---

## 2. Caffeine

### C1. Dose and timing: meta-analysis
- **Outcome:** TST, SE, SOL, WASO, N1, deep sleep.
- **Effect:** 24 studies: TST -45 min, SE -7%, SOL +9 min, WASO +12 min, N1 +6.1 min (+1.7%), deep sleep (N3/N4) -11.4 min (-1.4%). To avoid a TST reduction: coffee (107 mg per 250 mL) at least 8.8 h before bedtime; a standard pre-workout serve (217.5 mg) at least 13.2 h before bedtime.
- **Rule thresholds:** 8.8 h (about 100 mg); 13.2 h (about 200 mg).
- **Population:** mixed, mostly healthy YA, LAB.
- **Evidence type:** SR and meta-analysis.
- **Source:** Gardiner C et al. Sleep Med Rev 2023;69:101764. https://pubmed.ncbi.nlm.nih.gov/36870101/ [A]
- **Confidence:** high (direction); medium (cutoff hours).
- **Caveats:** effect sizes are pooled from studies using large doses close to bedtime; a habitual morning coffee drinker will see much less.
- **App measurement:** coffee quick log with time and dose (default mg per drink type, editable); hours from each dose to bed.

### C2. Dose x timing RCT (100 vs 400 mg at 12, 8, 4 h)
- **Outcome:** objective (in-home partial PSG) and subjective sleep.
- **Effect:** 23 men, 25.3 ± 5.0 y, habitual intake below 300 mg/day, seven crossover conditions. 100 mg: no significant effect at any time vs placebo. 400 mg: delayed sleep initiation and altered architecture when taken within 12 h of bed; more fragmentation within 8 h; perceived quality -34% at 4 h. Conclusion: "100 mg ... can be consumed up to 4 hours prior to bedtime, but 400 mg may negatively impact sleep when consumed as one dose within 12 hours of bedtime."
- **Rule thresholds:** ≤100 mg single dose: ≥4 h (young men) to ≥8.8 h (C1) window; ≥400 mg single dose: ≥12 h, i.e., morning only.
- **Population:** YA, M.
- **Evidence type:** randomized, double-blind, placebo-controlled crossover.
- **Source:** Gardiner CL et al. Sleep 2025;48(4):zsae230. https://pubmed.ncbi.nlm.nih.gov/39377163/ [A]
- **Confidence:** medium-high for young men; medium for a 47-year-old (see C3).
- **Caveats:** young participants; single doses; no evaluation of multiple smaller doses across the afternoon.
- **App measurement:** per-dose flag using dose band and hours to bed.

### C3. Middle-age sensitivity
- **Outcome:** SOL, TST, SE, SWS, REM.
- **Effect:** PSG, 200 and 400 mg: caffeine lengthened SOL, shortened TST, reduced SE; at high dose these effects were "more pronounced in middle-aged than in young adults"; dose-dependent SWS reductions in both groups (22 young, 23.5 y; 24 middle-aged, 51.7 y) (Robillard 2015). Meta-analysis of 22 crossover PSG trials, 956 participants: TST -34.7 min, SE -4.7%, SOL +8.4 min, SWS -1.0%; TST fell in both young and middle-aged groups; young adults showed broader disruption (SE, SOL, SWS) (Chang 2025).
- **Rule thresholds:** at 47 assume at least young-adult sensitivity for doses ≥200 mg; personalize (6.4).
- **Population:** MA included.
- **Evidence type:** PSG experiment; meta-analysis.
- **Sources:** Robillard R et al. J Psychopharmacol 2015;29(6):688-697. https://pubmed.ncbi.nlm.nih.gov/25759402/ [A] (older). Chang YH, Cheng YC, Cheng WJ. Sleep Med 2025;136:106874. https://pubmed.ncbi.nlm.nih.gov/41124973/ [A]
- **Confidence:** medium.
- **Caveats:** the two sources disagree on who is more sensitive (see section 8).
- **App measurement:** same as C1; his own N-of-1 decides.

### C4. Classic "6 hours" study
- **Outcome:** subjective and objectively monitored sleep at home.
- **Effect:** 400 mg at 0, 3 or 6 h before habitual bedtime each disrupted sleep vs placebo (p < 0.05); at 6 h caffeine had "important disruptive effects"; authors support avoiding substantial caffeine for at least 6 h before bed. A secondary summary reports TST falling from 7.68 h to 6.50 h at 6 h (about 71 min) [S, secondary source].
- **Population:** 12 healthy adults (per secondary summary [S]).
- **Evidence type:** double-blind crossover.
- **Source:** Drake C et al. J Clin Sleep Med 2013;9(11):1195-1200. https://pubmed.ncbi.nlm.nih.gov/24235903/ [A] (seminal, older)
- **Confidence:** medium.
- **Caveats:** 400 mg in one dose is large; the device used is discontinued.
- **App measurement:** as C1.

### C5. Circadian phase delay
- **Outcome:** melatonin rhythm timing.
- **Effect:** caffeine equal to a double espresso 3 h before habitual bedtime delayed the melatonin rhythm by about 40 min, "nearly half of the magnitude" of 3 h of evening bright light (~3000 lux).
- **Rule thresholds:** evening caffeine also shifts the clock later, compounding late light.
- **Population:** healthy adults, LAB, 49-day protocol.
- **Evidence type:** within-subject, double-blind, placebo-controlled.
- **Source:** Burke TM et al. Sci Transl Med 2015;7(305):305ra146. https://pubmed.ncbi.nlm.nih.gov/26378246/ [A] (older)
- **Confidence:** medium.
- **Caveats:** small n.
- **App measurement:** later sleep onset trend on days with evening caffeine.

### C6. Half-life variability, CYP1A2
- **Effect:** mean plasma half-life about 5 h, range 1.5 to 9.5 h; smoking shortens it, oral contraceptives lengthen it (Institute of Medicine 2001, NCBI Bookshelf) [S]. CYP1A2 metabolizes about 95% of ingested caffeine; polymorphisms in CYP1A2, NAT2 and the adenosine A2A receptor (ADORA2A) drive differences in pharmacokinetics, consumption and sleep effects (Nehlig 2018) [A].
- **Sources:** IOM, Caffeine for the Sustainment of Mental Task Performance, 2001: https://www.ncbi.nlm.nih.gov/books/NBK223801/ [S] (older). Nehlig A. Pharmacol Rev 2018;70(2):384-411. https://pubmed.ncbi.nlm.nih.gov/29514871/ [A]
- **Confidence:** high that variability is large; low for predicting his value.
- **App measurement:** cannot genotype; infer a personal half-life class from N-of-1 (6.4).

### C7. Coffee vs energy drinks / pre-workout; decaf; regulatory limits
- **Effect:** FDA: 400 mg/day for most adults; decaf coffee 2 to 15 mg per 8 fl oz cup; energy drinks 54 to 328 mg per 16 fl oz (FDA 2024) [A]. EFSA 2015 (via EUFIC): single doses up to 200 mg raise no safety concern; up to 400 mg/day not harmful for adults; "at doses of around 100 mg in certain individuals, particularly when consumed close to bedtime" sleep can be affected [A]. Young adults given 240 mg 3 h before bed for 3 nights: no significant change in smartwatch sleep duration, but reports of poor sleep rose 8% with coffee and 20% with an energy drink (Schlichtiger 2025) [S]. Actigraphy cohort: caffeine within 4 h of bed was not associated with that night's sleep (Spadola 2019) [S].
- **Rule thresholds:** treat pre-workout and energy drinks by their label dose (often ≥200 mg): morning only; decaf ≈ 10 mg per cup [U midpoint], negligible for the rule.
- **Sources:** FDA, Spilling the Beans, content current 2024-08-28: https://www.fda.gov/consumers/consumer-updates/spilling-beans-how-much-caffeine-too-much [A]. EFSA Scientific Opinion on the safety of caffeine, EFSA J 2015;13(5):4102, summarized at https://www.eufic.org/en/whats-in-food/article/efsa-opinion-on-the-safety-of-caffeine [A]. Schlichtiger J et al. Nutrients 2025;17(9):1503. https://doi.org/10.3390/nu17091503 [S]. Spadola CE et al. Sleep 2019;42(11):zsz136. https://pubmed.ncbi.nlm.nih.gov/31386152/ [S]
- **Confidence:** high (content, limits); low (energy drink vs coffee difference in sleep).
- **Caveats:** wearables may miss effects that PSG detects (Schlichtiger vs C1/C2).
- **App measurement:** drink-type presets with editable mg; pre-workout flagged automatically when logged within 13 h of bed.

### C8. Concrete personalizable caffeine rule (proposal)
1. **Dose-scaled cutoff (evidence-anchored defaults):**
   - single dose ≤100 mg: last intake ≥9 h before habitual bed (C1: 8.8 h). Relax to ≥6 h only if his N-of-1 shows no effect (C2 found none at 4 h in young men).
   - 101-199 mg: ≥11 h [U, interpolated].
   - ≥200 mg (pre-workout, energy drink, large cold brew): ≥13 h (C1: 13.2 h); ≥400 mg: morning only and discouraged (C2).
   - daily total ≤400 mg (FDA, EFSA).
2. **Residual-caffeine model (for multiple doses):** residual_at_bed = Σ dose_i x 0.5^((t_bed - t_i) / t_half). Start t_half = 5 h (C6 mean). Flag if residual_at_bed > 50 mg [U: half of the EFSA 100 mg sleep-relevant dose]. Example: 107 mg at 14:00, bed 23:00: residual ≈ 31 mg with t_half 5 h, ≈ 49 mg with t_half 8 h (calculation).
3. **Personalize t_half:** run the 6.4 caffeine protocol; if nights with residual > 25 mg show worse SOL/WASO/HRV than nights < 10 mg, move him to "slow" (t_half 7-8 h); if no difference at residual ≤ 50 mg, keep 5 h.
4. **Keep total dose constant when testing timing** (only shift time) so that withdrawal is not a confounder [U, design choice].

---

## 3. Alcohol

### A1. Sleep architecture: dose-response (meta-analysis)
- **Outcome:** REM onset and duration, SOL, N3 latency, TST, SE, WASO.
- **Effect:** 27 studies: REM onset delayed and REM duration reduced. REM disruption appears at a low dose (≤0.50 g/kg, "approximately two standard drinks") and worsens with dose. Shorter SOL and shorter latency to N3 only at high dose (≥0.85 g/kg, "approximately five standard drinks"). Large uncertainty for TST, SE, WASO.
- **Rule thresholds:** for 68 kg: 0.50 g/kg = 34 g ethanol; 0.85 g/kg = 58 g (calculation).
- **Population:** healthy adults, mostly LAB PSG.
- **Evidence type:** SR and meta-analysis.
- **Source:** Gardiner C et al. Sleep Med Rev 2025;80:102030. https://pubmed.ncbi.nlm.nih.gov/39631226/ [A] (abstract via PubMed and Europe PMC)
- **Confidence:** high (REM effect); low (TST, WASO).
- **Caveats:** most studies dose close to bedtime; few women and few middle-aged.
- **App measurement:** grams of ethanol per log (volume x ABV x 0.789 g/mL, calculation) and g/kg using his weight.

### A2. First-half vs second-half of the night
- **Effect:** at all doses alcohol "causes a reduction in sleep onset latency, a more consolidated first half sleep and an increase in sleep disruption in the second half of sleep"; SWS increased in the first half in most studies; total-night REM % decreased at moderate and high doses; delayed first REM is the most consistent effect.
- **Source:** Ebrahim IO et al. Alcohol Clin Exp Res 2013;37(4):539-49. https://pubmed.ncbi.nlm.nih.gov/23347102/ [A] (seminal, older)
- **Confidence:** high.
- **Caveats:** the "falls asleep faster" effect is what makes people believe alcohol helps.
- **App measurement:** awake minutes and awakenings in the second half of the night (wearable epoch data if available).

### A3. Autonomic recovery during sleep (real-world HRV)
- **Outcome:** HRV-derived "physiological recovery" in the first hours of sleep.
- **Effect:** 4,098 Finnish employees (55.8% female, mean age 45.1): recovery decreased by 9.3, 24.0 and 39.2 percentage units after low (≤0.25 g/kg), moderate (>0.25-0.75 g/kg) and high (>0.75 g/kg) intake (all p < .001); effects similar in men and women, stronger in younger people and in those with lower baseline sleep heart rate.
- **Rule thresholds:** for 68 kg: ≤17 g (about 1.2 US standard drinks) already costs about 9 points; 17-51 g about 24 points (calculation).
- **Population:** MA, RW (very close to this user); note "lower baseline sleep heart rate" describes a fit man like him.
- **Evidence type:** observational within-person.
- **Source:** Pietilä J et al. JMIR Ment Health 2018;5(1):e23. https://pubmed.ncbi.nlm.nih.gov/29549064/ [A]
- **Confidence:** high (direction); medium (magnitude transfer to Fitbit metrics).
- **Caveats:** proprietary recovery index; self-reported drinks.
- **App measurement:** nightly HRV and RHR vs logged grams.

### A4. Per-drink effects on RHR, HRV, sleep, next-day activity (large wearable cohort)
- **Outcome:** nocturnal RHR, HRV, sleep duration, next-day activity.
- **Effect:** WHOOP, 20,968 people (52.1% male), 5,109,185 person-days, drinks and time of last drink self-logged. One drink above personal average vs one below: RHR +2.4 bpm (men) / +2.8 (women); HRV -3.3 ms (men) / -3.8 (women). Five vs three drinks above usual: HRV -5.1 ms (men). Sleep duration fell progressively with dose. Inverse age gradient (larger effects in younger); after five extra drinks the 40-49 group lost 2.7 ms more HRV than the 50-59 group. Modifiers: drinking 60 min earlier linked to RHR -0.87 bpm and HRV +1.5 ms (reported for women); after five extra drinks, high vs low sleep tertile had RHR 2.9 bpm lower and HRV 7.2 ms higher; low vs high activity on the drinking day had RHR 0.7 bpm lower, HRV 2.1 ms higher, sleep +4.3 min.
- **Rule thresholds:** every drink matters; earlier is better; do not stack hard training with drinking.
- **Population:** RW, all adult ages including 40-49.
- **Evidence type:** observational within-person cohort.
- **Source:** Grosicki GJ et al. PLOS Digit Health 2026;5(3):e0001284. https://journals.plos.org/digitalhealth/article?id=10.1371%2Fjournal.pdig.0001284 [A]
- **Confidence:** high (direction); medium (magnitude for Fitbit).
- **Caveats:** observational; self-report; WHOOP HRV definition differs from Fitbit's.
- **App measurement:** identical design is possible in-app: within-person regression of nightly RHR/HRV on drinks above his personal average, adjusted for weekday.

### A5. Moderate drinking and smartwatch RHR (prospective)
- **Effect:** 40 healthy adults (63% female, mean age 30.5), 3 baseline days, 3 evenings of 40 g (women) / 60 g (men), 3 post days: nocturnal RHR 63.6 to 66.6 bpm (p < 0.001) with rapid normalization (64.9) after exposure; no objective sleep-architecture change detected by smartwatch; subjective sleep quality declined.
- **Source:** Strüven A et al. Nutrients 2025;17(9):1470. https://pubmed.ncbi.nlm.nih.gov/40362779/ [A]
- **Confidence:** medium.
- **Caveats:** wearables are weak at REM detection, so "no architecture change" is not reassuring (see A1, 6.6). Useful for design: carryover after stopping is short (about 1 night).
- **App measurement:** RHR is the most sensitive, most reliable alcohol signal on a wrist device.

### A6. Breathing during sleep (apnea)
- **Outcome:** AHI, oxygen saturation, OSA risk.
- **Effect:** 14 RCTs (422 participants, 71.9% male): alcohol raised AHI by 2.33 events/h (95% CI 1.41-3.25) and lowered mean SpO2 by 0.60 points; in snorers or people with OSA AHI rose by 7.10 events/h (95% CI 3.59-10.61) (Kolla 2018). 21 studies: higher alcohol consumption associated with 25% higher risk of sleep apnoea (RR 1.25, 95% CI 1.13-1.38) (Simou 2018).
- **Rule thresholds:** if snoring, gasping or witnessed apneas are reported, alcohol becomes the top lever and medical evaluation is advised (not a lifestyle decision).
- **Population:** mostly men.
- **Evidence type:** SR/MA of RCTs; SR/MA of observational studies.
- **Sources:** Kolla BP et al. Sleep Med Rev 2018;42:59-67. https://pubmed.ncbi.nlm.nih.gov/30017492/ [A]. Simou E, Britton J, Leonardi-Bee J. Sleep Med 2018;42:38-46. https://pubmed.ncbi.nlm.nih.gov/29458744/ [A]
- **Confidence:** high.
- **Caveats:** Fitbit SpO2/breathing features are not diagnostic.
- **App measurement:** optional snoring question; SpO2 variability if exposed by the API (see track A file).

### A7. Timing of the last drink
- **Effect:** actigraphy + diary cohort (6.7 nights on average): alcohol within 4 h of bedtime was associated with that night's lower sleep efficiency (not WASO or duration) (Spadola 2019) [S]. Wearable cohort: earlier drinking associated with smaller RHR/HRV disruption; about 2 h earlier (e.g., before rather than after dinner) linked to better nocturnal autonomic regulation (Grosicki 2026) [A].
- **Rule thresholds:** last drink ≥4 h before bed (exposure window used by Spadola; supported directionally by Grosicki). A pharmacokinetic "1 drink per hour" clearance rule is common but [U] (not verified here).
- **Population:** middle-aged and older African American adults (Spadola); RW adults (Grosicki).
- **Confidence:** medium.
- **App measurement:** time of last drink in the quick log (mandatory field).

### A8. Concrete alcohol rule (proposal)
- Conversions for 68 kg (calculation; ethanol 0.789 g/mL): US standard drink = 14 g (NIAAA [A], https://www.niaaa.nih.gov/alcohols-effects-health/what-standard-drink) = 0.21 g/kg. Beer 330 mL at 5% ≈ 13 g; wine 150 mL at 13% ≈ 15 g; arak 50 mL at 40% ≈ 16 g. 0.25 g/kg ≈ 17 g ≈ 1.2 drinks; 0.50 g/kg ≈ 34 g ≈ 2.4 drinks; 0.75 g/kg ≈ 51 g ≈ 3.6 drinks.
- **Default:** alcohol-free nights are the sleep-optimal choice; there is no sleep-safe dose (A3: ≤0.25 g/kg already lowers recovery).
- **Harm-reduction rule when he chooses to drink:** ≤1 standard drink (≤14 g), with food, last sip ≥4 h before bed, not on nights before key training; never ≥0.5 g/kg (≥34 g) if sleep is the goal (REM, A1).
- **Interpretation rule:** on drinking nights, expect RHR up about 2-3 bpm and HRV down about 3 ms per drink above his usual (A4); tag the night "alcohol-explained" and do not trigger training-recovery flags from that night alone.

---

## 4. Meal timing and composition

### M1. Dinner-to-bed gap (sleep outcomes)
- **Outcome:** nocturnal awakenings, WASO, subjective quality.
- **Effect:**
  - 793 young adults (18-29, 26% male): eating within 3 h of bed associated with ≥1 nocturnal awakening (OR 1.61, 95% CI 1.15-2.27; adjusted OR 1.43, 1.00-2.04), not with long SOL or short sleep (Chung 2020) [A].
  - American Time Use Survey 2003-2018 (US residents aged ≥15 [S]): eating/drinking less than 1 h before bed: higher odds of WASO in men (OR 2.64, 95% CI 2.08-3.36) and women (OR 2.03); also longer weekday sleep; as the interval grew to 2-3 h, odds of short/long sleep and WASO decreased (Iao 2022) [A].
  - Maastricht Study, 3,463 adults (mean 63.6 y): mean last-meal-to-bed interval 2.6 h; longer interval associated with better sleep quality: PSQI -0.72 (Q2 vs Q1) and -0.85 (Q4 vs Q1) [S]; per extra hour also better mental (+0.20) and physical (+0.29) functioning [A] (Chong 2026).
  - NHANES 2005-2008, 7,023 adults (mean 50.5 y): later last-meal timing (third vs first tertile) associated with higher (worse) PSQI, beta 0.385 (95% CI 0.090-0.680) (Yan 2024) [A].
  - 52 healthy adults, PSG + food diaries: nocturnal fat intake correlated with worse sleep, more variables affected in women (Crispim 2011) [A].
- **Rule thresholds:** last main meal ends ≥3 h before bed (default); <1 h = strong flag.
- **Population:** YA, MA, OA; cross-sectional mostly.
- **Evidence type:** cross-sectional and survey data; no RCT on sleep outcomes located.
- **Sources:** Chung N et al. IJERPH 2020;17(8):2677. https://pubmed.ncbi.nlm.nih.gov/32295235/ [A]. Iao SI et al. Br J Nutr 2022;127(12):1888-1897. https://pubmed.ncbi.nlm.nih.gov/34511160/ [A]. Chong MY et al. Clin Nutr 2026;59:106593. https://pubmed.ncbi.nlm.nih.gov/41780086/ [A]. Yan L-M et al. PLoS One 2024;19(8):e0308172. https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0308172 [A]. Crispim CA et al. J Clin Sleep Med 2011;7(6):659-64. https://pubmed.ncbi.nlm.nih.gov/22171206/ [A] (older)
- **Confidence:** medium (direction, consistent); low (causality, magnitude).
- **Caveats:** reverse causation (poor sleepers eat late); confounding by alcohol at dinner; the paradox of longer sleep with late eating (Iao).
- **App measurement:** gap = sleep_onset - last meal photo timestamp (photo usually taken at meal start: add a default 20-30 min meal duration [U] or ask "finished eating" tap).

### M2. Late dinner and nocturnal glucose (prediabetes-specific)
- **Outcome:** glucose tolerance, overnight metabolism.
- **Effect:** randomized crossover, 20 healthy adults (26 y), dinner at 22:00 vs 18:00 with sleep 23:00-07:00: late dinner shifted the postprandial period into sleep, with higher glucose, delayed triglyceride peak, and lower fatty acid oxidation (Gu 2020) [A]; press summary: peak glucose about 18% higher and overnight fat burned about 10% lower [S]. Crossover in 845 Spanish adults: a 75 g OGTT 1 h vs 4 h before habitual bedtime gave melatonin 3.5-fold higher, insulin AUC -6.7%, glucose AUC +8.3%, with a stronger effect in MTNR1B risk-allele carriers (Garaulet 2022) [S; record opened A].
- **Rule thresholds:** for prediabetes prefer dinner end ≥4 h before bed when feasible; ≥3 h minimum.
- **Population:** YA (Gu); general adult population (Garaulet); not prediabetes-specific.
- **Evidence type:** randomized crossover trials.
- **Sources:** Gu C et al. J Clin Endocrinol Metab 2020;105(8):2789-802. https://pubmed.ncbi.nlm.nih.gov/32525525/ [A]. Garaulet M et al. Diabetes Care 2022;45(3):512-519. https://pubmed.ncbi.nlm.nih.gov/35015083/ [A record, numbers S]
- **Confidence:** medium-high (metabolic direction).
- **Caveats:** OGTT is a model of a carbohydrate-heavy late meal, not a mixed dinner.
- **App measurement:** gap as M1; photo-estimated carbohydrate load of the last meal (vision model; accuracy [U]).

### M3. Evening carbohydrate and glycemic index
- **Effect:** 12 healthy men (18-35): high-GI rice meal (GI 109) 4 h before bed cut SOL to 9.0 min vs 17.5 min for low-GI (GI 50); high-GI at 4 h beat high-GI at 1 h (9.0 vs 14.6 min); no other sleep variable changed (Afaghi 2007) [A]. Opposite direction long-term: 77,860 postmenopausal women: higher dietary GI associated with prevalent (OR 1.11, Q5 vs Q1) and incident (OR 1.16) insomnia; added sugars, starch, refined grains raised risk; fibre, fruit, vegetables lowered it (Gangwisch 2020) [A].
- **Rule thresholds:** do not recommend high-GI dinners for sleep in a prediabetic man; if a carbohydrate-rich dinner is eaten, eat it early (≥4 h) (combines M2 and Afaghi).
- **Population:** YA M (acute); W OA (cohort).
- **Evidence type:** small crossover; large cohort.
- **Sources:** Afaghi A et al. Am J Clin Nutr 2007;85(2):426-30. https://pubmed.ncbi.nlm.nih.gov/17284739/ [A] (seminal, older). Gangwisch JE et al. Am J Clin Nutr 2020;111(2):429-439. https://pubmed.ncbi.nlm.nih.gov/31828298/ [A]
- **Confidence:** low (sleep); medium (glycemic priority).
- **App measurement:** meal photo classification (refined vs whole-grain carbohydrate) [U accuracy].

### M4. Fibre, saturated fat, sugar; unhealthy diet; ultra-processed food
- **Effect:** 26 normal-weight adults (30-45 y), controlled feeding then free eating: more fibre predicted less N1 and more SWS; higher % saturated fat predicted less SWS; more sugar and non-fibre carbohydrate predicted more arousals; free eating gave less SWS and longer SOL than controlled feeding (St-Onge 2016) [A]. 15 healthy young men, 1-week isocaloric high-fat/high-sugar vs low-fat/low-sugar diet: no change in duration or macrostructure, but lower delta power, delta/beta ratio and slow-wave amplitude in deep sleep (Brandão 2023) [A]. NutriNet-Santé, 38,570 adults (mean 50 y, 77% female): each absolute +10% UPF share associated with chronic insomnia OR 1.06 (1.02-1.09); in men OR 1.09 (1.01-1.18) (Duquenne 2024) [A].
- **Rule thresholds:** dinner pattern: vegetables/legumes/whole grains, limited saturated fat and added sugar; UPF as small share of intake (no numeric sleep threshold established).
- **Population:** MA adults (St-Onge); YA M (Brandão); MA mixed (Duquenne).
- **Evidence type:** secondary analysis of RCT; RCT crossover; cross-sectional cohort.
- **Sources:** St-Onge MP et al. J Clin Sleep Med 2016;12(1):19-24. https://pubmed.ncbi.nlm.nih.gov/26156950/ [A] (older). Brandão LEM et al. Obesity 2023;31(7):1755-1766. https://pubmed.ncbi.nlm.nih.gov/37245331/ [A]. Duquenne P et al. J Acad Nutr Diet 2024;124(9):1109-1117.e2. https://pubmed.ncbi.nlm.nih.gov/38423510/ [A]
- **Confidence:** low-medium (sleep); these patterns are anyway advised for prediabetes (ADA 2026 [S]).
- **Caveats:** wearable "deep sleep" minutes will not show micro-architecture changes (delta power).
- **App measurement:** daily fibre / UPF share estimated from photos [U accuracy]; test over weeks, not nights.

### M5. Mediterranean-style diet
- **Effect:** 62 observational studies, 328,493 participants: sufficient sleep duration (OR 1.39), good sleep quality (OR 1.38) and earlier chronotype (OR 1.74) associated with high MedDiet scores; causality unknown.
- **Source:** Arab A, Lempesis IG, Garaulet M, Scheer FAJL. Sleep Med Rev 2025;80:102071. https://pubmed.ncbi.nlm.nih.gov/40081182/ [A]
- **Confidence:** low (causal effect on sleep); high as a prediabetes pattern (ADA 2026 [S]).
- **App measurement:** weekly MedDiet-like score from photos [U].

### M6. Protein before bed (casein 20-40 g)
- **Effect:** systematic review, 9 articles: 20-40 g casein about 30 min before sleep stimulates overnight protein synthesis in young and older men and increased muscle fibre area, strength and mass over 10-12 weeks of training in young men, "but not in elderly men" (Reis 2021) [A]. Sleep: 9 resistance-trained young adults (5 men), 40 g whey vs 40 g casein vs maltodextrin 30 min before bed after training: whey shortened SOL (9.0 vs 19.0 min control) and increased TST; casein did not differ from control (Aussieker 2026) [A].
- **Rule thresholds:** optional for muscle goals: 20-40 g protein ~30 min before bed as a small liquid snack; not a sleep intervention; test with N-of-1 because it conflicts with M1.
- **Population:** YA mostly; he is 47 (between groups).
- **Evidence type:** SR; tiny crossover.
- **Sources:** Reis CEG et al. J Sci Med Sport 2021;24(2):177-182. https://pubmed.ncbi.nlm.nih.gov/32811763/ [A]. Aussieker T et al. Int J Sport Nutr Exerc Metab 2026;36(5):481-490. https://pubmed.ncbi.nlm.nih.gov/42413910/ [A]
- **Confidence:** medium (muscle, young); low (sleep).
- **App measurement:** protein snack log; compare WASO/HRV on snack vs no-snack nights.

### M7. Tryptophan (supplement; flag only)
- **Effect:** meta-analysis of 18 articles: L-tryptophan shortened WASO (-81.03 min per g; ≥1 g more effective), no effect on other sleep components.
- **Source:** Sutanto CN, Loh WW, Kim JE. Nutr Rev 2022;80(2):306-316. https://pubmed.ncbi.nlm.nih.gov/33942088/ [A]
- **Confidence:** low; supplements belong to another track; do not recommend from food "tryptophan" claims.

### M8. Time-restricted eating (TRE) and fasting windows
- **Effect:** meta-analysis of 51 articles (2001-2023): overall TRF reduced self-reported TST and worsened PSQI, but this was driven by Ramadan studies; non-Ramadan TRF showed TST increases and no significant PSQI difference (Lima 2025) [A]. Systematic review of 11 studies: "most studies found no effect on sleep parameters"; no objective change in sleep duration; one subjective study reported -30 ± 13 min (de Sousa 2025) [A].
- **Rule thresholds:** TRE is sleep-neutral; if he uses an eating window, ending it early automatically satisfies M1/M2.
- **Population:** mostly OW adults.
- **Sources:** Lima GS et al. Chronobiol Int 2025;42(12):1744-1764. https://pubmed.ncbi.nlm.nih.gov/41208478/ [A]. de Sousa BA et al. Nutr Rev 2025;83(7):1264-1276. https://pubmed.ncbi.nlm.nih.gov/40257510/ [A]
- **Confidence:** medium (neutral).
- **App measurement:** eating window = first to last meal photo.

### M9. Hydration and nocturia
- **Effect:** ICS consensus on nocturia (Delphi): diagnostic package includes an intake diary and bladder diary; "Lifestyle interventions may be useful" (Everaert 2019) [A]; search-result text states there is no more than level 2 evidence that modifying fluid intake helps nocturia [S]. NICE CG97 (men with LUTS): limit fluid in the late afternoon/evening for nocturia; limit caffeine, artificial sweeteners, fizzy drinks; avoid excessive restriction [S].
- **Rule thresholds:** only if he logs ≥1 night-time void on most nights: shift fluids earlier in the day and review evening alcohol/caffeine; recurrent nocturia at 47 warrants a medical check (OSA and prostate are part of work-up per ICS phenotyping) [A for work-up list].
- **Sources:** Everaert K et al. Neurourol Urodyn 2019;38(2):478-498. https://pubmed.ncbi.nlm.nih.gov/30779378/ [A]. NICE CG97: https://www.nice.org.uk/guidance/cg97 [S]
- **Confidence:** low.
- **Caveats:** avoid dehydration during Israeli summer training.
- **App measurement:** morning quick question "night-time bathroom trips (0/1/2+)"; awakenings timing from wearable.

### M10. Large or spicy dinners
- **Effect:** large high-fat intake near bed: see M1 (Crispim 2011) [A]. Spicy food: no study located and opened in this search [U]; treat as unknown and test with N-of-1 if he suspects it.

---

## 5. Behavioural and environmental levers

### B1. CBT-I and its components
- **Outcome:** insomnia severity, SOL, WASO, SE, TST.
- **Effect:** AASM guideline: STRONG recommendation for multicomponent CBT-I; CONDITIONAL for brief behavioural therapy, stimulus control, sleep restriction, and relaxation as single components; conditional recommendation AGAINST sleep hygiene as a single therapy (Edinger 2021 guideline + GRADE review of 124 studies) [A]. European guideline 2023: CBT-I is first-line for chronic insomnia, in person or digital; light therapy and exercise "may be useful as adjunct therapies" (Riemann 2023) [A]. Meta-analysis of 20 RCTs (1,162 participants, mean age 56, 64% female): SOL -19.0 min, WASO -26.0 min, TST +7.6 min (NS), SE +9.9% (Trauer 2015) [A].
- **Rule thresholds:** if ≥3 nights/week of trouble falling or staying asleep for ≥3 months with daytime impact (insomnia pattern [U: clinical definition not opened here]), the coach should recommend CBT-I (digital or clinician), not lifestyle tweaks. Components usable as rules for a non-insomniac: fixed rise time; bed only when sleepy; leave the bed if unable to sleep for a prolonged period (commonly about 15-20 min [U]).
- **Population:** adults with chronic insomnia (CLIN).
- **Sources:** Edinger JD et al. J Clin Sleep Med 2021;17(2):255-262. https://pubmed.ncbi.nlm.nih.gov/33164742/ [A]; review 263-298, https://pubmed.ncbi.nlm.nih.gov/33164741/ [A]. Riemann D et al. J Sleep Res 2023;32(6):e14035. https://pubmed.ncbi.nlm.nih.gov/38016484/ [A]. Trauer JM et al. Ann Intern Med 2015;163(3):191-204. https://pubmed.ncbi.nlm.nih.gov/26054060/ [A] (older)
- **Confidence:** high (for insomnia); low (for a good sleeper).
- **Caveats:** sleep restriction therapy should not be self-administered by an app without clinical oversight [U, safety judgement].
- **App measurement:** weekly insomnia screen (2-3 questions) + wearable SOL/WASO trends.

### B2. Regular timing, consistent wake time, sleep opportunity
- **Outcome:** health, safety, performance; mortality (association).
- **Effect:** NSF consensus: "Consistency of sleep onset and offset timing is important for health, safety, and performance"; weekend catch-up sleep may benefit health when weekday sleep is insufficient (Sletten 2023) [A]. UK Biobank accelerometry, 60,977 participants (mean 62.8 y): higher Sleep Regularity Index linked to 20-48% lower all-cause, 16-39% lower cancer, 22-57% lower cardiometabolic mortality (top four quintiles vs least regular); regularity predicted mortality better than duration (Windred 2024) [A]. Adults 18-60 need "7 or more hours" (AASM/SRS consensus via CDC) [A].
- **Rule thresholds:** fixed wake time 7 days/week within ±30-45 min [U]; sleep opportunity ≥7.5 h so that TST ≥7 h is possible [U margin]; SRI tracked weekly.
- **Population:** OA (Windred); consensus for adults.
- **Sources:** Sletten TL et al. Sleep Health 2023;9(6):801-820. https://pubmed.ncbi.nlm.nih.gov/37684151/ [A]. Windred DP et al. Sleep 2024;47(1):zsad253. https://pubmed.ncbi.nlm.nih.gov/37738616/ [A]. CDC About Sleep (citing Watson NF et al. Sleep 2015;38(6):843-4): https://www.cdc.gov/sleep/about/index.html [A]
- **Confidence:** medium-high (importance); low (nightly effect size in a regular sleeper).
- **App measurement:** SRI from wearable sleep/wake epochs over 7+ days; SD of wake time and sleep onset; weekday vs weekend difference.

### B3. Morning and daytime light
- **Outcome:** insomnia symptoms, ease of waking, chronotype, SE, SOL.
- **Effect:** UK Biobank (about 500,000): each additional daily hour outdoors associated with fewer insomnia symptoms (OR 0.94-0.97), greater ease of getting up (OR 1.46-1.49), earlier chronotype (OR 0.75-0.77) (Burns 2021) [A]. Consensus recommendation: daytime melanopic EDI ≥250 lux (Brown 2022) [S for number; record A]. 12 students (24.9 y), 1000 lx 6500 K for 1.5 h on 5 mornings: SE 83.8% vs 80.4%, shorter SOL, earlier onset (He 2023) [A]. 59 UK adults with light loggers: daytime light often below and evening light above recommendations; brighter light around waking reduced morning sleepiness (Didikoglu 2023) [A].
- **Rule thresholds:** ≥30 min outdoors within ~2 h of waking [U; per-hour associations in Burns; protocol duration 1.5 h in He]; Israeli outdoor daylight easily exceeds 250 melanopic lux [U, not measured here].
- **Population:** MA/OA (Burns); YA (He); adults (Didikoglu).
- **Evidence type:** large cross-sectional/longitudinal; expert consensus; small crossover.
- **Sources:** Burns AC et al. J Affect Disord 2021;295:347-352. https://pubmed.ncbi.nlm.nih.gov/34488088/ [A]. Brown TM et al. PLoS Biol 2022;20(3):e3001571. https://pubmed.ncbi.nlm.nih.gov/35298459/ [A]. He M et al. J Sleep Res 2023;32(2):e13724. https://pubmed.ncbi.nlm.nih.gov/36058557/ [A]. Didikoglu A et al. PNAS 2023;120(42):e2301608120. https://pubmed.ncbi.nlm.nih.gov/37812713/ [A]
- **Confidence:** medium (direction); low (dose).
- **App measurement:** morning check-in "minutes outdoors"; morning walk logs; sleep onset drift.

### B4. Evening light dimming and dark nights
- **Outcome:** melatonin suppression, SOL, metabolic risk (association).
- **Effect:** consensus: melanopic EDI <10 lux from 3 h before habitual sleep, <1 lux in the sleep environment (Brown 2022) [S]. 55 adults (18-30): 50% melatonin suppression at about 25 lux (ED50 24.60 lux), with a >50-fold difference in sensitivity between people (Phillips 2019) [S; record A]. Higher pre-bedtime light was associated with longer SOL (Didikoglu 2023) [A]. UK Biobank light sensors, 84,790 people (62.3 y): highest night-light exposure (90-100th percentile) vs 0-50th: incident type 2 diabetes HR 1.53 (1.32-1.77) (Windred 2024, Lancet Reg Health Eur) [S].
- **Rule thresholds:** from bed - 3 h: dim, warm, low lamps; bedroom dark (<1 lux: blackout curtains, cover LEDs). Night-light link to diabetes is directly relevant to prediabetes (association only).
- **Population:** YA (Phillips); OA (Windred).
- **Sources:** Brown 2022 as above. Phillips AJK et al. PNAS 2019;116(24):12019-12024. https://pubmed.ncbi.nlm.nih.gov/31138694/ [A] (seminal, 2019). Windred DP et al. Lancet Reg Health Eur 2024: https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(24)00110-8/fulltext [S]
- **Confidence:** medium.
- **Caveats:** individual sensitivity varies enormously, so the effect in him is unknown until tested.
- **App measurement:** evening quick check "lights dimmed from HH:MM"; no light sensor assumed on Fitbit Air [U].

### B5. Bedroom temperature (Israel-relevant)
- **Outcome:** wakefulness, SWS, REM, SE, TST.
- **Effect:** review: heat or cold exposure increases wakefulness and decreases REM and SWS; humid heat adds thermal load (Okamoto-Mizuno 2012) [S] (older). 50 older adults (79 y), 18 months of home sensors: sleep most efficient and restful at 20-25 °C; a "clinically relevant 5-10% drop in sleep efficiency" from 25 to 30 °C; large between-person differences (Baniassadi 2023) [A]. 47,628 people in 68 countries, 7 million+ nights: nights above 25 °C add 3.5 percentage points to the chance of sleeping under 7 h vs a 5-10 °C baseline; sleep 14.08 min shorter on nights above 30 °C; effects larger in older adults and women (Minor 2022) [S].
- **Rule thresholds:** target bedroom 20-25 °C (older-adult data; midlife value [U]); flag nights when outdoor overnight low ≥25 °C and no AC is used.
- **Sources:** Okamoto-Mizuno K, Mizuno K. J Physiol Anthropol 2012;31:14. https://jphysiolanthropol.biomedcentral.com/articles/10.1186/1880-6805-31-14 [S]. Baniassadi A et al. Sci Total Environ 2023;899:165623. https://pubmed.ncbi.nlm.nih.gov/37474050/ [A]. Minor K et al. One Earth 2022: https://www.cell.com/one-earth/fulltext/S2590-3322(22)00209-3 [S]
- **Confidence:** medium.
- **App measurement:** weather API overnight temperature for his city as covariate; optional bedroom thermometer log; Fitbit skin-temperature deviation if exposed.

### B6. Warm bath or shower before bed
- **Outcome:** SOL, SE, subjective quality.
- **Effect:** 17 studies (13 in meta-analysis): water at 40-42.5 °C improved self-rated sleep quality and SE; when scheduled 1-2 h before bedtime, for as little as 10 min, SOL shortened significantly; mechanism: distal vasodilation and core cooling; evidence scarce (Haghayegh 2019) [A]. Press summary: about 10 min faster sleep onset [S].
- **Rule thresholds:** 40-42.5 °C, ≥10 min, ending 1-2 h before bed.
- **Population:** mixed, many older adults.
- **Source:** Haghayegh S et al. Sleep Med Rev 2019;46:124-135. https://pubmed.ncbi.nlm.nih.gov/31102877/ [A]
- **Confidence:** low-medium.
- **Caveats:** in Israeli summer a hot shower may conflict with room cooling.
- **App measurement:** evening quick tag "warm shower HH:MM"; SOL proxy.

### B7. Screens and blue light
- **Effect:** NSF consensus (16 experts, 35 experimental studies): consensus that screen use impairs sleep in children/adolescents; NO consensus for adults that screen use in general, or the light from pre-sleep screens, impairs sleep; consensus that behavioural strategies can reduce negative effects (Hartstein 2024) [A + S]. Cochrane (17 RCTs): blue-light-filtering lenses' effects on sleep are "indeterminate" / inconclusive (Singh 2023) [S].
- **Rule thresholds:** no screen curfew rule is evidence-based for adults; focus on content arousal, displacement of sleep time, and overall evening light (B4).
- **Sources:** Hartstein LE et al. Sleep Health 2024;10(4):373-384. https://pubmed.ncbi.nlm.nih.gov/38806392/ [A]. Singh S et al. Cochrane Database Syst Rev 2023, CD013244.pub2: https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD013244.pub2/full [S]
- **Confidence:** medium (that evidence is weak).
- **App measurement:** optional "phone in bed" tag; bedtime procrastination = lights-out later than planned.

### B8. Wind-down: mindfulness, slow breathing, yoga nidra, NSDR
- **Effect:** mindfulness: 18 RCTs (1,654 participants): no difference vs specific active controls (ES 0.03, low strength); improved sleep quality vs non-specific controls (ES 0.33 post, 0.54 follow-up, moderate strength) (Rusch 2019) [A]. Slow breathing: 20 participants, 30 min pre-sleep slow breathing vs music: both increased HRV acutely; "neither condition had robust effects on sleep quality" (Kuula 2020, pilot) [A]. Yoga nidra: 5 studies; RCTs non-significant (PSQI SMD -1.04, n=181; ISI SMD -1.00, n=99); "very low certainty" (Singh 2026) [A]. NSDR: no sleep RCT located [U].
- **Rule thresholds:** offer as optional wind-down when pre-sleep arousal is the reported problem; do not promise sleep gains.
- **Sources:** Rusch HL et al. Ann N Y Acad Sci 2019;1445(1):5-16. https://pubmed.ncbi.nlm.nih.gov/30575050/ [A]. Kuula L et al. Sci Rep 2020;10:7427. https://pubmed.ncbi.nlm.nih.gov/32366866/ [A]. Singh S et al. Sleep Breath 2026;30(2):144. https://pubmed.ncbi.nlm.nih.gov/42043659/ [A]
- **Confidence:** low.
- **App measurement:** tag "wind-down practice"; subjective sleep quality + SOL proxy.

### B9. Naps
- **Effect:** Mayo Clinic: 20-30 min naps; napping after 15:00 can make night sleep harder (Mayo) [S]. Review of nap length/time-of-day benefits (Milner and Cote 2009) [A record]; search text: 10-min afternoon nap was the most effective length in the reviewed work; frequent, long or late naps linked to poorer night sleep in some groups, no impact in others [S].
- **Rule thresholds:** nap ≤30 min, ending before 15:00; if his night SOL is long, no naps during a test block.
- **Sources:** Mayo Clinic, Napping: https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/napping/art-20048319 [S]. Milner CE, Cote KA. J Sleep Res 2009;18(2):272-81. https://pubmed.ncbi.nlm.nih.gov/19645971/ [A] (seminal, older)
- **Confidence:** low-medium.
- **App measurement:** daytime sleep bouts detected by wearable (detection of naps is a known weak point, 6.6).

### B10. Noise
- **Effect:** WHO Europe 2018 guideline: night-time road-traffic exposure guideline 45 dB Lnight (strong recommendation to reduce above guideline levels) [S].
- **Source:** WHO Environmental Noise Guidelines for the European Region 2018: https://www.who.int/europe/publications/i/item/9789289053563 [S]
- **Confidence:** medium (population level); low for an individual.
- **App measurement:** optional phone dB reading or "noisy night" tag.

### B11. Partner and pets
- **Effect:** 12 young couples, dual PSG, 4 nights: bed-sharing increased REM (about 10%) and made it less fragmented; sleep-stage synchronization (Drews 2020) [S]. 40 adults with dogs, 7 nights actigraphy: human SE lower when the dog was on the bed vs in the room (p = .003) (Patel 2017) [S].
- **Sources:** Drews HJ et al. Front Psychiatry 2020, doi 10.3389/fpsyt.2020.00583: https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2020.00583/full [S]. Patel SI et al. Mayo Clin Proc 2017: https://www.mayoclinicproceedings.org/article/S0025-6196(17)30486-X/abstract [S]
- **Confidence:** low.
- **App measurement:** optional tags (partner away, pet on bed, partner snoring).

### B12. Nicotine and cannabis
- **Effect:** PSG, 44 smokers vs 44 matched never-smokers: smokers had shorter sleep period, longer SOL, higher REM density, more apneas and leg movements; cotinine correlated negatively with SWS (Jaehne 2012) [A]. Evening nicotine (within 4 h) associated with lower SE and higher WASO that night (Spadola 2019) [S]. Cannabis: 18 PSG studies (9 meta-analysed): no consistent change in duration, latency, wake, efficiency or staging; withdrawal consistently disturbs sleep (shorter TST, longer SOL, REM rebound) (Velzeboer 2025) [A]; AASM: medical cannabis should not be used to treat OSA (2018) [S].
- **Rule thresholds:** no nicotine within 4 h of bed; cannabis not recommended as a sleep aid.
- **Sources:** Jaehne A et al. Sleep Med 2012;13(10):1286-92. https://pubmed.ncbi.nlm.nih.gov/23026505/ [A] (older). Velzeboer R et al. Sleep Med Rev 2025;84:102164. https://pubmed.ncbi.nlm.nih.gov/40967124/ [A]. AASM position statement 2018: https://pubmed.ncbi.nlm.nih.gov/29609727/ [S]
- **Confidence:** medium (nicotine); medium (cannabis: no benefit shown, withdrawal harm).
- **App measurement:** quick-log categories only if he reports use.

### B13. Evidence strength summary (behaviour and environment)

| Lever | Strength | Key basis |
|---|---|---|
| CBT-I for insomnia | Strong | AASM 2021, ESRS 2023, Trauer 2015 |
| Regular timing / fixed wake time | Moderate (consensus + large cohorts) | Sletten 2023, Windred 2024 |
| Daytime/morning light | Moderate (direction) / weak (dose) | Burns 2021, Brown 2022 |
| Evening light dimming, dark bedroom | Moderate (physiology) / weak (sleep outcome size) | Phillips 2019, Didikoglu 2023, Brown 2022 |
| Bedroom temperature | Moderate | Baniassadi 2023, Minor 2022 |
| Warm bath/shower 1-2 h pre-bed | Weak-moderate | Haghayegh 2019 |
| Stimulus control, relaxation (single) | Conditional | AASM 2021 |
| Sleep hygiene alone | Conditional against (as treatment) | AASM 2021 |
| Mindfulness | Weak (not better than active controls) | Rusch 2019 |
| Slow breathing, yoga nidra, NSDR | Very weak | Kuula 2020, Singh 2026 |
| Screens / blue-light glasses (adults) | No consensus / inconclusive | Hartstein 2024, Singh 2023 |
| Naps rules | Weak (expert advice) | Mayo, Milner 2009 |
| Noise | Moderate at population level | WHO 2018 |
| Nicotine (evening) | Moderate | Jaehne 2012, Spadola 2019 |
| Cannabis as sleep aid | No benefit shown; withdrawal harms | Velzeboer 2025 |

---

## 6. Prioritization for this user and the N-of-1 engine

### 6.1 Pre-checks before any lever (not lifestyle levers)
1. **Sleep opportunity:** if average TST < 7 h because of schedule, extending time in bed comes before any fine-tuning (CDC/AASM 7+ h [A]).
2. **OSA red flags:** snoring, gasping, witnessed apneas, unrefreshing sleep: advise medical evaluation; alcohol raises AHI by about 7 events/h in snorers/OSA (Kolla 2018 [A]).
3. **Insomnia pattern:** chronic difficulty ≥3 nights/week: point to CBT-I (B1) rather than lifestyle experiments.
4. **Statin:** do not attribute sleep complaints to the statin by default. CTT Collaboration meta-analysis of double-blind RCTs: blinded data "do not support causal relationships between statin therapy and most of the conditions (including ... sleep disturbance ...)" listed in labels. Lancet 2026;407(10529):689-703. https://pubmed.ncbi.nlm.nih.gov/41655587/ [A]. Medication questions belong to the clinical track.

### 6.2 Ranked impact list (conditional on exposure in his logs)
Rank assumes the exposure occurs at least weekly; if a lever's exposure is absent in his data, skip it and move down. Expected effects are the best available numbers from the cited populations, not predictions for him.

| # | Lever (one change) | Trigger in his data | Expected effect if exposure removed | Confidence | Primary metric |
|---|---|---|---|---|---|
| 1 | Alcohol: alcohol-free nights; if drinking ≤1 drink, last sip ≥4 h pre-bed | any alcohol log, especially ≥17 g (0.25 g/kg) or within 4 h of bed | per drink above usual: RHR +2.4 bpm, HRV -3.3 ms (men, A4); recovery -9 to -39 points by dose (A3); REM loss from ≤0.5 g/kg (A1); AHI +2.3/h (A6) | High (direction), medium (size) | nightly RHR, HRV |
| 2 | Hard sessions end ≥4 h before sleep onset | RPE ≥7 ending <4 h before onset | max vs light strain ending 2 h pre-sleep: onset +36 min, TST -22 min, RHR +3.9 bpm, HRV -8.3 (E6) | Medium-high | sleep onset, RHR, HRV |
| 3 | Caffeine dose-scaled cutoff (C8) | residual >50 mg at bed [U], or ≥200 mg within 13 h | lab pooled: TST -45 min, SOL +9, WASO +12, deep -11 min (C1); 100 mg ≥4 h pre-bed: no effect in young men (C2) | Medium (size depends on habit) | WASO, TST, SOL proxy |
| 4 | Fixed wake time + ≥7.5 h in bed | wake SD >30-45 min [U] or TST <7 h ≥3 nights/week | nightly effect not quantified; SRI strongly linked to mortality (B2) | Medium | SRI, TST |
| 5 | Dinner ends ≥3 h (ideally ≥4 h) before bed | last meal photo <3 h before onset | near-bed eating: awakenings OR 1.43 (YA), WASO OR 2.64 for <1 h (men); PSQI about -0.7 to -0.85 with longer gaps (OA); glucose AUC +8.3% late vs early (M1, M2) | Low-medium (sleep), medium (glucose) | WASO, HRV |
| 6 | Light: ≥30 min morning outdoors + dim evenings (<10 melanopic lux from bed - 3 h) | few outdoor minutes; bright evenings | per outdoor hour insomnia OR 0.94-0.97, easier waking OR 1.46-1.49 (B3); brighter pre-bed light -> longer SOL (B4) | Medium (direction), low (size) | sleep onset time, SOL proxy |
| 7 | Bedroom 20-25 °C | overnight outdoor low ≥25 °C without AC | SE -5 to -10% from 25 to 30 °C (OA); +3.5 pp risk of <7 h above 25 °C (B5) | Medium-low | SE, WASO |
| 8 | Training-load recovery rule (E10) | recovery flag | overreaching: SE -2.0% (E9), TST -7.9% in triathletes | Low-medium | 7-day HRV, RHR, SE |
| 9 | Diet quality (fibre up; sugar, saturated fat, UPF down) | low-fibre / UPF-heavy photos | more SWS with fibre, less with saturated fat; insomnia OR 1.09 per +10% UPF in men (M4) | Low (sleep), high as prediabetes advice | WASO, subjective quality |
| 10 | Warm shower 40-42.5 °C, ≥10 min, 1-2 h pre-bed | long SOL | SOL about -10 min (B6, press figure) | Low-medium | SOL proxy |

Conditional add-ons (only if present): naps late or long (B9), evening nicotine (B12), noise/partner/pet (B10-B11), nocturia (M9), pre-sleep protein test (M6).

### 6.3 Rule set v1 for the app (machine-usable)
- **R-EX-LATE:** RPE ≥7 AND workout_end > habitual_onset - 4 h -> flag "late hard session" (E6). RPE ≥7 AND end within 1 h -> strong flag (E4).
- **R-EX-OK:** RPE ≤5 ending ≥1-2 h before bed -> no flag (E4, E5).
- **R-EX-GLU:** suggest light walk within ~30 min after meals [U timing; direction from Engeroff 2023].
- **R-CAF-DOSE:** single dose ≥200 mg after bed - 13 h -> flag; ≤100 mg after bed - 9 h -> soft flag (C1, C2). Daily total >400 mg -> flag.
- **R-CAF-RES:** residual_at_bed >50 mg (t_half default 5 h) -> flag [U threshold] (C8).
- **R-ALC-ANY:** any alcohol -> tag night "alcohol"; ≥0.25 g/kg -> expect HRV drop; last drink <4 h before bed -> flag (A3, A4, A7).
- **R-MEAL-GAP:** last meal <3 h before onset -> flag; <1 h -> strong flag (M1); prediabetes preference ≥4 h (M2).
- **R-SCHED:** 7-day wake-time SD >45 min or SRI below his 30-day median -> flag [U thresholds] (B2).
- **R-LIGHT:** no morning outdoor minutes logged for ≥3 of last 7 days -> suggest (B3).
- **R-HEAT:** overnight outdoor low ≥25 °C and "no AC" -> flag (B5).
- **R-NAP:** nap >30 min or ending after 15:00 -> flag (B9).
- **R-REC:** multi-signal recovery flag (E10) with explainer exclusion.
- **R-EXPLAIN:** before calling a night "bad", check explainers in order: alcohol, late hard session, caffeine residual, late meal, heat, illness/travel, schedule shift.

### 6.4 N-of-1 protocol template (one lever at a time)
1. **Choose one lever** from 6.2 with real exposure in his last 4 weeks. Define exposure precisely (e.g., "last caffeine ≥9 h before 23:00").
2. **Pre-specify the primary outcome** matched to mechanism: alcohol -> nightly RHR (most reliable wrist signal, A5); late training -> sleep onset time and HRV; caffeine -> WASO/awake minutes and TST (SOL if lights-out is logged); meal timing -> WASO and HRV; light -> sleep onset time and SOL. Secondary: TST, SE, subjective quality (1-5), morning energy.
3. **Baseline:** 14 nights of normal life (covers 2 weekends). Consumer-tracker data need 3 nights for "good" and 5 for "very good" reliability of a weekly TST mean, weekday-only 2-3 nights, and 5-6 nights for weekly variability (1,041 adults, 107,000+ Fitbit nights; Lau 2022 [A], https://pubmed.ncbi.nlm.nih.gov/37193398/). Use baseline to compute his SD per metric.
4. **Design:** randomized ABAB (or BAAB/ABBA counterbalanced) blocks of 7 nights, at least 4 blocks (28 nights); extend to 6-8 blocks if the effect is small. Replicated, randomized crossovers within one person are the core of N-of-1 methodology (Konigorski 2026 [A], https://pubmed.ncbi.nlm.nih.gov/42318774/; CENT reporting guideline, Vohra 2015 [A], https://pubmed.ncbi.nlm.nih.gov/25976398/; AHRQ user's guide 2014 [S], https://effectivehealthcare.ahrq.gov/products/n-1-trials/research-2014-5).
5. **Washout:** for acute levers (alcohol, caffeine timing, late training, meal timing) carryover is about 1 night (RHR normalized quickly after alcohol, A5): drop the first night of each block (analytic washout: carryover handled by "eliminating, discarding, or downweighting observations taken at the beginning of a new treatment period"; text seen in search results for N-of-1 design sources including AHRQ 2014 ch. 4, exact source page not opened [S]). For circadian levers (light, fixed wake time, morning training) drop the first 2-3 nights [U].
6. **Alternative for exposure levers:** for alcohol, caffeine and late training the app can first run a passive within-person analysis of logged exposures (as in A4 and E6), then confirm with a planned block design.
7. **Minimum data:** ≥80% valid nights per block [U]; exposure logged same day; ≥10 analysable nights per condition.
8. **Detectable effect (standard approximation, independent nights, 80% power, two-sided 0.05):** MDE ≈ 2.8 x SD x sqrt(2/n). Illustration only: if his TST SD = 40 min and n = 14 per arm, MDE ≈ 42 min; if RHR SD = 2 bpm, MDE ≈ 2.1 bpm (calculation; replace with his baseline SD; autocorrelation reduces effective n).
9. **Decision rule [U]:** adopt the change if the primary outcome improves by more than 0.5 of his baseline SD (the smallest-worthwhile-change convention used in HRV monitoring, Manresa-Rocamora 2021 [A]) AND the direction is the same in at least 3 of 4 A/B pairs; otherwise report "no detectable benefit; keep only if cheap and liked".
10. **Precedent:** an automated self-experimentation sleep system (SleepCoacher) generated personalized recommendations from sensor data and short experiments; participants' sleep improved as adherence increased (Daskalova 2016 UIST, https://dx.doi.org/10.1145/2984511.2984534 [S]).

### 6.5 Common pitfalls (and guards)
- **Day-of-week effects:** weekday and weekend sleep differ (weekday-only estimates stabilise faster, Lau 2022 [A]); keep blocks as whole weeks or balance weekdays across conditions.
- **Regression to the mean:** starting an experiment after an unusually bad week guarantees apparent improvement; "RTM ... should always be considered as a possible cause of an observed change" (Barnett AG et al. Int J Epidemiol 2005;34(1):215-220, https://pubmed.ncbi.nlm.nih.gov/15333621/ [S]). Guard: fixed baseline, randomized order, never start on a trough.
- **Confounders that move HRV/RHR more than the lever:** alcohol (A4), late hard training (E6), hot nights (B5), illness, travel, holidays; log and exclude or model them.
- **Clock change:** Israel returns to standard time Sunday 2026-10-25 (02:00 -> 01:00) per IANA tz database; do not let blocks straddle it; re-baseline 3-4 nights after.
- **Measurement error:** wrist trackers vs PSG (24 studies, 798 people): pooled mean differences as reported were TST -16.9 min, SE -4.7%, SOL +2.6 min, WASO +13.3 min, with no significant WASO difference for Fitbit (Lee 2025 [A], https://pubmed.ncbi.nlm.nih.gov/39484805/). The abstract does not state the subtraction order; the most likely reading (PSG minus device) means devices overcount sleep and undercount wake, consistent with low wake specificity in Chinoy 2021 [inference]. Sleep staging is inconsistent; specificity for wake low-to-medium; worse on disrupted nights (Chinoy 2021 [A], https://pubmed.ncbi.nlm.nih.gov/33378539/). Consumer devices beat actigraphy for sleep/wake but misclassify wake, struggle outside the main sleep bout, and are unvalidated in many subgroups (de Zambotti 2024, Sleep 47(4):zsad325 [S], https://academic.oup.com/sleep/article/47/4/zsad325/7501518). Fitbit Air itself: no validation study located [U].
- **Expectancy:** subjective outcomes shift with belief (mindfulness beat non-specific but not specific controls, B8); prefer objective primary outcomes.
- **Multiple testing:** one primary outcome per experiment; treat the rest as exploratory.
- **Co-interventions:** change one thing at a time; keep caffeine total constant when testing timing (C8); keep training volume constant when testing timing.
- **Firmware or algorithm updates** can shift metrics overnight [U, practical]; log app/device versions.

### 6.6 Wearable-specific interpretation rules
- Trust order for a wrist device (from 6.5 sources): RHR and HRV trends > TST and sleep timing > WASO > SOL > stage minutes.
- Do not coach on "deep/REM targets"; use stage data only as weak secondary evidence (Chinoy 2021).
- Expect known signatures: alcohol -> RHR up, HRV down (A4, A5); late hard training -> RHR up, HRV down, later onset (E6); hot night -> shorter TST (B5).

---

## 7. Things NOT to say (myths and overclaims)

1. "A drink helps you sleep." It shortens SOL mainly at high doses, then fragments the second half of the night and suppresses REM from about 2 drinks (Ebrahim 2013; Gardiner 2025).
2. "One glass of wine is harmless for sleep." Low intake (≤0.25 g/kg) already cut HRV-based recovery by 9.3 points (Pietilä 2018); each drink above usual raises RHR about 2.4 bpm in men (Grosicki 2026).
3. "Never exercise in the evening." False; meta-analyses show no harm overall and even more SWS; the problem is hard sessions ending within about 4 h (Stutz 2019; Frimpong 2021; Leota 2025).
4. "Caffeine is fine because you fall asleep easily." Caffeine can cut deep sleep and TST without the person noticing latency changes (Gardiner 2023; Robillard 2015).
5. "No coffee after 14:00 works for everyone." Dose and personal half-life (1.5-9.5 h) matter; a fixed clock time is a default, not a law (IOM; Gardiner 2025).
6. "Blue-light glasses / night mode fix sleep." Evidence is inconclusive in adults (Cochrane 2023; NSF 2024 no consensus for adults).
7. "Your tracker shows too little deep sleep / REM, fix it." Wrist staging is inconsistent vs PSG (Chinoy 2021; de Zambotti 2024).
8. "HRV dropped, so you are overtrained." A single night's HRV is dominated by alcohol, heat, late exercise; even overreaching can raise resting HRV (Bellenger 2016); overtraining is a diagnosis of exclusion (Meeusen 2013).
9. "Your statin is ruining your sleep." Blinded RCT data do not support a causal link with sleep disturbance (CTT 2026).
10. "Eat carbs at night to fall asleep." Evidence is one small single-meal study in young men (Afaghi 2007); in prediabetes late carbohydrate raises nocturnal glucose (Gu 2020; Garaulet 2022).
11. "Casein before bed improves sleep." Minimal evidence; casein did not beat control in the only sleep trial found (Aussieker 2026); muscle benefits shown in young, not older men (Reis 2021).
12. "The Mediterranean diet will fix your sleep." Evidence is observational only (Arab 2025); recommend it for prediabetes, not as a sleep cure.
13. "Sleep hygiene tips treat insomnia." AASM advises against sleep hygiene as a stand-alone treatment; CBT-I is the treatment (Edinger 2021).
14. "NSDR / yoga nidra can replace sleep." No evidence; yoga nidra data are very low certainty (Singh 2026).
15. "One bad night means something." Reliable weekly means need about 3-5 nights (Lau 2022); decisions need blocks, not nights.
16. Avoid numbers without sources: "1 drink per hour clearance", "stop fluids 2 h before bed", "get out of bed after 20 min", "18-19 °C is ideal" are all [U] in this file.

---

## 8. Conflicting evidence (how to handle in coaching)

1. **Evening exercise: lab meta-analyses vs big wearable data.** Stutz 2019 and Frimpong 2021 (small lab samples) find no meaningful harm, even +1.3 pp SWS; Leota 2025 (4 million nights) finds dose-dependent harm for high strain ending <4 h pre-sleep. Reconciliation: harm scales with intensity x proximity; small trials used moderate sessions and could not detect small effects. Coach with the intensity-scaled buffer (R-EX-LATE) and let his N-of-1 decide.
2. **Exercise timing for glucose vs for sleep.** Afternoon/evening training improves glucose (Savikj 2019; Moholdt 2021; van der Velde 2023; Schipper 2026) while late hard training worsens sleep (Leota 2025) and morning training advances sleep timing (Saidi 2021; Shen 2025). Sweet spot: afternoon/early-evening hard sessions ending ≥4 h pre-bed, plus light post-meal walks.
3. **Who is more caffeine-sensitive, young or middle-aged?** Robillard 2015 (PSG, high doses): middle-aged more sensitive. Chang 2025 meta: young show broader disruption, possibly due to tolerance in habitual older drinkers. Coach: assume sensitivity until his data show otherwise.
4. **How late is 100 mg caffeine OK?** Gardiner 2025 RCT: no effect even 4 h pre-bed (young men); Gardiner 2023 meta: 8.8 h to avoid TST loss; EFSA: about 100 mg near bedtime can affect some. Use 9 h default, test down to 6 h.
5. **Wearable vs PSG signals of caffeine and alcohol.** Smartwatch studies found no sleep-duration or architecture change (Schlichtiger 2025; Strüven 2025) where PSG meta-analyses do (Gardiner 2023, 2025). Wrist devices miss architecture effects; rely on RHR/HRV and WASO, not stages.
6. **Carbohydrate at dinner.** High-GI meal 4 h pre-bed shortened SOL (Afaghi 2007, young men) vs high-GI diets associated with insomnia (Gangwisch 2020, postmenopausal women) vs late carbohydrate impairing glucose tolerance (Garaulet 2022). For prediabetes, glucose wins; timing (early) reconciles both.
7. **Eating near bedtime.** Eating <1 h pre-bed associated with longer sleep but more WASO (Iao 2022); pre-sleep protein literature feeds 30 min pre-bed without sleep harm and whey even shortened SOL (Aussieker 2026, n=9). Treat a small protein drink differently from a meal, and test.
8. **HRV in overreaching.** Plews 2012 case: falling 7-day lnRMSSD toward NFOR; Bellenger 2016 meta: resting RMSSD rose slightly in overreaching. Use multi-signal rules, never HRV alone.
9. **Resistance vs combined training.** Kovacevic 2018: adding aerobic attenuates RT sleep benefit; Wang 2025 NMA: combined (SMD -1.11) ≈ resistance (-1.12). For him (already combined), no change indicated.
10. **Time-restricted eating.** Lima 2025: overall TRF worsened PSQI and TST, but non-Ramadan TRF showed no PSQI change and longer TST; de Sousa 2025: mostly no effect. Sleep-neutral if not religious fasting.
11. **Regularity vs catch-up sleep.** NSF 2023 says consistency matters AND weekend catch-up may help when weekday sleep is short. Coach: fix wake time first; allow limited catch-up only after short weeks.
12. **Alcohol age gradient.** Grosicki 2026: effects larger in younger adults; Pietilä 2018: stronger in younger and in those with low sleeping HR (fit people). For a fit 47-year-old, expect at least average sensitivity.

---

## 9. Gaps and UNVERIFIED items (to resolve before hard-coding)

- Spicy food and sleep: no source opened.
- Specific stimulus-control time window (15-20 min), fluid cutoff (2 h), alcohol clearance (1 drink/h), optimal bedroom temperature for midlife men (only older-adult and global wearable data), morning light minimum duration, residual-caffeine threshold (50 mg), recovery-flag RHR threshold (+3 bpm), deload magnitude: all [U] heuristics.
- Brellenthin resistance-training numbers are conference data seen in search results [S].
- Drake 2013 magnitude (about 71 min at 6 h) is from a secondary summary [S].
- Haghayegh "about 10 min" SOL is a press figure [S].
- Fitbit Air validation vs PSG: none located [U].
- No study located that measured both glucose and sleep outcomes of exercise or meal timing in lean men with prediabetes.

---

## 10. Source index (year, URL, status)

Exercise: Kline 2021 Sleep Med Rev https://pubmed.ncbi.nlm.nih.gov/33934046/ [A]; Wang 2025 BMC Public Health https://pubmed.ncbi.nlm.nih.gov/40217183/ [A]; Kovacevic 2018 Sleep Med Rev https://pubmed.ncbi.nlm.nih.gov/28919335/ [A]; AHA news 2022 (Brellenthin) https://www.heart.org/en/news/2022/03/03/resistance-exercise-may-improve-sleep-more-than-aerobic-exercise [S]; Stutz 2019 Sports Med https://pubmed.ncbi.nlm.nih.gov/30374942/ [A]; Frimpong 2021 Sleep Med Rev https://pubmed.ncbi.nlm.nih.gov/34416428/ [A]; Leota 2025 Nat Commun https://pmc.ncbi.nlm.nih.gov/articles/PMC12000559/ [A]; Alley 2015 JSCR https://pubmed.ncbi.nlm.nih.gov/25426516/ [A]; Fairbrother 2014 VHRM https://pubmed.ncbi.nlm.nih.gov/25540588/ [A]; Saidi 2021 Chronobiol Int https://pubmed.ncbi.nlm.nih.gov/34128447/ [A]; Shen 2025 Sci Rep https://pubmed.ncbi.nlm.nih.gov/40419564/ [A]; Murphy 2024 PLoS One https://pubmed.ncbi.nlm.nih.gov/38809828/ [A]; Hausswirth 2014 MSSE https://pubmed.ncbi.nlm.nih.gov/24091995/ [A]; Meeusen 2013 MSSE https://pubmed.ncbi.nlm.nih.gov/23247672/ [A]; Bellenger 2016 Sports Med https://pubmed.ncbi.nlm.nih.gov/26888648/ [A]; Plews 2012 EJAP https://pubmed.ncbi.nlm.nih.gov/22367011/ [A]; Plews 2013 Sports Med https://pubmed.ncbi.nlm.nih.gov/23852425/ [A]; Manresa-Rocamora 2021 IJERPH https://pubmed.ncbi.nlm.nih.gov/34639599/ [A]; Foster 2001 JSCR https://pubmed.ncbi.nlm.nih.gov/11708692/ [A]; Schipper 2026 JDMD https://pubmed.ncbi.nlm.nih.gov/42220558/ [A]; van der Velde 2023 Diabetologia https://pubmed.ncbi.nlm.nih.gov/36316401/ [A]; Savikj 2019 Diabetologia https://pubmed.ncbi.nlm.nih.gov/30426166/ [A]; Moholdt 2021 Diabetologia https://pubmed.ncbi.nlm.nih.gov/34009435/ [A]; Engeroff 2023 Sports Med https://pubmed.ncbi.nlm.nih.gov/36715875/ [A]; ADA Standards of Care 2026 Sec. 3 https://diabetesjournals.org/care/article/49/Supplement_1/S50/163924/ [S].

Caffeine: Gardiner 2023 Sleep Med Rev https://pubmed.ncbi.nlm.nih.gov/36870101/ [A]; Gardiner 2025 Sleep https://pubmed.ncbi.nlm.nih.gov/39377163/ [A]; Drake 2013 JCSM https://pubmed.ncbi.nlm.nih.gov/24235903/ [A]; Robillard 2015 J Psychopharmacol https://pubmed.ncbi.nlm.nih.gov/25759402/ [A]; Chang 2025 Sleep Med https://pubmed.ncbi.nlm.nih.gov/41124973/ [A]; Burke 2015 Sci Transl Med https://pubmed.ncbi.nlm.nih.gov/26378246/ [A]; Nehlig 2018 Pharmacol Rev https://pubmed.ncbi.nlm.nih.gov/29514871/ [A]; IOM 2001 NCBI Bookshelf https://www.ncbi.nlm.nih.gov/books/NBK223801/ [S]; EFSA 2015 via EUFIC https://www.eufic.org/en/whats-in-food/article/efsa-opinion-on-the-safety-of-caffeine [A]; FDA 2024 https://www.fda.gov/consumers/consumer-updates/spilling-beans-how-much-caffeine-too-much [A]; Schlichtiger 2025 Nutrients https://doi.org/10.3390/nu17091503 [S]; Spadola 2019 Sleep https://pubmed.ncbi.nlm.nih.gov/31386152/ [S].

Alcohol: Gardiner 2025 Sleep Med Rev https://pubmed.ncbi.nlm.nih.gov/39631226/ [A]; Ebrahim 2013 ACER https://pubmed.ncbi.nlm.nih.gov/23347102/ [A]; Pietilä 2018 JMIR Ment Health https://pubmed.ncbi.nlm.nih.gov/29549064/ [A]; Grosicki 2026 PLOS Digit Health https://journals.plos.org/digitalhealth/article?id=10.1371%2Fjournal.pdig.0001284 [A]; Strüven 2025 Nutrients https://pubmed.ncbi.nlm.nih.gov/40362779/ [A]; Kolla 2018 Sleep Med Rev https://pubmed.ncbi.nlm.nih.gov/30017492/ [A]; Simou 2018 Sleep Med https://pubmed.ncbi.nlm.nih.gov/29458744/ [A]; NIAAA standard drink https://www.niaaa.nih.gov/alcohols-effects-health/what-standard-drink [A].

Meals: Chung 2020 IJERPH https://pubmed.ncbi.nlm.nih.gov/32295235/ [A]; Iao 2022 BJN https://pubmed.ncbi.nlm.nih.gov/34511160/ [A]; Chong 2026 Clin Nutr https://pubmed.ncbi.nlm.nih.gov/41780086/ [A/S]; Yan 2024 PLoS One https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0308172 [A]; Crispim 2011 JCSM https://pubmed.ncbi.nlm.nih.gov/22171206/ [A]; Gu 2020 JCEM https://pubmed.ncbi.nlm.nih.gov/32525525/ [A/S]; Garaulet 2022 Diabetes Care https://pubmed.ncbi.nlm.nih.gov/35015083/ [A/S]; Afaghi 2007 AJCN https://pubmed.ncbi.nlm.nih.gov/17284739/ [A]; Gangwisch 2020 AJCN https://pubmed.ncbi.nlm.nih.gov/31828298/ [A]; St-Onge 2016 JCSM https://pubmed.ncbi.nlm.nih.gov/26156950/ [A]; Brandão 2023 Obesity https://pubmed.ncbi.nlm.nih.gov/37245331/ [A]; Duquenne 2024 JAND https://pubmed.ncbi.nlm.nih.gov/38423510/ [A]; Arab 2025 Sleep Med Rev https://pubmed.ncbi.nlm.nih.gov/40081182/ [A]; Reis 2021 JSAMS https://pubmed.ncbi.nlm.nih.gov/32811763/ [A]; Aussieker 2026 IJSNEM https://pubmed.ncbi.nlm.nih.gov/42413910/ [A]; Sutanto 2022 Nutr Rev https://pubmed.ncbi.nlm.nih.gov/33942088/ [A]; Lima 2025 Chronobiol Int https://pubmed.ncbi.nlm.nih.gov/41208478/ [A]; de Sousa 2025 Nutr Rev https://pubmed.ncbi.nlm.nih.gov/40257510/ [A]; Everaert 2019 Neurourol Urodyn https://pubmed.ncbi.nlm.nih.gov/30779378/ [A]; NICE CG97 https://www.nice.org.uk/guidance/cg97 [S].

Behaviour/environment: Edinger 2021 JCSM https://pubmed.ncbi.nlm.nih.gov/33164742/ and https://pubmed.ncbi.nlm.nih.gov/33164741/ [A]; Riemann 2023 J Sleep Res https://pubmed.ncbi.nlm.nih.gov/38016484/ [A]; Trauer 2015 Ann Intern Med https://pubmed.ncbi.nlm.nih.gov/26054060/ [A]; Sletten 2023 Sleep Health https://pubmed.ncbi.nlm.nih.gov/37684151/ [A]; Windred 2024 Sleep https://pubmed.ncbi.nlm.nih.gov/37738616/ [A]; CDC About Sleep https://www.cdc.gov/sleep/about/index.html [A]; Burns 2021 JAD https://pubmed.ncbi.nlm.nih.gov/34488088/ [A]; Brown 2022 PLoS Biol https://pubmed.ncbi.nlm.nih.gov/35298459/ [A/S]; He 2023 J Sleep Res https://pubmed.ncbi.nlm.nih.gov/36058557/ [A]; Didikoglu 2023 PNAS https://pubmed.ncbi.nlm.nih.gov/37812713/ [A]; Phillips 2019 PNAS https://pubmed.ncbi.nlm.nih.gov/31138694/ [A/S]; Windred 2024 Lancet Reg Health Eur https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(24)00110-8/fulltext [S]; Okamoto-Mizuno 2012 J Physiol Anthropol https://jphysiolanthropol.biomedcentral.com/articles/10.1186/1880-6805-31-14 [S]; Baniassadi 2023 Sci Total Environ https://pubmed.ncbi.nlm.nih.gov/37474050/ [A]; Minor 2022 One Earth https://www.cell.com/one-earth/fulltext/S2590-3322(22)00209-3 [S]; Haghayegh 2019 Sleep Med Rev https://pubmed.ncbi.nlm.nih.gov/31102877/ [A]; Hartstein 2024 Sleep Health https://pubmed.ncbi.nlm.nih.gov/38806392/ [A]; Singh 2023 Cochrane https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD013244.pub2/full [S]; Rusch 2019 Ann NY Acad Sci https://pubmed.ncbi.nlm.nih.gov/30575050/ [A]; Kuula 2020 Sci Rep https://pubmed.ncbi.nlm.nih.gov/32366866/ [A]; Singh 2026 Sleep Breath https://pubmed.ncbi.nlm.nih.gov/42043659/ [A]; Mayo Clinic napping https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/napping/art-20048319 [S]; Milner 2009 J Sleep Res https://pubmed.ncbi.nlm.nih.gov/19645971/ [A]; WHO 2018 noise https://www.who.int/europe/publications/i/item/9789289053563 [S]; Drews 2020 Front Psychiatry https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2020.00583/full [S]; Patel 2017 Mayo Clin Proc https://www.mayoclinicproceedings.org/article/S0025-6196(17)30486-X/abstract [S]; Jaehne 2012 Sleep Med https://pubmed.ncbi.nlm.nih.gov/23026505/ [A]; Velzeboer 2025 Sleep Med Rev https://pubmed.ncbi.nlm.nih.gov/40967124/ [A]; AASM 2018 cannabis/OSA https://pubmed.ncbi.nlm.nih.gov/29609727/ [S]; CTT 2026 Lancet https://pubmed.ncbi.nlm.nih.gov/41655587/ [A].

Measurement and N-of-1: Lee 2025 JCSM https://pubmed.ncbi.nlm.nih.gov/39484805/ [A]; Chinoy 2021 Sleep https://pubmed.ncbi.nlm.nih.gov/33378539/ [A]; de Zambotti 2024 Sleep https://academic.oup.com/sleep/article/47/4/zsad325/7501518 [S]; Lau 2022 Sleep Adv https://pubmed.ncbi.nlm.nih.gov/37193398/ [A]; Konigorski 2026 Exp Physiol https://pubmed.ncbi.nlm.nih.gov/42318774/ [A]; Vohra 2015 BMJ (CENT) https://pubmed.ncbi.nlm.nih.gov/25976398/ [A]; AHRQ N-of-1 guide 2014 https://effectivehealthcare.ahrq.gov/products/n-1-trials/research-2014-5 [S]; Barnett 2005 IJE https://pubmed.ncbi.nlm.nih.gov/15333621/ [S]; Daskalova 2016 SleepCoacher https://dx.doi.org/10.1145/2984511.2984534 [S]; IANA tz database (Asia/Jerusalem, zdump run locally 2026-09-29).
