# D2: YouTube explainers for the sleep-coach "Why?" library (v1)

As of 2026-09-29. Topics 15 to 30. Audience: one Israeli man, 47, lean, trains 4x a week (weights and cardio), on a statin, prediabetes. Language tags: en / he. Order inside each topic is best first.

## How this file was verified

- Every URL listed was checked through the YouTube oEmbed endpoint with WebFetch (`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<VIDEO_ID>&format=json`). All returned a title and author that match the topic.
- Exact title and channel strings are copied from the raw oEmbed JSON, fetched separately by script, because the WebFetch summarizer sometimes garbled Hebrew text and dropped quote marks. Only edits: trailing spaces trimmed, and one en dash in one title replaced with a hyphen (flagged in that entry).
- Video IDs came from YouTube search result pages; none were guessed.
- Content checks: I read YouTube captions (manual where available, otherwise auto-captions) for most videos. Each entry says how its content was checked; entries marked 'description only' had no captions.
- Videos whose oEmbed returned HTTP 401 (embedding disabled) were dropped per the rule; see the dropped list.
- 'official chapters' come from the video description. 'auto-caption cues' are my own approximate locations from auto-captions and are NOT official chapters; treat them as hints.
- Hebrew titles are exact oEmbed strings; the English gloss is my translation.
- Screen applied: prefer hospital, university, health agency, professional society; then physician-scientists in their own field; then evidence-based communicators who cite studies. Sponsorship or commercial angles are recorded in each credibility note. For the statin topic, anything that advises stopping a statin was excluded.

## Topics

### topic 15 | cbt_i_basics | insomnia and CBT-I: stimulus control, sleep restriction, why it works
- coverage: 3 videos (2 en, 1 he). Strongest mechanism explanations: Grandner (short) and Posner (long). Hebrew item is content-unverified (no captions).

#### 15.1
- title: Stimulus control and sleep restriction therapy: reprogramming the brain to treat insomnia
- channel: VJNeurology
- url: https://www.youtube.com/watch?v=YESUi8EM-k4
- language: en
- length / published: 4:55 / 2026-06-30
- speaker and credentials: Michael Grandner, PhD, University of Arizona (per description); interview recorded at the 40th APSS meeting, Baltimore.
- why it fits: Explains conditioned arousal and why stimulus control plus sleep restriction are the behavioral core of CBT-I, in under 5 minutes.
- credibility note: Researcher speaking in his own field. Channel is VJNeurology, an independent open-access video journal aimed at clinicians. Studies cited: none named. Sponsorship or commercial angle: none seen (transcript read).
- caveat: Very brief and clinician-oriented; it does not explain how to set a sleep window safely, so do not present it as a do-it-yourself protocol.

#### 15.2
- title: CBT-I: The First-Line Treatment for Chronic Insomnia with Dr. Donn Posner (Part 1 of 2)
- channel: The Carlat Psychiatry Report
- url: https://www.youtube.com/watch?v=zZWx4vp1IM4
- language: en
- length / published: 27:30 / 2026-08-30
- speaker and credentials: Dr. Donn Posner: adjunct clinical associate professor of psychiatry and behavioral sciences at Stanford, founder of Sleepwell Consultants, 25 years directing behavioral sleep medicine at Lifespan Sleep Disorders Center (per description).
- why it fits: Best mechanism walk-through: sleep restriction targets homeostatic sleep drive, stimulus control targets conditioned arousal, the sleep diary is the clinician's 'X-ray', and CBT-I works even alongside depression, anxiety, PTSD or pain.
- credibility note: Senior clinician-educator. The Carlat Psychiatry Report sells newsletters, books and CME and states it takes no corporate funding. General evidence statements only, no specific studies named; no sponsor read in the transcript.
- caveat: 27 minutes and clinician-facing (assumes a trained therapist runs the protocol); he stresses the protocol flexes per patient, so there is no fixed recipe.

#### 15.3
- title: ד"ר עמית שי גרין - סובלים מנדודי שינה? כמה שינויים התנהגותיים קטנים יכולים לעזור
- title_en_gloss (my translation): Dr. Amit Shay Green - suffering from insomnia? A few small behavioral changes can help
- channel: אסותא מרכזים רפואיים
- url: https://www.youtube.com/watch?v=W0dWjFR7uAQ
- language: he
- length / published: 21:46 / 2022-12-01
- speaker and credentials: Dr. Amit Shay Green, psychologist and sleep specialist, sleep unit of Assuta Medical Centers (per Assuta description).
- why it fits: Israeli sleep psychologist busting myths about sleep disorders, behavioral treatment and sleeping pills, in Hebrew (matches the 'small behavioral changes' framing).
- credibility note: Institutional channel of a private hospital network, which may promote its own sleep clinics. No captions exist, so content is verified from title and description only; studies cited: unknown.
- caveat: Content could not be machine-checked. A transcript-checked lecture on CBT-I basics by what appears to be the same speaker is listed under alternates.

### topic 16 | sleep_apnea_signs_men | sleep apnea symptoms in men including lean men, when to get tested
- coverage: 3 videos (2 en, 1 he). Lean-men angle comes from Park (commercial) and, more softly, Bhat (anatomy risk factors) and Rosenzweig (facial structure).

#### 16.1
- title: Sleep Apnea 101: Symptoms, Risks & Solutions | Aparna Bhat, MD
- channel: Cleveland Clinic
- url: https://www.youtube.com/watch?v=zHhlDHpE_m0
- language: en
- length / published: 31:53 / 2026-06-24
- speaker and credentials: Aparna Bhat, MD, sleep medicine specialist, Cleveland Clinic (per description).
- why it fits: Hospital-produced conversation covering symptoms, causes and testing; the risk-factor section says jaw size, tongue and face shape can drive apnea alongside obesity, and it explains sleep study options.
- credibility note: Nonprofit academic medical center. No specific studies named. No sponsor or product angle. Transcript read.
- caveat: 32 minutes and not specific to lean men; the neck-size rule of thumb (17 inches or more for men) can falsely reassure a lean man, so use it with the anatomy points.
- official chapters (from description): 04:35 Symptoms and clues; 07:43 Serious health risks; 09:20 Causes and risk factors; 12:59 Testing and diagnosis; 15:17 Treatment basics

#### 16.2
- title: 5 Sleep Apnea Myths That Doctors Still Believe
- channel: Doctor Steven Park
- url: https://www.youtube.com/watch?v=YM-s689BrKs
- language: en
- length / published: 14:35 / 2024-01-05
- speaker and credentials: Steven Park, MD, ENT surgeon and sleep doctor (channel description).
- why it fits: Directly rebuts 'only overweight men with big necks who snore' and explains why thin people can have apnea, why a negative test can miss upper-airway resistance, and why apnea can occur without snoring.
- credibility note: Description lists studies (a Springer paper on OSA in non-obese patients, AASM hypopnea scoring notice, an AAFP symptom chart). Transcript read: he cites that about 20 percent of adults with sleep apnea are not obese. Commercial angle is strong: paid virtual coaching, a '90-Day Sleep Diet Course', books and Amazon links.
- caveat: Advocates his own theory (shrinking faces and airways) and his own views on test scoring; use it as a myth-busting perspective, not as diagnostic guidance.
- official chapters (from description): 01:20 Myth 1: only overweight men with big necks who snore; 01:58 Myth 2: must test positive; 04:16 Myth 3: no snoring means no apnea

#### 16.3
- title: מה שחשוב לדעת על דום נשימה בשינה- ד"ר אייל רוזנצוויג
- title_en_gloss (my translation): What is important to know about sleep apnea - Dr. Eyal Rosenzweig
- channel: מדיקו
- url: https://www.youtube.com/watch?v=DhEcbONz9do
- language: he
- length / published: 5:45 / 2025-11-02
- speaker and credentials: Dr. Eyal Rosenzweig, head of the sleep-disordered breathing and snoring clinic and senior physician in the ENT department, Ichilov (Tel Aviv Sourasky) hospital (per description).
- why it fits: Israeli hospital specialist lists symptoms (partner-reported snoring, tiredness, night awakenings), says risk includes obesity but also facial bone structure, and outlines CPAP, oral appliances and surgery.
- credibility note: Interview on the Medico health portal. No studies named; no sponsor seen. Transcript read.
- caveat: 6 minutes; no testing thresholds or when-to-test guidance, and the surgical section reflects an ENT perspective.

### topic 17 | statin_and_sleep | do statins affect sleep or cause muscle cramps, what to discuss with the doctor
- coverage: 3 videos, all en. No Hebrew video passed the 'no advice to stop statins' screen. Sleep effect is covered only by an educator-level video.

#### 17.1
- title: Statins, side effects and what they're used for
- channel: British Heart Foundation
- url: https://www.youtube.com/watch?v=o6Oi_N5jotg
- language: en
- length / published: 1:49 / 2026-06-04
- speaker and credentials: Narrated patient-information video by the British Heart Foundation (no individual named).
- why it fits: Says muscle pain is one possible side effect, to speak to your doctor who can reduce the dose or change the statin, and states it is important not to stop taking statins without speaking to your doctor first.
- credibility note: National heart charity. No studies named; no sponsor. Transcript read (manual captions).
- caveat: 1:49 overview; nothing on sleep or night cramps specifically.
- official chapters (from description): 00:48 Statins and side effects; 01:11 How long will I need to take a statin; 01:26 Are statins safe

#### 17.2
- title: Statins, cholesterol and side effects: do statins cause muscle problems?
- channel: Oxford Population Health
- url: https://www.youtube.com/watch?v=aVkmxckKW_4
- language: en
- length / published: 3:06 / 2022-08-29
- speaker and credentials: Oxford Population Health researchers (narrated; individuals not named in the description).
- why it fits: Uses pooled randomized-trial data (about 155,000 participants) to show muscle pain, cramps and weakness are common with placebo too, that fewer than 1 percent extra reports are due to the statin, and that real cases are mostly mild and early.
- credibility note: University of Oxford research unit describing large randomized trial data. No sponsor. Transcript read. It never advises stopping.
- caveat: Population-level reassurance ('over 90 percent not caused by the statins') should not be used to dismiss an individual's cramps; no sleep content.

#### 17.3
- title: Attention Statin Users - Statins Can Cause THESE Sleep Changes | & Why They Happen
- channel: JJ Medicine
- url: https://www.youtube.com/watch?v=wui7GXnsClU
- language: en
- length / published: 4:31 / 2025-07-25
- speaker and credentials: 'JJ' of JJ Medicine, a medical-education channel (creator credentials not stated in what I opened).
- why it fits: The only verified video on the sleep angle: vivid dreams, nightmares, night terrors and insomnia reported with lipophilic statins (simvastatin, atorvastatin, lovastatin) versus fewer with rosuvastatin or pravastatin.
- credibility note: One PubMed reference in the description (PMID 24435290). Channel uses affiliate links, Patreon and memberships and is exam-prep oriented. Transcript read; it does not advise stopping.
- caveat: Mechanisms are presented as hypotheses and the effect as uncommon; clickbait title. Never use it to justify stopping or switching a statin without the prescriber.

### topic 18 | prediabetes_sleep_glucose | how poor sleep affects insulin sensitivity and blood sugar
- coverage: 3 videos (2 en, 1 he). Researcher talk (Tasali) plus a short Hebrew professor summary and a hospital diabetes webinar. Lloyd-Jones (topic 26) also touches on sleep and insulin sensitivity.

#### 18.1
- title: 2019 IEEE EMBS Workshop - Esra Tasali on Sleep and metabolic health
- channel: IEEE EMBS
- url: https://www.youtube.com/watch?v=Q-wlgpvbTC8
- language: en
- length / published: 32:16 / 2022-01-19
- speaker and credentials: Esra Tasali, University of Chicago: pulmonologist, sleep medicine specialist with endocrine training, clinician-scientist (self-introduction in the talk).
- why it fits: Researcher explains how restricted sleep and sleep apnea reduce insulin sensitivity and glucose tolerance and raise diabetes risk, with her lab's experimental protocols.
- credibility note: Presents controlled laboratory studies (hers and others). Uploaded by IEEE EMBS (biomedical engineering society). No sponsor. Transcript read.
- caveat: 32-minute 2019 conference talk for biomedical engineers, no chapters; lab studies mostly in young healthy volunteers and no practical advice for a prediabetic 47-year-old.
- auto-caption cues (my approximate reading, NOT official chapters): sleep loss to insulin resistance mechanisms roughly 8:00 to 13:30

#### 18.2
- title: שינה וסוכרת, פרופ' גיורא פילר מתוך המדריך לניהול הסוכרת של ספרת הסוכרת בגליל והאגודה הישראלית לסוכרת
- title_en_gloss (my translation): Sleep and diabetes, Prof. Giora Pillar, from the diabetes management guide of the Galilee Diabetes Sphere and the Israeli Diabetes Association
- channel: אגודה ישראלית לסוכרת
- url: https://www.youtube.com/watch?v=sVIjcoj6UK0
- language: he
- length / published: 3:41 / 2023-11-09
- speaker and credentials: Prof. Giora Pillar, Technion Faculty of Medicine, sleep disorders specialist, runs the Clalit sleep network for the Western Galilee and Haifa district (self-introduction).
- why it fits: Short Hebrew explanation that short or poor sleep, insomnia, sleep apnea and circadian misalignment all impair insulin function and diabetes control.
- credibility note: Professional society channel (Israeli Diabetes Association). Refers to many studies without naming them; no sponsor. Transcript read.
- caveat: 3:41 only. Says apnea is mainly a disorder of overweight men (oversimplified for lean men) and that sleeping pills are justified when there is no alternative (CBT-I is first-line).

#### 18.3
- title: The Impact of Sleep on Blood Glucose Regulation
- channel: Stanford Health Care
- url: https://www.youtube.com/watch?v=0RHaB5CMtFk
- language: en
- length / published: 31:56 / 2025-11-19
- speaker and credentials: Carl Ching, MSN, RN, CDCES, certified diabetes education specialist at Stanford Health Care (per description).
- why it fits: Hospital webinar linking short sleep to higher A1C, insulin resistance, sleep apnea, night-time urination and cravings.
- credibility note: Stanford Medicine Diabetes Care Program webinar. Cites CDC figures in general terms; no sponsor. Transcript read.
- caveat: 32-minute webinar for adults already living with diabetes, by a nurse educator rather than a researcher, with a personal story; prediabetes is not the focus.

### topic 19 | post_meal_walk | a short walk after meals and blood glucose
- coverage: 2 videos (1 en, 1 he). No credible institutional Hebrew video found; the Hebrew item is a lay communicator citing a meta-analysis.

#### 19.1
- title: Walk or Squat After Eating? What Actually Lowers Blood Sugar
- channel: Sean Hashmi, MD
- url: https://www.youtube.com/watch?v=QdxlFMJGwYw
- language: en
- length / published: 12:54 / 2026-08-07
- speaker and credentials: Sean Hashmi, MD, MS, FASN, board-certified nephrologist and obesity medicine specialist.
- why it fits: Walks through the evidence: a short walk right after eating beats walking before, 10-minute post-meal walks versus one 30-minute walk, the GLUT4 mechanism, and a safety note for people on insulin or sulfonylureas.
- credibility note: Full reference list in the description (Engeroff 2023 Sports Med; Reynolds 2016 Diabetologia; Hamilton 2022 iScience; Hashimoto 2025 Sci Rep; DiPietro 2013 Diabetes Care). Commercial angle: channel memberships, free newsletter, own nonprofit; no products seen. Transcript read.
- caveat: Most trials involve people with type 2 diabetes or older adults at risk, and the outcome is post-meal glucose, not proven long-term results; includes a side topic on seated soleus heel raises.
- official chapters (from description): 01:00 The straight answer: walk after you eat; 01:16 The 2023 Sports Medicine review; 01:25 A 2016 trial: 10-minute walks vs one 30-minute walk; 03:53 Sooner beats longer; 04:23 Why exercising before the meal works less well; 10:29 Safety note for insulin or sulfonylurea

#### 19.2
- title: למה כדאי לזוז אחרי כל ארוחה (5 דקות בלבד)
- title_en_gloss (my translation): Why it is worth moving after every meal (5 minutes only)
- channel: אגוגו מגזין בריאות
- url: https://www.youtube.com/watch?v=CnSSv2Wb7mM
- language: he
- length / published: 2:54 / 2025-11-28
- speaker and credentials: Ozbek Thawka, founder and editor of the health site Agogo (not a clinician), per description.
- why it fits: Hebrew explainer: 2 to 5 minutes of light walking within 60 to 90 minutes of a meal blunts the glucose rise because working leg muscles pull sugar from the blood.
- credibility note: Description links a Springer Sports Medicine paper (s40279-022-01649-4). He promotes his own website and a WhatsApp group; no product sale seen. Transcript read; content matches the linked research.
- caveat: Lay communicator, simplified mechanism, no trial numbers; not a substitute for a clinician's advice.

### topic 20 | melatonin_facts | what melatonin is and is not, dose, safety, and glucose considerations
- coverage: 3 videos (2 en, 1 he). Glucose tolerance is mentioned only in the Mayo item; no video gives a prediabetes-specific melatonin timing rule.

#### 20.1
- title: Mayo Clinic Minute: What to consider before using melatonin supplements for sleep
- channel: Mayo Clinic
- url: https://www.youtube.com/watch?v=LLMc1qZGcd8
- language: en
- length / published: 1:36 / 2022-02-22
- speaker and credentials: Naima Covassin, MD (Mayo Clinic), per description.
- why it fits: Says melatonin is a circadian-rhythm regulator, not a sleep promoter; typical advised maximum is 5 mg or less but many take more; lists decreased glucose tolerance among serious side effects; advises talking to your provider.
- credibility note: Mayo Clinic News Network. No studies named; no sponsor.
- caveat: 1:36; glucose tolerance is a single phrase with no detail on dose or timing, so it is a flag to raise with the doctor rather than guidance.

#### 20.2
- title: The Real Reason Cardiologists Are Worried About Melatonin
- channel: Sean Hashmi, MD
- url: https://www.youtube.com/watch?v=plfrPqLRqdw
- language: en
- length / published: 7:35 / 2026-02-06
- speaker and credentials: Sean Hashmi, MD, MS, FASN, nephrologist and obesity medicine specialist.
- why it fits: Practical safety plan: lowest dose (0.5 to 1 mg, up to 3 to 4 mg), timing 1 to 3 hours before bed, short-term use, treat root causes; explains label content can be far off (the video says up to 667 percent of the labeled dose; the description cites 83 percent below to 478 percent above).
- credibility note: References listed (Khan and Lima, Open Heart 2026 NHANES analysis; Erland and Saxena, J Clin Sleep Med 2017; Ferracioli-Oda, PLoS One 2013). Commercial angle: memberships and newsletter only. Transcript read.
- caveat: Frames the 2025 AHA heart-failure signal (observational, later not confirmed after adjustment in an NHANES analysis); does not discuss glucose effects.
- official chapters (from description): 00:45 What the research found; 02:04 Six-step action plan for safe melatonin use; 04:10 Study limitations; 05:45 Why dosing is wildly inconsistent; 06:24 Does melatonin even work

#### 20.3
- title: נטילת מלטונין לפני השינה מגבירה את הסיכון למחלות לב
- title_en_gloss (my translation): Taking melatonin before sleep increases the risk of heart disease
- channel: פרופסור יהודה אדלר
- url: https://www.youtube.com/watch?v=7qKATEqghaY
- language: he
- length / published: 5:27 / 2025-11-09
- speaker and credentials: Prof. Yehuda Adler, cardiologist (inferred from the content and the cardiol.co.il link; the description gives no credentials); Channel 13 interview of 7 Nov 2025.
- why it fits: Hebrew interview on the 2025 AHA analysis of about 131,000 patient records linking long-term melatonin use to cardiac events, with an explicit call to treat it cautiously.
- credibility note: Professor of cardiology; study discussed but not linked. Commercial angle: description promotes his private clinic. Transcript read.
- caveat: The title states causation but he says the connection is unclear and results should be taken with limited weight; only about the first 2.5 minutes concern melatonin, the rest is an unrelated segment; auto-captions show he quotes a 3.5-fold figure, so check the original abstract before reuse.

### topic 21 | magnesium_supplements_sleep | do magnesium, glycine and other popular sleep supplements work
- coverage: 3 videos, all en. No credible Hebrew video found. Evidence summary: effects are small and mostly for calming or sleep depth, not for treating insomnia.

#### 21.1
- title: Sleep Scientist Reveals the BEST Supplements for Sleep (and Which 2 to Avoid)
- channel: FoundMyFitness Clips
- url: https://www.youtube.com/watch?v=0NnAYGM6gF8
- language: en
- length / published: 10:33 / 2025-10-07
- speaker and credentials: Michael Grandner, PhD, University of Arizona sleep researcher (description misspells his name), interviewed by Rhonda Patrick, PhD.
- why it fits: Sleep researcher's view: melatonin is a night signal not a sedative, dose and label overage matter; magnesium, glycine, theanine and similar items are 'not nothing' but none beat placebo for insomnia (valerian came closest).
- credibility note: Expert in his field; no studies named in the clip. FoundMyFitness sells premium membership; no sponsor read or product plug found in the transcript.
- caveat: Expert opinion, not a trial review; 'great data on glycine' overstates small trials, and the B12-at-night remark is speculative.

#### 21.2
- title: Magnesium Glycinate Improved Sleep in 155-People Study
- channel: Dr Brad Stanfield
- url: https://www.youtube.com/watch?v=v6paAVTSevY
- language: en
- length / published: 14:10 / 2025-09-23
- speaker and credentials: Dr Brad Stanfield, primary care physician in New Zealand (channel page links his medical registration).
- why it fits: Dissects a 155-person randomized trial of magnesium bisglycinate (250 mg elemental) that improved insomnia scores, then covers its weaknesses, the wider research and safety.
- credibility note: About 14 paper links in the description. Commercial angle: newsletter and Patreon; no supplement store seen. Transcript read (no sponsor).
- caveat: Opens by framing the result positively although the difference was small (1.6 points on the Insomnia Severity Index) and from a single trial.
- official chapters (from description): 00:35 Consumerlab.com analysis; 06:40 Weaknesses of the study; 08:04 The bigger research picture; 10:44 Safety of magnesium supplements; 11:16 Assessing magnesium status

#### 21.3
- title: Magnesium For Sleep: Does It Actually Work? (An Honest Doctor's Take)
- channel: Doctor Alex
- url: https://www.youtube.com/watch?v=W7EIYzNxxko
- language: en
- length / published: 19:42 / 2026-08-01
- speaker and credentials: Dr Alex, emergency medicine doctor in the UK (channel page).
- why it fits: Cautious take: magnesium-for-sleep studies are small, older and low quality, any benefit is likely a slight nudge in some people plus placebo, and caffeine, alcohol, body clock and bedroom matter more.
- credibility note: Physician but not a sleep specialist; describes evidence without listing references in the description. Commercial angle: daily newsletter only. Transcript read; no sponsor.
- caveat: About 20 minutes for a modest message; covers magnesium only (nothing on glycine or theanine).

### topic 22 | nocturia_prostate_sleep | waking at night to urinate in men in their 40s and 50s
- coverage: 3 videos (2 en, 1 he). Winter gives the sleep-medicine view (apnea link); Schaeffer the urology view; ynet Hebrew is BPH-centered.

#### 22.1
- title: Sleep Unplugged #167 - Frequent Nighttime Urination: All Through The Night
- channel: Sleep Unplugged with Dr. Chris Winter
- url: https://www.youtube.com/watch?v=0TO0HrWj5oU
- language: en
- length / published: 29:18 / 2025-09-07
- speaker and credentials: Dr. Chris Winter, neurologist and sleep specialist (self-introduction).
- why it fits: Sleep-medicine view: people usually wake first and then feel the urge, nocturia can be a red flag for sleep apnea (cites a 2006 Pressman study), fluid restriction rarely helps but timing does, plus caffeine, alcohol, edema, diuretics and when a sleep study helps.
- credibility note: Physician; names studies aloud (Pressman 2006; a bladder-training paper on fluid restriction). No sponsor read in this episode (his books are promoted at the end). Transcript read.
- caveat: 29-minute conversational solo podcast; prostate and bladder causes get only brief treatment, so pair it with a urology video.

#### 22.2
- title: Is your nocturnal urinary frequency normal? | Peter Attia & Ted Schaeffer
- channel: Peter Attia MD
- url: https://www.youtube.com/watch?v=WTuPdFbGQ1w
- language: en
- length / published: 13:56 / 2023-10-07
- speaker and credentials: Ted Schaeffer, MD, PhD, urologist specializing in prostate cancer (per description); host Peter Attia, MD.
- why it fits: Urologist explains first-line behavioral steps (fluid timing, caffeine, alcohol and antidiuretic hormone), voiding diary, why night-time urine output rises with age, edema, sleep apnea as a driver, and what is normal at age 50.
- credibility note: Internationally recognized urologist (per description); clip from Attia Drive episode 273. No studies named. Attia has commercial ventures (practice, membership, newsletter); no sponsor read in this clip's transcript.
- caveat: 14-minute clip that also covers other lower urinary tract topics and drug options; the 'normal' counts he gives are anecdotal.

#### 22.3
- title: ערמונית מוגדלת והפרעות במתן שתן: טיפול תרופתי או ניתוח?
- title_en_gloss (my translation): Enlarged prostate and urinary disorders: medication or surgery?
- channel: ynet
- url: https://www.youtube.com/watch?v=KcjewrJxCUY
- language: he
- length / published: 21:15 / 2024-07-18
- speaker and credentials: Prof. Jack Baniel, head of urology at Rabin Medical Center (per description); hosts Dana Ron and Prof. Itamar Raz on ynet's 'Health Games' podcast.
- why it fits: Hebrew explainer on BPH symptoms (including waking 2 to 4 times a night), behavioral changes, medications and surgery.
- credibility note: Senior Israeli urologist on a national news outlet's health podcast. No studies named; no sponsor seen. Transcript read.
- caveat: BPH-centered; nocturia appears only as one symptom and I found no discussion of sleep apnea or fluid timing in a keyword scan.
- auto-caption cues (my approximate reading, NOT official chapters): night-time waking as a symptom around 5:30 and as a reason to treat around 13:20

### topic 23 | stress_breathing_wind_down | slow breathing, NSDR / yoga nidra, wind-down routines and sleep
- coverage: 3 videos (2 en, 1 he). NO GOOD VIDEO FOUND for NSDR / yoga nidra evidence: results were guided audio sessions or influencer clips. Breathing and wind-down are covered.

#### 23.1
- title: How cyclic breathing can relieve stress | 90 Seconds w/ Lisa Kim
- channel: Stanford Medicine
- url: https://www.youtube.com/watch?v=lBJ2z4PxVt0
- language: en
- length / published: 3:48 / 2023-02-17
- speaker and credentials: David Spiegel, MD, Associate Chair of Psychiatry and Behavioral Sciences and director of the Center on Stress and Health, Stanford (per description); interviewed by Lisa Kim.
- why it fits: Explains cyclic sighing (long exhales): as little as 5 minutes brought less anxiety, better mood and a lower resting breathing rate in a Stanford study.
- credibility note: Stanford Medicine. Refers to a new Stanford study without giving details in the video; no sponsor. Manual captions read.
- caveat: Outcomes are stress and mood, not sleep; 3:48 news-style piece.

#### 23.2
- title: Cardiac rehab: Sleep and your heart
- channel: Bristol NHS Foundation Trust
- url: https://www.youtube.com/watch?v=OSRh4U9H6Wg
- language: en
- length / published: 7:23 / 2025-04-02
- speaker and credentials: A cardiac rehab nurse ('Tom') who, per the captions, works at Southmead Hospital in Bristol (captions render it 'South Meat'; channel is Bristol NHS Foundation Trust); surname not stated.
- why it fits: Gives a concrete wind-down routine for the hour before bed (reading, relaxing music or a podcast, shower or bath, meditation, no screens) and links sleep to heart health.
- credibility note: NHS Foundation Trust patient-education video. Quotes prevalence figures (for example up to 44 percent of people with heart disease affected) without sources; no sponsor. Transcript read.
- caveat: Basic sleep-hygiene advice for cardiac patients; hygiene alone is not a treatment for insomnia.

#### 23.3
- title: פרק #3: המשך טיפים לטיוב איכות השינה -בניית היגיינת שינה
- title_en_gloss (my translation): Episode 3: more tips for improving sleep quality - building sleep hygiene
- channel: אוניברסיטת חיפה - University of Haifa
- url: https://www.youtube.com/watch?v=SrMz4lEelrk
- language: he
- length / published: 10:02 / 2020-11-09
- speaker and credentials: Dr. Keren Or-Chen, psychologist, School of Social Work, University of Haifa (per description).
- why it fits: Hebrew university series episode on evening habits: TV, reading and music before sleep, and how caffeine and alcohol affect falling asleep and sleep quality.
- credibility note: University channel (2020). No captions, so content is verified from title and description only; studies cited: unknown.
- caveat: Content unverified; contains no breathing or NSDR material.

### topic 24 | naps_rules | napping: when it helps and when it hurts nighttime sleep
- coverage: 3 videos (2 en, 1 he). Hebrew item is a TV feature with no captions (content unverified).

#### 24.1
- title: Are naps actually good for us? | Sleeping with Science
- channel: TED
- url: https://www.youtube.com/watch?v=uEHu8LIZUKI
- language: en
- length / published: 2:17 / 2021-11-17
- speaker and credentials: Matt Walker, sleep scientist (TED series 'Sleeping with Science').
- why it fits: In 2 minutes: the afternoon dip is hard-wired, long or late naps take the edge off sleep pressure, so avoid naps if you struggle to sleep at night; otherwise about 20 minutes early in the day is fine.
- credibility note: TED series; manual captions read. No studies named. No sponsor. Walker's popular claims elsewhere have reportedly drawn public criticism for overstatement, but this clip's advice is mainstream.
- caveat: Very brief; no nuance for older adults or cardiovascular risk.

#### 24.2
- title: Sleep, Health, and Fitness (Episode 114)
- channel: Stronger By Science
- url: https://www.youtube.com/watch?v=Eh5fPcZDVX0
- language: en
- length / published: 1:31:59 / 2023-01-30
- speaker and credentials: Eric Trexler, Stronger By Science podcast (credentials not stated in the description).
- why it fits: Chapters on napping and caffeinated napping as tools after short sleep, each with PubMed links in the description.
- credibility note: Description lists PubMed IDs per chapter. Commercial angle: MacroFactor diet app and a BulkSupplements promo code.
- caveat: 92-minute podcast, so watch only the chapters below; framed around athletes and lifters, not insomnia.
- official chapters (from description): 40:14 Napping; 41:54 Caffeinated napping; 46:47 Modifications to your training program

#### 24.3
- title: ד״ר עמית גרין, פסיכולוג ומומחה בטיפול בהפרעת שינה באסותא מרכזים רפואיים
- title_en_gloss (my translation): Dr. Amit Green, psychologist and sleep disorder specialist at Assuta Medical Centers
- channel: אסותא מרכזים רפואיים
- url: https://www.youtube.com/watch?v=hdnWKSJ9Toc
- language: he
- length / published: 11:59 / 2021-12-01
- speaker and credentials: Dr. Amit Green, psychologist and specialist in treating sleep disorders (per description); Channel 13 Saturday edition feature of 27 Nov 2021 in which reporter Hila Korach naps mid-day.
- why it fits: Hebrew expert commentary on the midday nap inside a TV feature.
- credibility note: Hospital-network channel re-posting a TV segment. No captions, so content is verified from title and description only.
- caveat: TV magazine format; the expert portion may be short and light in tone; treat as unverified.

### topic 25 | tiny_changes_experiments | how to change habits with one small change at a time and run personal experiments (N-of-1)
- coverage: 3 videos, all en. No Hebrew video fit (the Tel Aviv University behavior-change talks found were about a lab technique, not habit design). A guard-rail against over-tracking (Jade Wu TEDx) is listed under alternates.

#### 25.1
- title: Forget big change, start with a tiny habit: BJ Fogg at TEDxFremont
- channel: TEDx Talks
- url: https://www.youtube.com/watch?v=AdKUJxjn-R8
- language: en
- length / published: 17:23 / 2012-12-05
- speaker and credentials: BJ Fogg, PhD, directs the Persuasive Tech Lab at Stanford (per description).
- why it fits: The classic case for shrinking a habit to a tiny action (floss one tooth, one push-up) and letting routine anchors and small wins grow it.
- credibility note: Stanford behavior researcher; mostly his own model and anecdotes, no studies named. Commercial angle: he sells the Tiny Habits book and academy. Manual captions available.
- caveat: 2012 talk (kept as a classic); limited controlled evidence for the method and not sleep-specific.

#### 25.2
- title: What Is an N of 1 Study? The MOST Personalized Health Research Explained!
- channel: The Public Health Millennial
- url: https://www.youtube.com/watch?v=t4uEC5NbAjE
- language: en
- length / published: 7:01 / 2024-10-23
- speaker and credentials: Eric J. Daza, DrPH, MPS, health data scientist (20+ years), founder and chief editor of Stats-of-1 (per description).
- why it fits: Explains N-of-1 studies: group averages can hide opposite effects in different people, so you run a self-experiment (condition A vs B) on your own outcomes such as sleep or glucose.
- credibility note: Statistician who works on N-of-1 methods; no studies named in the clip. Guest promotes his own newsletter and consulting; host lists affiliate links. Transcript read.
- caveat: 7-minute podcast clip from a public-health careers show; explains the idea but not the practical design (baseline length, washout, randomization).

#### 25.3
- title: SleepCoacher: A Personalized Automated Self-Experimentation System for Sleep Recommendations
- channel: ACM SIGCHI
- url: https://www.youtube.com/watch?v=4LQ_CL7tARU
- language: en
- length / published: 21:30 / 2016-11-24
- speaker and credentials: Presenter is a Brown University researcher; first author Nediyana Daskalova, co-authors include Jeff Huang and sleep clinicians Julie Boergers, Nicole Nugent and John McGeary (per description).
- why it fits: Shows how to run a personal sleep experiment properly: baseline (A) and intervention (B) phases in an ABAB single-case design, with clinician-informed recommendations tested a few days at a time.
- credibility note: Peer-reviewed conference talk (ACM UIST 2016) with two evaluation studies; academic, no commercial angle. Transcript read.
- caveat: 2016 research prototype using phone sensors; small studies; the single-case design explanation sits in the first third of the talk.
- auto-caption cues (my approximate reading, NOT official chapters): ABAB single-case design explained around 7:50 to 8:10

### topic 26 | sleep_heart_health | sleep and cardiovascular health, cholesterol and blood pressure
- coverage: 3 videos, all en. No credible Hebrew video found. Cholesterol itself is barely covered (it appears as one of the Life's Essential 8 metrics); blood pressure and insulin sensitivity are covered.

#### 26.1
- title: Sleep and Heart Health
- channel: The Heart Doctor
- url: https://www.youtube.com/watch?v=CkH6zt4s0l8
- language: en
- length / published: 11:13 / 2023-06-01
- speaker and credentials: Donald Lloyd-Jones, MD, cardiologist and epidemiologist, Northwestern University Feinberg School of Medicine and immediate past president of the American Heart Association (per description); interviewer is the host of the 'Heart Talks' series (credentials not stated).
- why it fits: AHA leader explains why sleep became the eighth metric of Life's Essential 8: blood pressure dipping, insulin sensitivity, blood sugar, arrhythmias, sleep apnea, 7 to 9 hours and regular timing.
- credibility note: Top-tier cardiologist speaking in his field; framework-level evidence, no specific studies named. No sponsor. Transcript read.
- caveat: 2023 interview; lists cholesterol only as one of the metrics and gives no lipid-specific sleep data.

#### 26.2
- title: AHA Life's Essential 8: sleep recommendations for cardiovascular health
- channel: VJNeurology
- url: https://www.youtube.com/watch?v=NnTbcGfYm0U
- language: en
- length / published: 1:41 / 2026-07-21
- speaker and credentials: Michael Grandner, PhD, University of Arizona (per description); recorded at the 40th APSS meeting.
- why it fits: 1:41 summary that AHA now treats sleep as a pillar of cardiovascular health (7 to 9 hours) and has issued statements on multidimensional sleep health and on circadian health.
- credibility note: Researcher; VJNeurology (independent video journal for clinicians). No studies named; no sponsor. Transcript read.
- caveat: Very short; no numbers on blood pressure or cholesterol.

#### 26.3
- title: Sleep and the Heart 101 - an introduction for patients with cardiovascular disease
- title_note: the original title contains an en dash; shown here with a plain hyphen per the file rule
- channel: University of Ottawa Heart Institute
- url: https://www.youtube.com/watch?v=JfWRo9N1-a0
- language: en
- length / published: 15:54 / 2021-07-15
- speaker and credentials: Presenter introduces himself as Dr. Adam Heenan (spelling from auto-captions; credentials not stated).
- why it fits: Hospital video for heart patients: insomnia affects 30 to 40 percent of cardiac patients and is a risk factor linked with hypertension and dyslipidemia; then sleep hygiene and CBT-style tools (stimulus control, sleep restriction, relaxation).
- credibility note: University of Ottawa Heart Institute; no sponsor; cites figures generally without sources. Transcript read.
- caveat: 2021 and aimed at cardiac patients; the hygiene section is basic.
- auto-caption cues (my approximate reading, NOT official chapters): stimulus control and sleep restriction explained around 8:10 to 10:15

### topic 27 | time_restricted_eating_sleep | eating window / time-restricted eating and sleep
- coverage: 3 videos (2 en, 1 he). Direct evidence for eating windows changing sleep is thin; these cover circadian meal timing and the last-meal-before-bed question.

#### 27.1
- title: How optimizing circadian rhythms can increase healthy years | Satchin Panda | TEDxBoston
- channel: TEDx Talks
- url: https://www.youtube.com/watch?v=fciGNBN0nKM
- language: en
- length / published: 13:12 / 2021-12-10
- speaker and credentials: Satchin Panda, PhD, professor, Regulatory Biology Laboratory, Salk Institute (per description).
- why it fits: Circadian scientist's six rules: 8 hours in bed at a consistent time, no food for the first hour after waking, eat within an 8 to 12 hour window from a consistent breakfast, 30 minutes of daylight, afternoon or evening exercise, and no food or bright light 2 to 3 hours before bed.
- credibility note: Leading TRE researcher; no studies named in the talk; manual captions read. No commercial angle in this talk (he runs a research app, myCircadianClock, per a newer TEDx description).
- caveat: Bold framing ('revolutionary', 'hundreds of papers'); TED flagged a newer talk by him as making claims that need further study; evidence for TRE improving sleep itself is limited; his claim that late-afternoon or evening exercise beats morning for prediabetic glucose control differs from the Hebrew podcast's rule of thumb (morning for insulin resistance), so treat exercise timing as unsettled.

#### 27.2
- title: Best Diet & Time to Eat for Increasing Deep Sleep | Dr. Marie-Pierre St-Onge & Dr. Andrew Huberman
- channel: Huberman Lab Clips
- url: https://www.youtube.com/watch?v=LcVh5MRlqP4
- language: en
- length / published: 11:37 / 2026-06-09
- speaker and credentials: Marie-Pierre St-Onge, PhD, professor of nutritional medicine at Columbia University (per description), with Andrew Huberman.
- why it fits: Researcher on diet and sleep: more fiber goes with more deep sleep, saturated fat with less, refined sugars with more arousal, and she stops eating about 3 hours before bed.
- credibility note: Leading nutrition-and-sleep researcher describing her own findings. Huberman Lab has sponsors and memberships (disclosures link in description); no sponsor read in this clip's transcript.
- caveat: Mostly about what you eat rather than a daily eating window; the meal-timing answer is only the last minute of an 11-minute clip.
- official chapters (from description): 09:50 How nutrients affect sleep stages; 10:45 Best time to stop eating

#### 27.3
- title: השעון הביולוגי שלנו - איך חיים, אוכלים ומתאמנים לפי השעון הביולוגי, ועוד על המנגנון הגאוני הזה
- title_en_gloss (my translation): Our biological clock - how to live, eat and exercise according to the biological clock, and more about this ingenious mechanism
- channel: TAUVOD
- url: https://www.youtube.com/watch?v=xwtaZYe1WcM
- language: he
- length / published: 52:56 / 2026-07-23
- speaker and credentials: Dr. Yaarit Adamovich-Tamam, staff scientist at the Weizmann Institute of Science who researches the biological clock; host Miri Nevo, MSc exercise physiology (per description). Tel Aviv University podcast 'Pod al HaDofek'.
- why it fits: Hebrew: food is a clock signal for organs such as the liver; eating at night is metabolically different; time-restricted eating shows benefits mainly when the window is early in the day.
- credibility note: University podcast with a working circadian researcher; links one study in the description; no sponsor seen. Transcript read.
- caveat: 53 minutes with no chapters; she notes TRE is still relatively little studied.
- auto-caption cues (my approximate reading, NOT official chapters): meal timing and TRE about 31:15 to 34:30

### topic 28 | sleep_muscle_recovery | sleep, muscle protein synthesis, growth hormone and training adaptation for lifters
- coverage: 3 videos, all en. NO GOOD VIDEO FOUND on growth hormone (one popular clip was dropped for a contested claim). Muscle protein synthesis is covered by the primary-research short.

#### 28.1
- title: Physiology Shorts: Sleep restriction on myofibrillar protein synthesis
- channel: The Physiological Society
- url: https://www.youtube.com/watch?v=kzMk-Er5-qs
- language: en
- length / published: 1:53 / 2020-08-03
- speaker and credentials: Nick Saner, Victoria University Melbourne, first author; co-authors include Stuart Phillips and Jonathan Bartlett (per description).
- why it fits: 24 young men, 5 nights of 4 hours versus 8 hours: muscle protein synthesis fell with sleep restriction, and a few high-intensity interval sessions prevented the drop.
- credibility note: Researcher explaining his own paper (J Physiol 2020;598(8):1523-1536, full citation in description). The Physiological Society; no commercial angle. Transcript read.
- caveat: 1:53 only; young men, extreme restriction, interval exercise rather than lifting, and it measures protein synthesis not long-term muscle size.

#### 28.2
- title: Sleep, Health, and Fitness (Episode 114)
- channel: Stronger By Science
- url: https://www.youtube.com/watch?v=Eh5fPcZDVX0
- language: en
- length / published: 1:31:59 / 2023-01-30
- speaker and credentials: Eric Trexler, Stronger By Science podcast (credentials not stated in the description).
- why it fits: Chapters on how short sleep affects training quality, appetite and body composition, each with PubMed references in the description.
- credibility note: PubMed IDs listed per chapter. Commercial angle: MacroFactor diet app and a BulkSupplements promo code.
- caveat: 92-minute podcast, so watch only the chapters below; no growth hormone content.
- official chapters (from description): 17:29 Impact on training quality; 21:16 Impact on appetite; 25:04 Impact on body composition; 31:03 Strategies to minimize the impact of insufficient sleep

#### 28.3
- title: Sleep Unplugged #80 - Weight Training and Sleep: Keep on Lifting
- channel: Sleep Unplugged with Dr. Chris Winter
- url: https://www.youtube.com/watch?v=wAVYri_mWmM
- language: en
- length / published: 25:30 / 2024-01-07
- speaker and credentials: Dr. Chris Winter, neurologist and sleep specialist (self-introduction).
- why it fits: Sleep physician reviews studies on sleep and lifting: three nights of 3 hours cut maximal bench press, leg press and deadlift in a small 1994 study, and adequate sleep supports strength gains and recovery.
- credibility note: Physician naming studies by year; no sponsor read in this episode; he promotes his books. Transcript read.
- caveat: Conversational with tangents and a very small early study; he also suggests exercise could stand in for CPAP in mild apnea, which should not be applied to moderate or severe apnea; no muscle protein synthesis or growth hormone content.
- auto-caption cues (my approximate reading, NOT official chapters): sleep loss and lifting performance about 13:40 to 14:45

### topic 29 | chronotype_and_midlife | chronotype, morning vs evening types, and how sleep timing shifts in midlife
- coverage: 3 videos (2 en, 1 he). Midlife-specific content is limited to the Yale video and the Hebrew podcast.

#### 29.1
- title: Can you change your sleep schedule?
- channel: TED-Ed
- url: https://www.youtube.com/watch?v=Amkg1cdDCpM
- language: en
- length / published: 4:38 / 2023-09-12
- speaker and credentials: TED-Ed animation with information and insights from Jamie M. Zeitzer, PhD (per description; affiliation not stated there).
- why it fits: Explains that most people sit between early bird and night owl, the circadian system anchors your preference, timing shifts with age but you rarely outgrow it, and consistency plus morning light are what you control.
- credibility note: TED-Ed with a credited scientific advisor; manual captions read. No studies named; no commercial angle.
- caveat: 4:38 general explainer, not specific to midlife.

#### 29.2
- title: Sleep and Aging - Yale Medicine Explains
- channel: Yale Medicine
- url: https://www.youtube.com/watch?v=1RE08qza9es
- language: en
- length / published: 5:35 / 2023-03-13
- speaker and credentials: Brienne Miner, assistant professor of geriatrics at Yale with sleep medicine training (self-introduction).
- why it fits: Says sleep need stays 7 to 9 hours from middle to older age, melatonin rises earlier with age so people tend to sleep and wake earlier, and lists what disrupts sleep (conditions, medications, alcohol, caffeine).
- credibility note: Yale Medicine; manual captions read. No studies named; no sponsor.
- caveat: 5:35 and about aging in general rather than age 47 specifically.
- official chapters (from description): 00:23 How do sleep needs change as we age; 01:07 What factors impact sleep as we age; 03:16 What sleep changes are normal as we age; 04:27 What is the takeaway

#### 29.3
- title: השעון הביולוגי שלנו - איך חיים, אוכלים ומתאמנים לפי השעון הביולוגי, ועוד על המנגנון הגאוני הזה
- title_en_gloss (my translation): Our biological clock - how to live, eat and exercise according to the biological clock, and more about this ingenious mechanism
- channel: TAUVOD
- url: https://www.youtube.com/watch?v=xwtaZYe1WcM
- language: he
- length / published: 52:56 / 2026-07-23
- speaker and credentials: Dr. Yaarit Adamovich-Tamam, staff scientist at the Weizmann Institute of Science who researches the biological clock; host Miri Nevo (per description). Tel Aviv University podcast.
- why it fits: Hebrew: chronotype is plastic across life (short cycle in babies, lengthening through adolescence, shortening again in adults), partly genetic but movable by behavior (a camping study), plus social jetlag and men tending to be later than women.
- credibility note: University podcast with a working circadian researcher; no sponsor seen. Transcript read.
- caveat: 53 minutes with no chapters.
- auto-caption cues (my approximate reading, NOT official chapters): chronotype and change over life about 22:30 to 26:00; social jetlag about 29:30; men versus women about 41:00

### topic 30 | lifting_and_sleep_quality | does resistance training improve sleep (deep sleep, latency), how to program it
- coverage: 3 videos (2 en, 1 he). NO dedicated explainer on resistance training and sleep architecture was found; coverage is partial, so treat this topic as a weak spot.

#### 30.1
- title: Sleep Unplugged #80 - Weight Training and Sleep: Keep on Lifting
- channel: Sleep Unplugged with Dr. Chris Winter
- url: https://www.youtube.com/watch?v=wAVYri_mWmM
- language: en
- length / published: 25:30 / 2024-01-07
- speaker and credentials: Dr. Chris Winter, neurologist and sleep specialist (self-introduction).
- why it fits: Sleep physician reviews weight training and sleep: a 1997 randomized trial in which lifting improved subjective sleep, mood and depression, a 2011 randomized trial where exercise training reduced apnea severity in sedentary obese adults, and a 2023 study on evening exercise.
- credibility note: Physician naming studies by year; no sponsor read in this episode; he promotes his books. Transcript read.
- caveat: Conversational; describes studies loosely by year and result; suggests exercise might substitute for CPAP in mild apnea (do not generalize); no chapters.
- auto-caption cues (my approximate reading, NOT official chapters): weight-training trials and sleep quality about 15:00 to 24:00

#### 30.2
- title: Exercise, Sleep, and Mental Health: Evidence and Implications for Practice | ADAA Sleep SIG
- channel: ADAA_Anxiety
- url: https://www.youtube.com/watch?v=ccs4PvcdZ-M
- language: en
- length / published: 41:41 / 2026-05-08
- speaker and credentials: Kristin Szuhany, PhD, member of ADAA's Sleep Special Interest Group (per description).
- why it fits: Reviews meta-analyses: acute exercise improves sleep efficiency, slow-wave sleep, sleep-onset latency and time awake at night; regular exercise strongly improves perceived sleep quality; high-intensity exercise 3 to 8 hours before bed lowered REM; a network meta-analysis favored vigorous strength training for sleep quality in depression.
- credibility note: Professional association webinar by a clinical researcher; cites meta-analyses without naming them; no sponsor. Transcript read.
- caveat: 42 minutes, clinician-facing and centered on depression and anxiety populations; resistance-specific content is brief.
- auto-caption cues (my approximate reading, NOT official chapters): meta-analyses of acute and regular exercise about 4:45 to 8:40; intensity and timing about 21:30 to 24:00; guideline amounts including 2 strength sessions a week about 27:30 to 29:30

#### 30.3
- title: השעון הביולוגי שלנו - איך חיים, אוכלים ומתאמנים לפי השעון הביולוגי, ועוד על המנגנון הגאוני הזה
- title_en_gloss (my translation): Our biological clock - how to live, eat and exercise according to the biological clock, and more about this ingenious mechanism
- channel: TAUVOD
- url: https://www.youtube.com/watch?v=xwtaZYe1WcM
- language: he
- length / published: 52:56 / 2026-07-23
- speaker and credentials: Dr. Yaarit Adamovich-Tamam, staff scientist at the Weizmann Institute of Science; host Miri Nevo (per description). Tel Aviv University podcast.
- why it fits: Hebrew: exercise timing rule of thumb (afternoon for performance, morning for insulin resistance and weight), any exercise beats none, and a discussion of late-evening exercise and alertness.
- credibility note: University podcast with a circadian researcher whose lab studies exercise timing (Wingate and Olympic Committee collaboration); no sponsor seen. Transcript read.
- caveat: Not resistance-specific and does not claim lifting improves sleep; rule of thumb drawn largely from mouse data and differs from Panda's evening-exercise claim (topic 27); 53 minutes without chapters.
- auto-caption cues (my approximate reading, NOT official chapters): exercise timing about 34:40 to 41:00

## Alternates (verified through oEmbed, not in the top three)

- topic 15 cbt_i_basics: CBT-I: Cognitive Behavioral Therapy for Insomnia | Cleveland Clinic | https://www.youtube.com/watch?v=1aQPRybcq08 | en | 3:11 / 2026-07-10
  - note: Cleveland Clinic 3-minute CBT-I overview with official chapters (01:03 stimulus control, 01:35 sleep restriction); good as a quick first look.
- topic 15 cbt_i_basics: נדודי שינה | עמית גרין | https://www.youtube.com/watch?v=rLRUb8piTPc | he | 27:06 / 2026-04-12
  - title_en_gloss (my translation): Insomnia
  - note: Hebrew lecture on insomnia and CBT-I basics (hyperarousal model, sleep diary, time-in-bed restriction, cognitive work, pills) that I transcript-checked; speaker is presumably Dr. Amit Green but his identity is not stated on-page, and he takes a relaxed view of chronic sleeping-pill use.
- topic 17 statin_and_sleep: Statins Causing Muscle Pain? What You Should Do (Before You Stop Them)   #statin | HG Cardiowise | https://www.youtube.com/watch?v=05gh9XwN7pI | en | 13:26 / 2026-08-14
  - note: Cardiologist Dr. Ameya Amonkar (channel page) on statin muscle symptoms: transcript says do not silently stop, describes dose change, switching statin, adding ezetimibe, and the nocebo data. Small independent channel; the title's 'Before You Stop Them' is clickbait-ish.
- topic 17 statin_and_sleep: Statins update: the nocebo effect and statin use in older adults | GPnotebook | https://www.youtube.com/watch?v=5t6XXdhDCTY | en | 7:43 / 2022-12-16
  - note: GP Kevin Fernando on the SAMSON and StatinWISE n-of-1 nocebo trials; clinician-facing, 7:43, second half is about older adults.
- topic 20 melatonin_facts: Oxford professor reveals myths about sleep | University of Oxford | https://www.youtube.com/watch?v=0qhPE4H11R0 | en | 1:30 / 2024-03-15
  - note: University of Oxford, Prof Russell Foster, 1:30: melatonin is a biological marker of darkness and only a mild sleep modulator; alcohol and sleeping tablets are sedatives, not sleep.
- topic 22 nocturia_prostate_sleep: Why do you keep waking up at night to pee?! | Nocturia | Rena Malik, M.D. | https://www.youtube.com/watch?v=6QkyRSSPlLk | en | 6:11 / 2021-07-30
  - note: Urologist Rena Malik, 6:11 (2021): causes including prostate obstruction and sleep apnea; description carries promotion for her book and masterclass.
- topic 25 tiny_changes_experiments (guard-rail): Why sleep hygiene alone won't treat your insomnia | Jade Wu, PhD | TEDxJacksonville | TEDx Talks | https://www.youtube.com/watch?v=HmXmfTIF6Jw | en | 14:56 / 2026-04-15
  - note: Jade Wu, PhD (SUNY Upstate), TEDx: treating sleep as a system to optimize with trackers backfires; frames CBT-I as listening, generosity and fairness toward sleep. Useful counterweight for anyone running sleep experiments. Author of 'Hello Sleep'; TED notes it is not medical advice.
- topic 27 time_restricted_eating_sleep: How fasting can impact sleep | Peter Attia, M.D. & Matthew Walker, Ph.D. | Peter Attia MD | https://www.youtube.com/watch?v=GDrKCK4UHBU | en | 8:06 / 2022-05-31
  - note: Attia and Walker on fasting and sleep (8:06): mainly multi-day fasting and an orexin mechanism from animal work; overnight eating windows are said not to be a problem.
- topic 29 chronotype_and_midlife: Social Jetlag - What You Need to Know About Your Sleep (Till Roenneberg) | DLDwomen 13 | DLD Conference | https://www.youtube.com/watch?v=726F7o2logQ | en | 23:05 / 2013-07-25
  - note: Till Roenneberg (chronotype and social jetlag pioneer), 23 minutes, 2013 classic; includes sleep across the lifespan.

## Considered and dropped (no URLs on purpose)

- Failed oEmbed with HTTP 401 (embedding disabled): the Esra Tasali talk as uploaded by the Institute for Neural Computation (the same talk is kept via the IEEE EMBS upload), and 'SleepBandits: Guided Flexible Self-Experiments for Sleep' (ACM SIGCHI, CHI 2020), which would have been the best fit for topic 25.
- Advises stopping a statin (excluded by the rule): Mayo Clinic 'Statin Myopathy' (Sept 2025; the clinician describes stopping for a month as a washout), Mayo Clinic 'Lipids Series: Statin Intolerance' (recommends stopping for about a month), a Hebrew clinical-pharmacist video on suspected statin muscle pain (describes pauses of months), and a one-minute Hebrew physician video suggesting a two-week pause with approval. These are otherwise credible, so a reviewer may want to watch them, but they should not be shown in the app.
- Contested or mismatched content: a Huberman Lab clip with Gina Poe claiming a later bedtime forfeits the growth hormone pulse because of clock timing (conflicts with the classic finding that the sleep-onset pulse follows sleep onset); a Luigi Fontana video titled 'Even One Night of Poor Sleep...' whose content is a six-week trial in women; a Hebrew video on evening workouts by an obesity surgeon whose description (4 hours) and narration (3 hours; 90 minutes for intense sessions) give inconsistent timing advice.
- Commercial or coaching channels skipped: 'Insomnia Coach' (sells coaching programs), supplement-selling doctor channels, and clips tied to a CGM company; also a Hebrew physician's magnesium video from a private hormone-therapy clinic that makes broad claims (desalination-driven deficiency, magnesium type matched to conditions), though it honestly notes there are almost no sleep trials. Also skipped: many high-view shorts with clickbait titles.

## Weak spots

- statin_and_sleep: the sleep angle rests on one educator-level video (JJ Medicine); the strongest clinician videos were dropped because they describe stopping the statin; no Hebrew video passed.
- stress_breathing_wind_down: NO GOOD VIDEO FOUND for NSDR / yoga nidra evidence (only guided audio and influencer clips).
- sleep_muscle_recovery: NO GOOD VIDEO FOUND on growth hormone; muscle protein synthesis rests on a 2-minute research short.
- lifting_and_sleep_quality: no dedicated resistance-training and sleep explainer; coverage is partial (podcast, clinician webinar, Hebrew circadian podcast).
- Hebrew gaps: none for statin_and_sleep, magnesium_supplements_sleep, tiny_changes_experiments, sleep_heart_health; several Hebrew items are content-unverified because they have no captions (Assuta, Haifa, Channel 13 segment).
- Long sources: a few picks run 30 to 90 minutes (Bhat, Tasali, Stanford webinar, ADAA, Hebrew TAU podcast, Stronger By Science); use the chapters or cues.
- Several recommended channels have commercial ties (Park, Hashmi, Attia, FoundMyFitness, Huberman Lab, Stronger By Science, Adler); each is flagged in its entry.

## Machine-readable index (same data as above)

```json
[
 {
  "topic_num": 15,
  "topic_id": "cbt_i_basics",
  "topic": "insomnia and CBT-I: stimulus control, sleep restriction, why it works",
  "videos": [
   {
    "video_id": "YESUi8EM-k4",
    "url": "https://www.youtube.com/watch?v=YESUi8EM-k4",
    "title": "Stimulus control and sleep restriction therapy: reprogramming the brain to treat insomnia",
    "channel": "VJNeurology",
    "language": "en"
   },
   {
    "video_id": "zZWx4vp1IM4",
    "url": "https://www.youtube.com/watch?v=zZWx4vp1IM4",
    "title": "CBT-I: The First-Line Treatment for Chronic Insomnia with Dr. Donn Posner (Part 1 of 2)",
    "channel": "The Carlat Psychiatry Report",
    "language": "en"
   },
   {
    "video_id": "W0dWjFR7uAQ",
    "url": "https://www.youtube.com/watch?v=W0dWjFR7uAQ",
    "title": "ד\"ר עמית שי גרין - סובלים מנדודי שינה? כמה שינויים התנהגותיים קטנים יכולים לעזור",
    "channel": "אסותא מרכזים רפואיים",
    "language": "he"
   }
  ]
 },
 {
  "topic_num": 16,
  "topic_id": "sleep_apnea_signs_men",
  "topic": "sleep apnea symptoms in men including lean men, when to get tested",
  "videos": [
   {
    "video_id": "zHhlDHpE_m0",
    "url": "https://www.youtube.com/watch?v=zHhlDHpE_m0",
    "title": "Sleep Apnea 101: Symptoms, Risks & Solutions | Aparna Bhat, MD",
    "channel": "Cleveland Clinic",
    "language": "en"
   },
   {
    "video_id": "YM-s689BrKs",
    "url": "https://www.youtube.com/watch?v=YM-s689BrKs",
    "title": "5 Sleep Apnea Myths That Doctors Still Believe",
    "channel": "Doctor Steven Park",
    "language": "en"
   },
   {
    "video_id": "DhEcbONz9do",
    "url": "https://www.youtube.com/watch?v=DhEcbONz9do",
    "title": "מה שחשוב לדעת על דום נשימה בשינה- ד\"ר אייל רוזנצוויג",
    "channel": "מדיקו",
    "language": "he"
   }
  ]
 },
 {
  "topic_num": 17,
  "topic_id": "statin_and_sleep",
  "topic": "do statins affect sleep or cause muscle cramps, what to discuss with the doctor",
  "videos": [
   {
    "video_id": "o6Oi_N5jotg",
    "url": "https://www.youtube.com/watch?v=o6Oi_N5jotg",
    "title": "Statins, side effects and what they're used for",
    "channel": "British Heart Foundation",
    "language": "en"
   },
   {
    "video_id": "aVkmxckKW_4",
    "url": "https://www.youtube.com/watch?v=aVkmxckKW_4",
    "title": "Statins, cholesterol and side effects: do statins cause muscle problems?",
    "channel": "Oxford Population Health",
    "language": "en"
   },
   {
    "video_id": "wui7GXnsClU",
    "url": "https://www.youtube.com/watch?v=wui7GXnsClU",
    "title": "Attention Statin Users - Statins Can Cause THESE Sleep Changes | & Why They Happen",
    "channel": "JJ Medicine",
    "language": "en"
   }
  ]
 },
 {
  "topic_num": 18,
  "topic_id": "prediabetes_sleep_glucose",
  "topic": "how poor sleep affects insulin sensitivity and blood sugar",
  "videos": [
   {
    "video_id": "Q-wlgpvbTC8",
    "url": "https://www.youtube.com/watch?v=Q-wlgpvbTC8",
    "title": "2019 IEEE EMBS Workshop - Esra Tasali on Sleep and metabolic health",
    "channel": "IEEE EMBS",
    "language": "en"
   },
   {
    "video_id": "sVIjcoj6UK0",
    "url": "https://www.youtube.com/watch?v=sVIjcoj6UK0",
    "title": "שינה וסוכרת, פרופ' גיורא פילר מתוך המדריך לניהול הסוכרת של ספרת הסוכרת בגליל והאגודה הישראלית לסוכרת",
    "channel": "אגודה ישראלית לסוכרת",
    "language": "he"
   },
   {
    "video_id": "0RHaB5CMtFk",
    "url": "https://www.youtube.com/watch?v=0RHaB5CMtFk",
    "title": "The Impact of Sleep on Blood Glucose Regulation",
    "channel": "Stanford Health Care",
    "language": "en"
   }
  ]
 },
 {
  "topic_num": 19,
  "topic_id": "post_meal_walk",
  "topic": "a short walk after meals and blood glucose",
  "videos": [
   {
    "video_id": "QdxlFMJGwYw",
    "url": "https://www.youtube.com/watch?v=QdxlFMJGwYw",
    "title": "Walk or Squat After Eating? What Actually Lowers Blood Sugar",
    "channel": "Sean Hashmi, MD",
    "language": "en"
   },
   {
    "video_id": "CnSSv2Wb7mM",
    "url": "https://www.youtube.com/watch?v=CnSSv2Wb7mM",
    "title": "למה כדאי לזוז אחרי כל ארוחה (5 דקות בלבד)",
    "channel": "אגוגו מגזין בריאות",
    "language": "he"
   }
  ]
 },
 {
  "topic_num": 20,
  "topic_id": "melatonin_facts",
  "topic": "what melatonin is and is not, dose, safety, and glucose considerations",
  "videos": [
   {
    "video_id": "LLMc1qZGcd8",
    "url": "https://www.youtube.com/watch?v=LLMc1qZGcd8",
    "title": "Mayo Clinic Minute: What to consider before using melatonin supplements for sleep",
    "channel": "Mayo Clinic",
    "language": "en"
   },
   {
    "video_id": "plfrPqLRqdw",
    "url": "https://www.youtube.com/watch?v=plfrPqLRqdw",
    "title": "The Real Reason Cardiologists Are Worried About Melatonin",
    "channel": "Sean Hashmi, MD",
    "language": "en"
   },
   {
    "video_id": "7qKATEqghaY",
    "url": "https://www.youtube.com/watch?v=7qKATEqghaY",
    "title": "נטילת מלטונין לפני השינה מגבירה את הסיכון למחלות לב",
    "channel": "פרופסור יהודה אדלר",
    "language": "he"
   }
  ]
 },
 {
  "topic_num": 21,
  "topic_id": "magnesium_supplements_sleep",
  "topic": "do magnesium, glycine and other popular sleep supplements work",
  "videos": [
   {
    "video_id": "0NnAYGM6gF8",
    "url": "https://www.youtube.com/watch?v=0NnAYGM6gF8",
    "title": "Sleep Scientist Reveals the BEST Supplements for Sleep (and Which 2 to Avoid)",
    "channel": "FoundMyFitness Clips",
    "language": "en"
   },
   {
    "video_id": "v6paAVTSevY",
    "url": "https://www.youtube.com/watch?v=v6paAVTSevY",
    "title": "Magnesium Glycinate Improved Sleep in 155-People Study",
    "channel": "Dr Brad Stanfield",
    "language": "en"
   },
   {
    "video_id": "W7EIYzNxxko",
    "url": "https://www.youtube.com/watch?v=W7EIYzNxxko",
    "title": "Magnesium For Sleep: Does It Actually Work? (An Honest Doctor's Take)",
    "channel": "Doctor Alex",
    "language": "en"
   }
  ]
 },
 {
  "topic_num": 22,
  "topic_id": "nocturia_prostate_sleep",
  "topic": "waking at night to urinate in men in their 40s and 50s",
  "videos": [
   {
    "video_id": "0TO0HrWj5oU",
    "url": "https://www.youtube.com/watch?v=0TO0HrWj5oU",
    "title": "Sleep Unplugged #167 - Frequent Nighttime Urination: All Through The Night",
    "channel": "Sleep Unplugged with Dr. Chris Winter",
    "language": "en"
   },
   {
    "video_id": "WTuPdFbGQ1w",
    "url": "https://www.youtube.com/watch?v=WTuPdFbGQ1w",
    "title": "Is your nocturnal urinary frequency normal? | Peter Attia & Ted Schaeffer",
    "channel": "Peter Attia MD",
    "language": "en"
   },
   {
    "video_id": "KcjewrJxCUY",
    "url": "https://www.youtube.com/watch?v=KcjewrJxCUY",
    "title": "ערמונית מוגדלת והפרעות במתן שתן: טיפול תרופתי או ניתוח?",
    "channel": "ynet",
    "language": "he"
   }
  ]
 },
 {
  "topic_num": 23,
  "topic_id": "stress_breathing_wind_down",
  "topic": "slow breathing, NSDR / yoga nidra, wind-down routines and sleep",
  "videos": [
   {
    "video_id": "lBJ2z4PxVt0",
    "url": "https://www.youtube.com/watch?v=lBJ2z4PxVt0",
    "title": "How cyclic breathing can relieve stress | 90 Seconds w/ Lisa Kim",
    "channel": "Stanford Medicine",
    "language": "en"
   },
   {
    "video_id": "OSRh4U9H6Wg",
    "url": "https://www.youtube.com/watch?v=OSRh4U9H6Wg",
    "title": "Cardiac rehab: Sleep and your heart",
    "channel": "Bristol NHS Foundation Trust",
    "language": "en"
   },
   {
    "video_id": "SrMz4lEelrk",
    "url": "https://www.youtube.com/watch?v=SrMz4lEelrk",
    "title": "פרק #3: המשך טיפים לטיוב איכות השינה -בניית היגיינת שינה",
    "channel": "אוניברסיטת חיפה - University of Haifa",
    "language": "he"
   }
  ]
 },
 {
  "topic_num": 24,
  "topic_id": "naps_rules",
  "topic": "napping: when it helps and when it hurts nighttime sleep",
  "videos": [
   {
    "video_id": "uEHu8LIZUKI",
    "url": "https://www.youtube.com/watch?v=uEHu8LIZUKI",
    "title": "Are naps actually good for us? | Sleeping with Science",
    "channel": "TED",
    "language": "en"
   },
   {
    "video_id": "Eh5fPcZDVX0",
    "url": "https://www.youtube.com/watch?v=Eh5fPcZDVX0",
    "title": "Sleep, Health, and Fitness (Episode 114)",
    "channel": "Stronger By Science",
    "language": "en"
   },
   {
    "video_id": "hdnWKSJ9Toc",
    "url": "https://www.youtube.com/watch?v=hdnWKSJ9Toc",
    "title": "ד״ר עמית גרין, פסיכולוג ומומחה בטיפול בהפרעת שינה באסותא מרכזים רפואיים",
    "channel": "אסותא מרכזים רפואיים",
    "language": "he"
   }
  ]
 },
 {
  "topic_num": 25,
  "topic_id": "tiny_changes_experiments",
  "topic": "how to change habits with one small change at a time and run personal experiments (N-of-1)",
  "videos": [
   {
    "video_id": "AdKUJxjn-R8",
    "url": "https://www.youtube.com/watch?v=AdKUJxjn-R8",
    "title": "Forget big change, start with a tiny habit: BJ Fogg at TEDxFremont",
    "channel": "TEDx Talks",
    "language": "en"
   },
   {
    "video_id": "t4uEC5NbAjE",
    "url": "https://www.youtube.com/watch?v=t4uEC5NbAjE",
    "title": "What Is an N of 1 Study? The MOST Personalized Health Research Explained!",
    "channel": "The Public Health Millennial",
    "language": "en"
   },
   {
    "video_id": "4LQ_CL7tARU",
    "url": "https://www.youtube.com/watch?v=4LQ_CL7tARU",
    "title": "SleepCoacher: A Personalized Automated Self-Experimentation System for Sleep Recommendations",
    "channel": "ACM SIGCHI",
    "language": "en"
   }
  ]
 },
 {
  "topic_num": 26,
  "topic_id": "sleep_heart_health",
  "topic": "sleep and cardiovascular health, cholesterol and blood pressure",
  "videos": [
   {
    "video_id": "CkH6zt4s0l8",
    "url": "https://www.youtube.com/watch?v=CkH6zt4s0l8",
    "title": "Sleep and Heart Health",
    "channel": "The Heart Doctor",
    "language": "en"
   },
   {
    "video_id": "NnTbcGfYm0U",
    "url": "https://www.youtube.com/watch?v=NnTbcGfYm0U",
    "title": "AHA Life's Essential 8: sleep recommendations for cardiovascular health",
    "channel": "VJNeurology",
    "language": "en"
   },
   {
    "video_id": "JfWRo9N1-a0",
    "url": "https://www.youtube.com/watch?v=JfWRo9N1-a0",
    "title": "Sleep and the Heart 101 - an introduction for patients with cardiovascular disease",
    "channel": "University of Ottawa Heart Institute",
    "language": "en"
   }
  ]
 },
 {
  "topic_num": 27,
  "topic_id": "time_restricted_eating_sleep",
  "topic": "eating window / time-restricted eating and sleep",
  "videos": [
   {
    "video_id": "fciGNBN0nKM",
    "url": "https://www.youtube.com/watch?v=fciGNBN0nKM",
    "title": "How optimizing circadian rhythms can increase healthy years | Satchin Panda | TEDxBoston",
    "channel": "TEDx Talks",
    "language": "en"
   },
   {
    "video_id": "LcVh5MRlqP4",
    "url": "https://www.youtube.com/watch?v=LcVh5MRlqP4",
    "title": "Best Diet & Time to Eat for Increasing Deep Sleep | Dr. Marie-Pierre St-Onge & Dr. Andrew Huberman",
    "channel": "Huberman Lab Clips",
    "language": "en"
   },
   {
    "video_id": "xwtaZYe1WcM",
    "url": "https://www.youtube.com/watch?v=xwtaZYe1WcM",
    "title": "השעון הביולוגי שלנו - איך חיים, אוכלים ומתאמנים לפי השעון הביולוגי, ועוד על המנגנון הגאוני הזה",
    "channel": "TAUVOD",
    "language": "he"
   }
  ]
 },
 {
  "topic_num": 28,
  "topic_id": "sleep_muscle_recovery",
  "topic": "sleep, muscle protein synthesis, growth hormone and training adaptation for lifters",
  "videos": [
   {
    "video_id": "kzMk-Er5-qs",
    "url": "https://www.youtube.com/watch?v=kzMk-Er5-qs",
    "title": "Physiology Shorts: Sleep restriction on myofibrillar protein synthesis",
    "channel": "The Physiological Society",
    "language": "en"
   },
   {
    "video_id": "Eh5fPcZDVX0",
    "url": "https://www.youtube.com/watch?v=Eh5fPcZDVX0",
    "title": "Sleep, Health, and Fitness (Episode 114)",
    "channel": "Stronger By Science",
    "language": "en"
   },
   {
    "video_id": "wAVYri_mWmM",
    "url": "https://www.youtube.com/watch?v=wAVYri_mWmM",
    "title": "Sleep Unplugged #80 - Weight Training and Sleep: Keep on Lifting",
    "channel": "Sleep Unplugged with Dr. Chris Winter",
    "language": "en"
   }
  ]
 },
 {
  "topic_num": 29,
  "topic_id": "chronotype_and_midlife",
  "topic": "chronotype, morning vs evening types, and how sleep timing shifts in midlife",
  "videos": [
   {
    "video_id": "Amkg1cdDCpM",
    "url": "https://www.youtube.com/watch?v=Amkg1cdDCpM",
    "title": "Can you change your sleep schedule?",
    "channel": "TED-Ed",
    "language": "en"
   },
   {
    "video_id": "1RE08qza9es",
    "url": "https://www.youtube.com/watch?v=1RE08qza9es",
    "title": "Sleep and Aging - Yale Medicine Explains",
    "channel": "Yale Medicine",
    "language": "en"
   },
   {
    "video_id": "xwtaZYe1WcM",
    "url": "https://www.youtube.com/watch?v=xwtaZYe1WcM",
    "title": "השעון הביולוגי שלנו - איך חיים, אוכלים ומתאמנים לפי השעון הביולוגי, ועוד על המנגנון הגאוני הזה",
    "channel": "TAUVOD",
    "language": "he"
   }
  ]
 },
 {
  "topic_num": 30,
  "topic_id": "lifting_and_sleep_quality",
  "topic": "does resistance training improve sleep (deep sleep, latency), how to program it",
  "videos": [
   {
    "video_id": "wAVYri_mWmM",
    "url": "https://www.youtube.com/watch?v=wAVYri_mWmM",
    "title": "Sleep Unplugged #80 - Weight Training and Sleep: Keep on Lifting",
    "channel": "Sleep Unplugged with Dr. Chris Winter",
    "language": "en"
   },
   {
    "video_id": "ccs4PvcdZ-M",
    "url": "https://www.youtube.com/watch?v=ccs4PvcdZ-M",
    "title": "Exercise, Sleep, and Mental Health: Evidence and Implications for Practice | ADAA Sleep SIG",
    "channel": "ADAA_Anxiety",
    "language": "en"
   },
   {
    "video_id": "xwtaZYe1WcM",
    "url": "https://www.youtube.com/watch?v=xwtaZYe1WcM",
    "title": "השעון הביולוגי שלנו - איך חיים, אוכלים ומתאמנים לפי השעון הביולוגי, ועוד על המנגנון הגאוני הזה",
    "channel": "TAUVOD",
    "language": "he"
   }
  ]
 }
]
```
