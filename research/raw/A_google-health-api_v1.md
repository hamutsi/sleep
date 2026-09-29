# Track A - Data access feasibility: Fitbit Air / Google Health (v1)

Research date: 2026-09-29. Scope: how a Cloudflare Pages Functions / Workers backend (JavaScript, no native app) can read ONE user's sleep and recovery data from a Fitbit Air.
Method: official pages were opened directly (HTTP fetch of the live page, then text extraction; plus WebFetch). "Last updated" dates are the dates printed on each page. Source IDs [Sxx] map to section 12. Anything not confirmed in an opened source is tagged [UNVERIFIED]. Effort figures are the author's estimates, not sourced facts.

---

## 0. Executive summary

- VERDICT: FEASIBLE with an official, documented path. The Google Health API (`https://health.googleapis.com/v4/...`, REST + JSON, Google OAuth 2.0) is "the next generation of the Fitbit Web API" and returns Fitbit and Pixel data [S1][S2]. A Worker can call it with plain `fetch`; no SDK needed.
- Fitbit Air is explicitly supported. Its device row lists sleep, HRV (daily + samples), resting HR, SpO2 (daily + minute), respiratory rate (daily + per-sleep summary), daily sleep temperature derivations, heart rate, steps, active minutes, Active Zone Minutes, exercise, VO2 max [S8].
- NOT available via API: Sleep Score, readiness, Google Health Coach output, stress/Resilience. Minute-level skin temperature is on the Q4 2026 roadmap ("Granular skin temperature") [S2]; the app itself removed minute-by-minute skin temperature [S42]. Sleep efficiency is not a field but the docs give the formula [S9].
- Main blocker = OAuth policy, not tech. All Google Health API scopes are Restricted [S2]. Public use needs OAuth verification plus an annual CASA security assessment (2-6 weeks, USD 500-4,500) [S5]. BUT Google exempts "Personal Use apps ... (fewer than 100 users)"; users "click through 'unverified app' warning screens" [S34]. The Health API setup page confirms unverified clients have "a cap of 100 users for both testing and production purposes" [S3].
- The 7-day rule is real and current: in "Testing" status, refresh tokens "expire after 7 days" [S3][S32][S36]. In "In production" status they "generally don't expire unless they are revoked or remain unused for a prolonged period (typically six months)" [S3].
- Recommended path: (1) build in Testing mode with the friend as test user, verify data; (2) press "Publish app" (In production, unverified, personal use); friend re-consents once via "Advanced > Go to {Project Name} (unsafe)" [S38]; (3) if Google blocks that, stay in Testing and ask for a 20-second reconnect every 7 days.
- Freshness: data exists in the API only after the phone app syncs [S7]. Webhooks exist (push on new data, retried up to 7 days) [S19]. The legacy Fitbit Web API is being turned down in September 2026 [S2][S31] (an unofficial report says the deadline moved to Oct 30, 2026 [S69]); do not build on it.
- Israel: the in-app Gemini "Google Health Coach" (Premium) is NOT offered in Israel (not in the 37-country list) [S44][S46]. This strengthens the case for our own coach. No API exposes the Coach.
- Aggregators (Terra, Junction, ROOK) cost about USD 300-499 per month minimum [S60][S64][S65]; not worth it for one user unless Google blocks the direct path.

---

## 1. What is "Fitbit Air"

| Item | Finding | Source |
|---|---|---|
| Announcement / pre-order | Google blog post dated 2026-05-07: "We are introducing the Fitbit Air, our smallest and most affordable tracker"; pre-order "starting at $99.99" | [S39] |
| On-shelf / ship | Blog: Special Edition "on-shelf in the U.S. May 26". DC Rainmaker (secondary, 2026-05-07): "$99USD, no subscription required" at launch on May 26 | [S39][S41] |
| Form factor | "screenless pebble", swappable bands (Performance Loop, Active, Elevated Modern). No display; a status LED shows charging/low battery/firmware update | [S39][S40] |
| Battery | "up to a week of battery life"; "a full day of power in just five minutes" of charging | [S39] |
| Metrics (official) | "24/7 heart rate, heart rhythm monitoring with Afib alerts, SpO2, resting heart rate, heart rate variability, sleep stages and duration"; automatic workout detection | [S39] |
| Sensors | Official Google Store spec page is JS-rendered and could not be read [UNVERIFIED official list]. DC Rainmaker (secondary): "Optical heart rate monitor, plus a red and infrared sensor for SpO2 monitoring", skin temperature, "3-Axis accelerometer + gyroscope"; 5.2 g without band, 12 g with band; water resistant to 50 m; "7 days of memory for detailed motion data" | [S41] |
| Temperature evidence (official) | API device table lists Daily Sleep Temperature Derivations and Skin Temperature for `air` | [S8] |
| Sleep tracking | Sleep stages (Light/Deep/REM/Awake), duration, nightly SpO2, HRV, breathing rate, temperature derivations exposed via API for `air` | [S8][S9] |
| Companion app | "pairs with the Google Health app"; works with Android 11+ and iOS 16.4+; "Requires Google Account and Google Health app" | [S39] |
| Subscription | Includes "a three-month trial of Google Health Premium"; Premium renews at "$9.99/mo after trial"; Coach "Requires Google Health Premium". Help page: "You'll need Google Health Premium to use advanced health tracking features" (which features is not listed) | [S39][S40] |
| Subscription for API data | No Google Health API page mentions Premium as a prerequisite for data access [UNVERIFIED either way; confirm on first call] | [S1]-[S30] |
| Also | Can be paired together with a Pixel Watch in the same app ("filter the view by device") | [S40] |

---

## 2. The Google Health app vs the old Fitbit app, and the Coach

- Rebrand: "Starting May 19, 2026, the Fitbit app will become the Google Health app"; auto-update between May 19 and May 26 [S42]. Four tabs: Today, Fitness, Sleep, Health [S42].
- Premium rename: "As of May 19, 2026, Fitbit Premium will be renamed Google Health Premium" [S42].
- Removed or changed (relevant to sleep): Sleep Profile removed; Estimated Oxygen Variation removed; Sleep Sensitivity settings removed; "Skin Temperature minute-by-minute data will no longer be available" (daily and weekly trends remain); sleep score algorithm "improved" [S42].
- Google Account requirement: "After May 19, 2026, you can no longer access Fitbit with your Fitbit account"; data deletion processing starts July 15, 2026 for unmigrated accounts; "A Google Account is now required to sign up for the Google Health app and activate newly-released Fitbit and Pixel devices" [S43].
- IMPORTANT: "You can't link your Google Health account to a Google Workspace account" [S43]. The friend must use a personal Google account. (Inference: the OAuth "Internal" user type, which skips verification, needs a Workspace/Cloud Identity org [S34], so it cannot be used here.)
- Gemini coach: "Google Health Coach" is a Premium feature "built with Gemini" [S44]. The blog (2026-05-07) says Public Preview launched "last year" and the Coach "will exit preview and become available globally" on May 19 as part of Premium [S45]. Requirements: a Fitbit or Pixel Watch device, age 18+, and residence in one of: Australia, Austria, Belgium, Brazil, Canada, Czech Republic, Denmark, Estonia, Finland, France, Germany, Hungary, India, Indonesia, Ireland, Italy, Japan, Latvia, Lithuania, Malaysia, Mexico, Netherlands, New Zealand, Norway, Poland, Portugal, Romania, Singapore, Slovakia, Slovenia, South Korea, Spain, Sweden, Switzerland, Taiwan, United Kingdom, United States [S44][S46]. ISRAEL IS NOT LISTED.
- Coach via API: none. The REST reference has no coach, insight, score or readiness resource [S11][S12]. A search of the whole Health doc set for "sleep score", "readiness", "sleepScore" found nothing (only prose mentions of "readiness") [S9].
- Base Google Health app availability in Israel: official country list not located [UNVERIFIED]. Moot, since the user already runs it.

---

## 3. The developer API: Google Health API

### 3.1 Identity of the API
- Docs home: https://developers.google.com/health [S1]. About page (last updated 2026-09-23) [S2].
- "The Fitbit Web API has been improved and modernized ... and is now called the Google Health API" [S2].
- Service endpoint: `https://health.googleapis.com`, version `v4` [S11]. REST (JSON) and gRPC [S1].
- Auth: "Replace legacy Fitbit Authorization (FOT) with Google OAuth 2.0" [S2]. Authorization endpoint `https://accounts.google.com/o/oauth2/v2/auth`, token endpoint `https://oauth2.googleapis.com/token` [S26][S3].
- Launched 2026-03-24 (release notes) [S25]. Roadmap Q4 2026: "Granular skin temperature", "Basal Metabolic Rate", more Health Connect data types Q4 2026 and Q1 2027, "Statistics endpoint to monitor webhooks telemetry" [S2].
- Pricing: no price or billing requirement found anywhere in the Health docs; the official codelab has no billing step [S26] [UNVERIFIED that it is free].

### 3.2 Scopes (exact strings) [S4]
Prefix: `https://www.googleapis.com/auth/googlehealth`
| Scope | Consent text shown to the user |
|---|---|
| `.activity_and_fitness.readonly` | See your Google Health activity and fitness data. |
| `.health_metrics_and_measurements.readonly` | See your Google Health health metrics and measurement data. |
| `.sleep.readonly` | See your Google Health sleep data. |
| `.settings.readonly` | See your Google Health settings. |
| `.profile.readonly` | See your Google Health profile data. |
| `.nutrition.readonly` | See your Google Health nutrition data. |
| `.location.readonly` | See your Google Health GPS location recorded during an exercise. |
| `.ecg.readonly`, `.irn.readonly` | ECG / Irregular Rhythm Notifications data |
| `*.writeonly` variants | activity_and_fitness, health_metrics_and_measurements, nutrition, profile, settings, sleep, logged_symptoms, mindfulness, reproductive_health |

Scope-to-data-type map (read) [S16]:
- `.sleep.readonly`: `sleep`
- `.health_metrics_and_measurements.readonly`: blood-glucose, body-fat, core-body-temperature, daily-heart-rate-variability, daily-heart-rate-zones, daily-oxygen-saturation, daily-respiratory-rate, daily-resting-heart-rate, daily-sleep-temperature-derivations, heart-rate, heart-rate-variability, height, oxygen-saturation, respiratory-rate-sleep-summary, weight
- `.activity_and_fitness.readonly`: active-energy-burned, active-minutes, active-zone-minutes, activity-level, altitude, calories-in-heart-rate-zone, daily-vo2-max, distance, exercise, floors, run-vo2-max, sedentary-period, steps, swim-lengths-data, time-in-heart-rate-zone, total-calories, vo2-max
- `.settings.readonly`: needed for `users.pairedDevices.list` (gives `lastSyncTime`) [S29] and `users.getSettings` (gives `timeZone`, `utcOffset`) [S30]

Classification: "All Google Health API scopes are categorized as Restricted, necessitating a privacy and security review for access" [S2]. (The App verification page says "Most scopes ... are restricted" [S5]; treat all as Restricted.)
Minimum set for this app: `.sleep.readonly .health_metrics_and_measurements.readonly .activity_and_fitness.readonly .settings.readonly`. Skip write scopes (docs: only configure write if sending data [S4]).

### 3.3 REST methods [S11]
- `GET /v4/{parent=users/*/dataTypes/*}/dataPoints` (list)
- `GET /v4/{parent=users/*/dataTypes/*}/dataPoints:reconcile` (deduplicated stream; supports `dataSourceFamily`) [S14]
- `POST .../dataPoints:rollUp` (physical-time windows), `POST .../dataPoints:dailyRollUp` (civil days) [S15][S17]
- `GET /v4/{name=users/*/dataTypes/*/dataPoints/*}` (get), plus create, patch, batchDelete, exportExerciseTcx
- `GET /v4/users/me/identity` (users.getIdentity), `getProfile`, `getSettings`, `getIrnProfile`
- `GET /v4/{parent=users/*}/pairedDevices` (list), get
- Webhooks: `projects.subscribers` and `projects.subscribers.subscriptions` (create/list/patch/delete)

### 3.4 Filters and paging (critical details)
- Filter syntax is AIP-160; only `>=` and `<`, only AND; must be URL-encoded [S16].
- Data type in the path is kebab-case (`daily-heart-rate-variability`), in the filter it is snake_case (`daily_heart_rate_variability`); hyphens in a filter return 400 INVALID_DATA_POINT_FILTER [S16].
- Fields per record type [S16]: Interval `{t}.interval.start_time` / `{t}.interval.civil_start_time`; Sample `{t}.sample_time.physical_time` / `{t}.sample_time.civil_time`; Daily `{t}.date`; Sleep `sleep.interval.end_time` / `sleep.interval.civil_end_time`; Exercise `exercise.interval.civil_start_time`.
- Do not mix physical and civil bounds in one filter (INVALID_DATA_POINT_FILTER_MIXED_TIME_RESTRICTIONS) [S16].
- Page size: default 1440, max 10,000; for sleep and exercise default and max 25 [S13][S7].
- Rollup range limits: 14 days for calories-in-heart-rate-zone, heart-rate, active-minutes, total-calories; 90 days for others; `windowSize` >= "1s" [S7].
- `dataSourceFamily` values (full URI required): `users/me/dataSourceFamilies/all-sources` (default), `.../google-wearables` (tracker only, excludes manual and phone-estimated), `.../google-sources` [S17].
- 64-bit integers arrive as JSON strings (for example `"beatsPerMinute": "58"`) [S12].
- On-wrist filtering: "Unless otherwise noted, data types will exclude data points that are identified as recorded by wearables in intervals when they were not actually worn" [S12].

### 3.5 Availability matrix for this project (Fitbit Air)
Legend: AV = available and documented; NA = not available; UNCLEAR = see note.

| Need | Status | dataType / endpoint | Key fields (exact) | Src |
|---|---|---|---|---|
| Sleep sessions with stages + timestamps | AV | `sleep` list or reconcile | `sleep.interval{startTime,startUtcOffset,endTime,endUtcOffset,civilStartTime,civilEndTime}`, `sleep.type` (CLASSIC/STAGES), `sleep.stages[]{startTime,startUtcOffset,endTime,endUtcOffset,type,createTime,updateTime}` with type AWAKE/LIGHT/DEEP/REM/ASLEEP/RESTLESS, `sleep.outOfBedSegments[]`, `sleep.metadata{stagesStatus,processed,nap,manuallyEdited,externalId}`, `sleep.summary{stagesSummary[]{type,minutes,count},minutesInSleepPeriod,minutesAfterWakeUp,minutesToFallAsleep,minutesAsleep,minutesAwake}`, `sleep.createTime`, `sleep.updateTime` | [S12][S17] |
| Sleep efficiency | AV (computed) | from `sleep.summary` | Docs formula: "round( (Total Minutes Asleep / Total Minutes In Bed) * 100 )". Mapping "In Bed" to `minutesInSleepPeriod` is an inference (in the official sample 407+57=464 = minutesInSleepPeriod) | [S9][S17] |
| Sleep Score (0-100) | NA | none | No score field in the DataPoint schema | [S12] |
| Sleep onset latency | AV, weak | `sleep.summary.minutesToFallAsleep` | For auto-detected logs it "defaults to 0" | [S9] |
| HR during sleep | AV | `heart-rate` list (1 s storage resolution) filtered to the sleep window, or `rollUp` | `heartRate.sampleTime.physicalTime`, `heartRate.beatsPerMinute`, `heartRate.metadata.motionContext`; rollup value `beatsPerMinuteAvg`, `beatsPerMinuteMax`, `beatsPerMinuteMin` | [S12][S15][S7] |
| Non-REM HR | AV | `daily-heart-rate-variability` | `dailyHeartRateVariability.nonRemHeartRateBeatsPerMinute` | [S12] |
| Resting HR | AV | `daily-resting-heart-rate` | `dailyRestingHeartRate.date`, `.beatsPerMinute`, `.dailyRestingHeartRateMetadata.calculationMethod` (WITH_SLEEP / ONLY_WITH_AWAKE_DATA) | [S12] |
| HRV (RMSSD) daily | AV | `daily-heart-rate-variability` | `.averageHeartRateVariabilityMilliseconds` ("calculated using the root mean square of successive differences (RMSSD)"), `.deepSleepRootMeanSquareOfSuccessiveDifferencesMilliseconds`, `.entropy`, `.nonRemHeartRateBeatsPerMinute`, `.date` | [S12] |
| HRV samples | AV | `heart-rate-variability` | `heartRateVariability.sampleTime`, `.rootMeanSquareOfSuccessiveDifferencesMilliseconds` (range 1-200), `.standardDeviationMilliseconds` | [S12] |
| Breathing rate | AV | `daily-respiratory-rate`; `respiratory-rate-sleep-summary` | daily: `dailyRespiratoryRate.date`, `.breathsPerMinute` ("One data point per day calculated for the main sleep"); per sleep: `respiratoryRateSleepSummary.sampleTime`, `.fullSleepStats`, `.deepSleepStats`, `.lightSleepStats`, `.remSleepStats`, each `{breathsPerMinute, standardDeviation, signalToNoise}` | [S12] |
| Breathing rate samples | UNCLEAR | `respiratory-rate` | Listed for `air` in device table and mentioned in the sleep guide, but absent from the REST union and data-types index | [S8][S9][S12] |
| SpO2 | AV | `daily-oxygen-saturation`; `oxygen-saturation` (1-min) | daily: `.date`, `.averagePercentage`, `.lowerBoundPercentage`, `.upperBoundPercentage`, `.standardDeviationPercentage`; minute: `oxygenSaturation.sampleTime`, `.percentage`. Minute data is validity-filtered, "gaps ... are expected" | [S12][S9][S24] |
| Skin temperature deviation | AV (nightly) | `daily-sleep-temperature-derivations` | `.date`, `.nightlyTemperatureCelsius` (mean skin temp during sleep), `.baselineTemperatureCelsius` (30-day median), `.relativeNightlyStddev30dCelsius`. Deviation = nightly minus baseline (computed) | [S12] |
| Skin temperature granular | NA now | `skin-temperature` | Listed in device table for `air`, not in REST union; roadmap "Granular skin temperature" Q4 2026 | [S8][S2] |
| Steps | AV | `steps` list (1-min) or dailyRollUp | `steps.interval`, `steps.count`; rollup `countSum` | [S12][S17] |
| Active minutes | AV | `active-minutes` | `activeMinutes.interval`, `.activeMinutesByActivityLevel[]{activityLevel, activeMinutes}` | [S12] |
| Active Zone Minutes | AV | `active-zone-minutes` | `activeZoneMinutes.interval`, `.heartRateZone` (FAT_BURN/CARDIO/PEAK), `.activeZoneMinutes`; rollup `sumInFatBurnHeartZone`, `sumInCardioHeartZone`, `sumInPeakHeartZone` | [S12][S15] |
| Exercise sessions | AV | `exercise` | `exercise.interval`, `.exerciseType` (includes STRENGTH_TRAINING, WEIGHTLIFTING, RUNNING, WALKING, ...), `.displayName`, `.activeDuration`, `.metricsSummary{caloriesKcal, distanceMillimeters, steps, averageHeartRateBeatsPerMinute, activeZoneMinutes, heartRateZoneDurations, ...}`, `.exerciseEvents[]`, `.updateTime` | [S12][S26] |
| Weight | AV if logged (Air does not measure it) | `weight` | `weight.sampleTime`, `.weightGrams`, `.notes` | [S12][S8] |
| VO2 max | AV | `daily-vo2-max`, `vo2-max`, `run-vo2-max` | `runVo2Max.runVo2Max` (ml/kg/min); other VO2 field names not extracted | [S12] |
| Intraday | AV by default | list endpoint | "intraday data and webhooks are now available for all relevant data types through a dedicated list endpoint" | [S2] |
| Last device sync time | AV | `users.pairedDevices.list` | `pairedDevices[]{deviceVersion, lastSyncTime, batteryLevel, batteryStatus, deviceType, features[]}`; needs `.settings.readonly` | [S29] |
| User time zone | AV | `users.getSettings` | `timeZone`, `utcOffset` | [S30] |
| Readiness, stress, Coach output | NA | none | not in reference | [S11][S12] |

Sample shape, sleep via reconcile (official example, trimmed) [S17]:
```
GET https://health.googleapis.com/v4/users/me/dataTypes/sleep/dataPoints:reconcile?dataSourceFamily=users/me/dataSourceFamilies/google-wearables&filter=sleep.interval.civil_end_time >= "2026-03-03"
{ "dataPoints": [ {
  "name": "users/2515055256096816351/dataTypes/sleep/dataPoints/2724123844716220216",
  "dataSource": { "recordingMethod": "DERIVED", "device": { "displayName": "Charge 6" }, "platform": "FITBIT" },
  "sleep": {
    "interval": { "startTime": "2026-03-03T20:57:30Z", "startUtcOffset": "0s", "endTime": "2026-03-04T04:41:30Z", "endUtcOffset": "0s" },
    "type": "STAGES",
    "stages": [ { "startTime": "...", "startUtcOffset": "0s", "endTime": "...", "endUtcOffset": "0s", "type": "AWAKE", "createTime": "...", "updateTime": "..." } ],
    "metadata": { "stagesStatus": "SUCCEEDED", "processed": true, "main": true },
    "summary": { "minutesInSleepPeriod": "464", "minutesAfterWakeUp": "0", "minutesToFallAsleep": "0", "minutesAsleep": "407", "minutesAwake": "57",
      "stagesSummary": [ {"type":"AWAKE","minutes":"56","count":"12"}, {"type":"LIGHT","minutes":"198","count":"19"}, {"type":"DEEP","minutes":"114","count":"10"}, {"type":"REM","minutes":"94","count":"4"} ] },
    "createTime": "2026-03-04T04:43:40.337983Z", "updateTime": "2026-03-04T04:43:40.937183Z" } } ],
  "nextPageToken": "" }
```
Daily types have no official sample response; their JSON representation is in the reference, for example `{"date":{"year":2026,"month":9,"day":29},"averageHeartRateVariabilityMilliseconds":42.1,...}` (shape per [S12], values illustrative).

Identity sample [S17]: `{"name":"users/me/identity","legacyUserId":"A1B2C3","healthUserId":"111111256096816351"}`.
Steps rollup sample [S17]: `{"rollupDataPoints":[{"startTime":"2026-07-29T08:00:00Z","endTime":"2026-07-29T09:00:00Z","steps":{"countSum":"1200"}}]}`.

### 3.6 Documentation inconsistencies found (code defensively, store raw JSON)
1. Sleep guide example uses `sleepStages`, `shortAwakenings`, `sleepType`, `minutesAfterWakeup` at top level; the REST reference and the reconcile sample use `sleep.stages`, `sleep.outOfBedSegments`, `sleep.type`, `sleep.summary.minutesAfterWakeUp` [S9] vs [S12][S17]. Trust the REST reference.
2. `metadata.main` appears in the official sample but not in the `Sleep.SleepMetadata` schema table (whose description does say "processing, main, manually edited") [S17][S12].
3. `ReconciledDataPoint` schema names the id `dataPointName` and has no `dataSource`; the official reconcile sample shows `name` and `dataSource` [S14][S17]. Accept both.
4. Codelab sample has `distanceMillimiters`; the reference has `distanceMillimeters` [S26][S12].
5. Vitals guide examples use `?startTime=...&endTime=...`; the list reference documents only `filter`, `pageSize`, `pageToken` [S10][S13]. Use `filter`.
6. List reference example `dailyHeartRateVariability.date`; filters guide requires snake_case `daily_heart_rate_variability.date` [S13][S16]. Use snake_case.
7. Webhook verification: guide says the authorized probe expects "200 OK or 201 Created"; the create reference says "HTTP 201 Created" [S19][S20]. Return 201.
8. Device table lists `respiratory-rate` and `skin-temperature` for `air`; neither exists in the REST union [S8][S12].
9. "All" scopes restricted [S2] vs "Most scopes ... are restricted" [S5].
10. About page still says changes may come "between now and the end of May" [S2]. Expect API drift; Open Wearables shipped Google Health fixes in 0.9.0 (2026-09-17), including "Existing Google Health API energy data is wrong" [S67].

---

## 4. Legacy Fitbit Web API (dev.fitbit.com)

- Official banner on dev.fitbit.com (fetched 2026-09-29): "We will be deprecating the legacy Fitbit Web API in September 2026. To ensure uninterrupted data continuity for your users, you will need to migrate your applications" [S31].
- Google Health About: "In September 2026, the legacy Fitbit Web API will be turned down and will no longer sync data to or from Fitbit users" [S2].
- Unofficial: a developer email reportedly says "extending the user migration deadline to October 30, 2026"; the article itself says "this is all yet to be confirmed" (2026-09-28) [S69]. MyDataHelps: "Google is deprecating the Fitbit API on October 30th, 2026" [S70]. Google's pages did not mention Oct 30 on 2026-09-29.
- Tokens: "existing access and refresh tokens cannot be transferred, requiring users to re-consent" [S23].
- Whether the legacy API returns Fitbit Air data: [UNVERIFIED]. Irrelevant: it dies this week or next month.
- Migration material: guide https://developers.google.com/health/migration [S23]; endpoint/scope/data-type mapping https://developers.google.com/health/migration/api-specifications [S24]; parity tool https://developers.google.com/health/migration/parity-tool [S25].
- Decision: build only on the Google Health API.

---

## 5. Access model for a personal single-user app

### 5.1 Registration (all official) [S3][S26]
1. Google Cloud project (console.cloud.google.com, "Select a project" > "New Project", Location "No organization") [S26].
2. Enable "Google Health API": https://console.developers.google.com/apis/library/health.googleapis.com [S3].
3. Google Auth Platform (menu names: Branding, Audience, Data Access, Clients) [S32][S26]: App name, User support email, Audience "External", Contact information, accept Google API Services User Data Policy [S26].
4. Data Access: https://console.developers.google.com/auth/scopes > "Add or remove scopes" > search "Google Health API" > select > Update > Save [S3].
5. Credentials: https://console.developers.google.com/apis/credentials > "+ Create Credentials" > "OAuth client ID" > "Web application" > Authorized redirect URIs [S26]. Redirect URI rules: HTTPS (localhost exempt), no raw IP, TLD on the public suffix list, no fragment, no wildcard [S37].
6. Audience: https://console.developers.google.com/auth/audience: "Publishing status" Testing, "User type" External; "+ Add users" to add test users [S3].
- No allowlist or access request form for the Health API was found in the docs [S1]-[S30].

### 5.2 Verification and security assessment (what we avoid)
- "If your app isn't verified, it's limited to 100 users" [S5]. Verification = OAuth app verification (Trust and Safety review) + third-party CASA security assessment [S5].
- CASA: "annual", "2-3 weeks for tier-2 applications and 4-6 weeks for tier-3", "fees ... ranging from $500 to $4,500 USD" [S5]. Also in-app disclosure rules [S5].
- "Supporting more than 100 users with the Google Health API requires completion of a third party security review" [S3].

### 5.3 The personal-use exemption (key source)
- "Personal Use apps: If the app is for your personal use (fewer than 100 users), you and your limited number of users can continue using the app without going through verification (users will be allowed to click through 'unverified app' warning screens during sign-in)" [S34].
- "Apps in development: if your app is experimental or a test build, you don't need to go through verification unless you decide to launch it to the public" [S33].
- User cap: "100 new users in total, after the app presents the unverified app screen"; the cap "applies over the entire lifetime of the project, and it cannot be reset" [S33][S32].
- Health API specific: "newly created OAuth clients are in an unverified state with a cap of 100 users for both testing and production purposes. To enable authorization during this period, you must manually add each user's email address to the Test users list" [S3]. (Ambiguous: test users normally matter only in Testing. Safe move: add the friend as a test user anyway.)
- Answer: YES, a developer can read their own or one named friend's account with no verification review.

### 5.4 Token lifetimes by publishing status (the 7-day question)
- Testing: "Authorizations by a test user will expire seven days from the time of consent. If your OAuth client requests an offline access type and receives a refresh token, that token will also expire" [S32]. Health setup: refresh tokens "are time-based and expire after 7 days" [S3]. Identity docs: Testing + External "is issued a refresh token expiring in 7 days, unless the only OAuth scopes requested are a subset of name, email address, and user profile" [S36]. Codelab token responses show `"refresh_token_expires_in": 604799` (7 days) [S26][S27].
- In production: refresh tokens "generally don't expire unless they are revoked or remain unused for a prolonged period (typically six months)" [S3]. Other invalidation causes: user revocation; 6 months unused; over 100 live refresh tokens per account per client (oldest silently invalidated); "time-based access" grants [S36]. `refresh_token_expires_in` is "only set when the user grants time-based access" [S37].
- Access token: `"expires_in": 3599` [S3].
- Rule confirmed current (pages updated 2026-05-26 to 2026-09-29).

### 5.5 Real-world plan to keep a refresh token alive for one friend
- Path A (recommended): Publish to "In production" without submitting verification (personal use, under 100 users). Consent Screen shows the unverified-app warning; friend clicks through once; refresh token is long-lived. Sources: publishing status "In production after selecting the Publish app button"; Google "will display an Unverified apps warning message" for unverified restricted scopes [S32]; personal-use exemption [S34]; Health cap applies to "production purposes" too [S3].
  - Caveat 1: [S32] also says production projects "may be subject to verification ... before it may request authorization of sensitive or restricted scopes". Whether Google hard-blocks an unverified production Health API client was not testable here [UNVERIFIED].
  - Caveat 2: the Health checklist frames publishing as a post-verification step ("Once OAuth verification is complete, publish your app to 'In production'") [S6]. This is guidance, not a stated prohibition.
  - Caveat 3: a token minted while in Testing probably keeps its 7-day expiry after publishing [UNVERIFIED]. Force a fresh consent (`prompt=consent`) after publishing and check that `refresh_token_expires_in` is absent.
- Path B (fallback, guaranteed by docs): stay in Testing, friend in Test users; app tracks `refresh_token_expires_in` and shows a "reconnect" banner on day 6. Cost: about 20 seconds per week for the friend.
- Path C (pay): use an aggregator whose own OAuth app carries the verification (section 8d). Junction's default app is "conditionally approved and available while Junction completes the required Cloud Application Security Assessment (CASA)" [S63].
- Not possible: OAuth 2.0 Playground with Google's own client ("The Google Health API requires that you use your own OAuth credentials with Playground") [S27]. Not useful: Data Portability API offers only `dataportability.fitbit.device_events` [S56].

### 5.6 Exactly what the friend clicks on first connect
1. Tap "Connect" in our PWA; browser opens accounts.google.com; choose his personal Google account.
2. Testing status: a warning that the app is not verified; press "Continue" [S26]. Production-unverified status: a screen titled "This app isn't verified"; press "Advanced", then "Go to {Project Name} (unsafe)" [S38].
3. Consent page: "The consent page lists the scopes being requested. The user has the opportunity to select whichever scopes they want to share"; tick all; press "Continue" [S26]. (Google's granular consent may show a "Select all" box [UNVERIFIED label].)
4. Redirect back to our callback; app shows "Connected".
Blockers to pre-empt: HTTP 412 if his Google Health profile is not set up [S22]; Advanced Protection accounts "may block most non-Google apps" [S32]; Workspace accounts cannot hold Google Health [S43].

---

## 6. Quotas, token lifetimes, freshness, webhooks, backfill

- Rate limits [S21]: per project 86.4M/day and 120,000/min; per user 300 requests/min; "Unverified applications: Max 250 QPS total (capped at 100 users @ 2.5 QPS per user)". Errors: 429, back off. Our need is roughly 20-60 calls/day (estimate).
- Tokens: access 1 hour [S3]; refresh as in 5.4. Google advises refreshing on demand, not batch cron refresh [S3] (fine for one user either way).
- Freshness: "Updates to the user's data is only available after they sync their activity tracker or manually enter new data into the Google Health app. The Fitbit device and Google Health app can automatically sync every 15 minutes when the Google Health app is open on the mobile device" [S7]. Help Center: "Data automatically syncs to the Google Health app throughout the day" [S52]; "When you wake up, open the Google Health app and sync your device. You may need to wait a minute" [S55]; "Sync your device each morning" [S53].
- Processing flags: `sleep.metadata.processed` false means "sleep period is detected but sleep stages is still processing"; `stagesStatus` SUCCEEDED or REJECTED_* reasons (for example REJECTED_NAP "< 3h duration", REJECTED_COVERAGE "low RR coverage") [S12].
- Sync latency after phone sync: no documented number or SLA [UNVERIFIED]; webhooks fire "as soon as data is available in the Google Health API" [S19]; Terra notes "no published SLA" [S61].
- Webhooks [S19][S20]:
  - Supported types include Sleep, Daily Heart Rate Variability, Daily Oxygen Saturation, Daily Respiratory Rate, Daily Resting Heart Rate, Daily Sleep Temperature Derivations, Heart Rate, Heart Rate Variability, Respiratory Rate Sleep Summary, Steps, Exercise, Active Zone Minutes, Weight and others. NOT listed: oxygen-saturation (minute), active-minutes, daily-vo2-max.
  - Project-level "subscriber": `POST https://health.googleapis.com/v4/projects/{PROJECT_NUMBER}/subscribers?subscriberId=...` with `endpointUri`, `subscriberConfigs[]{dataTypes[], subscriptionCreatePolicy: AUTOMATIC|MANUAL}`, `endpointAuthorization.secret` (sent back as the Authorization header). Needs OAuth scope `https://www.googleapis.com/auth/cloud-platform` and IAM permission `health.subscribers.create`. Use the project NUMBER, not the ID.
  - Endpoint verification: POST `{"type":"verification"}` with the Authorization header (expect 201) and without it (expect 401 or 403).
  - Notification body: `data{version, clientProvidedSubscriptionName, healthUserId, operation: UPSERT|DELETE, dataType, intervals[]{physicalTimeInterval, civilDateTimeInterval, civilIso8601TimeInterval}}`; DELETE of identifiable data (sleep) includes `recordId`. Up to 99 messages per batch (JSON array). Notifications carry no health values; you re-fetch.
  - Reply 204 immediately; retries with exponential backoff "for up to 7 days"; optional signature header `GOOGLE-HEALTH-API-SIGNATURE` (Tink ECDSA P-256; public keyset at https://www.gstatic.com/googlehealthapi/webhooks/webhooks_public_keyset.json).
  - Which `dataTypes` spelling to use in `subscriberConfigs` for multi-word types (kebab vs camel) is not shown (the example uses only one-word types) [UNVERIFIED]. Try kebab-case first.
- Backfill: "You can query a user's data as far back as it has been recorded; the API imposes no limitations or restrictions on the amount of historical data" [S7]. Sleep pages are 25 sessions; rollups max 14 or 90 days per call; recommended hot load (7-14 days) then background cold load [S7].
- Tracker memory: DC Rainmaker says the Air keeps "7 days of memory for detailed motion data" [S41]. Data can be lost if the phone does not sync for over a week [UNVERIFIED official figure].

---

## 7. Recommended architecture on Cloudflare (Pages + Functions + D1)

### 7.1 Components
- Pages project: PWA + `functions/api/[[route]].js` (same pattern as the existing `mass` app). D1 binding `DB`. Secrets (Settings > Variables and Secrets > Add, "Encrypt") [S74]: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `TOKEN_ENC_KEY` (32 random bytes, base64), `GH_WEBHOOK_SECRET` (for example "Bearer " + 32 random bytes), `APP_TOKEN`.
- Scheduling: Pages Functions do NOT support Cron Triggers (Workers: yes; Pages: no) [S71]. Options: (a) webhooks + sync-on-app-open (no cron); (b) add a tiny separate Worker with `scheduled()` bound to the same D1 as a safety net. Cron Triggers "execute on UTC time" [S72]; Asia/Jerusalem changes its UTC offset with daylight saving, so either schedule two UTC slots or check local time inside `scheduled()`.
- Background work inside a request: `context.waitUntil(promise)` is available in Pages Functions [S76].
- Crypto: Workers implement full WebCrypto incl. AES-GCM and ECDSA, plus non-standard `crypto.subtle.timingSafeEqual` [S73].
- D1 itself is encrypted at rest with AES-256-GCM using Cloudflare-managed keys [S75]. Still encrypt tokens at the app layer, because the Health API policy requires "Keeping user data and credentials, specifically tokens such as OAuth access and refresh tokens, encrypted at rest" and keys managed in "a hardware security module or equivalent-strength key management system" [S28]. Worker secrets are the practical equivalent here (judgement).

### 7.2 OAuth code flow (server-side, confidential client)
1. `GET /api/gh/connect` (requires APP_TOKEN session): create `state` (32 random bytes, base64url), store in D1 `oauth_state(state, created_at)` with 10-minute TTL. 302 to:
   `https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=https://<app-domain>/api/gh/callback&response_type=code&access_type=offline&prompt=consent&include_granted_scopes=true&state=...&scope=<space-separated scopes, URL-encoded>` [S3][S26][S37]. `state` is "Recommended" by Google [S37]. PKCE is not mentioned in the web-server guide [S37]; the client secret protects the exchange.
2. `GET /api/gh/callback?code=...&state=...` (or `error=access_denied`): check and delete `state`.
3. `POST https://oauth2.googleapis.com/token` (form-urlencoded: `code, client_id, client_secret, redirect_uri, grant_type=authorization_code`). Response: `access_token, expires_in, refresh_token, scope, token_type`, plus `refresh_token_expires_in` in Testing [S26]. A refresh token arrives only with `access_type=offline`, normally only on first consent or with `prompt=consent` [S26].
4. Check granted scopes: at least one starts with `https://www.googleapis.com/auth/googlehealth` [S23]; missing ones mean partial consent, so degrade features and offer "grant missing permissions" [S4].
5. `GET https://health.googleapis.com/v4/users/me/identity`: store `healthUserId`. On HTTP 412, show: "Open the Google Health app to complete setup, then return here to connect" [S22][S23].
6. Allowlist: accept only `healthUserId == env.ALLOWED_HEALTH_USER_ID` (set after the first connect); else revoke (`POST https://oauth2.googleapis.com/revoke?token=...` [S37]) and reject.
7. Encrypt and store the refresh token; set `refresh_token_expires_at` if `refresh_token_expires_in` is present (Testing mode detector).
8. `waitUntil(initialBackfill())`: 14 days now, then 90 days in background [S7].

Refresh: `POST https://oauth2.googleapis.com/token` with `client_id, client_secret, refresh_token, grant_type=refresh_token`; persist a new `refresh_token` if one is returned (the official sample returns one) [S3]. On `invalid_grant`, set `status='needs_reauth'` and show a reconnect banner [S36][S37].

### 7.3 Token encryption (AES-GCM, key in a Worker secret, ciphertext in D1)
```js
const te = new TextEncoder(), td = new TextDecoder();
const b64 = u8 => btoa(String.fromCharCode(...u8));
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const aesKey = env => crypto.subtle.importKey('raw', unb64(env.TOKEN_ENC_KEY), 'AES-GCM', false, ['encrypt', 'decrypt']);
export async function seal(env, plain, aad) {           // aad = healthUserId
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: te.encode(aad) }, await aesKey(env), te.encode(plain)));
  return `v1.${b64(iv)}.${b64(ct)}`;                    // key version prefix enables rotation
}
export async function unseal(env, sealed, aad) {
  const [, iv, ct] = sealed.split('.');
  return td.decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(iv), additionalData: te.encode(aad) }, await aesKey(env), unb64(ct)));
}
```
Never log tokens; access tokens can live in memory only (1 hour).

### 7.4 Sync strategy
Triggers, in priority order: (1) webhook UPSERT for a relevant type, re-fetch that type for the notified civil dates; (2) PWA open, `POST /api/sync` if the last sync is older than 15 minutes; (3) optional cron safety net at about 08:30 and 11:00 Israel time.
Per sync, for date window D-2..D (civil, Asia/Jerusalem):
- Sleep: `GET .../dataTypes/sleep/dataPoints:reconcile?dataSourceFamily=users/me/dataSourceFamilies/google-wearables&filter=sleep.interval.civil_end_time >= "D-2" AND sleep.interval.civil_end_time < "D+1"` (URL-encode). Upsert by name; skip if `updateTime` unchanged. If `metadata.processed=false`, re-poll later.
- Daily vitals (list, filter `<snake>.date >= "D-2"`): daily-heart-rate-variability, daily-resting-heart-rate, daily-oxygen-saturation, daily-respiratory-rate, daily-sleep-temperature-derivations.
- respiratory-rate-sleep-summary: `respiratory_rate_sleep_summary.sample_time.civil_time >= "D-2"`.
- HR during sleep: `POST .../heart-rate/dataPoints:rollUp` with `range` = the sleep interval and `windowSize: "300s"` (max range 14 days) [S7][S15].
- Steps and AZM: `POST .../steps/dataPoints:dailyRollUp` and `.../active-zone-minutes/dataPoints:dailyRollUp` with CivilDateTime range, `windowSizeDays: 1`. Month and day must not be zero-padded in JSON (a 400 cause) [S22].
- Exercise: list with `exercise.interval.civil_start_time >= "D-7"`.
- Staleness: `GET .../users/me/pairedDevices`, show "last sync X h ago" from `lastSyncTime` [S29][S22].
- Morning look-back job: run when today's main sleep has `processed=true` and `stagesStatus=SUCCEEDED`, else fall back at a fixed hour with "partial data" wording.
- Time zones: use the API's `civil*` fields and `*UtcOffset` Duration strings (for example "10800s" = UTC+3 hours); do not recompute DST yourself [S12].

### 7.5 Webhook receiver (Pages Function)
```js
export async function onRequestPost({ request, env, waitUntil }) {
  const got = te.encode(request.headers.get('Authorization') || ''), want = te.encode(env.GH_WEBHOOK_SECRET);
  const authed = got.byteLength === want.byteLength && crypto.subtle.timingSafeEqual(got, want);
  const body = await request.json().catch(() => null);
  if (body && body.type === 'verification') return new Response(null, { status: authed ? 201 : 401 });
  if (!authed) return new Response(null, { status: 401 });
  const items = Array.isArray(body) ? body : [body];
  waitUntil(enqueueAndSync(env, items));     // idempotent: dedupe on dataType + interval
  return new Response(null, { status: 204 });
}
```
One-time subscriber registration, run by Lior from any shell with gcloud logged in as the project owner (Google Cloud Shell in the console is a no-install option [UNVERIFIED that it is pre-authenticated]): `curl -X POST "https://health.googleapis.com/v4/projects/PROJECT_NUMBER/subscribers?subscriberId=sleep-coach" -H "Authorization: Bearer $(gcloud auth print-access-token)" -H "Content-Type: application/json" -d '{"endpointUri":"https://<app-domain>/api/gh/webhook","subscriberConfigs":[{"dataTypes":["sleep","steps","exercise","daily-heart-rate-variability","daily-resting-heart-rate","daily-oxygen-saturation","daily-respiratory-rate","daily-sleep-temperature-derivations","respiratory-rate-sleep-summary"],"subscriptionCreatePolicy":"AUTOMATIC"}],"endpointAuthorization":{"secret":"Bearer <GH_WEBHOOK_SECRET value>"}}'` (shape per [S19][S20]; multi-word type spelling [UNVERIFIED]; if 403, grant yourself the "Google Health API Admin" role [S19]). Signature verification via Tink is optional for a personal app; the shared secret plus re-fetching from the API is sufficient (judgement).

### 7.6 Edge cases
| Case | Signal | Handling | Src |
|---|---|---|---|
| Testing-mode expiry | `refresh_token_expires_in` present; `invalid_grant` after 7 days | banner on day 6, one-tap reconnect | [S3][S36] |
| User revoked in Google Health app (profile > Apps and services > app > Delete all) | `invalid_grant` | `needs_reauth` | [S22] |
| 6 months unused | `invalid_grant` | daily sync keeps the token alive | [S36] |
| Partial consent | 403 MISSING_OAUTH_SCOPE | disable features, prompt re-consent with `prompt=consent` | [S16][S4][S3] |
| No Google Health profile | 412 | instruct to finish setup | [S22] |
| Legacy Fitbit login consented | 403 "Could not mint UberMint from GaiaMint." | sign out, sign in to Google Health with Google | [S22] |
| Rate limit / gateway | 429 / 504 | exponential backoff, never instant retry | [S21][S7] |
| Duplicate or retried webhooks | same payload | idempotent upserts | [S19] |
| DELETE notification | `operation: DELETE` (+ `recordId` for sleep) | delete local row | [S19] |
| Re-bucketed intervals | overlaps in list | use reconcile for UI and totals | [S18] |
| Naps | `metadata.nap=true` or REJECTED_NAP | exclude from the "main night" | [S12] |
| Two devices (for example a Pixel Watch) | overlapping sessions | reconcile + google-wearables | [S17][S40] |
| Sparse SpO2 minutes | gaps | expected; use the daily summary | [S24] |
| Concurrent refreshes | two requests | single-flight lock row in D1 | judgement |
| Key rotation | `v1.` prefix | re-encrypt on next use | judgement |
| Data sent to Gemini | policy | allowed only for user-visible features with consent; show an in-app disclosure; use the Gemini paid tier (unpaid-tier terms: "Do not submit sensitive, confidential, or personal information to the Unpaid Services") | [S28][S59] |

Effort (estimate): 2-3 developer days for OAuth + sync + D1 + webhook + banners; 45-60 min of human console work.

---

## 8. Fallbacks

(a) Google Takeout / in-app export
- Official: "follow the instructions for How to download your Google data. Make sure Google Health is selected" [S47]. Takeout offers zip or tgz, and "Scheduled exports: Automatically create an archive ... every 2 months for one year" [S48]. Archive creation takes "from a few minutes to a few days" [S48]. Per-workout TCX export exists in-app (Fitness tab > activity > More > Export) [S47].
- File layout for Google Health in Takeout is not documented officially [UNVERIFIED]. A third-party undated guide claims `Takeout/Fitbit/` with JSON-only subfolders (Global Export Data, Sleep, Heart Rate, Body...) [S77].
- Verdict: good for a one-time history import; useless for a daily coach (manual, at most every 2 months when scheduled).

(b) Health Connect / Apple Health
- Health Connect: "Health Connect securely stores your health and fitness data on your Android phone" [S49]; it is an on-device APK reached by client apps through an SDK over IPC [S50]. The Google Health app can write to it [S49]. A web backend cannot read it; it needs a native Android app. Confirmed NOT usable from a web app.
- iPhone: Google Health can link to Apple Health (Connections > Apps and services > Apple Health) [S40][S51]. Apple Health is also on-device (same conclusion) [UNVERIFIED official Apple source not opened].

(c) Screenshot upload + multimodal LLM extraction
- Feasible: Gemini accepts images inline (total request up to 20 MB) or via the File API [S57] and can return JSON constrained by a JSON Schema [S58].
- It is the only way to capture the in-app Sleep Score (not in the API) [S12][S54].
- Fragile: the app was redesigned in May 2026 [S42]; Hebrew/English locale, cropped screens, chart-only values; needs a daily human action.
- Privacy: use the paid tier (see 7.6) [S59].
- Effort (estimate): 0.5-1 day; about 30-60 s per day for the friend. Validate sums (stage minutes vs time asleep).

(d) Third-party aggregators
| Vendor | Google Health API support | Price (entry) | Notes | Src |
|---|---|---|---|---|
| Junction (ex-Vital) | Yes, provider `google_health` ("Fitbit and Pixel Watch"); Junction default OAuth app "conditionally approved ... while Junction completes ... CASA" | Launch USD 300/month, 1-500 users; free sandbox | HIPAA-compliant handling; BAA only on Enterprise | [S62][S63][S64] |
| Terra | Blog (2026-05-18) documents testing the Google Health API, "31 data types" | Quick Start from USD 499/month, or 399/month billed annually; 200 credits per active auth per month | 30-day money-back | [S60][S61] |
| ROOK | Fitbit integration page does not mention the Google Health API [UNVERIFIED support] | Core USD 399/month, 750 users | HIPAA/GDPR claimed (search snippet) | [S65][S66] |
| Open Wearables | Yes, since v0.7.0 (2026-08-12); provider `google_health` since v0.9.0 (2026-09-17) | Free, MIT | Self-hosted Python (FastAPI) + PostgreSQL + Redis + Celery (does not fit Cloudflare). You still register YOUR OWN Google OAuth client (same 100-user and verification rules) | [S67][S68] |
- Privacy: an aggregator becomes an extra processor holding tokens and health data. The Health API policy allows third-party transfer only to provide user-visible features "and only with the user's consent" [S28].

(e) Manual entry
- Always needed for subjective inputs (sleep quality, caffeine, alcohol, late meals, stress). As a data fallback: bedtime, wake time, awakenings, optional numbers. Effort (estimate): 2-4 hours; 1 minute per day.

Ranked recommendation (effort = estimate)
1. Direct Google Health API, Path A (production, unverified, personal use): 2-3 dev days + about 1 h console; near-zero ongoing effort. Best data (stages, HRV, SpO2, BR, temperature, HR).
2. Same code, Path B (Testing + weekly reconnect): same build; about 20 s per week for the friend. Automatic fallback if Path A is blocked.
3. Manual quick log (subjective context): 2-4 h; ship regardless.
4. Screenshot + Gemini: 0.5-1 day; optional add-on for Sleep Score, or an emergency fallback.
5. Junction aggregator: 0.5-1 day + USD 300/month; only if Google blocks both A and B.
6. Takeout: one-time historical import only.
7. Health Connect / Apple Health: requires a native app; out of scope.

---

## 9. Minimum manual steps the humans must do

Lior (developer), about 45-60 minutes once:
1. Sign in at https://console.cloud.google.com/ (preferably a personal Gmail). Project picker > "New Project" > name `sleep-coach` > Location "No organization" > Create [S26].
2. Open https://console.developers.google.com/apis/library/health.googleapis.com > Enable ("Google Health API") [S3].
3. APIs & Services > Credentials > "+ Create Credentials" > "OAuth client ID" > "Configure consent screen" > "Get Started": App name "Sleep Coach"; User support email; Audience "External"; Contact Information; tick Google API Services User Data Policy; Create [S26].
4. https://console.developers.google.com/auth/scopes > "Add or remove scopes" > search "Google Health API" > tick `.../auth/googlehealth.sleep.readonly`, `.../googlehealth.health_metrics_and_measurements.readonly`, `.../googlehealth.activity_and_fitness.readonly`, `.../googlehealth.settings.readonly` > Update > Save [S3].
5. Clients > "Create OAuth client" > Application type "Web application" > Authorized redirect URIs: `https://<app-domain>/api/gh/callback` (plus `http://localhost:8788/api/gh/callback` for local dev) > Create > copy Client ID and Client secret immediately (a lost secret cannot be viewed again; you must add a new one) [S26][S37].
6. https://console.developers.google.com/auth/audience > Test users > "+ Add users" > friend's Gmail > Save [S3].
7. Cloudflare dashboard > Workers & Pages > project > Settings > Variables and Secrets > Add (Encrypt): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `TOKEN_ENC_KEY`, `GH_WEBHOOK_SECRET`, `APP_TOKEN`; bind D1; deploy [S74].
8. After the friend's first connect and one good data pull: Audience page > "Publish app" > confirm ("In production") [S32]. Ask the friend to reconnect once. Check the server log: `refresh_token_expires_in` must be absent. If Google refuses, revert to Testing (Path B).
9. Webhooks: open Cloud Shell in the console (or a local terminal with gcloud) and run the subscriber curl from 7.5 with the project NUMBER, not the project ID [S19][S22]. (Exact console menu path to the project number and Cloud Shell button: [UNVERIFIED].)
10. Gemini key from a billing-enabled Google Cloud project (paid tier) [S59].

Friend (user), about 5 minutes once, then passive:
1. Confirm the Google Health app is signed in with a personal (non-Workspace) Google account, the profile is complete, and Fitbit Air is paired [S43][S22].
2. Open the PWA on the phone > tap "Connect Google Health" > choose his Google account.
3. If the warning appears: Testing > "Continue"; Production > "Advanced" > "Go to Sleep Coach (unsafe)" [S26][S38].
4. On the permissions page tick every item > "Continue" [S26].
5. Back in the app: "Connected". Done.
6. Every morning: open the Google Health app once so the tracker syncs [S53][S55]. Sync at least every few days (tracker memory about 7 days per a secondary source [S41]).
7. Only if a "Reconnect" banner appears (Testing mode: every 7 days): repeat steps 2-4.
8. To disconnect: Google Health app > profile icon > Apps and services > Sleep Coach > "Delete all" > confirm [S22].

---

## 10. Schema hints (exact API field paths to store)

General: store `raw_json` for every data point (drift protection, section 3.6). Parse int64 strings with `Number()`. Keys: `name` (or `dataPointName`) for identifiable types (sleep, exercise); `date` (YYYY-MM-DD built from `{year,month,day}`) for daily types.

`gh_connection` (single row): `health_user_id` (from `healthUserId`), `legacy_user_id` (`legacyUserId`), `refresh_token_sealed`, `refresh_token_expires_at` (from `refresh_token_expires_in`; NULL in production), `granted_scopes` (token `scope`), `status` (connected / needs_reauth / profile_missing), `last_sync_at`, `last_device_sync_at` (`pairedDevices[].lastSyncTime`), `device_version` (`deviceVersion`), `time_zone` (`settings.timeZone`).

`sleep_session`:
| column | API path |
|---|---|
| id | `name` / `dataPointName` |
| start_utc, start_offset | `sleep.interval.startTime`, `sleep.interval.startUtcOffset` |
| end_utc, end_offset | `sleep.interval.endTime`, `sleep.interval.endUtcOffset` |
| night_date (wake date) | `sleep.interval.civilEndTime.date` |
| sleep_type | `sleep.type` |
| is_main, is_nap, processed, stages_status, manually_edited | `sleep.metadata.main` (undocumented in schema), `.nap`, `.processed`, `.stagesStatus`, `.manuallyEdited` |
| min_in_period, min_asleep, min_awake, min_to_fall_asleep, min_after_wake | `sleep.summary.minutesInSleepPeriod`, `.minutesAsleep`, `.minutesAwake`, `.minutesToFallAsleep`, `.minutesAfterWakeUp` |
| deep_min, light_min, rem_min, awake_min (+ _count) | `sleep.summary.stagesSummary[type=DEEP|LIGHT|REM|AWAKE].minutes` / `.count` |
| efficiency_pct (computed) | round(minutesAsleep / minutesInSleepPeriod * 100) (formula [S9]; mapping inferred) |
| device, platform, recording_method | `dataSource.device.displayName`, `dataSource.platform`, `dataSource.recordingMethod` |
| update_time | `sleep.updateTime` |

`sleep_stage`: session_id, `start_utc` (`stages[].startTime`), `end_utc` (`stages[].endTime`), `offset` (`stages[].startUtcOffset`), `stage` (`stages[].type`). Optional `out_of_bed` from `sleep.outOfBedSegments[]`.

`sleep_hr` (optional, per 5-minute window): session_id, window start/end, `beatsPerMinuteAvg`, `beatsPerMinuteMin`, `beatsPerMinuteMax` (heart-rate rollUp).

`daily_recovery` (PK date):
| column | API path (dataType) |
|---|---|
| hrv_rmssd_ms | `dailyHeartRateVariability.averageHeartRateVariabilityMilliseconds` |
| hrv_deep_rmssd_ms | `dailyHeartRateVariability.deepSleepRootMeanSquareOfSuccessiveDifferencesMilliseconds` |
| hrv_entropy | `dailyHeartRateVariability.entropy` |
| nonrem_hr_bpm | `dailyHeartRateVariability.nonRemHeartRateBeatsPerMinute` |
| rhr_bpm, rhr_method | `dailyRestingHeartRate.beatsPerMinute`, `dailyRestingHeartRate.dailyRestingHeartRateMetadata.calculationMethod` |
| spo2_avg, spo2_low, spo2_high, spo2_sd | `dailyOxygenSaturation.averagePercentage`, `.lowerBoundPercentage`, `.upperBoundPercentage`, `.standardDeviationPercentage` |
| br_bpm | `dailyRespiratoryRate.breathsPerMinute` |
| skin_nightly_c, skin_baseline_c, skin_sd30_c | `dailySleepTemperatureDerivations.nightlyTemperatureCelsius`, `.baselineTemperatureCelsius`, `.relativeNightlyStddev30dCelsius` |
| skin_dev_c (computed) | nightly minus baseline |
| steps | dailyRollUp steps `countSum` |
| azm_fat_burn, azm_cardio, azm_peak | dailyRollUp `sumInFatBurnHeartZone`, `sumInCardioHeartZone`, `sumInPeakHeartZone` |
Note: whether each daily `date` is the wake date or the evening date is not stated [UNVERIFIED]. Join to sleep by date and confirm empirically on the first real night.

`resp_sleep` (per sleep): `respiratoryRateSleepSummary.sampleTime.physicalTime`, `fullSleepStats.breathsPerMinute`, `fullSleepStats.standardDeviation`, `fullSleepStats.signalToNoise`, `deepSleepStats.breathsPerMinute`, `lightSleepStats.breathsPerMinute`, `remSleepStats.breathsPerMinute`.

`exercise`: id (`name`), `exercise.exerciseType`, `exercise.displayName`, `exercise.interval.startTime/endTime/startUtcOffset`, `exercise.activeDuration` ("900s"), `exercise.metricsSummary.caloriesKcal`, `.averageHeartRateBeatsPerMinute`, `.activeZoneMinutes`, `.steps`, `.distanceMillimeters`, `exercise.updateTime`.

`webhook_event`: received_at, `data.dataType`, `data.operation`, `data.healthUserId`, `data.intervals` (JSON), `recordId`, processed_at.

---

## 11. Open questions and uncertainties

1. Whether "Publish app" with unverified Restricted Health scopes works in practice (vs a hard block) [UNVERIFIED]. Test on day 1; Path B is the safety net.
2. Whether Premium is required for any API data type [UNVERIFIED]; Premium is not sold in Israel anyway [S46].
3. Exact end-to-end latency (tracker > phone > API > webhook) [UNVERIFIED].
4. Daily `date` semantics (wake date vs night start) [UNVERIFIED].
5. `subscriberConfigs.dataTypes` spelling for multi-word types [UNVERIFIED].
6. Final legacy cutoff: September 30 vs October 30, 2026 [S2][S69] (irrelevant to our build).
7. Official Fitbit Air sensor list (Store page not machine-readable) [UNVERIFIED official].
8. `respiratory-rate` and `skin-temperature` data types for `air` (device table vs REST reference) [S8][S12].
9. Google Health Takeout file layout [UNVERIFIED].
10. Whether the Health API is free of charge [UNVERIFIED; no price found].

---

## 12. Sources (opened 2026-09-29; "updated" = date printed on the page)

- [S1] Google Health API home. https://developers.google.com/health
- [S2] About the Google Health API (updated 2026-09-23). https://developers.google.com/health/about
- [S3] Set up Google Cloud and OAuth (updated 2026-09-29). https://developers.google.com/health/setup
- [S4] Scopes (updated 2026-09-29). https://developers.google.com/health/scopes
- [S5] App verification (updated 2026-09-25). https://developers.google.com/health/app-verification
- [S6] Developer checklist (updated 2026-09-29). https://developers.google.com/health/developer-checklist
- [S7] Data types index, query constraints, data availability, historical data (updated 2026-09-22). https://developers.google.com/health/data-types
- [S8] Device compatibility (updated 2026-09-29). https://developers.google.com/health/data-types/device-compatibility
- [S9] Sleep guide (updated 2026-09-22). https://developers.google.com/health/data-types/sleep
- [S10] Vitals guide (updated 2026-09-22). https://developers.google.com/health/data-types/vitals
- [S11] REST reference index. https://developers.google.com/health/reference/rest
- [S12] DataPoint resource schema. https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints
- [S13] dataPoints.list. https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints/list
- [S14] dataPoints.reconcile. https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints/reconcile
- [S15] dataPoints.rollUp and HeartRateRollupValue / ActiveZoneMinutesRollupValue / StepsRollupValue (updated 2026-03-26). https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints/rollUp ; https://developers.google.com/health/reference/rest/v4/HeartRateRollupValue
- [S16] Filters (updated 2026-09-29). https://developers.google.com/health/filters
- [S17] Endpoints guide with samples (updated 2026-09-29). https://developers.google.com/health/endpoints
- [S18] Data management (updated 2026-09-29). https://developers.google.com/health/data-management
- [S19] Webhook subscriptions (updated 2026-09-29). https://developers.google.com/health/webhooks
- [S20] projects.subscribers.create (updated 2026-07-24). https://developers.google.com/health/reference/rest/v4/projects.subscribers/create
- [S21] Quotas and rate limits (updated 2026-05-18). https://developers.google.com/health/rate-limits
- [S22] Troubleshooting (updated 2026-09-29). https://developers.google.com/health/troubleshooting
- [S23] Migration guide (updated 2026-09-29). https://developers.google.com/health/migration
- [S24] API specifications / Fitbit mapping. https://developers.google.com/health/migration/api-specifications
- [S25] Release notes (updated 2026-08-17). https://developers.google.com/health/release-notes ; parity tool page: https://developers.google.com/health/migration/parity-tool
- [S26] Codelab: first API call (VS Code). https://developers.google.com/health/codelabs/make-your-first-api-call
- [S27] Codelab: OAuth 2.0 Playground. https://developers.google.com/health/codelabs/make-your-first-api-call-using-oauth2-playground
- [S28] Google Health API Developer and User Data Policy (updated 2026-03-24). https://developers.google.com/health/policies/health-api-developer-user-data-policy
- [S29] users.pairedDevices resource and list. https://developers.google.com/health/reference/rest/v4/users.pairedDevices
- [S30] Settings and Profile resources; users.getIdentity (updated 2026-05-26). https://developers.google.com/health/reference/rest/v4/Settings ; https://developers.google.com/health/reference/rest/v4/users/getIdentity
- [S31] Legacy Fitbit Web API banner. https://dev.fitbit.com/build/reference/web-api/
- [S32] Google Auth Platform: Manage App Audience. https://support.google.com/cloud/answer/15549945
- [S33] Unverified apps. https://support.google.com/cloud/answer/7454865
- [S34] When is verification not needed. https://support.google.com/cloud/answer/13464323
- [S35] OAuth App Verification Help Center. https://support.google.com/cloud/answer/13463073
- [S36] Using OAuth 2.0 to Access Google APIs, refresh token expiration (updated 2026-05-26). https://developers.google.com/identity/protocols/oauth2
- [S37] OAuth 2.0 for Web Server Applications (updated 2026-09-14). https://developers.google.com/identity/protocols/oauth2/web-server
- [S38] Troubleshoot authentication and authorization issues ("Advanced > Go to {Project Name} (unsafe)") (updated 2026-09-03). https://developers.google.com/workspace/docs/api/troubleshoot-authentication-authorization
- [S39] Google blog: Introducing the new Google Fitbit Air (2026-05-07). https://blog.google/products-and-platforms/devices/fitbit/fitbit-air/
- [S40] Get started with Google Fitbit Air. https://support.google.com/googlehealth/answer/17033101
- [S41] DC Rainmaker, Fitbit Air details (2026-05-07, secondary). https://www.dcrainmaker.com/2026/05/fitbit-air-whoop-competitor-everything-details.html
- [S42] What is new with the redesigned Google Health app. https://support.google.com/googlehealth/answer/17068213
- [S43] How to move your Fitbit Account to a Google Account. https://support.google.com/googlehealth/answer/14237024
- [S44] Get started with the Google Health Coach. https://support.google.com/googlehealth/answer/16961408
- [S45] Google blog: Google Health Coach (2026-05-07). https://blog.google/products-and-platforms/products/google-health/google-health-coach/
- [S46] Sign up or manage your Google Health Premium subscription. https://support.google.com/googlehealth/answer/14237941
- [S47] How do I export my Google Health data? https://support.google.com/googlehealth/answer/14236615
- [S48] How to download your Google data (Takeout). https://support.google.com/accounts/answer/3024190
- [S49] How do I use Health Connect with the Google Health app? https://support.google.com/googlehealth/answer/14506680
- [S50] Health Connect architecture (updated 2026-06-16). https://developer.android.com/health-and-fitness/health-connect/architecture
- [S51] Connect third-party devices and apps to the Google Health app. https://support.google.com/googlehealth/answer/14236613
- [S52] How do Fitbit devices sync their data? https://support.google.com/googlehealth/answer/14237221
- [S53] Track sleep with Google Health. https://support.google.com/googlehealth/answer/14236407
- [S54] What's the Sleep Score in the Google Health app. https://support.google.com/googlehealth/answer/14236513
- [S55] Learn about Google Health sleep stages. https://support.google.com/googlehealth/answer/14236712
- [S56] Data Portability API scopes. https://developers.google.com/data-portability/user-guide/scopes
- [S57] Gemini API image understanding (updated 2026-09-23). https://ai.google.dev/gemini-api/docs/image-understanding
- [S58] Gemini API structured output (updated 2026-09-23). https://ai.google.dev/gemini-api/docs/structured-output
- [S59] Gemini API Additional Terms (updated 2026-04-28). https://ai.google.dev/gemini-api/terms
- [S60] Terra pricing. https://tryterra.co/pricing ; https://docs.tryterra.co/unified-api/pricing
- [S61] Terra: The complete guide, how the new Google Health API works (2026-05-18). https://tryterra.co/blog/everything-you-need-to-know-about-google-health-new-api
- [S62] Junction providers. https://docs.junction.com/wearables/providers/introduction
- [S63] Junction Google Health guide. https://docs.junction.com/wearables/guides/google-health
- [S64] Junction pricing. https://www.junction.com/pricing
- [S65] ROOK pricing. https://www.tryrook.io/pricing
- [S66] ROOK Fitbit integration. https://tryrook.io/wearable-api-sdk/integrations/fitbit
- [S67] Open Wearables repo (MIT) and releases 0.7.0 (2026-08-12), 0.9.0 (2026-09-17). https://github.com/the-momentum/open-wearables ; https://api.github.com/repos/the-momentum/open-wearables/releases
- [S68] Open Wearables: Google Health API practical setup guide (search-result snippet only). https://openwearables.io/blog/google-health-api-practical-guide-getting-started
- [S69] Gadgets and Wearables: Fitbit API shutdown may have been pushed back (2026-09-28). https://gadgetsandwearables.com/2026/09/28/fitbit-api-migration-deadline-october-30/
- [S70] MyDataHelps: Google Health Export Overview. https://support.mydatahelps.org/google-health-export-overview
- [S71] Cloudflare: Migrate from Pages to Workers, compatibility matrix (Cron Triggers: Workers yes, Pages no) (updated Sep 22, 2026). https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/
- [S72] Cloudflare Cron Triggers ("execute on UTC time") (updated Sep 4, 2026). https://developers.cloudflare.com/workers/configuration/cron-triggers/
- [S73] Cloudflare Workers Web Crypto (updated Apr 23, 2026). https://developers.cloudflare.com/workers/runtime-apis/web-crypto/
- [S74] Cloudflare Pages Functions bindings, secrets (updated Jun 25, 2026). https://developers.cloudflare.com/pages/functions/bindings/
- [S75] Cloudflare D1 data security (updated Apr 21, 2026). https://developers.cloudflare.com/d1/reference/data-security/
- [S76] Cloudflare Pages Functions API reference, waitUntil (updated Apr 21, 2026). https://developers.cloudflare.com/pages/functions/api-reference/
- [S77] Wearable Converter: export Google Health data (third-party, undated). https://www.wearableconverter.com/export-google-health-data
