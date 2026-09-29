# D1 - YouTube explainers for the sleep-coach "Why?" panel (v1)

- prepared: 2026-09-29
- file: O-output/apps/sleep-coach/research/raw/D1_youtube-explainers_v1.md
- scope: 14 topics, 1 to 3 verified YouTube videos each (best first), English and Hebrew
- contents: 14 topics, 42 list entries covering 38 unique videos (8 Hebrew, 30 English), plus 31 verified bench videos in Appendix B
- user profile: Israeli man, 47, lean, trains 4x/week (weights and cardio), statin for high cholesterol, prediabetes, wants the reasoning behind every insight
- status: RAW research input for the app's video library. It is not coaching advice and no video here should be quoted as medical guidance.
- confidence in one line: every URL below resolved through YouTube oEmbed, but I could not read transcripts or watch the videos, so 'why it fits' and the segment pointers rest on titles, creator descriptions and creator-made chapter lists.

## How to read the entries

Each video has these fields: title and channel (exact oEmbed strings; Hebrew titles also get an English gloss that is my own translation), url, language (en or he), length and publish date (from the watch page), speaker and credentials, why it fits (one line), credibility note, caveat, and segments (only where the creator's own chapter list gives timestamps; chapter titles in Hebrew are translated and marked).

Tier tag at the start of each credibility note:
- Tier A: institution, university, professional society, public broadcaster, or an academic researcher; no commercial angle noticed beyond institutional app promotion.
- Tier B: credible expert or researcher speaking in their field, but on a commercial creator or sponsor-supported channel, or the speaker has a product interest. Usable with the flag shown.
- Tier C: guest or speaker is credible but the host channel or the speaker's expertise is a weaker fit. Use only if the app accepts that risk, or skip.

## Method and limits

- Discovery: YouTube search result pages (English and Hebrew queries), channel-scoped searches inside institutional channels, and web search results. Every video ID in this file appeared in one of those result lists; none was guessed.
- Verification: for every ID in the topic lists and in Appendix B I fetched https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=ID&format=json with WebFetch. All resolved and the channel matched. WebFetch runs a summarising step that sometimes altered characters (Hebrew letters, curly quotes and apostrophes), so the exact title and channel strings in this file were copied from the raw oEmbed JSON fetched directly with curl from the same endpoint; Appendix A lists the entries where the two differed (that list may not be exhaustive). A mistyped ID during my own testing returned a 404, which confirmed IDs are case-sensitive; every ID in this file was therefore cross-checked programmatically against the verified oEmbed results (a mismatch would have stopped the build).
- Dash rule: two original titles contain a dash character (one em dash, one en dash). They are written here with a plain hyphen, as your no-dash rule requires, and each is flagged in its entry.
- Metadata: lengths, publish dates, descriptions, sponsor lines and chapter lists come from each video's watch page. Cited studies were resolved through PubMed, Crossref or Europe PMC where noted.
- Not done: transcripts were unavailable (YouTube blocks caption download here), so I did not confirm what is actually said in any segment. Segment pointers are the creators' own chapter titles. Chapters that looked auto-generated (evenly spaced generic titles) were not used.
- Tooling note: the session's web-search budget ran out partway through, so the last checks (credentials, PubMed and DOI lookups) used direct page reads and public metadata APIs instead.

## Topic index (best first)

- sleep_regularity | Why a consistent sleep and wake time matters for health | mpwBpNhal_M (en), fH917lreUPw (en), SQAHBxvUn08 (he)
- sleep_duration_need | How much sleep adults need, 7+ hours, sleep debt myths | pofc5AIT7Is (en), z4IIqNo9xMw (en), aDpNGXI4ND8 (he)
- sleep_stages_aging | Deep sleep and REM, how sleep architecture changes at 45-55, what is normal | 1RE08qza9es (en), Umt2nct_Vvs (en), rG2kiKfm7rM (he)
- wearable_accuracy | How accurate sleep trackers and sleep-stage estimates are, orthosomnia | 3KSzUAhBESM (en), piW9atgdpU8 (en), Br9qNQceP-8 (en)
- hrv_rhr_recovery | What HRV and resting heart rate tell you about recovery, how to read trends | K1_FXDlO64E (en), eoDcFoOWlmA (en), E_SJ1Lj5B6Y (en)
- caffeine_timing | Caffeine half-life and cut-off time before bed | KQ9FfzMKBNc (en), szCmDEIB-Ws (en), SrMz4lEelrk (he)
- alcohol_sleep_hrv | What alcohol does to sleep quality and overnight HRV | 46i-RLhMtN0 (en), 8XBQK0hUKRo (en), SrMz4lEelrk (he)
- dinner_timing_late_eating | Late dinner and sleep, glucose and digestion | 2-80OGNgYaw (en), OZugGTyBevY (en), Zp5Nb1t_YqQ (he)
- evening_carbs_protein | Evening carbohydrates, protein and casein before bed, and sleep | QNIehDVGtcI (en), 5Quwcdxsa8Y (en), Zp5Nb1t_YqQ (he)
- exercise_timing_evening | Evening exercise and sleep, resistance versus aerobic training | fH917lreUPw (en), SQAHBxvUn08 (he), MpqRCPpanVQ (he)
- overtraining_recovery_signals | Overreaching signs in sleep, HRV and resting heart rate, deloads | KzewemLbm_I (en), 9_ZFXGygJao (en), WupySAArncI (en)
- morning_light_circadian | Morning sunlight and the body clock | 2XMb3MD6g6Q (en), OHSvAKNvq58 (en), 39k9tNAmxbk (he)
- evening_light_screens | Evening light and screens, what the evidence really shows | isPxdnIND5k (en), ud3w_4ycbqk (en), _ZQNYvunf4k (he)
- bedroom_temperature_warm_bath | Cool bedroom, warm shower before bed, body temperature and sleep onset | t0kACis_dJE (en), FmLO9UlebgM (en), KR3JutggUcw (en)

## Coverage summary

| topic_id | videos | Hebrew | weakest point |
|---|---|---|---|
| sleep_regularity | 3 | yes (1) | the institutional item is a 2.5-minute tip list; the deep item is 84 minutes and its host co-sells a supplement |
| sleep_duration_need | 3 | yes (1) | consensus video is pitched at clinicians; sleep-debt coverage is a 2:45 clip |
| sleep_stages_aging | 3 | yes (1) | nothing specific to men aged 45 to 55; the Hebrew item covers stage basics only |
| wearable_accuracy | 3 | no | Apple Watch and Fitbit centered; no independent Oura or Whoop lab test; no Hebrew |
| hrv_rhr_recovery | 3 | no | resting heart rate thinly covered; no Hebrew |
| caffeine_timing | 3 | yes (1) | no short video gives a cut-off hour with the half-life reasoning |
| alcohol_sleep_hrv | 3 | yes (1) | only one podcast clip touches overnight HRV; the Hebrew item is a general 2020 episode |
| dinner_timing_late_eating | 3 | yes (1) | conversational sources only; Hebrew item is Tier C |
| evening_carbs_protein | 3 | yes (1) | casein content only inside a 2.5-hour podcast; Hebrew item is Tier C |
| exercise_timing_evening | 3 | yes (2) | resistance versus aerobic not separated; one English item only |
| overtraining_recovery_signals | 3 | no | no credible deload video; no Hebrew |
| morning_light_circadian | 3 | yes (1) | no lux or duration numbers in any description |
| evening_light_screens | 3 | yes (1) | Hebrew item predates the 2024 review |
| bedroom_temperature_warm_bath | 3 | no | no institutional source on warm bath; sponsor angles; no Hebrew |

## Topics

### sleep_regularity | Why a consistent sleep and wake time matters for health

- hebrew_status: Included (video 3).
- topic_note: The best-known evidence here is observational (irregular sleep timing linked to higher mortality and cardiometabolic risk in UK Biobank data, Windred et al., Sleep 2024). None of these videos proves causation. Video 1 is a 2.5-minute institutional tip list, video 2 is the deep dive, video 3 is Hebrew. A 3-minute Matt Walker short that gives a target of about plus or minus 15 minutes of daily consistency is on the bench (Appendix B).

**Video 1**
- title: Tips For Better Rest and A Healthier Sleep Routine
- channel: Cleveland Clinic
- url: https://www.youtube.com/watch?v=mpwBpNhal_M
- language: en
- length_and_date: 2:38, published 2025-03-24
- speaker_and_credentials: Dr Nancy Foldvary-Schaefer, sleep-medicine specialist, Cleveland Clinic (this description spells the surname 'Foldvary-Schaeffer'; other Cleveland Clinic listings give DO, MS).
- why_it_fits: A 2.5-minute Cleveland Clinic explainer that opens with why the body needs a regular sleep schedule and why a set wake-up time matters, then covers caffeine, alcohol, light and when to see a doctor.
- credibility_note: Tier A. Institutional source; no studies listed; no sponsor or product noticed. The description dates the information to 24 March 2025.
- caveat: Tip-list format: the wake-time point is about 10 seconds of chapter time and gives no evidence or numbers.
- segments_from_creator_chapters: 00:33 Why a set wake-up time is so important; 00:44 Eliminate caffeine later in the day; 00:52 Avoid alcohol 3 hours before bedtime; 01:04 Modify light exposure

**Video 2**
- title: Sleep Scientist Dr. Kristen Knutson: The 4 Things That Actually Determine Your Sleep Health EP#408
- channel: The Proof with Simon Hill
- url: https://www.youtube.com/watch?v=fH917lreUPw
- language: en
- length_and_date: 84:00, published 2026-03-09
- speaker_and_credentials: Dr Kristen Knutson, Associate Professor of Neurology (Sleep Medicine) and Preventive Medicine (Epidemiology), Northwestern University Feinberg School of Medicine (confirmed on her Northwestern faculty profile). Host: Simon Hill, MSc, BSc (Hons) (from his signature; field not stated), creator of The Proof.
- why_it_fits: A sleep scientist discusses circadian health, daily regularity, social jet lag and why catching up on sleep fails, with chapter markers.
- credibility_note: Tier B. Guest is a researcher speaking inside her field. The description says supporting studies are on the show website (not checked). Commercial angle: the description carries sponsor reads including 38TERA, a prebiotic supplement the host says he co-formulated (discount code included), plus WHOOP, Function Health, Mill and Shopify, and links the host's personal supplement stack. Use the guest's segments only.
- caveat: 84 minutes and regularity is one theme among many; send the user to the chapter timestamps, not the whole episode.
- segments_from_creator_chapters: 15:42 Night Owls: Is Your Sleep Schedule Genetic?; 21:39 Why "Catching Up" on Sleep Fails

**Video 3**
- title: מומחה שינה: ״אתה בחיים לא תתעורר עייף שוב״
- title_gloss_en: Sleep expert: "You will never wake up tired again" (my translation, not the video's own text)
- channel: אופק זרמטי - Ofek Zaramati
- url: https://www.youtube.com/watch?v=SQAHBxvUn08
- language: he
- length_and_date: 14:47, published 2026-02-26
- speaker_and_credentials: Guest: Dr Amit Green, described in this video's description as a sleep-consulting expert, researcher and lecturer in applied chronobiology at Tel-Hai College (Assuta Medical Centers describes him elsewhere as a psychologist and vice president for operations and research of its sleep institutes). Host: Ofek Zaramati, fitness coach.
- why_it_fits: A Hebrew interview with a sleep specialist; the description lists the studies discussed, including the 2024 Sleep paper showing regularity predicted mortality better than duration.
- credibility_note: Tier B. Studies cited: yes (PubMed and PMC links in the description). I resolved the regularity link to Windred DP et al., Sleep 2024 (PMC10782501, same paper as PMID 37738616). Weak points: the title is clickbait-style (it translates as a promise that you will never wake up tired again) and the host is a fitness coach and natural bodybuilder who sells coaching (ofekzaramati.com) and links a free sleep-habit tracking assistant he built; no supplement sales noticed in the description. The guest and the study list are the value.
- caveat: No chapters, so the regularity segment cannot be located; content judged from the description only. The same video is listed again under exercise_timing_evening; its description also cites the 2023 caffeine meta-analysis (Gardiner et al.).

### sleep_duration_need | How much sleep adults need, 7+ hours, sleep debt myths

- hebrew_status: Included (video 3).
- topic_note: Consensus figure to anchor the app: the AASM and Sleep Research Society joint statement says 7 or more hours for adults (video 1 covers it). Video 2 covers the sleep-debt myth; the Knutson episode under sleep_regularity has a longer treatment of why catching up fails.

**Video 1**
- title: How Long Should We Sleep? And When? S7-Ep1
- channel: Mayo Clinic
- url: https://www.youtube.com/watch?v=pofc5AIT7Is
- language: en
- length_and_date: 15:24, published 2025-10-17
- speaker_and_credentials: Mayo Clinic sleep-medicine faculty (the speaker is not named in the description). The S7 episodes appear to be a Mayo Clinic sleep-medicine professional-education podcast season (other S7 titles: school start times, shift work, jet lag, pediatric sleep); an iHeart listing for the Mayo Clinic Center for Sleep Medicine podcast names Dr Michael Silber as series host, but I could not confirm this episode appears on that listing.
- why_it_fits: A 15-minute talk on the AASM consensus for adult sleep duration, what it was based on, and the risks at both ends including too much sleep.
- credibility_note: Tier A. Institutional source (Mayo Clinic). No studies listed in the description; no sponsor or product noticed.
- caveat: Pitched at clinicians, speaker unnamed, and roughly the second half (pre-modern sleep and biphasic sleep) is not needed for this topic.
- segments_from_creator_chapters: 01:23 AASM consensus of sleep duration: What do they recommend for adults?; 02:20 And what was this consensus based upon?; 05:22 So what about the other end of the spectrum? Too much sleep?

**Video 2**
- title: Can you "catch up" on your sleep debt?
- channel: Mayo Clinic Press
- url: https://www.youtube.com/watch?v=z4IIqNo9xMw
- language: en
- length_and_date: 2:45, published 2022-06-23
- speaker_and_credentials: Stephen Kopecky, MD, preventive cardiologist at Mayo Clinic (per the description).
- why_it_fits: A 2:45 myth-busting clip: catching up on lost sleep is not as easy as people assume.
- credibility_note: Tier A. Physician speaking on the Mayo Clinic Press channel; no studies listed. Commercial angle: the description promotes his book Live Younger Longer and the podcast; no supplement or device sales noticed.
- caveat: Very short and from a cardiologist rather than a sleep specialist; gives the conclusion, not the evidence.

**Video 3**
- title: זמנולוגיה 3 - כמה שעות לישון
- title_gloss_en: Zmanologia 3 - How many hours to sleep (my translation, not the video's own text)
- channel: Zmanologia
- url: https://www.youtube.com/watch?v=aDpNGXI4ND8
- language: he
- length_and_date: 9:25, published 2019-09-03
- speaker_and_credentials: Dr Maria Korman, per the channel description: PhD from the Weizmann Institute, postdoc at the University of Montreal, researcher at the Safra brain research center at the University of Haifa, studying how the biological clock and sleep affect memory and attention.
- why_it_fits: A 9-minute Hebrew explainer on recommended sleep duration by age (citing the American sleep-medicine recommendations), a self-check, sleep debt and midday naps.
- credibility_note: Tier A. Academic researcher speaking in her field; the description links a Sleep Foundation page and names no peer-reviewed papers. No commercial angle noticed.
- caveat: Small channel, uploaded 2019-09, so it predates newer work; treat it as a plain-language introduction.

- cross_reference: See also (listed under sleep_regularity): fH917lreUPw, segment 21:39 on why catching up fails. Institutional alternatives on the bench (Appendix B): the American Heart Association 4-minute 'How much sleep do you really need?' and Johns Hopkins 'Sleep: The Other Vital Sign'.

### sleep_stages_aging | Deep sleep and REM, how sleep architecture changes at 45-55, what is normal

- hebrew_status: Included (video 3, covers stage basics only, not age-related change).
- topic_note: Gap: I found no free video that explains deep-sleep and REM change specifically for men in their late 40s and early 50s with numbers. The three below give age effects, an age-norm concept, and stage basics in Hebrew. Also relevant (Appendix B): the TED stages clip, the Johns Hopkins lifespan talk, and Yale's 'Getting Better Sleep' chapter 3:27 'What does normal sleep look like?'.

**Video 1**
- title: Sleep and Aging - Yale Medicine Explains
- channel: Yale Medicine
- url: https://www.youtube.com/watch?v=1RE08qza9es
- language: en
- length_and_date: 5:35, published 2023-03-13
- speaker_and_credentials: Yale Medicine sleep-medicine clinician (speaker not named in the description).
- why_it_fits: A 5.5-minute explainer with a dedicated section on which sleep changes are normal with age (earlier melatonin rise, 7 to 9 hours still needed, more disturbance from conditions and medications).
- credibility_note: Tier A. Academic medical center; no studies listed; no commercial angle noticed.
- caveat: General 'aging' message, not specific to 45-55 and without deep-sleep percentages by decade.
- segments_from_creator_chapters: 03:16 What sleep changes are normal as we age?

**Video 2**
- title: 'Sleep age' can determine longterm health | 90 Seconds w/ Lisa Kim
- channel: Stanford Medicine
- url: https://www.youtube.com/watch?v=Umt2nct_Vvs
- language: en
- length_and_date: 3:35, published 2022-12-07
- speaker_and_credentials: Emmanuel Mignot, MD, PhD, Professor of Sleep Medicine at Stanford and Director of the Stanford Center for Narcolepsy (per the description), interviewed by Stanford Medicine media relations (Lisa Kim).
- why_it_fits: A 3.5-minute explainer of 'sleep age': sleep characteristics averaged across people of one age (the description uses 55-year-olds as its example) and how departures from that norm relate to mortality.
- credibility_note: Tier A. Institutional source and a leading sleep researcher. The description cites no paper; no commercial angle noticed.
- caveat: About a research metric built from lab sleep studies, not a consumer-tracker benchmark, and the description gives no deep-sleep or REM percentages.

**Video 3**
- title: פרק#4: מעגל השינה - מיקוד בשנת החלומות
- title_gloss_en: Episode 4: The sleep cycle - focus on dream sleep (my translation, not the video's own text)
- channel: אוניברסיטת חיפה - University of Haifa
- url: https://www.youtube.com/watch?v=rG2kiKfm7rM
- language: he
- length_and_date: 9:10, published 2020-11-09
- speaker_and_credentials: Dr Keren Or-Chen, psychologist at the University of Haifa School of Social Work (per the description); episode 4 of a six-episode series.
- why_it_fits: A 9-minute Hebrew episode asking what the sleep stages are, how long a sleep cycle lasts and what REM sleep is.
- credibility_note: Tier A. University source; the description lists no studies; no commercial angle noticed.
- caveat: 2020; stage basics rather than age-related change, and the episode title focuses on dream sleep.

### wearable_accuracy | How accurate sleep trackers and sleep-stage estimates are, orthosomnia

- hebrew_status: None found (Hebrew results were retail and gadget reviews or translated English videos).
- topic_note: Gap: the two academic items are Fitbit/Apple Watch centered; I found no independent academic lab test of Oura or Whoop stage accuracy in video form. A German-language public-broadcaster lab test of Apple Watch, Oura Ring 4 and Whoop 4.0 against polysomnography (2026) exists but is not he or en, so it is not listed.

**Video 1**
- title: Polysomnography vs Wearable Technology: The Evolution and Future of Sleep Tracking
- channel: Dr Cailbhe Doherty
- url: https://www.youtube.com/watch?v=3KSzUAhBESM
- language: en
- length_and_date: 9:58, published 2024-10-05
- speaker_and_credentials: Dr Cailbhe Doherty, School of Public Health, Physiotherapy and Sports Science, University College Dublin (affiliation taken from the Europe PMC record of the 2026 npj Digital Medicine review that his sibling video summarises).
- why_it_fits: A 10-minute lecture comparing polysomnography (the reference method) with consumer wearables, including how wearables are validated against it and why that is hard.
- credibility_note: Tier A. University researcher. The description lists 10 references (DOIs); I resolved three: a 2024 Sports Medicine living umbrella review of wearable accuracy (Doherty et al.), a 2020 Sleep Medicine Reviews systematic review of wearable accuracy for sleep onset (Scott et al.) and a 2020 actigraphy review (Fekedulegn et al.). No commercial links noticed.
- caveat: Lecture style from 2024; names Fitbit and Apple Watch and does not test Oura or Whoop.
- segments_from_creator_chapters: 06:38 Validating wearables against PSG; 07:50 The challenges of conducting validation research with wearables

**Video 2**
- title: How Accurate Is the Apple Watch? A Comprehensive Review of Validation Studies Across All Models
- channel: Dr Cailbhe Doherty
- url: https://www.youtube.com/watch?v=piW9atgdpU8
- language: en
- length_and_date: 10:08, published 2026-01-24
- speaker_and_credentials: Dr Cailbhe Doherty, University College Dublin (same affiliation as above).
- why_it_fits: Synthesises 82 validation studies (about 430,000 participants) and states that sleep detection is solid for sleep versus wake but limited for staging.
- credibility_note: Tier A. Based on a living systematic review and meta-analysis (npj Digital Medicine 2026, Lambe et al., Doherty last author) funded by Ireland's Health Research Board (grant noted in the description). No commercial angle noticed.
- caveat: Apple Watch only (models up to Series 9 and Ultra 2); the user's device may differ.
- segments_from_creator_chapters: 04:15 Metric by Metric: Heart Rate, SpO2, Sleep, VO2 Max & More (subscripts removed)

**Video 3**
- title: Who decides if you sleep well: you or your watch?
- channel: BBC Global
- url: https://www.youtube.com/watch?v=Br9qNQceP-8
- language: en
- length_and_date: 8:44, published 2026-06-29
- speaker_and_credentials: BBC Global, from the series New Normal with Katty Kay. The description names Dr Kelly Glazer Baron as one of the researchers who coined 'orthosomnia' in 2017; it does not state her affiliation or say which guests speak on camera.
- why_it_fits: An 8.7-minute explainer on orthosomnia: what it is, when tracking turns harmful, why sleep data confuses people and the optimisation trap.
- credibility_note: Tier A. Public broadcaster; no studies listed in the description; no sponsorship noticed.
- caveat: About anxiety and behavior around tracking, not a device accuracy comparison; pair it with the two Doherty items.
- segments_from_creator_chapters: 01:16 What is Orthosomnia?; 02:53 When Tracking Turns Harmful; 04:46 Why Sleep Data Is Confusing; 06:21 Do We Trust Devices Too Much?; 06:53 The Optimization Trap

### hrv_rhr_recovery | What HRV and resting heart rate tell you about recovery, how to read trends

- hebrew_status: None found (Hebrew HRV results were HRV-biofeedback clinic clips and translated English videos, not recovery or trend reading).
- topic_note: Common message across all three: compare with your own baseline and follow multi-day patterns, not single mornings. Resting heart rate gets less airtime than HRV; the Altini episode has the only dedicated segment.

**Video 1**
- title: HRV Explained: How to Track & Interpret Your Heart Rate Variability
- channel: Dr Cailbhe Doherty
- url: https://www.youtube.com/watch?v=K1_FXDlO64E
- language: en
- length_and_date: 6:02, published 2025-04-05
- speaker_and_credentials: Dr Cailbhe Doherty, University College Dublin.
- why_it_fits: A 6-minute explainer on what HRV is, how to measure it, how to interpret numbers and trends, wearable limits and how to use HRV to guide training.
- credibility_note: Tier A. University researcher; 8 citations (DOIs) in the description, including his own group's Apple Watch HRV and resting heart rate validation study (O'Grady et al., Sensors 2024). No commercial angle noticed.
- caveat: Concentrates on HRV; resting heart rate is barely covered.
- segments_from_creator_chapters: 00:40 Interpreting HRV; 03:10 How to measure HRV; 04:05 Using HRV to guide training - a practical guide

**Video 2**
- title: HRV for Runners: What Your Morning Number Actually Means - Marco Altini
- title_note: the original oEmbed title contains a dash character; replaced here by a plain hyphen
- channel: PaceBuddies
- url: https://www.youtube.com/watch?v=eoDcFoOWlmA
- language: en
- length_and_date: 54:34, published 2026-07-17
- speaker_and_credentials: Dr Marco Altini, founder of the HRV4Training app and data science advisor at Oura (per the description), interviewed on The Aerobic Edge podcast.
- why_it_fits: The most direct treatment of reading HRV trends: baseline length, 7-day baseline versus normal range, resting heart rate versus HRV, why single drops mislead, wearable accuracy.
- credibility_note: Tier B. Recognised HRV practitioner-researcher (another channel's description credits him with over 50 peer-reviewed papers; not independently checked); no studies listed here. Commercial angle: he sells HRV4Training and advises Oura; the host sells running coaching and the episode has a sponsor break at 05:26.
- caveat: Runner-focused examples and 54 minutes long; use the chapters.
- segments_from_creator_chapters: 15:07 How long to build a baseline; 16:39 Seven-day baseline vs normal range; 23:33 Resting heart rate vs HRV; 32:59 Should you worry about wearable accuracy?; 37:23 Should your HRV drop after a hard session?; 39:25 What the normal range really is

**Video 3**
- title: Can You Trust Your HRV? What 14 Days of Real-World Data Revealed
- channel: Dr Cailbhe Doherty
- url: https://www.youtube.com/watch?v=E_SJ1Lj5B6Y
- language: en
- length_and_date: 3:20, published 2025-07-24
- speaker_and_credentials: Dr Cailbhe Doherty, University College Dublin.
- why_it_fits: A 3-minute summary of his 14-day study in 41 healthy adults: higher HRV tracked with feeling less stressed and fatigued and better rested, but day-to-day swings averaged 37 percent (up to 70 percent).
- credibility_note: Tier A. His group's own peer-reviewed study (Hannon et al., 'Associations Between Daily Heart Rate Variability and Self-Reported Wellness: A 14-Day Observational Study in Healthy Adults', Sensors 2025, doi 10.3390/s25144415 per the description); no commercial angle noticed.
- caveat: Small sample of healthy adults using chest-strap morning readings; overnight wrist-wearable HRV may behave differently.
- segments_from_creator_chapters: 02:00 HRV fluctuates more than you think, up to 70% (chapter title paraphrased); 02:27 The big takeaway: do not fixate on one number, follow the pattern (chapter title paraphrased)

- cross_reference: See also (listed under overtraining_recovery_signals): KzewemLbm_I, segment 05:28 on HRV and where it fails for lifting, and WupySAArncI on composite readiness scores.

### caffeine_timing | Caffeine half-life and cut-off time before bed

- hebrew_status: Included (video 3).
- topic_note: Gap: no short credible video states a personalised cut-off hour with the half-life reasoning. The peer-reviewed anchor is Gardiner C et al., Sleep Medicine Reviews 2023 (systematic review and meta-analysis of caffeine and subsequent sleep), which the Hebrew Ofek Zaramati video listed under sleep_regularity cites under 'when to stop caffeine'. Also relevant: Cleveland Clinic short mpwBpNhal_M, chapter 00:44 'Eliminate caffeine later in the day' (listed under sleep_regularity), and the Cleveland Clinic diet-and-sleep chapter 42:01 'The Impact of Alcohol and Caffeine on Sleep' (listed under dinner_timing_late_eating).

**Video 1**
- title: How caffeine and alcohol affect your sleep | Sleeping with Science, a TED series
- channel: TED
- url: https://www.youtube.com/watch?v=KQ9FfzMKBNc
- language: en
- length_and_date: 4:55, published 2020-09-02
- speaker_and_credentials: Prof. Matthew Walker (UC Berkeley); the TED description calls him a sleep scientist.
- why_it_fits: A 5-minute summary of how caffeine (and alcohol) change the quantity and quality of sleep.
- credibility_note: Tier A. TED series; no sponsor or product noticed; no citations in the description.
- caveat: The description states no cut-off time or half-life figure, so check the video before quoting numbers; Walker's popular claims have been publicly criticised as overstated in places.

**Video 2**
- title: The Effects of Caffeine, Stimulants, Cannabis, and Alcohol on your Sleep
- channel: UCLA Health
- url: https://www.youtube.com/watch?v=szCmDEIB-Ws
- language: en
- length_and_date: 8:58, published 2023-06-01
- speaker_and_credentials: Dr Sara Mednick, PhD sleep and cognitive neuroscientist at the University of California, Irvine and author of The Power of the Downstate (per the description), in a clip from the UCLA BrainSPORT Podcast.
- why_it_fits: A 9-minute clip on how caffeine, stimulants, cannabis and alcohol influence sleep.
- credibility_note: Tier B. Researcher speaking in her field on a UCLA Health channel; no studies listed. Commercial angle: the description promotes her new book and the podcast; no supplement sales noticed.
- caveat: The description does not say whether caffeine timing or half-life is covered, and there are no chapters.

**Video 3**
- title: פרק #3: המשך טיפים לטיוב איכות השינה -בניית היגיינת שינה
- title_gloss_en: Episode 3: More tips for improving sleep quality - building sleep hygiene (my translation, not the video's own text)
- channel: אוניברסיטת חיפה - University of Haifa
- url: https://www.youtube.com/watch?v=SrMz4lEelrk
- language: he
- length_and_date: 10:02, published 2020-11-09
- speaker_and_credentials: Dr Keren Or-Chen, psychologist at the University of Haifa School of Social Work (per the description); episode 3 of a six-episode series.
- why_it_fits: A 10-minute Hebrew episode whose description asks how caffeine and alcohol affect falling asleep and sleep quality (plus TV, reading and music before sleep).
- credibility_note: Tier A. University source; the description lists no studies; no commercial angle noticed.
- caveat: 2020; the description poses questions and states no cut-off time or half-life, and there are no chapters.

### alcohol_sleep_hrv | What alcohol does to sleep quality and overnight HRV

- hebrew_status: Included (video 3, shared with caffeine_timing).
- topic_note: Gap: only one item (the Attia clip) touches overnight HRV directly, and it is a podcast conversation without cited data. Also relevant: the TED clip KQ9FfzMKBNc and the UCLA clip szCmDEIB-Ws (both listed under caffeine_timing), and Cleveland Clinic short mpwBpNhal_M chapter 00:52 'Avoid alcohol 3 hours before bedtime' (listed under sleep_regularity).

**Video 1**
- title: How Booze Affects Your Snooze | Nancy Foldvary-Schaefer, DO, MS
- channel: Cleveland Clinic
- url: https://www.youtube.com/watch?v=46i-RLhMtN0
- language: en
- length_and_date: 19:44, published 2025-02-06
- speaker_and_credentials: Nancy Foldvary-Schaefer, DO, MS, sleep-medicine specialist, Cleveland Clinic.
- why_it_fits: A 20-minute physician talk on how alcohol undermines sleep quality and REM sleep, its link to sleep disorders including apnea, and practical tips.
- credibility_note: Tier A. Institutional source; no studies listed; no sponsor or product noticed.
- caveat: The description does not mention HRV; use with the Attia clip for the HRV link.
- segments_from_creator_chapters: 02:14 The Science Behind Alcohol and REM Sleep; 05:57 Alcohol's Impact on Sleep Disorders; 13:08 Tips for Better Sleep with Alcohol Consumption

**Video 2**
- title: The impact of exercise, stress, alcohol, and other lifestyle factors on heart rate variability
- channel: Peter Attia MD
- url: https://www.youtube.com/watch?v=8XBQK0hUKRo
- language: en
- length_and_date: 8:09, published 2024-10-08
- speaker_and_credentials: Peter Attia, MD, with guest Joel Jamieson (conditioning coach; per his site 8weeksout.com he sells a coaching certification, courses and a store).
- why_it_fits: A clip from episode 305 of The Drive on HRV whose description lists 'alcohol's effect on overnight HRV and recovery' among the topics.
- credibility_note: Tier B. Physician host, guest is a practitioner; no studies listed. Commercial angle: paid membership and newsletter promotion in the description; the host's site lists his investments and advisory roles.
- caveat: A conversation, not a data review, and an 8-minute clip with no timestamps for the alcohol portion.

**Video 3**
- title: פרק #3: המשך טיפים לטיוב איכות השינה -בניית היגיינת שינה
- title_gloss_en: Episode 3: More tips for improving sleep quality - building sleep hygiene (my translation, not the video's own text)
- channel: אוניברסיטת חיפה - University of Haifa
- url: https://www.youtube.com/watch?v=SrMz4lEelrk
- language: he
- length_and_date: 10:02, published 2020-11-09
- speaker_and_credentials: Dr Keren Or-Chen, psychologist at the University of Haifa School of Social Work (per the description); episode 3 of a six-episode series.
- why_it_fits: A 10-minute Hebrew episode whose description asks how caffeine and alcohol affect falling asleep and sleep quality.
- credibility_note: Tier A. University source; the description lists no studies; no commercial angle noticed.
- caveat: 2020; poses the alcohol question but the description gives no answer, no HRV content, and there are no chapters.

### dinner_timing_late_eating | Late dinner and sleep, glucose and digestion

- hebrew_status: Included (video 3, Tier C, see caveat).
- topic_note: For prediabetes context the Snyder clip is the only one that speaks to next-day glucose; all three are conversational, none is a trial summary. Also relevant (listed elsewhere): the BBC Food Chain episode under evening_carbs_protein, and the Knutson chapters 40:46 Meal Timing and Weight Gain and 46:44 The Best Fasting Window for Your Circadian Rhythm under sleep_regularity.

**Video 1**
- title: The Connection Between Diet and Sleep | Nancy Foldvary-Schaefer, DO
- channel: Cleveland Clinic
- url: https://www.youtube.com/watch?v=2-80OGNgYaw
- language: en
- length_and_date: 51:58, published 2025-05-07
- speaker_and_credentials: Nancy Foldvary-Schaefer, DO, MS, sleep-medicine specialist, and Julia Zumpano, registered dietitian, Cleveland Clinic.
- why_it_fits: A hospital sleep specialist and dietitian cover circadian rhythm and eating habits, and sugar and carbohydrates, in dedicated chapters.
- credibility_note: Tier A. Institutional source; no studies listed. Commercial angle: promotes the Cleveland Clinic Diet app and sleep app; no supplement sales noticed.
- caveat: 52-minute conversation for a general audience; no glucose data or prediabetes-specific advice.
- segments_from_creator_chapters: 04:45 The Role of Sugar and Carbohydrates; 09:14 Circadian Rhythm and Eating Habits (chapter runs to 20:18)

**Video 2**
- title: The Truth About Eating Before Bed | Dr. Michael Snyder & Dr. Andrew Huberman
- channel: Huberman Lab Clips
- url: https://www.youtube.com/watch?v=OZugGTyBevY
- language: en
- length_and_date: 7:52, published 2025-10-19
- speaker_and_credentials: Dr Michael Snyder, professor of genetics at Stanford (per the description), with host Andrew Huberman (Stanford neurobiology professor).
- why_it_fits: A 7:52 clip on how late-night eating affects sleep quality, next-day glucose regulation and metabolic health, which matters for a person with prediabetes.
- credibility_note: Tier B. Researcher speaking in his field; no studies listed. Commercial angle: Huberman Lab is sponsor-supported (its full episodes list supplement sponsors such as AG1); this clip's description carries no sponsor line.
- caveat: Discussion format with no cited data in the description; not personalised medical advice for someone on a statin or with prediabetes.
- segments_from_creator_chapters: 00:00 Impact of Meal Timing on Sleep & Glucose Levels

**Video 3**
- title: פרופ' יובל חלד: שעון ביולוגי, הפרעות שינה, האטת הזדקנות ובאיזה שעות הכי כדאי להתאמן ולאכול
- title_gloss_en: Prof. Yuval Heled: biological clock, sleep disorders, slowing aging, and which hours are best for training and eating (my translation, not the video's own text)
- channel: שחר כהן - Shahar Cohen
- url: https://www.youtube.com/watch?v=Zp5Nb1t_YqQ
- language: he
- length_and_date: 59:25, published 2024-11-20
- speaker_and_credentials: Prof. Yuval Heled: doctorate from Tel Aviv University Faculty of Medicine, postdoctoral work at USUHS in Maryland, professor at the Kibbutzim College faculty of sciences, former chief physiologist of the IDF Medical Corps, over 100 peer-reviewed articles (all from his own website yuvalheled.com). Host: Shahar Cohen, meditation and self-help creator.
- why_it_fits: A chaptered Hebrew interview that includes recommended hours for workouts and meals (12:49) and the value of a fixed daily routine for sleep and digestion (25:12).
- credibility_note: Tier C. Guest is a credible exercise physiologist; no studies cited in the description. Weak point is the host channel: its description makes healing claims and promotes NLP, affirmations and a paid habit-change guide.
- caveat: Chapter titles only, I could not verify what is said in each segment; use only if the app is comfortable linking to that channel.
- segments_from_creator_chapters: 12:49 Recommended hours for workouts and meals (Hebrew chapter title, translated); 25:12 The importance of a fixed daily routine for sleep and digestion (translated)

### evening_carbs_protein | Evening carbohydrates, protein and casein before bed, and sleep

- hebrew_status: Included (video 3, Tier C, see caveat).
- topic_note: Gap: casein and pre-sleep protein are only addressed directly in the 2.5-hour Stronger By Science episode (chapters below). Also relevant (listed under dinner_timing_late_eating): Cleveland Clinic 2-80OGNgYaw, segment 04:45 on sugar and carbohydrates.

**Video 1**
- title: What can I eat for a better night’s sleep? - The Food Chain podcast, BBC World Service
- channel: BBC World Service
- url: https://www.youtube.com/watch?v=QNIehDVGtcI
- language: en
- length_and_date: 22:11, published 2026-08-01
- speaker_and_credentials: Prof. Marie-Pierre St-Onge, Director of the Center of Excellence for Sleep & Circadian Research at Columbia University, and Dr Allie Hare, sleep physician and President of the British Sleep Society (both per the description); presenter Ruth Alexander.
- why_it_fits: A 22-minute look at diet and sleep: fibre, sleep stages, tryptophan, whether 'sleep foods' exist, a good bedtime snack and supplements.
- credibility_note: Tier A. Public broadcaster with two credentialed experts; no sponsor noticed; no studies listed in the description.
- caveat: The description does not mention casein or the evening carbohydrate load of a lifter; treat it as a general nutrition-and-sleep overview.
- segments_from_creator_chapters: 05:50 Why will a diet high in fibre improve sleep?; 08:19 Can diet impact our sleep stages, REM and deep sleep, for example?; 12:34 What's a good bedtime snack?; 14:58 Have studies been done into specific foods affecting sleep?

**Video 2**
- title: Sleep and Nutrition: Pre-Sleep Snacks, and How Your Diet Impacts Your Sleep (Episode 118)
- channel: Stronger By Science
- url: https://www.youtube.com/watch?v=5Quwcdxsa8Y
- language: en
- length_and_date: 149:19, published 2023-08-16
- speaker_and_credentials: Greg and Lyndsey, hosts of the Stronger By Science podcast (evidence-focused strength coaches, not sleep clinicians).
- why_it_fits: The only source found that directly answers pre-sleep protein, slow-digesting protein (casein) and extra carbs or calories right before bed.
- credibility_note: Tier B. Cites studies: the description says the full source list is on the Stronger By Science site (not checked). Commercial angle: the description promotes the MacroFactor app, Stronger By Science coaching and a MASS Research Review subscription, and lists a BulkSupplements promo code (5 percent off).
- caveat: 2 hours 29 minutes, from 2023, with a strength-athlete lens; use the chapters.
- segments_from_creator_chapters: 1:30:14 Recommendations for pre-sleep meal/snacks; 1:37:06 How macronutrient distributions influence sleep; 1:46:40 Sugar/Carbohydrates; 2:01:20 Protein; 2:10:57 Listener question: Should you still eat protein before bed if doing so decreases sleep quality?; 2:15:09 Listener question: Do you need a slow-digesting protein before sleep?; 2:25:09 Listener question: Are there benefits of eating additional total calories (including carbs and carbohydrate) right before bed?

**Video 3**
- title: פרופ' יובל חלד: שעון ביולוגי, הפרעות שינה, האטת הזדקנות ובאיזה שעות הכי כדאי להתאמן ולאכול
- title_gloss_en: Prof. Yuval Heled: biological clock, sleep disorders, slowing aging, and which hours are best for training and eating (my translation, not the video's own text)
- channel: שחר כהן - Shahar Cohen
- url: https://www.youtube.com/watch?v=Zp5Nb1t_YqQ
- language: he
- length_and_date: 59:25, published 2024-11-20
- speaker_and_credentials: Prof. Yuval Heled (credentials as listed under dinner_timing_late_eating), hosted by Shahar Cohen.
- why_it_fits: A Hebrew chapter asks when to eat carbohydrate versus fat and protein (32:44) within a broader talk on body clock, sleep and timing of meals and workouts.
- credibility_note: Tier C. Same as the entry under dinner_timing_late_eating: credible guest, weak host channel, no studies cited in the description.
- caveat: Chapter title only; the content of the segment is unverified and may not mention sleep.
- segments_from_creator_chapters: 32:44 When to eat carbohydrate and when fat and protein (Hebrew chapter title, translated)

### exercise_timing_evening | Evening exercise and sleep, resistance versus aerobic training

- hebrew_status: Included (videos 2 and 3).
- topic_note: Gap: none of the three separates resistance from aerobic training in its description, so that sub-question is unanswered. The peer-reviewed anchor cited by the Hebrew Ofek Zaramati video is Leota et al., Nature Communications 2025, 'Dose-response relationship between evening exercise and sleep'.

**Video 1**
- title: Sleep Scientist Dr. Kristen Knutson: The 4 Things That Actually Determine Your Sleep Health EP#408
- channel: The Proof with Simon Hill
- url: https://www.youtube.com/watch?v=fH917lreUPw
- language: en
- length_and_date: 84:00, published 2026-03-09
- speaker_and_credentials: Dr Kristen Knutson, Northwestern University Feinberg School of Medicine (credentials as listed under sleep_regularity).
- why_it_fits: A sleep scientist gives 'what we know, what we do not, and the key takeaway' on exercise timing in a dedicated chapter titled 'Can Late Workouts Ruin Sleep?'.
- credibility_note: Tier B. Researcher speaking in her field; the description says supporting studies are on the show website (not checked). Sponsor and supplement angle of the host as described under sleep_regularity.
- caveat: About 7 minutes inside an 84-minute episode; use the timestamp.
- segments_from_creator_chapters: 52:49 Can Late Workouts Ruin Sleep? (chapter runs to 1:00:04)

**Video 2**
- title: מומחה שינה: ״אתה בחיים לא תתעורר עייף שוב״
- title_gloss_en: Sleep expert: "You will never wake up tired again" (my translation, not the video's own text)
- channel: אופק זרמטי - Ofek Zaramati
- url: https://www.youtube.com/watch?v=SQAHBxvUn08
- language: he
- length_and_date: 14:47, published 2026-02-26
- speaker_and_credentials: Dr Amit Green (sleep-consulting expert, Tel-Hai College, per the description) with fitness coach Ofek Zaramati.
- why_it_fits: The description cites the 2025 Nature Communications dose-response study on evening exercise and sleep under 'late training'.
- credibility_note: Tier B. Studies cited: yes (I resolved PMID 40234380 to Leota J et al., Nat Commun, 2025). Same weak points as under sleep_regularity: clickbait-style title and a fitness-coach host who sells coaching.
- caveat: No chapters; the exercise segment cannot be located and its wording is unverified.

**Video 3**
- title: האם אימון בערב פוגע בשינה? - דר אסנת רזיאל
- title_gloss_en: Does evening exercise harm sleep? - Dr Asnat Raziel (my translation, not the video's own text)
- channel: Asnat Raziel
- url: https://www.youtube.com/watch?v=MpqRCPpanVQ
- language: he
- length_and_date: 4:59, published 2025-12-20
- speaker_and_credentials: Dr Asnat Raziel, a surgeon specialising in bariatric surgery and obesity treatment who runs the Assia Bariatric multidisciplinary center (Assia Medical Group, Assuta), per the description and channel page.
- why_it_fits: A 5-minute Hebrew summary: light to moderate evening exercise is not harmful, vigorous exercise close to bedtime may delay sleep onset and worsen overnight recovery, aim to finish 3 to 4 hours before bed.
- credibility_note: Tier C. The description names no studies (it mentions 'a large study with thousands of participants'). Commercial angle: the channel markets her clinic (phone, email, obesity-drug hashtags). Speaker is not a sleep or exercise specialist.
- caveat: The 3-4 hour rule is a simplification; it is consistent with the 2025 dose-response study above but that study is not cited in this video.

### overtraining_recovery_signals | Overreaching signs in sleep, HRV and resting heart rate, deloads

- hebrew_status: None found.
- topic_note: Gap: no credible short video on deloads. The deload videos that dominate search are from coaching brands that sell apps or supplements, so deload guidance may need text sources. Item 1 is deliberately skeptical about wearable markers, which is a useful counterweight to the HRV videos.

**Video 1**
- title: Why Your Wearable Is Lying to You About Overtraining
- channel: Barbell Medicine
- url: https://www.youtube.com/watch?v=KzewemLbm_I
- language: en
- length_and_date: 9:04, published 2026-05-01
- speaker_and_credentials: Drs Jordan Feigenbaum (MD, MS) and Austin Baraki (MD, clinical assistant professor of medicine) of Barbell Medicine (credentials from barbellmedicine.com).
- why_it_fits: A 9-minute physician talk on HRV, cortisol and the testosterone-to-cortisol ratio as overtraining markers, arguing subjective monitoring and session RPE beat objective markers.
- credibility_note: Tier B. Cites studies: yes (Saw 2016 review of 56 studies, Meeusen, Foster 1998 and two HRV papers, with PubMed links in the description). Commercial angle: Barbell Medicine sells coaching, training templates, whey protein and pre-workout supplements per its own site.
- caveat: Strength-training lens and a deliberately skeptical stance on HRV; it argues most self-diagnosed overtraining is not overtraining syndrome.
- segments_from_creator_chapters: 01:58 Subjective vs. objective monitoring: subjective wins; 05:28 HRV: what it measures, how to use it, and where it fails for lifting; 06:58 If HRV is trending down, investigate life load; 07:21 Session RPE: the monitoring tool that actually works

**Video 2**
- title: Overtraining Syndrome | National Fellow Online Lecture Series
- channel: The AMSSM
- url: https://www.youtube.com/watch?v=9_ZFXGygJao
- language: en
- length_and_date: 48:07, published 2022-10-13
- speaker_and_credentials: Thomas Howard, MD (moderated by Laura Goldberg, MD), for the American Medical Society for Sports Medicine.
- why_it_fits: A professional-society lecture on overtraining syndrome for sports-medicine fellows.
- credibility_note: Tier A. Professional society; no studies listed in the description; no commercial angle.
- caveat: 48 minutes, technical, 2022, no chapters; I could not confirm from the description that it covers sleep, HRV or resting heart rate signals.

**Video 3**
- title: Can You Trust Whoop, Oura, Garmin and Polar's “Readiness” Scores?
- channel: Dr Cailbhe Doherty
- url: https://www.youtube.com/watch?v=WupySAArncI
- language: en
- length_and_date: 6:51, published 2025-08-30
- speaker_and_credentials: Dr Cailbhe Doherty, University College Dublin.
- why_it_fits: A 7-minute academic look at composite 'readiness, recovery and strain' scores built from HRV, resting heart rate and sleep: inputs, double counting, non-comparability across brands.
- credibility_note: Tier A. Based on his group's systematic review ('Readiness, recovery, and strain: an evaluation of composite health scores in consumer wearables', Translational Exercise Biomedicine 2025, open access, doi 10.1515/teb-2025-0001 per the description) and funded by Ireland's Health Research Board; no commercial angle noticed.
- caveat: About the scores, not about diagnosing overreaching or planning deloads.
- segments_from_creator_chapters: 06:09 How to use composite health scores wisely

- cross_reference: See also (listed under hrv_rhr_recovery): the Altini episode chapter 37:23 on whether HRV should drop after a hard session.

### morning_light_circadian | Morning sunlight and the body clock

- hebrew_status: Included (video 3).
- topic_note: Also relevant (listed under sleep_regularity): Knutson chapter 30:54 How to Use Light & Melatonin, and Cleveland Clinic short mpwBpNhal_M chapter 01:04 'Modify light exposure'. None of the descriptions gives lux or minutes targets, so numeric guidance still needs a text source.

**Video 1**
- title: Essentials: Timing Light for Better Sleep, Energy & Mood | Dr. Samer Hattar
- channel: Andrew Huberman
- url: https://www.youtube.com/watch?v=2XMb3MD6g6Q
- language: en
- length_and_date: 30:45, published 2025-08-21
- speaker_and_credentials: Dr Samer Hattar, Chief of the Section on Light and Circadian Rhythms at the National Institute of Mental Health (per the description), with host Andrew Huberman.
- why_it_fits: A 30-minute 'Essentials' cut with a light and circadian researcher: how light sets the clock, morning sunlight, dimming evening light, screens, regular mealtimes.
- credibility_note: Tier B. Researcher speaking in his field; no studies listed. Commercial angle: Huberman Lab is sponsor-supported (full episodes list supplement sponsors such as AG1); this Essentials description lists no sponsor.
- caveat: Protocol-style advice with no lux or duration figures in the description.
- segments_from_creator_chapters: 00:27 Light, Circadian Clock vs Solar Day, Sleep-Wake Cycle; 06:13 Morning Light, Artificial Lights, Tool: Morning Sunlight Exposure; 09:18 Chronotypes, Intrinsic Circadian Rhythms; 11:10 Afternoon & Evening Light, Tools: Dimming Lights, Reduce Screen Use

**Video 2**
- title: The circadian rhythm and health | Satchin Panda | TEDxBoston
- channel: TEDx Talks
- url: https://www.youtube.com/watch?v=OHSvAKNvq58
- language: en
- length_and_date: 17:54, published 2026-03-16
- speaker_and_credentials: Satchin Panda, circadian biologist (Salk Institute; the description calls him a leading circadian biologist whose group co-identified the blue-light signals that set the human clock).
- why_it_fits: An 18-minute talk distilling three habits: bright daylight and dim evening light, a consistent eating window, and late-afternoon exercise.
- credibility_note: Tier B. Researcher speaking in his field; no studies listed in the description. TED's own note in the description says not to treat the talk as medical advice and that several claims warrant further investigation. Commercial angle: mentions his myCircadianClock app.
- caveat: TEDx talk uploaded 2026-03, recording date not stated; treat claims about timing of medicines and eating window as unproven.

**Video 3**
- title: זמנולוגיה 5 - תפקיד האור: על אור כחול, מלטונין וסיכונים של אור בלילה
- title_gloss_en: Zmanologia 5 - The role of light: blue light, melatonin and the risks of light at night (my translation, not the video's own text)
- channel: Zmanologia
- url: https://www.youtube.com/watch?v=39k9tNAmxbk
- language: he
- length_and_date: 9:35, published 2019-09-23
- speaker_and_credentials: Dr Maria Korman (credentials as listed under sleep_duration_need), University of Haifa.
- why_it_fits: A 9.5-minute Hebrew explainer on light as the main synchroniser of the body clock, why short-wavelength (blue) light matters, melatonin and risks of light at night.
- credibility_note: Tier A. Academic researcher speaking in her field; no papers named in the description; no commercial angle noticed.
- caveat: 2019; the tags include cancer, so it probably covers long-term night-light risk, which is epidemiological and not about typical screen use. It does not clearly focus on morning light.

### evening_light_screens | Evening light and screens, what the evidence really shows

- hebrew_status: Included (video 3).
- topic_note: What the descriptions themselves say: the Vox description states that changing colour temperature or turning on night mode is not enough (sources: Nagare 2019 and Duraccio 2021), and the Gradisar episode treats blue light as a myth to be checked against the linked 2024 review (Bauducco et al., Sleep Medicine Reviews). A 2024 short by Dr Sophie Bostock (not listed) summarises that review as finding that neither screen light nor violent or suspenseful content reliably affects falling asleep, and that engagement and alerts may matter more. Also relevant (listed under morning_light_circadian): Hattar chapter 11:10 on afternoon and evening light.

**Video 1**
- title: How screens actually affect your sleep
- channel: Vox
- url: https://www.youtube.com/watch?v=isPxdnIND5k
- language: en
- length_and_date: 6:38, published 2024-05-20
- speaker_and_credentials: Vox video explainer (narrator not named; cites peer-reviewed studies).
- why_it_fits: A 6.6-minute explainer: colour temperature or night mode alone does not counter screen effects, because screens act on sleep through more than blue light.
- credibility_note: Tier A. Two studies listed: Nagare et al. 2019 (iPad Night Shift and melatonin suppression, Lighting Research & Technology) and Duraccio et al. 2021 (iPhone Night Shift in emerging adults, Sleep Health). Sponsor: Brilliant (learning platform, unrelated to health; Vox says it has no editorial say).
- caveat: Short synthesis resting on two small young-adult studies.

**Video 2**
- title: Sleep Science, Myths & Technology with Professor Michael Gradisar
- channel: Optimising Human Performance
- url: https://www.youtube.com/watch?v=ud3w_4ycbqk
- language: en
- length_and_date: 44:10, published 2025-09-02
- speaker_and_credentials: Prof. Michael Gradisar, sleep researcher and clinical psychologist and co-author of the 2024 review the description links; now Head of Sleep Science at Sleep Cycle (a sleep-tracking app), per the description.
- why_it_fits: A sleep researcher debunks blue-light and sleep-hygiene myths, with the linked 2024 review (Bauducco et al., 'A bidirectional model of sleep and technology use', Sleep Medicine Reviews).
- credibility_note: Tier B. Researcher speaking inside his field; sources linked (blue-light review, magnesium review). Commercial angle: his employer sells a sleep app; the podcast is produced by OPHP (ophp.co.uk).
- caveat: 44-minute podcast and only the first chapters concern light; verify claims against the linked review.
- segments_from_creator_chapters: 03:10 Debunking Sleep Myths: Blue Light and Sleep Hygiene (chapter runs to 11:06)

**Video 3**
- title: זמנולוגיה 6 - שימוש נאור באור: ההיגיון והעקרונות של תאורה צירקדיאנית
- title_gloss_en: Zmanologia 6 - Enlightened use of light: the logic and principles of circadian lighting (my translation, not the video's own text)
- channel: Zmanologia
- url: https://www.youtube.com/watch?v=_ZQNYvunf4k
- language: he
- length_and_date: 10:23, published 2019-11-12
- speaker_and_credentials: Dr Maria Korman (credentials as listed under sleep_duration_need), University of Haifa.
- why_it_fits: A 10-minute Hebrew explainer on the logic and principles of circadian lighting, meaning how to light the day and evening to protect the body clock.
- credibility_note: Tier A. Academic researcher speaking in her field; the description is a single line and names no papers; no commercial angle noticed.
- caveat: 2019, so it predates the 2024 review cited above that found screen light itself often has small effects; check for nuance.

- cross_reference: See also: Cleveland Clinic short mpwBpNhal_M chapter 01:04 'Modify light exposure' (listed under sleep_regularity); the Haifa episode SrMz4lEelrk (listed under caffeine_timing) whose description asks about TV, books and music before sleep; Yale's 'Getting Better Sleep' (Appendix B), which gives the conventional advice to avoid room and electronic light a few hours before bed and to use blue-light-blocking glasses if needed, advice the newer sources above are less enthusiastic about; and the UC Davis Health optometry explainer (Appendix B), chapters 02:06 'Does blue light affect sleep?' and 02:35 'Do blue light glasses work?'.

### bedroom_temperature_warm_bath | Cool bedroom, warm shower before bed, body temperature and sleep onset

- hebrew_status: None found.
- topic_note: Gap: no institutional video on the warm bath or shower effect; the two sleep-scientist items are Tier B. A 2023 TODAY segment description says a Harvard study of adults over 50 found 68 to 77 F (20 to 25 C) optimal, warmer than Walker's 16 to 18 C; I did not verify that study, and the user is 47. A long institutional alternative (Mayo Clinic Human Optimization Project E40, sleep environment) is in Appendix B.

**Video 1**
- title: 6 tips for better sleep | Sleeping with Science, a TED series
- channel: TED
- url: https://www.youtube.com/watch?v=t0kACis_dJE
- language: en
- length_and_date: 5:29, published 2020-09-02
- speaker_and_credentials: Prof. Matthew Walker (UC Berkeley); the TED description calls him a sleep scientist.
- why_it_fits: A 5.5-minute talk on how room temperature, lighting and other easy fixes set up better sleep.
- credibility_note: Tier A. TED series; no sponsor noticed; no citations in the description.
- caveat: The description gives no temperature figure, so check the video before quoting; Walker's popular claims have been publicly criticised as overstated in places.

**Video 2**
- title: #14: Temperature - Part 2
- title_note: the original oEmbed title contains a dash character; replaced here by a plain hyphen
- channel: Sleep Diplomat (Matt Walker)
- url: https://www.youtube.com/watch?v=FmLO9UlebgM
- language: en
- length_and_date: 10:23, published 2024-11-29
- speaker_and_credentials: Prof. Matthew Walker (UC Berkeley), on his own podcast channel.
- why_it_fits: A 10-minute episode explaining why a warm bath or shower helps (skin blood flow rises, core temperature falls), giving 16 to 18 C (61 to 65 F) as the average adult optimum and suggesting warming the room about 30 minutes before waking.
- credibility_note: Tier B. The description summarises body-temperature suit experiments but cites no papers. Commercial angle: this episode is sponsored by InsideTracker (blood and DNA testing service) and the description promotes an 'Art of Sleep' community; the description says Walker is not a medical doctor.
- caveat: The 16-18 C figure is a population average from Walker, and his popular claims have been publicly criticised as overstated in places.

**Video 3**
- title: #3 Can a warm bath help you to fall asleep?
- channel: Dr Sophie Bostock, The Sleep Scientist
- url: https://www.youtube.com/watch?v=KR3JutggUcw
- language: en
- length_and_date: 2:48, published 2021-01-13
- speaker_and_credentials: Dr Sophie Bostock, 'The Sleep Scientist' (self-described scientist turned sleep evangelist who consults for individuals, teams and organisations).
- why_it_fits: A 2:48 answer to whether a warm bath, shower or footbath helps you fall asleep faster, part of her Sleep Toolkit series.
- credibility_note: Tier B. No studies listed in the description. Commercial angle: she markets consulting to individuals, teams and organisations; no product sales noticed.
- caveat: 2021, very short, and the description does not state the timing or water temperature.

- cross_reference: See also: Yale Medicine 'Getting Better Sleep' (Appendix B), chapter 02:53 'How do you optimize the sleep environment?' (the chapter content is not described, so it is not ranked).

## Appendix A - verification log (topic-list videos)

Every row: WebFetch of the oEmbed URL returned the video and the same channel. 'raw JSON used' means WebFetch's text differed from the raw oEmbed JSON in some characters, so the raw JSON string is what this file shows.

| video_id | channel (oEmbed author_name) | WebFetch oEmbed check | used under |
|---|---|---|---|
| mpwBpNhal_M | Cleveland Clinic | OK | sleep_regularity |
| fH917lreUPw | The Proof with Simon Hill | OK | sleep_regularity, exercise_timing_evening |
| SQAHBxvUn08 | אופק זרמטי - Ofek Zaramati | OK, WebFetch altered Hebrew characters; raw JSON used | sleep_regularity, exercise_timing_evening |
| pofc5AIT7Is | Mayo Clinic | OK | sleep_duration_need |
| z4IIqNo9xMw | Mayo Clinic Press | OK | sleep_duration_need |
| aDpNGXI4ND8 | Zmanologia | OK, WebFetch altered Hebrew characters; raw JSON used | sleep_duration_need |
| 1RE08qza9es | Yale Medicine | OK | sleep_stages_aging |
| Umt2nct_Vvs | Stanford Medicine | OK | sleep_stages_aging |
| rG2kiKfm7rM | אוניברסיטת חיפה - University of Haifa | OK | sleep_stages_aging |
| 3KSzUAhBESM | Dr Cailbhe Doherty | OK | wearable_accuracy |
| piW9atgdpU8 | Dr Cailbhe Doherty | OK | wearable_accuracy |
| Br9qNQceP-8 | BBC Global | OK | wearable_accuracy |
| K1_FXDlO64E | Dr Cailbhe Doherty | OK | hrv_rhr_recovery |
| eoDcFoOWlmA | PaceBuddies | OK | hrv_rhr_recovery |
| E_SJ1Lj5B6Y | Dr Cailbhe Doherty | OK | hrv_rhr_recovery |
| KQ9FfzMKBNc | TED | OK | caffeine_timing |
| szCmDEIB-Ws | UCLA Health | OK | caffeine_timing |
| SrMz4lEelrk | אוניברסיטת חיפה - University of Haifa | OK, WebFetch altered Hebrew characters; raw JSON used | caffeine_timing, alcohol_sleep_hrv |
| 46i-RLhMtN0 | Cleveland Clinic | OK | alcohol_sleep_hrv |
| 8XBQK0hUKRo | Peter Attia MD | OK | alcohol_sleep_hrv |
| 2-80OGNgYaw | Cleveland Clinic | OK | dinner_timing_late_eating |
| OZugGTyBevY | Huberman Lab Clips | OK | dinner_timing_late_eating |
| Zp5Nb1t_YqQ | שחר כהן - Shahar Cohen | OK, WebFetch altered Hebrew characters; raw JSON used | dinner_timing_late_eating, evening_carbs_protein |
| QNIehDVGtcI | BBC World Service | OK, WebFetch normalised quotes or apostrophes; raw JSON used | evening_carbs_protein |
| 5Quwcdxsa8Y | Stronger By Science | OK | evening_carbs_protein |
| MpqRCPpanVQ | Asnat Raziel | OK | exercise_timing_evening |
| KzewemLbm_I | Barbell Medicine | OK | overtraining_recovery_signals |
| 9_ZFXGygJao | The AMSSM | OK | overtraining_recovery_signals |
| WupySAArncI | Dr Cailbhe Doherty | OK, WebFetch normalised quotes or apostrophes; raw JSON used | overtraining_recovery_signals |
| 2XMb3MD6g6Q | Andrew Huberman | OK | morning_light_circadian |
| OHSvAKNvq58 | TEDx Talks | OK | morning_light_circadian |
| 39k9tNAmxbk | Zmanologia | OK, WebFetch altered Hebrew characters; raw JSON used | morning_light_circadian |
| isPxdnIND5k | Vox | OK | evening_light_screens |
| ud3w_4ycbqk | Optimising Human Performance | OK | evening_light_screens |
| _ZQNYvunf4k | Zmanologia | OK | evening_light_screens |
| t0kACis_dJE | TED | OK | bedroom_temperature_warm_bath |
| FmLO9UlebgM | Sleep Diplomat (Matt Walker) | OK | bedroom_temperature_warm_bath |
| KR3JutggUcw | Dr Sophie Bostock, The Sleep Scientist | OK | bedroom_temperature_warm_bath |

## Appendix B - verified bench (not part of the 1-to-3 lists)

Also fetched through oEmbed and found valid. Use only as replacements if a primary video is removed or the app wants a longer or deeper option. Each has a reason it was not ranked in the top three. For four bench entries (three Hebrew titles and one apostrophe) WebFetch's text differed from the raw oEmbed JSON, so the raw JSON string is shown.

- title: #110 - The Science Behind Wearable Sleep Monitoring
  - channel: Sleep Diplomat (Matt Walker); url: https://www.youtube.com/watch?v=opWwyGQ8fas; language: en; 62:10, published 2025-10-13
  - possible use: wearable_accuracy
  - note: 62-minute episode explaining sensitivity, specificity and absolute versus relative accuracy of trackers, and orthosomnia. Not ranked: no chapters, sponsors listed in the description (AG1, Shopify, Puori) and it presents one specific FDA-cleared ring (Happy Ring) as highly accurate.
- title: Heart Rate Variability and Training: Best Practices with Marco Altini
  - channel: Wattkg; url: https://www.youtube.com/watch?v=NMVtxhGPDds; language: en; 61:20, published 2024-05-26
  - possible use: hrv_rhr_recovery
  - note: Marco Altini on HRV and training with a literature list (Seiler 2007, Buchheit 2014, Granero-Gallegos 2020) and chapters such as 26:12 using HRV and resting heart rate, 43:59 baseline duration, 45:42 which deviations matter. Not ranked: 61 minutes and the PaceBuddies episode has a more direct trend-reading chapter list.
- title: Mayo Clinic Human Optimization Project: How to Fix Your Sleep Environment E40
  - channel: Mayo Clinic; url: https://www.youtube.com/watch?v=4V2XI_MJp_Q; language: en; 51:32, published 2025-11-26
  - possible use: bedroom_temperature_warm_bath; evening_light_screens; sleep_regularity
  - note: Mayo Clinic sleep-environment episode with Dr Tim Morgenthaler (51 minutes). Not ranked: the chapter list looks auto-generated (evenly spaced generic titles), so timestamps cannot be trusted and no warm-bath content is described.
- title: Mayo Clinic Human Optimization Project: Understanding the Basics of Sleep E14
  - channel: Mayo Clinic; url: https://www.youtube.com/watch?v=3wCsOsK9BIw; language: en; 52:47, published 2025-06-27
  - possible use: sleep_stages_aging
  - note: Mayo Clinic episode on the basics of sleep with neurologist Dr Stuart McCarter (52 minutes): what sleep is, stage functions, how to tell if you sleep enough. Not ranked: long, no chapters, not age-specific.
- title: Mayo Clinic Human Optimization Project: Understanding Your Circadian Rhythm E7
  - channel: Mayo Clinic; url: https://www.youtube.com/watch?v=aoHH5BfLcsQ; language: en; 41:46, published 2025-05-20
  - possible use: morning_light_circadian
  - note: Mayo Clinic episode on the circadian rhythm with Dr Michael Howell, sleep physician at the University of Minnesota (42 minutes). Not ranked: long and no chapters.
- title: Why do we sleep? | Russell Foster
  - channel: TED; url: https://www.youtube.com/watch?v=LWULB9Aoopc; language: en; 21:47, published 2013-08-14
  - possible use: morning_light_circadian; sleep_duration_need
  - note: Classic TED talk (2013) by Prof. Russell Foster, circadian neuroscientist, on why we sleep and the body clock. Not ranked: 13 years old.
- title: Harvard Thinking: Are you getting enough sleep? Probably not.
  - channel: Harvard University; url: https://www.youtube.com/watch?v=bmoARUbKv5k; language: en; 31:22, published 2025-11-07
  - possible use: sleep_duration_need
  - note: Harvard Thinking podcast video with sleep scientist Rebecca Robbins, psychiatrist Tony Cunningham and epidemiologist Matthew Weaver (31 minutes). Not ranked: general sleep-deprivation discussion, no chapters, no specific hours figure in the description.
- title: How much sleep do you really need? | Sleeping with Science, a TED series
  - channel: TED; url: https://www.youtube.com/watch?v=knJWF4km3y0; language: en; 2:55, published 2020-09-02
  - possible use: sleep_duration_need
  - note: TED clip in which Matt Walker states the recommended amount for adults (2:55). Not ranked: shorter and less evidence-based than the Mayo consensus video.
- title: Do You Really Need 8 Hours of Sleep Every Night? | Body Stuff with Dr. Jen Gunter | TED
  - channel: TED; url: https://www.youtube.com/watch?v=fQUeDdaVoWo; language: en; 3:53, published 2022-11-02
  - possible use: sleep_duration_need; wearable_accuracy
  - note: TED clip by Dr Jen Gunter arguing you should not lose sleep over sleep and criticising the gadget and doom-messaging industry (3:53). Useful counterweight to orthosomnia; not ranked because it is a short opinion piece from a gynaecologist, not a sleep specialist.
- title: Best Diet & Time to Eat for Increasing Deep Sleep | Dr. Marie-Pierre St-Onge & Dr. Andrew Huberman
  - channel: Huberman Lab Clips; url: https://www.youtube.com/watch?v=LcVh5MRlqP4; language: en; 11:37, published 2026-06-09
  - possible use: dinner_timing_late_eating
  - note: Huberman Lab clip with Prof. Marie-Pierre St-Onge (Columbia): fibre, saturated fat and late eating, with a chapter 10:45 'Best Time To Stop Eating'. Ranked below the Snyder clip only because that clip speaks to glucose; a strong alternate. Huberman Lab sponsor flag applies.
- title: The honest truth about screens at bedtime (it’s not what you think)
  - channel: BrainCraft; url: https://www.youtube.com/watch?v=9ZXQSvQbBrE; language: en; 9:20, published 2026-03-13
  - possible use: evening_light_screens
  - note: BrainCraft explainer (9:20) with recent references (Sleep Health 2025 study, 2024 Sleep Medicine Reviews review, 2024 National Sleep Foundation consensus statement). Not ranked: the description flags a Samsung paid partnership with Galaxy Watch and Ring product links.
- title: Overtraining, Overreaching, and Burnout: Dr. Stephen Seiler Explains Fatigue States
  - channel: Fast Talk Laboratories; url: https://www.youtube.com/watch?v=NQEOUmMeUqo; language: en; 122:31, published 2025-05-22
  - possible use: overtraining_recovery_signals
  - note: Fast Talk episode with exercise physiologist Dr Stephen Seiler on overtraining, overreaching and burnout (2 hours 2 minutes). Not ranked: no chapters, endurance-cycling lens, produced by Fast Talk Labs (a cycling training and coaching brand).
- title: What Is Overtraining Syndrome? The Definition Problem
  - channel: Barbell Medicine; url: https://www.youtube.com/watch?v=qtKpob3iHwM; language: en; 19:29, published 2026-04-07
  - possible use: overtraining_recovery_signals
  - note: Barbell Medicine 19-minute video on why 'overtraining' is defined inconsistently, with chapters and cited studies (Meeusen 2013 consensus). Not ranked: same source as the top-ranked item, so kept as the second-choice from that channel.
- title: The Science of Heart Rate Variability (HRV): Health, Wellness & Performance
  - channel: Dr Cailbhe Doherty; url: https://www.youtube.com/watch?v=K5Pm9rDAZ0k; language: en; 19:09, published 2024-03-09
  - possible use: hrv_rhr_recovery
  - note: Dr Cailbhe Doherty's 19-minute deeper lecture on HRV (time-domain versus frequency-domain, measurement protocol, personal frame of reference) with 8 citations. Not ranked: longer than the 6-minute explainer that already covers interpretation.
- title: Why Sleep Gets Worse With Age (And What Actually Helps) | Mayo Clinic Aging Forward Podcast
  - channel: Mayo Clinic; url: https://www.youtube.com/watch?v=N7D3vtrykCY; language: en; 33:22, published 2026-07-09
  - possible use: sleep_stages_aging
  - note: Mayo Clinic Aging Forward podcast with geriatrician Dr Melissa Bogin (33 minutes) with chapters such as 01:34 how sleep changes with age. Not ranked: aimed at adults over 60.
- title: פרק 16- איך לשפר את איכות השינה? עם פרופ' יובל חלד | קצת יותר בריאים
  - title_gloss_en: Episode 16 - How to improve sleep quality? With Prof. Yuval Heled | A bit healthier (my translation)
  - channel: יסכה חסון; url: https://www.youtube.com/watch?v=DkkUToa1tms; language: he; 54:36, published 2024-01-06
  - possible use: sleep_regularity; sleep_duration_need; morning_light_circadian
  - note: Hebrew podcast (54 minutes) with Prof. Yuval Heled on sleep quality, sleep types, sleep hygiene, melatonin and the role of the sun; he is described as the person behind the IDF move to 7 hours of sleep for soldiers. Not ranked: no chapters and the host channel describes itself as a posture and back-health channel.
- title: 10K הרצאת החודש: פרופ׳ גיורא פילר
  - title_gloss_en: 10K lecture of the month: Prof. Giora Pillar (my translation)
  - channel: Weizmann Institute of Science; url: https://www.youtube.com/watch?v=bmQBshMiW4I; language: he; 68:40, published 2023-02-06
  - possible use: sleep_duration_need; sleep_regularity
  - note: Weizmann Institute '10K lecture of the month' by Prof. Giora Pillar (68 minutes). A sister upload on the Project 10K channel describes him as an MD from the Technion, trained in sleep medicine at Harvard, running Clalit's sleep clinics network and deputy dean at the Technion medical faculty. Not ranked: long, no chapters, content not described.
- title: השפעת השימוש בסלולרי לפני השינה, על איכות השינה. ד"ר עמית גרין, אסותא מרכזים רפואיים
  - title_gloss_en: The effect of cell-phone use before sleep on sleep quality. Dr Amit Green, Assuta Medical Centers (my translation)
  - channel: אסותא מרכזים רפואיים; url: https://www.youtube.com/watch?v=GoPZixmogrE; language: he; 6:10, published 2022-01-26
  - possible use: evening_light_screens
  - note: Assuta Medical Centers TV segment (6:10) with Dr Amit Green on how staring at a screen before sleep disrupts sleep quality. Not ranked: broadcast soundbite and the description suggests the simple 'screens disrupt sleep' framing.
- title: מזון לפי שעון והזמן הנכון לשרוף שומן - פרופ' אורן פרוי
  - title_gloss_en: Food by the clock and the right time to burn fat - Prof. Oren Froy (my translation)
  - channel: Hebrew University of Jerusalem; url: https://www.youtube.com/watch?v=tE2Z66ByVJ0; language: he; 85:10, published 2014-01-29
  - possible use: dinner_timing_late_eating
  - note: Hebrew University lecture by Prof. Oren Froy on eating by the clock and the right time to burn fat (85 minutes). Not ranked: published 2014, no chapters.
- title: פרק #2: טיפים לטיוב איכות שינה - טיפוסי שינה
  - title_gloss_en: Episode #2: Tips for improving sleep quality - sleep types (my translation)
  - channel: אוניברסיטת חיפה - University of Haifa; url: https://www.youtube.com/watch?v=eyI193fWCMw; language: he; 10:03, published 2020-11-09
  - possible use: sleep_duration_need
  - note: University of Haifa episode with Dr Keren Or-Chen (psychologist) on short and long sleepers and how many hours an adult needs (10 minutes, 2020). Not ranked behind Zmanologia only because the Zmanologia episode cites recommendations by age and discusses sleep debt.
- title: זמנולוגיה 4 - מהי שינה איכותית? איך אני ישן
  - title_gloss_en: Zmanologia 4 - What is quality sleep? How do I sleep (my translation)
  - channel: Zmanologia; url: https://www.youtube.com/watch?v=jwO7a3FcZkg; language: he; 8:45, published 2019-09-06
  - possible use: wearable_accuracy; sleep_stages_aging
  - note: Zmanologia episode 4 (8:45, 2019) on how sleep quality is assessed with objective brain-activity recording versus subjective report. Background for tracker accuracy but it does not discuss wearables.
- title: Sleep Regularity & Timing Impact on Health #shorts
  - channel: Sleep Diplomat (Matt Walker); url: https://www.youtube.com/watch?v=tfa2zw56J5s; language: en; 3:00, published 2025-12-15
  - possible use: sleep_regularity
  - note: Matt Walker's 3-minute short on regularity and timing, with a target of about plus or minus 15 minutes of daily consistency. Not ranked: Tier B channel (its long episodes carry AG1, Puori and InsideTracker sponsorship and it promotes an 'Art of Sleep' community), no studies listed, and the Cleveland Clinic short covers the same point from an institution.
- title: A walk through the stages of sleep | Sleeping with Science, a TED series
  - channel: TED; url: https://www.youtube.com/watch?v=eM2VWspRpfk; language: en; 4:48, published 2020-09-02
  - possible use: sleep_stages_aging
  - note: TED clip in which Matt Walker walks through REM and non-REM stages (4:48, 2020). Not ranked behind the Stanford and Hebrew items only because it does not address age; still a clean stage primer.
- title: Changes in Sleep and Circadian Rhythms in Aging and Memory Loss
  - channel: Johns Hopkins ADRC; url: https://www.youtube.com/watch?v=L01gYldsTrM; language: en; 10:33, published 2021-06-16
  - possible use: sleep_stages_aging
  - note: Johns Hopkins Alzheimer's center talk by Alfonso Alfini, PhD, on how sleep and circadian rhythms change across the lifespan and in memory loss (10:33, 2021). Not ranked: framed around memory loss and older adults; no chapters.
- title: Getting Better Sleep - Yale Medicine Explains
  - channel: Yale Medicine; url: https://www.youtube.com/watch?v=Y-h6hLlszAI; language: en; 4:48, published 2023-03-13
  - possible use: sleep_stages_aging; bedroom_temperature_warm_bath; evening_light_screens
  - note: Yale Medicine explainer (4:48, 2023) with chapters 00:46 how can you rise feeling refreshed, 02:12 how can you prepare for sleep, 02:53 how do you optimize the sleep environment, 03:27 what does normal sleep look like. The description says to avoid room and electronic light a few hours before bed and to use blue-light-blocking glasses if needed. Not ranked: chapter content is not described in detail, and the blue-light-glasses advice is weakly supported by the newer sources in this file.
- title: How much sleep do you really need?
  - channel: American Heart Association; url: https://www.youtube.com/watch?v=qBcSMTKvE2M; language: en; 4:17, published 2023-06-23
  - possible use: sleep_duration_need
  - note: American Heart Association 'House Calls' episode (4:17, 2023): Dr Eduardo Sanchez, the AHA's chief medical officer for prevention, on how much sleep you need, what happens during sleep and how lack of sleep raises health risks. Strong lay-audience alternate; not ranked because its description does not mention sleep debt or the AASM consensus.
- title: What You Eat Affects Your Sleep: Mayo Clinic Radio
  - channel: Mayo Clinic; url: https://www.youtube.com/watch?v=ks8UVc2ZotQ; language: en; 8:20, published 2017-10-06
  - possible use: dinner_timing_late_eating
  - note: Mayo Clinic Radio interview (8:20, published 2017) with gastroenterologist Dr Joseph Murray on why what you eat before bed can affect sleep. Not ranked: published 2017, no chapters, no glucose angle.
- title: Ep 10. Sleep: The Other Vital Sign | Medicine Made General
  - channel: Johns Hopkins Medicine; url: https://www.youtube.com/watch?v=bOmlaqvrS0E; language: en; 31:20, published 2026-03-24
  - possible use: sleep_duration_need
  - note: Johns Hopkins 'Medicine Made General' episode with Dr Charlene Gamaldo (31 minutes, 2026): how much sleep adults really need and the consequences of chronic sleep deprivation. Not ranked: the description is truncated, there are no chapters, and it does not mention sleep debt.
- title: פרק #1: מבוא לחקר השינה -מהן בעיות השינה הנפוצות ומהן הסיבות להן?
  - title_note: the original oEmbed title contains a dash character; replaced here by a plain hyphen
  - title_gloss_en: Episode 1: Introduction to sleep research - what are the common sleep problems and what causes them? (my translation)
  - channel: אוניברסיטת חיפה - University of Haifa; url: https://www.youtube.com/watch?v=CxrDY_X5y58; language: he; 9:54, published 2020-11-09
  - possible use: sleep_duration_need
  - note: University of Haifa episode 1 with Dr Keren Or-Chen (9:54, 2020): common sleep problems and causes, light sleep, and whether lost sleep hours can be made up. Not ranked: the description only poses questions; the Zmanologia episode gives recommendations by age.
- title: Blue Light - How it Affects Your Eyes, Sleep and Health |  UC Davis Health
  - channel: UC Davis Health; url: https://www.youtube.com/watch?v=-5HJoW9IP0I; language: en; 4:44, published 2024-02-16
  - possible use: evening_light_screens
  - note: UC Davis Health optometry explainer (4:44, 2024) by Dr Melissa Barnett, director of optometry, with chapters 02:06 Does blue light affect sleep?, 02:35 Do blue light glasses work?, 03:03 Tips to limit exposure to blue light. Institutional alternate; not ranked because the speaker is an optometrist and the piece is framed around eye health.
- title: פרופ' תמר שוחט בהרצאה על "ינשופים ועפרונים: כיצד השעון הביולוגי משפיע על בריאות ותפקוד"
  - title_gloss_en: Prof. Tamar Shochat lecture on "Owls and larks: how the biological clock affects health and functioning" (my translation)
  - channel: אוניברסיטת חיפה - University of Haifa; url: https://www.youtube.com/watch?v=BWcKe_bA3aU; language: he; 15:54, published 2018-10-02
  - possible use: sleep_regularity; morning_light_circadian
  - note: Prof. Tamar Shochat (University of Haifa) lecture on owls and larks and how the body clock affects health (16 minutes, published 2018). Not ranked: published before 2019 and content not described beyond the title.

## Appendix C - considered and rejected (no URLs on purpose)

- A 2026 English video titled 'How Much Sleep Do You Really Need?' from an MD PhD keto-diet creator: the description promotes the peptide Pinealon with a discount code and an affiliate link for a gamma light device. Rejected as a supplement and device sales angle.
- A short 2026 irregular-bedtime video from a PhD nutrition scientist that cites the right UK Biobank study with PubMed IDs: the description also sells the creator's supplements, a coaching app, courses and workouts. Rejected under the supplement-seller rule even though the science summary is sound.
- The Quantified Scientist channel (wearable tests against sleep EEG): the descriptions carry affiliate links for Oura, Whoop, Eight Sleep and other products. Rejected as a product-affiliate channel; the topic is covered by University College Dublin videos instead.
- A 2021 temperature-and-sleep video by a psychiatrist-educator that lists proper references: sponsored by Eight Sleep with a personal commission code. Rejected as sponsored by a sleep-cooling product.
- Hebrew health-site shorts on the last coffee of the day and on dinner timing: presenter is the website's editor and founder, no clinical credentials stated. Rejected on credentials.
- A Hebrew Rambam Medicine Center clip on eating before bed: the center describes itself as science-based natural health with a natural-therapy orientation. Rejected on orientation.
- A Hebrew clip on coffee, alcohol and sleep by a cancer and virology PhD biologist with generic tips and no references. Rejected on relevance of expertise and lack of sources.
- A German-language public-broadcaster lab test of Apple Watch, Oura Ring 4 and Whoop 4.0 against polysomnography (2026): relevant and credible but not he or en.
- Long Huberman Lab and Matt Walker podcast episodes (2 to 3 hours): descriptions list supplement or product sponsors (AG1, Puori protein powder, InsideTracker, Helix Sleep) and they were replaced by shorter items or clips where the guest is the value.
- Many high-view search results were consumer wellness clips and single-headline health-news snippets; most were not opened beyond their search-result lines.

End of file.
