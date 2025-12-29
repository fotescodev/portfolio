# CareerGating Research Brief
## Evidence-Based Quality Rules for Resume Content

**Date**: 2025-12-23
**Status**: Research Complete
**Purpose**: Ground CareerGating rules in empirical data

---

## Executive Summary

This research synthesis grounds CareerGating rules in empirical data from:
- **Eye-tracking studies**: TheLadders (n=30), Texas A&M/MDPI (n=221 recruiters, 2,043 resumes)
- **Academic research**: Ghent University (n=445), Bertrand & Mullainathan NBER study (~5,000 resumes)
- **Industry surveys**: CareerBuilder (n=2,153), Zety 2025 (n=753), ResumeGo (n=24,570)
- **ATS vendor data**: Enhancv, Jobscan, crowdsourced recruiter feedback

**Key Findings**:
- 6-7.4 second initial scan window (eye-tracking confirmed)
- 77% rejection rate for typos/grammar errors
- 40% more interviews with quantified achievements
- 71% higher callback with LinkedIn profile
- 75% "ATS rejection" statistic is a myth

---

## Section 1: Scanning Behavior — The 7.4 Second Window

### The Pattern
Recruiters make fit/no-fit decisions in **6-7.4 seconds** during initial screening.

### Evidence

| Study | Sample | Finding | Source |
|-------|--------|---------|--------|
| TheLadders 2018 | n=30 recruiters | 7.4 seconds average scan | [PDF](https://www.theladders.com/static/images/basicSite/pdfs/TheLadders-EyeTracking-StudyC2.pdf) |
| Texas A&M/MDPI 2023 | n=221 recruiters, 2,043 resumes | Longer viewing = higher approval (AUC 0.767) | [MDPI](https://www.mdpi.com/2504-4990/5/3/38) |
| HR Dive 2018 | Industry analysis | Confirms 7-second figure | [HR Dive](https://www.hrdive.com/news/eye-tracking-study-shows-recruiters-look-at-resumes-for-7-seconds/541582/) |

### F-Pattern Scanning
80% of attention concentrates on 6 data points:
1. Name
2. Current title
3. Current company
4. Previous title/company
5. Education
6. Start/end dates

**Confidence**: ✅ **STRONG** (eye-tracking replicated)

### Actionable Rules
- `CG-VIS-001`: Critical info must be in top-left quadrant
- `CG-VIS-002`: Job titles must be left-aligned and bolded

---

## Section 2: Rejection Triggers — Language That Kills Applications

### 2.1 Spelling & Grammar Errors

**The Pattern**: Typos cause immediate rejection in 68-77% of cases.

| Study | Sample | Finding | Source |
|-------|--------|---------|--------|
| Ghent University 2023 (Sterkens et al.) | n=445 recruiters, 1,335 resumes | 5 errors = **18.5pp** drop in interview probability | PLOS One |
| CareerBuilder 2018 | n=2,153 HR managers | **77% consider typos instant dealbreakers** | [StandOut-CV](https://standout-cv.com/usa/stats-usa/resume-statistics) |
| Zety 2025 | n=753 recruiters | **68% reject for spelling/grammar** | [Zety](https://zety.com/blog/hr-statistics) |

**Mechanism (Ghent Study)**:
- Lower mental abilities: 32.2% of penalty
- Lower conscientiousness: 12.1% of penalty
- Lower interpersonal skills: 9.0% of penalty

**Confidence**: ✅ **STRONG** (peer-reviewed + multiple large surveys)

**→ Rule CG-ERR-001**: FAIL on any spelling error (highest-confidence rejection signal)

---

### 2.2 Buzzword Fatigue

**The Pattern**: Generic phrases like "results-driven," "synergy," "team player" trigger recruiter fatigue.

| Source | Most-Fatigued Terms |
|--------|---------------------|
| CareerBuilder 2014 (n=2,000+) | "best of breed," "go-getter," "synergy," "think outside the box" |
| LinkedIn Annual Reports (2010-2018) | "motivated," "passionate," "creative," "strategic," "expert" |
| CultivatedCulture | 51% of resumes contain "buzzword bingo" |

**73% of hiring professionals** report fatigue from repetitive phrases.

**Confidence**: ✅ **STRONG** (10+ years of consistent survey data)

**→ Rule CG-LNG-001**: WARN on "synergy," "best of breed," "think outside the box," "leverage"

---

### 2.3 Sycophantic & Desperate Language

**The Pattern**: Excessive flattery triggers "manipulativeness" attribution. Research confirms curvilinear effects — some self-promotion helps, but "too much" backfires sharply.

| Signal | Perception |
|--------|------------|
| "It would be the greatest honor..." | Desperate, trying too hard |
| "I am a passionate admirer of your mission" | Sycophantic, inauthentic |
| "Dream job," "dream company" | Lack of alternatives, desperation |

**Evidence (Substantial Foundation)**:

| Study | Finding | Source |
|-------|---------|--------|
| Gordon (1996) meta-analysis | 69 studies: ingratiation has small positive effect (d=0.20) but **moderate transparency maximizes positive evaluations** while high transparency diminishes effectiveness | Journal of Applied Psychology |
| Baron (1986) | Combining multiple positive self-presentation tactics triggered *negative* reactions — establishing that thresholds exist | Journal of Applied Social Psychology |
| Vonk (2002) | When ulterior motives are detected, effects reverse sharply | Social Psychology |
| Fragale & Grant | Self-promotion only succeeds when audiences are cognitively distracted — **25 seconds** is threshold where reviewers "see right through it" | |
| ScienceDirect (~2021, n=254) | Candidate flattery during preliminary recruitment showed **strong negative effects** on perceptions of fit and interview likelihood | |

**Critical gap**: Almost all research examines **interviews**, not written applications. The one study on pre-interview screening (n=254) suggests written applications may be *more* vulnerable to sycophancy backlash than interviews, where candidates can adjust based on real-time feedback.

**No quantified thresholds exist**: Research establishes curvilinear effect but not "how many self-promotional statements per 500 words triggers backlash."

**Confidence**: ⚠️ **MODERATE** (strong theoretical foundation, interview-focused research, limited written application data)

**→ Rule CG-TONE-001**: WARN on "honor," "privilege," "dream job," "thrilled to apply," "long admired" — conservative detection given interview research transfers

---

### 2.4 Weak Action Verbs & Passive Voice

**The Pattern**: Passive constructions dilute impact and obscure accountability.

**Evidence**:
> "'Responsible for' doesn't confirm the person actually did the work." — [TopResume](https://topresume.com/career-advice/how-to-effectively-use-action-words-in-your-resume)

> "Passive voice dilutes quality of writing, which tells hiring managers communication skills may not be up to par." — [Great Resumes Fast](https://greatresumesfast.com/blog/how-do-i-use-action-verbs-in-my-resume/)

| Weak (Flag) | Strong (Pass) |
|-------------|---------------|
| "Was responsible for answering phones" | "Answered 50+ calls daily" |
| "Helped improve satisfaction" | "Increased satisfaction 20%" |
| "Duties included managing team" | "Managed team of 12" |

**⚠️ CRITICAL META-RESEARCH NOTE**:
No RCTs or field experiments exist testing active vs passive voice. The advice conflates two distinct concepts:
- **Action verbs** (achieved, launched, managed) — word choice
- **Active voice** (grammatical subject-verb construction)

A resume could use action verbs in passive voice ("A 20% increase was achieved") or weak verbs in active voice ("I was responsible for…"). No research separates these variables.

One source cited "a study in Journal of Professional Communication 2021" but the same source disclaims some citations are **"fictional and used for illustrative purposes."**

**Confidence**: ❓ **CONVENTION** (industry consensus, zero empirical validation)

**→ Rule CG-LNG-002**: WARN on "responsible for," "helped with," "assisted," "duties included" — but flag as convention-based, not evidence-based

---

## Section 3: Success Signals — Language That Gets Callbacks

### 3.1 Quantified Achievements

**The Pattern**: Specific numbers dramatically outperform vague claims.

| Study | Finding | Source |
|-------|---------|--------|
| LinkedIn Talent Trends | **40% more interview invitations** with quantified achievements | [Teal](https://www.tealhq.com/post/quantify-your-resume) |
| CareerBuilder 2018 | **34% reject resumes without quantifiable results** | [StandOut-CV](https://standout-cv.com/usa/stats-usa/resume-statistics) |
| Zety 2025 | **89% of recruiters expect measurable results** | [Zety](https://zety.com/blog/hr-statistics) |
| Enhancv | Hiring managers rate quantified bullets **2× as credible** | [Enhancv](https://enhancv.com/blog/quantifying-resume-examples/) |

**The XYZ Formula**: "Accomplished [X] as measured by [Y], by doing [Z]"

**Confidence**: ✅ **STRONG** (convergent across multiple sources)

**→ Rule CG-QNT-001**: WARN if <50% of bullets contain metrics (%, $, #, time)

---

### 3.2 LinkedIn Profile Inclusion

**The Pattern**: Comprehensive LinkedIn profiles increase callbacks.

| Study | Finding | Source |
|-------|---------|--------|
| ResumeGo field experiment | **71% higher callback rate** with LinkedIn (13.5% vs 7.9%) | [ResumeGo](https://www.resumego.net/research/race-in-resume-selection/) |

Sample: n=24,570 resumes

**Confidence**: ⚠️ **MODERATE** (single large field experiment)

**→ Rule CG-LNK-001**: INFO if no LinkedIn URL included

---

## Section 4: Cognitive Biases in Hiring

### 4.1 The Halo Effect

**The Pattern**: One impressive credential creates positive assumptions about everything else.

**Evidence**:
> "The halo effect causes approximately **75% of hiring managers to make poor recruitment decisions**." — [PMaps](https://www.pmapstest.com/blog/halo-effect-in-hiring)

> "The halo effect appears during resume screening, leading recruiters to make sweeping positive judgments based on singular impressive credentials." — [Criteria Corp](https://www.criteriacorp.com/blog/the-research-on-unconscious-bias-in-hiring)

**Implication**: If you have a prestige anchor (FAANG, Ivy League), ensure it appears in the first 25% of the resume.

---

### 4.2 Confirmation Bias

**The Pattern**: First impressions lock in; recruiters then seek confirming evidence.

**Evidence**:
> Study of 234 HR employees found significant confirmation bias across all interview stages. — [SAGE Journals 2023](https://journals.sagepub.com/doi/full/10.1177/23970022221094523)

**Implication**: The first bullet of each role must contain your highest-impact achievement.

---

### 4.3 Name-Based Discrimination

**The Pattern**: White-sounding names receive significantly more callbacks.

| Study | Sample | Finding | Source |
|-------|--------|---------|--------|
| Bertrand & Mullainathan (NBER) | ~5,000 resumes | White names: 10.08% callback vs. 6.70% for Black names (**50% gap**) | [NBER](https://www.nber.org/digest/sep03/employers-replies-racial-names) |
| ResumeGo 2019 | 19,200 resumes | White-sounding resumes: **43% higher callback** overall | [ResumeGo](https://www.resumego.net/research/race-in-resume-selection/) |

**Confidence**: ✅ **STRONG** (landmark academic study, replicated)

**Note**: CareerGating cannot fix systemic bias, but can ensure resumes don't inadvertently reveal protected characteristics through hobbies, location details, or graduation years that signal age.

---

## Section 5: ATS Technical Considerations

### 5.1 The "75% Rejection" Myth Is False

**Evidence**:
> "That '75% rejected by ATS' statistic is completely false. Career consultant Christine Assaf traced it back to Preptel, which went out of business in 2013." — [HiringThing](https://blog.hiringthing.com/applicant-tracking-system-myths)

> "Modern ATS don't auto-reject; they rank and sort for human reviewers." — [Simplify](https://simplify.jobs/blog/debunking-applicant-tracking-system-ats-myths/)

**Reality**:
- Actual parsing failure rate: ~3% (CV Compiler analysis of 20,000 resumes)
- 75% are filtered by **humans**, not robots

---

### 5.2 Format Issues That Break Parsing

| Element | Impact | Source |
|---------|--------|--------|
| Tables | Content scrambled or lost | Enhancv 2024 |
| Text boxes | Often invisible to ATS | Vendor documentation |
| Multi-column | 86% vs 93% parse success | Enhancv 2024 |
| Headers/footers | Contact info missed 25% of time | Interview Guys |
| Scanned PDFs | 0% parse rate | Enhancv 2024 |

**Format Success Rates**:
- Google Docs format: 95-96% accuracy
- MS Office DOCX: 88% accuracy
- Single-column layouts: 93% success

**Confidence**: ✅ **STRONG** (vendor-confirmed)

**→ Rule CG-FMT-001**: FAIL on scanned PDFs, tables, text boxes
**→ Rule CG-FMT-002**: WARN on multi-column layouts

---

## Section 6: Consolidated CareerGating Rules

### FAIL Severity (Strong Evidence, High Rejection Rate)

| Rule ID | Name | What It Catches | Evidence Base |
|---------|------|-----------------|---------------|
| CG-ERR-001 | SPELLING_ERROR | Any spelling mistakes | 77% dealbreaker (CareerBuilder), 18.5pp penalty (Ghent) |
| CG-ERR-002 | GRAMMAR_ERROR | Grammar/tense issues | 7.3pp penalty for 2 errors (Ghent) |
| CG-FMT-001 | ATS_BLOCKER | Tables, text boxes, scanned PDFs | 0% parse rate (Enhancv) |
| CG-FMT-002 | CONTACT_HEADER | Contact info in header/footer | 25% missed (Interview Guys) |
| CG-REG-001 | PHOTO_US | Photo on US resume | 88% rejection (StandOut-CV) |
| CG-SEC-001 | CREDENTIALS | API keys, tokens exposed | Security red flag |
| CG-SEC-002 | CONFIDENTIAL | NDA/internal language | Legal/judgment risk |

### WARN Severity (Strong to Moderate Evidence)

| Rule ID | Name | What It Catches | Evidence Base | Confidence |
|---------|------|-----------------|---------------|------------|
| CG-LNG-001 | BUZZWORD_CRITICAL | "synergy," "best of breed," "leverage" | 73% fatigue (CareerBuilder) | ✅ STRONG |
| CG-LNG-002 | WEAK_VERB | "responsible for," "helped with" | Industry consensus | ❓ CONVENTION |
| CG-QNT-001 | LOW_QUANTIFICATION | <50% bullets with metrics | 40% fewer interviews (LinkedIn) | ✅ STRONG |
| CG-QNT-002 | VAGUE_QUANTITY | "several," "many," "various" | Replace with numbers | ⚠️ MODERATE |
| CG-TONE-001 | SYCOPHANCY | "dream job," "honored," "thrilled" | Gordon meta-analysis, Baron 1986, n=254 study | ⚠️ MODERATE |
| CG-TONE-002 | ARROGANCE | "best," "guru," "ninja" unsupported | 72% turnoff (TopInterview) | ⚠️ MODERATE |
| CG-FMT-003 | MULTI_COLUMN | Two or more columns | 7% lower parse rate (Enhancv) | ✅ STRONG |
| CG-XVAR-001 | CONTAMINATION | Mentions other target companies | Wrong variant shipped | N/A (logic) |

### CONVENTION Severity (Downgraded — Industry Advice Without Evidence)

| Rule ID | Name | What It Catches | Why Downgraded |
|---------|------|-----------------|----------------|
| CG-LNG-003 | PASSIVE_VOICE | >10% passive constructions | ❌ NO RCTs exist; advice conflates "action verbs" with "active voice" |
| CG-BLT-001 | BULLET_COUNT | >5 or <2 bullets per role | ❌ "3-5 bullets" is pure convention; zero empirical support |

### INFO Severity (Context-Dependent)

| Rule ID | Name | What It Catches | Evidence Base |
|---------|------|-----------------|---------------|
| CG-LNK-001 | NO_LINKEDIN | Missing LinkedIn URL | 71% higher callback with (ResumeGo) |
| CG-GAP-001 | EMPLOYMENT_GAP | >3 months unexplained | Triggers questions |
| CG-AI-001 | AI_MARKERS | "delve," "pivotal" repeated | 49% reject obvious AI (Resume.io) |

---

## Section 7: Evidence Gaps — Meta-Research Findings

**Key insight**: Widespread professional advice rests on remarkably thin empirical foundations. The "3-5 bullets per role" benchmark and "use active voice" recommendations appear to be evidence-free conventions.

### Gap 1: Optimal Bullet Points Per Role

**Status**: ❌ **GENUINE VOID**

No controlled studies, A/B testing data, or peer-reviewed research exists specifically examining how bullet point counts affect hiring outcomes. The ubiquitous "3-5 bullets per job" recommendation is **pure professional convention**.

| Source | Sample | Tests Bullets? | Finding |
|--------|--------|----------------|---------|
| TheLadders (2018) | n=30 | No | Eye-tracking only, not bullet density |
| ResumeGo (2018-19) | n=24,570+ | No | Tested page length, gaps — never bullets |
| Cole et al. (2007) | n=244 | No | Education/experience focus |
| Kickresume (2024) | n=394 | Indirect | 28 total bullets avg, 4 per section — **correlational only, selection bias** |

**What could fill this gap**: Field experiment following ResumeGo methodology with 5,000+ resumes varying only in bullets per role (2, 4, 6, 8).

**→ Implication for CG rules**: No bullet count rules. Flag as "convention" if implemented.

---

### Gap 2: Active vs Passive Voice

**Status**: ❌ **GENUINE VOID**

No RCTs, field experiments, or peer-reviewed studies specifically test whether active versus passive voice affects hiring outcomes. **Complete separation between conventional wisdom and empirical research.**

**Critical distinction research fails to make**:
- **Action verbs** (achieved, launched, managed) = word choice
- **Active voice** (grammatical subject-verb construction) = sentence structure

Most advice conflates these. A resume could use action verbs in passive voice ("A 20% increase was achieved") or weak verbs in active voice ("I was responsible for…"). No research separates these variables.

| Claimed Research | Reality | Confidence |
|------------------|---------|------------|
| "Studies show active voice improves callbacks" | No such studies exist | Very weak |
| "Action verbs preferred" (surveys) | Self-reported preferences only | Moderate |
| "ATS prefers active voice" | Unsubstantiated | Very weak |
| "Journal of Professional Communication 2021 study" | Source disclaims some citations are **fictional** | Invalid |

**→ Implication for CG rules**: CG-LNG-003 (PASSIVE_VOICE) downgraded to CONVENTION, not WARN.

---

### Gap 3: Cross-Cultural Norms

**Status**: ⚠️ **PARTIAL COVERAGE** — Practitioner-documented but academically under-researched

Strong practitioner consensus exists on regional formats, but rigorous academic research is sparse. Evidence exists for discrimination effects but **not for format effectiveness**.

#### Well-Documented Regions (Strong Practitioner Consensus)

| Region | Key Norms | Evidence Quality |
|--------|-----------|------------------|
| **Japan** | Dual-document system (rirekisho + shokumukeirekisho), photos required, personal details expected | Practitioner only |
| **Germany** | Photos expected, Lebenslauf format, certificates (Zeugnisse), gaps must be explained | Practitioner + some discrimination research |
| **Australia/NZ** | 2-3 pages accepted, photos prohibited by law, references with full contact | Practitioner only |
| **Middle East (UAE, Saudi)** | Nationality disclosure required (visa purposes), photos common, English preferred | Practitioner only |

#### Significant Regional Gaps

| Region | Documentation Level |
|--------|---------------------|
| Latin America | Moderate, varies by country |
| Eastern Europe | Weak |
| Africa (excl. South Africa) | Very weak |
| Southeast Asia | Weak |
| Central Asia | None |

#### Academic Research That Does Exist

- **GEMM cross-national study** (Thijssen et al., 2019-2021): Field experiments across 5 EU countries — discrimination focus, not format effectiveness
- **Quillian et al. (2023)**: Meta-analysis of 90 field experiments, 170,000+ applications, 6 countries — discrimination unchanged or increasing
- **Europass data**: 133M visits, 65M+ CVs created — but experts consider it outdated for private sector

**→ Implication for CG rules**: Add region detection (CG-REG-*) but flag as practitioner-based, not academic.

---

### Gap 4: Sycophancy Thresholds

**Status**: ⚠️ **SUBSTANTIAL FOUNDATION, SPECIFIC GAP**

Strong research establishes that excessive impression management backfires, but virtually all studies focus on **interviews rather than written applications**, and no research provides **quantified thresholds**.

| Finding | Evidence Level | Applies to Written Apps? |
|---------|----------------|--------------------------|
| Ingratiation has positive interview effects | Strong (meta-analyses) | Untested |
| "Too much" backfires (curvilinear) | Moderate (Baron 1986) | Untested |
| Flattery negative in pre-interview screening | Moderate (n=254, one study) | **Yes** |
| Quantified phrase-level thresholds | None | Gap |

**What remains unknown**:
- How many self-promotional statements per 500 words triggers backlash?
- What ratio of accomplishment claims to humility markers is optimal?
- Are there specific phrases that universally signal "trying too hard"?

**→ Implication for CG rules**: CG-TONE-001 remains WARN but conservative; document as "threshold unknown."

---

### Evidence Classification Update

| Rating | Meaning | Criteria |
|--------|---------|----------|
| ✅ STRONG | Replicated, high-quality evidence | Peer-reviewed study OR multiple large surveys (n>500) agreeing |
| ⚠️ MODERATE | Single study or industry consensus | Single large study OR consistent expert opinion |
| ❓ CONVENTION | Industry consensus, zero empirical validation | Professional advice with no supporting research |
| ❌ VOID | No research exists | Topic never studied |

---

## Section 8: Primary Sources

### Academic Research — Peer-Reviewed
- Sterkens et al. 2023, PLOS One (Ghent University) — Spelling error penalty study (n=445)
- Bertrand & Mullainathan 2004, American Economic Review — Name discrimination study (~5,000 resumes)
- Texas A&M/MDPI 2023 — Eye-tracking + ML prediction study (n=221 recruiters, 2,043 resumes)
- SAGE Journals 2023 — Bias blind spot in HR employees (n=234)
- Cole et al. 2007 — Recruiter evaluation study (n=244)
- Risavy 2017 — Literature review of resume research (confirms gaps)
- Gordon 1996 — Ingratiation meta-analysis (69 studies)
- Baron 1986 — "Too much of a good thing" effect (Journal of Applied Social Psychology)
- Vonk 2002 — Flattery detection and backlash
- Quillian et al. 2023 — Meta-analysis of 90 discrimination field experiments (170,000+ applications)
- Thijssen et al. 2019-2021 — GEMM cross-national discrimination study (5 EU countries)

### Eye-Tracking Studies
- [TheLadders 2018 Eye-Tracking Study (PDF)](https://www.theladders.com/static/images/basicSite/pdfs/TheLadders-EyeTracking-StudyC2.pdf)
- [HR Dive Coverage](https://www.hrdive.com/news/eye-tracking-study-shows-recruiters-look-at-resumes-for-7-seconds/541582/)

### Industry Surveys
- [CareerBuilder/StandOut-CV Statistics](https://standout-cv.com/usa/stats-usa/resume-statistics)
- [Zety HR Statistics 2025](https://zety.com/blog/hr-statistics)
- [CultivatedCulture Resume Analysis](https://cultivatedculture.com/resume-statistics/)

### Field Experiments
- [ResumeGo Name Discrimination Study](https://www.resumego.net/research/race-in-resume-selection/)

### ATS Research
- [ATS Myths Debunked (HiringThing)](https://blog.hiringthing.com/applicant-tracking-system-myths)
- [Simplify ATS Myths](https://simplify.jobs/blog/debunking-applicant-tracking-system-ats-myths/)

### Career Guidance
- [TopResume Action Verbs](https://topresume.com/career-advice/how-to-effectively-use-action-words-in-your-resume)
- [Great Resumes Fast](https://greatresumesfast.com/blog/how-do-i-use-action-verbs-in-my-resume/)
- [Teal Quantification Guide](https://www.tealhq.com/post/quantify-your-resume)
- [Enhancv Quantification](https://enhancv.com/blog/quantifying-resume-examples/)

---

## Appendix: Confidence Rating Scale

| Rating | Meaning | Criteria |
|--------|---------|----------|
| ✅ STRONG | Replicated, high-quality evidence | Peer-reviewed study OR multiple large surveys (n>500) agreeing |
| ⚠️ MODERATE | Single study or industry consensus | Single large study OR consistent expert opinion |
| ❓ WEAK | Anecdotal or outdated | Small sample, pre-2015, or vendor marketing only |

---

**Next Steps**:
1. Implement rules in `@careergating/core`
2. Weight FAIL rules as blocking, WARN as advisory
3. Add region detection for cross-cultural rules (CG-REG-*)
4. Track false positive rates in production
