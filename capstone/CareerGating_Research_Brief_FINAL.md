# Psychological & Behavioral Foundations for Resume Quality Gates: Comprehensive Research Synthesis

## Executive Summary

This research brief synthesizes three independent analyses of resume evaluation research to establish evidence-based quality rules for a "CareerGating" linter. The synthesis reveals strong cross-source agreement on core findings while identifying nuances that emerge only through triangulation.

**Key convergent findings across all three sources:**

| Finding | Doc 1 Evidence | Doc 2 Evidence | Doc 3 Evidence | Synthesis Confidence |
|---------|----------------|----------------|----------------|---------------------|
| Initial scan time 6-7.4 seconds | TheLadders 2018 (n=30), Texas A&M (n=221) | TheLadders 2018, Wonsulting | TheLadders 2018, Wonsulting 2022 | **STRONG** (triple-replicated) |
| 77% reject for typos/grammar | Ghent 2023 (n=445), CareerBuilder (n=2,153) | Zety 2025 (68%), CareerBuilder | Flair.hr (26% formatting errors) | **STRONG** (multiple surveys) |
| F-pattern scanning behavior | Nielsen Norman (n=232), Ladders heatmaps | Ladders heatmaps, BU analysis | Ladders heatmaps, Wonsulting | **STRONG** (eye-tracking confirmed) |
| Quantified achievements increase callbacks 40-2.5× | LinkedIn Talent Trends, Resumly | Zety (89% expect metrics) | Jobvite (34% dealbreaker without) | **STRONG** (industry consensus) |
| ATS parsing fails with complex layouts | Enhancv 2024 (93% vs 86%), Jobscan | Interview Guys (25% header fail) | TopResume, ATZ CRM 2025 | **STRONG** (vendor-confirmed) |

**Unique contributions by source:**

- **Document 1**: Strongest academic citations (Ghent University spelling study, Bertrand & Mullainathan discrimination research, Texas A&M eye-tracking ML study)
- **Document 2**: Most current recruiter survey data (Zety 2025, Interview Guys 2025)
- **Document 3**: Novel findings on "rule-bender" language/narcissism correlation, AI detection concerns, cross-cultural requirements

---

## Section 1: Scanning Behavior Research

### The 6-7.4 Second Window Is Real But Context-Dependent

All three sources confirm the rapid initial screening finding, though with important nuances:

**The Pattern**: Recruiters make "fit/no-fit" decisions in 6-7.4 seconds during initial screening, but this is only the first pass. Total review time for promising candidates extends to 30 seconds–3 minutes.

**Converging Evidence**:

| Study | Sample | Initial Scan | Extended Review |
|-------|--------|--------------|-----------------|
| TheLadders 2012 | n=30 recruiters | 6.0 seconds | Not measured |
| TheLadders 2018 | n=30 recruiters | 7.4 seconds | Engaged recruiters read page 2 |
| ResumeGo 2024 | n=418 HR professionals | — | 47% spend 30-60 seconds |
| Texas A&M/MDPI 2023 | n=221 recruiters, 2,043 resumes | — | 30 seconds–3 minutes typical |
| Wonsulting 2022 | Hidden eye-tracking | 6-7 seconds | Confirms F-pattern |

**Key insight from synthesis**: The 6-7.4 second figure represents only the *kill-or-keep* decision. Longer viewing time strongly correlates with positive outcomes—the Texas A&M study achieved 0.767 AUC predicting hiring decisions from gaze duration alone.

**Confidence Level**: **STRONG** (replicated across eye-tracking studies, industry surveys, and academic research)

**Actionable Rule**: Critical information must be visible and parseable within the first 7.4 seconds. The "Big Six" elements (name, current title, current company, previous title/company, education, start/end dates) must dominate the top-left quadrant.

---

### F-Pattern and Visual Hierarchy Are Universal

**The Pattern**: Recruiters scan horizontally across the top, make a shorter horizontal movement below, then scan vertically down the left margin. 80% of attention concentrates on 6 data points.

**Converging Evidence**:

- **Document 1**: Nielsen Norman Group (n=232 users, replicated 2006-2017) established users read only 20-28% of page content; Ladders heatmaps showed "bright attention clusters" on name/title/first bullets
- **Document 2**: Wonsulting analysis showed "bright clusters" on candidate name, most recent title, first bullet points; dense paragraphs got "almost no view"
- **Document 3**: Professionally formatted resumes scored 6.2/7 for usability vs. 3.9/7 for self-written—a 60% improvement

**Cross-source discrepancy**: Document 1 emphasizes that the bottom third of page one and the entire second page receive minimal attention during initial screen, while Document 2 notes engaged recruiters will read page 2 "if page 1 is compelling." **Resolution**: Both are correct—the second page is contingent on first-page performance.

**Confidence Level**: **STRONG** (foundational UX research plus resume-specific replications)

**Actionable Rule (CG-VIS-001)**: 
- Job titles must be left-aligned and bolded
- Key metrics should appear in the top third
- Fail any resume with titles centered or aligned right

---

### Professional Differences in Scanning

**Unique to Document 3**: Different evaluator types exhibit distinct scanning behaviors:

| Evaluator Type | Primary Goal | Gaze Behavior | Focus Areas |
|----------------|--------------|---------------|-------------|
| **Recruiter** | Screening/Filtration | Rapid F-Pattern scan | Titles, Dates, Company Prestige |
| **Hiring Manager** | Team Fit/Technical Depth | Selective deep reading | Context of achievements, specific tools |
| **Executive** | Strategic Alignment | Narrative/Trajectory scan | Progression, scope of impact, P&L |

**Implication for CareerGating**: A single resume must satisfy multiple scanning modes—front-load "tracking indicators" for recruiters while including "contextual depth" for hiring managers.

**Confidence Level**: **MODERATE** (industry surveys from SeekOut, iSmartRecruit; not experimentally validated)

---

## Section 2: Rejection Triggers (Language)

### Spelling and Grammar Errors: The Strongest Rejection Signal

**The Pattern**: Typos and grammatical errors cause immediate rejection in 68-77% of cases, signaling lower cognitive ability, conscientiousness, and interpersonal skills.

**Converging Evidence**:

| Source | Study | Finding |
|--------|-------|---------|
| **Doc 1** | Ghent University (Sterkens et al. 2023, PLOS One, n=445 recruiters, 1,335 resumes) | 5 errors reduce interview probability by **18.5 percentage points**; 2 errors by 7.3 pp |
| **Doc 1** | CareerBuilder 2018 (Harris Poll, n=2,153) | **77% consider typos instant dealbreakers** |
| **Doc 2** | Zety 2025 (n=753) | **68% reject for spelling/grammar errors** |
| **Doc 1** | StandOut-CV 2025 (n=100) | ~80% reject for typos |

**Mechanism identified (Doc 1 only)**: The Ghent study decomposed the penalty—errors signal lower mental abilities (32.2% of penalty), lower conscientiousness (12.1%), and lower interpersonal skills (9.0%). Women face more severe penalties.

**Confidence Level**: **STRONG** (peer-reviewed academic study + multiple large-scale surveys)

**Actionable Rule (CG-ERR-001)**: FAIL any resume with spelling errors. This is the highest-confidence rejection signal in the research.

---

### Overused Buzzwords Trigger Fatigue

**The Pattern**: Generic phrases like "results-driven," "team player," "synergy," and "think outside the box" signal laziness rather than achievement.

**Converging Evidence**:

| Source | Most-Hated Terms | Survey Scale |
|--------|------------------|--------------|
| **Doc 1** | CareerBuilder 2014 (n=2,000+) | "best of breed," "go-getter," "synergy," "go-to person," "results-driven," "team player" |
| **Doc 1** | LinkedIn annual (2010-2018) | motivated, passionate, creative, experienced, leadership, strategic, expert |
| **Doc 2** | CultivatedCulture survey | 51% of resumes contain "buzzword bingo" |
| **Doc 3** | Recruiter surveys | "team player," "hard worker," "problem solver" treated as "clichés" |

**73% of hiring professionals** report fatigue from repetitive phrases (Vettio research, Doc 1).

**Unique finding (Doc 3)**: These terms are treated as "stopwords"—words that human readers ignore and ATS systems weight as low-value.

**Confidence Level**: **STRONG** (consistent across multiple surveys spanning 10+ years)

**Actionable Rule (CG-LNG-001)**: WARN on critical buzzwords ("synergy," "best of breed," "think outside the box"). These have the longest history of documented recruiter fatigue.

---

### Sycophantic and "Trying Too Hard" Language

**Unique to Doc 3 with partial support from Doc 2**:

**The Pattern**: Excessive flattery, unsolicited praise, or language that over-mirrors employer values triggers "manipulativeness" attribution.

**Evidence**:
- Impression management research shows "ingratiation" carries risks (Doc 3, citing ResearchGate study)
- TopResume poll (n=330): arrogance ranked #2 worst candidate trait (Doc 2)
- Doc 1: TopInterview survey—42% value confidence but 72% rate overconfidence as "biggest personality turnoff"

**Examples that trigger the "trying too hard" response**:
- "It would be the greatest honor of my life to serve your visionary company"
- "I am a passionate admirer of [Company's] mission"

**Confidence Level**: **MODERATE** (social psychology research + recruiter surveys)

**Actionable Rule (CG-SYCO-001)**: WARN on phrases containing "honor," "privilege," "grateful," "dream job," or excessive superlatives about the employer.

---

### "Rule-Bender" Language and Narcissism Correlation

**Unique to Doc 3**:

**The Pattern**: Language emphasizing "ambition," "strategic thinking," and "rule-bending" attracts narcissistic applicants who are statistically more likely to engage in fraud.

**Evidence**: A 2024 *Management Science* study by Nick Seybert et al. found "rule-bender" language (e.g., "thinks outside the box," "communicates persuasively") was significantly more seductive to narcissists. Professional recruiters unintentionally include this language when hiring for high-growth roles, biasing pools toward unethical candidates.

**Confidence Level**: **MODERATE** (single high-impact study; accounting sector focus may limit generalizability)

**Actionable Rule (CG-LANG-004)**: WARN on "ambitious strategist," "rule-breaker," "disrupts convention," "bypasses obstacles" unless specifically requested in job description.

---

### AI-Generated "Robotic Polish" as Emerging Red Flag

**Convergent across Doc 1 and Doc 3**:

**The Pattern**: Over-polished, unnaturally smooth writing signals dishonesty or AI over-reliance.

**Evidence**:
- **Doc 1**: Resume.io (n=3,000)—49% of hiring managers reject detected AI-generated resumes
- **Doc 3**: Indeed FutureWorks 2025—employers increasingly vigilant against "robotic resumes"
- **Doc 1**: MIT Sloan found AI-boosted resumes were 8% more likely to be selected with 8.4% higher wage offers—but *obvious* AI generation hurts

**AI-typical markers identified**:
- Words like "delve," "pivotal," "synergy," "leverage"
- Repetitive sentence structures
- Lack of specific, personal anecdotes
- Generic achievements lacking context

**Confidence Level**: **MODERATE** (emerging 2024-2025 trend; detection tools have significant false positive rates)

**Actionable Rule (CG-AI-001)**: INFO-level flag on AI-typical words ("delve," "pivotal," "leverage," "synergies") appearing more than twice.

---

## Section 3: Success Signals (Language)

### Quantified Achievements: The Strongest Positive Signal

**The Pattern**: Resumes with specific numbers and measurable results dramatically outperform vague claims.

**Converging Evidence**:

| Source | Finding | Magnitude |
|--------|---------|-----------|
| **Doc 1** | LinkedIn Talent Trends | 40% more interview invitations with quantified achievements |
| **Doc 1** | CareerBuilder 2018 | 34% reject resumes without quantifiable results |
| **Doc 1** | Resumly case study | 20% interview conversion (quantified) vs. 7.5% (generic) |
| **Doc 2** | Zety 2025 | 89% of recruiters expect measurable results; 35% won't consider resumes without them |
| **Doc 2** | Resumly/LinkedIn | 2.5× more callbacks with quantified achievements |
| **Doc 3** | Eye-tracking | Short, numbered bullets attracted more visual fixation than paragraphs |
| **Doc 3** | Flair.hr | 36% of rejected resumes lacked any metrics; only 26% had 5+ |

**The XYZ Formula (Doc 3)**: "Accomplished [X] as measured by [Y], by doing [Z]" is the gold standard.

**Confidence Level**: **STRONG** (convergent evidence across all three documents, multiple methodologies)

**Actionable Rule (CG-QNT-001)**: WARN if fewer than 50% of experience bullet points contain metrics (%, $, #, or time-based measures).

---

### Active Voice and High-Agency Verbs

**The Pattern**: Resumes leading with strong action verbs ("orchestrated," "secured," "reduced") signal competence and ownership.

**Converging Evidence**:

| Passive/Weak (Flag) | Active/Strong (Pass) |
|---------------------|---------------------|
| "Was responsible for answering phones" | "Answered 50+ calls daily" |
| "A promotion was awarded to me" | "Earned promotion after exceeding targets by 25%" |
| "Duties included managing team" | "Managed team of 12 across 3 departments" |
| "Helped improve customer satisfaction" | "Increased customer satisfaction 20%" |

**Verb tiers (Doc 3)**:

| Category | High-Impact | Low-Impact (Flag) |
|----------|-------------|-------------------|
| Leadership | Spearheaded, Orchestrated, Chaired | Led, Headed, Managed |
| Efficiency | Streamlined, Optimized, Refined | Improved, Helped, Assisted |
| Creation | Conceptualized, Devised, Fashioned | Made, Wrote, Built |
| Research | Systematized, Interpreted, Critiqued | Researched, Looked into, Found |

**Confidence Level**: **STRONG** (foundational business writing principle; supported by Harvard, Ohio University, UT Austin career services)

**Actionable Rule (CG-LNG-002)**: WARN on "Responsible for," "Helped with," "Assisted," "Duties included."

---

### The Confidence vs. Arrogance Boundary

**The Pattern**: Confidence uses quantifiable facts and acknowledges teams/learning; arrogance uses unsupported superlatives and claims sole credit.

**Converging Evidence**:

- **Doc 1**: TopInterview survey—42% value confidence, 72% rate overconfidence as biggest turnoff
- **Doc 2**: TopResume poll (n=330)—arrogance ranked #2 worst trait
- **Doc 3**: Computational linguistics research (88-91% accuracy) identified markers of "extreme" vs. "moderate" language

**Linguistic markers (Doc 3)**:
- Arrogance markers: exclamation marks, "always," "best," "unrivaled," failure to acknowledge teams
- Confidence markers: qualifying connectors ("but," "while"), "seem," acknowledging learning

**Example contrast**:
- Arrogance: "The absolute best developer in the world!"
- Confidence: "Consistently ranked in the top 5% of the engineering team while managing complex legacy migrations."

**Confidence Level**: **MODERATE** (computational linguistics research supports pattern; recruiter survey data confirms rejection)

**Actionable Rule (CG-LNG-004)**: WARN on unsubstantiated superlatives ("best," "top," "expert," "guru," "ninja," "rockstar") without supporting evidence.

---

## Section 4: Cognitive Bias Implications

### Similarity Bias Creates 50% Callback Differential

**The Pattern**: Evaluators favor candidates who share characteristics with themselves or belong to in-groups.

**Strongest Evidence (Doc 1 only)**:

| Study | Sample | Finding |
|-------|--------|---------|
| Bertrand & Mullainathan 2004 (American Economic Review) | ~5,000 fictitious resumes | White-sounding names: 10.08% callback vs. 6.70% for African-American-sounding names—**50% differential** |
| Wilson & Caliskan 2024 (AAAI/ACM) | 3+ million resume-job comparisons | AI screening showed white-associated names preferred in 85.1% of cases; Black male names never preferred over white male names |

**Supporting evidence from other docs**:
- **Doc 2**: Northwestern research—interviewers prefer "mini-me" candidates
- **Doc 3**: Warmth/competence perceptions affect callback rates; lack of social media profile viewed as "hiding something"

**Confidence Level**: **STRONG** (landmark academic study, replicated in AI systems)

**Implication for CareerGating**: The linter cannot fix systemic bias, but can ensure resumes don't inadvertently reveal protected characteristics through hobbies, location details, or graduation years that signal age.

---

### The Halo Effect of Prestige

**The Pattern**: One impressive credential (Ivy League, FAANG employer) creates a positive halo affecting all other evaluations.

**Converging Evidence**:
- **Doc 1**: Ladders eye-tracking—recruiters spend disproportionate attention on prestigious company names
- **Doc 2**: Experimental reviews—graduating from prestigious school led raters to infer higher ability across the board
- **Doc 3**: Recruiter behavior shows immediate jumps to company names for "scope" and "quality" shortcuts

**Mitigation for candidates without prestige markers**: Create alternative halos through quantified achievements, professional certifications, and polished formatting.

**Confidence Level**: **MODERATE** (widely accepted; empirical data on "overlook rate" for flaws is sparse)

**Actionable Rule (CG-STR-001)**: If a "Prestige Anchor" exists (top-tier university, FAANG company, major award), ensure it appears in the first 25% of the resume.

---

### Anchoring and Confirmation Bias Lock In First Impressions

**The Pattern**: The first information encountered sets an anchor; recruiters then seek confirming evidence.

**Converging Evidence**:
- **Doc 1**: Rabin & Schrag 1999 (Quarterly Journal of Economics)—agents form hypotheses and become biased toward confirming them
- **Doc 1**: Dipboye field study (n=164)—pre-interview evaluations positively predicted post-interview ratings
- **Doc 2**: Interview Guys—after 7-10 second scan, reviewers "confirm" snap judgment
- **Doc 3**: Experiment with 247 mock interviewers—early impressions accounted for 8% of variance beyond GPA

**Confidence Level**: **STRONG** (classic social psychology finding; Willis & Todorov 2006)

**Actionable Rule**: Place the single strongest credential (most relevant to target role) in the first 25% of page one. Ensure first bullet point of each role contains highest-impact achievement.

---

## Section 5: Technical/ATS Considerations

### Most ATS Systems Do NOT Auto-Reject

**Critical finding from Doc 1 (often misunderstood)**:

> Crowdsourced data from recruiters at Greenhouse, eRecruit, Lever, iCIMS, Brassring, Taleo, and Workday confirms: "As of 2020, none of the major ATS systems reject resumes automatically or hide them from recruiters."

The primary rejection mechanisms are:
1. **Knockout questions** (binary pre-screening questions)
2. **Poor keyword alignment** reducing search visibility
3. **Parsing failures** causing incomplete data extraction

**Taleo is the only major system confirmed to use automated ranking** based on parsed resume content.

**Confidence Level**: **STRONG** (crowdsourced from actual ATS users; vendor documentation)

---

### Formatting Causes Significant Parsing Failures

**Converging Evidence on Format Problems**:

| Element | Doc 1 (Enhancv 2024) | Doc 2 (Interview Guys) | Doc 3 (TopResume/ATZ) |
|---------|---------------------|------------------------|----------------------|
| Tables | "Content scrambled or lost" | "ATS scrambles content" | "Jumbles reading order" |
| Text boxes | "Content often invisible" | ATS may miss 25% of info | N/A |
| Multi-column | 86% parse rate vs. 93% single | "Merges first lines across columns" | Same finding |
| Headers/footers | "Contact info may be lost" | 25% of contact info missed | "Must be in main body" |
| Scanned PDFs | 0% parse rate | N/A | N/A |

**Format success rates (Doc 1)**:
- Google Docs format: 95-96% parsing accuracy
- MS Office DOCX: 88% accuracy
- MS Office PDF: 85% accuracy
- Single-column layouts: 93% success

**Confidence Level**: **STRONG** (convergent across all three documents; vendor-confirmed)

**Actionable Rules**:
- **CG-FMT-001** (FAIL): Scanned or image-based PDFs
- **CG-FMT-002** (FAIL): Tables in resume content
- **CG-FMT-003** (FAIL): Text boxes or shapes
- **CG-FMT-004** (WARN): Multi-column layouts
- **CG-CON-002** (FAIL): Contact info in document header/footer

---

### Keyword Optimization Requires Balance

**Converging Evidence**:

| Finding | Source |
|---------|--------|
| 99.7% of recruiters use keyword filters | Jobscan (Doc 1, Doc 2) |
| 88% of executives admit tools reject qualified candidates for wrong terminology | Doc 3 (Harvard Business School) |
| Keyword stuffing is detectable; 65-75% match rate recommended | Jobscan (Doc 1) |
| Modern ATS use semantic search with NLP-based algorithms | MDPI 2025 Resume2Vec study (Doc 1) |
| ATS often fails to recognize synonyms ("Project Lead" vs. "Project Manager") | Doc 3 |

**Best practices (synthesized)**:
- Include both spelled-out terms and acronyms: "Search Engine Optimization (SEO)"
- Use exact phrases from job descriptions
- Place important keywords in Experience section (weighted higher)
- Avoid hidden text (flagged as suspicious)
- Target 65-75% keyword match rate

**Confidence Level**: **STRONG** (convergent evidence; vendor documentation)

**Actionable Rule (CG-KWD-001)**: WARN if less than 65% keyword match to job description (when JD is provided).

---

## Section 6: Trust & Credibility Signals

### Social Proof Increases Callback Rates

**The Pattern**: Testimonials, digital badges, and LinkedIn profiles serve as "micro-endorsements" that reduce employer hesitation.

**Evidence**:
- **Doc 1**: ResumeGo (n=24,570)—71% higher callback with comprehensive LinkedIn profile
- **Doc 3**: LinkedIn study—candidates listing relevant certifications 30% more likely to receive callbacks
- **Doc 3**: Resumes with authentic testimonials pairing quote + metric report higher engagement

**Confidence Level**: **MODERATE** (large field experiment for LinkedIn; single studies for certifications)

**Actionable Rule (CG-LNK-001)**: INFO if no LinkedIn profile URL included.

---

### The "Too Good to Be True" Effect

**The Pattern**: Perfect, flaw-free resumes trigger skepticism; strategic vulnerability makes other claims more believable.

**Evidence (Doc 3 primarily)**:
- "Practicality Effect" in marketing—products with some negative reviews convert better than perfect 5-star ratings
- Admitting employment gap honestly resulted in ratings identical to those with no gap; lying was unmasked via social media and labeled "red flag"
- 76% of recruiters cite lies/exaggerations as rejection reason (Doc 2, Zety)

**Confidence Level**: **MODERATE** (consumer psychology research; 2024 IZA recruitment experiment)

**Actionable Rule (CG-GAP-001)**: INFO on employment gaps >3 months; prompt for explanation rather than hiding.

---

## Section 7: Tone & Voice

### First Person vs. Third Person vs. Implied First Person

**The Pattern**: "Implied first person" (dropping the subject) is preferred. Third person reads as arrogant; excessive "I" is unprofessional.

**Evidence**:
- **Doc 3**: Flair.hr survey—third person ("John is a highly skilled...") leads to 40% rejection rate
- **Doc 1**: Industry consensus—first-person pronouns implied but not stated

**Examples**:
- FAIL: "John is a results-driven professional who..."
- FAIL: "I managed a team of 12 engineers"
- PASS: "Managed team of 12 engineers across 3 departments"

**Confidence Level**: **STRONG** (industry consensus)

**Actionable Rule (CG-PERS-001)**: FAIL any sentence using candidate's name in third person. WARN on bullets starting with "I," "me," or "my."

---

### Active vs. Passive Voice

**The Pattern**: Passive voice ("was managed by me") waters down impact and obscures accountability.

**Evidence**:
- **Doc 1**: Harvard/Indeed—active voice preferred for demonstrating "ownership of action"
- **Doc 2**: Expert guidelines emphasize beginning bullets with action verbs
- **Doc 3**: Linguistic studies—passive structures appropriate for academic methodology sections, not marketing documents (which resumes are)

**Confidence Level**: **STRONG** (fundamental business writing principle)

**Actionable Rule (CG-LNG-005)**: WARN if >10% of constructions are passive ("was," "were," "by").

---

## Section 8: Common Rejection Reasons (Ranked by Frequency)

Synthesizing survey data across all three documents:

| Rank | Rejection Reason | Frequency | Primary Source |
|------|-----------------|-----------|----------------|
| 1 | Spelling/grammar errors | 68-77% | Ghent 2023, CareerBuilder, Zety |
| 2 | Not customized to role | 72% | Zety 2025 |
| 3 | Lies/exaggerations detected | 76% | Zety 2025 |
| 4 | Missing quantifiable results | 34-35% dealbreaker | CareerBuilder, Zety |
| 5 | Unprofessional email address | 30-35% | CareerBuilder |
| 6 | Formatting errors | 26% | Flair.hr |
| 7 | Wrong length (<475 or >600 words) | Interview rate drops to <5% | Flair.hr, TalentWorks |
| 8 | Photo on US resume | 80%+ rejection | Multiple sources |

**Unique finding (Doc 3)**: Word count "sweet spot" of 475-600 words optimizes interview rates.

---

## Section 9: Cross-Cultural Considerations

**The Pattern**: Resume expectations vary dramatically by region. A "perfect" US resume will be rejected in Germany, and vice versa.

| Region | Photo | Length | Personal Info | Key Differences |
|--------|-------|--------|---------------|-----------------|
| **US/Canada** | NEVER (80%+ rejection) | 1 page (<10 years exp) | Minimal | Impact-focused, compliance-conscious |
| **UK** | Rarely | 2 pages acceptable | Moderate | "Personal Statement" vs. "Professional Summary" |
| **Germany** | Often required | 2 pages standard | Required (DOB, nationality) | Professional photo expected |
| **Japan** | Required (passport-style) | Rirekisho format (JIS standard) | Extensive (DOB, family status) | Two-document system (Rirekisho + Shokumukeirekisho) |
| **EU (Europass)** | Optional | 2+ pages | Moderate | Standardized format for cross-border |

**Evidence**: Doc 1 provides most comprehensive regional rules; Doc 3 cites Modern Diplomacy and TopResume global guides.

**Confidence Level**: **STRONG** (industry consensus; documented standards)

**Actionable Rules**:
- **CG-REG-001** (FAIL): Photo included on US resume
- **CG-REG-002** (INFO): Missing photo for Germany
- **CG-REG-003** (WARN): Missing photo for Japan
- **CG-REG-004** (WARN): Missing DOB for Japan

---

## Section 10: Temporal Patterns (Post-2020 and Post-AI)

### Skills-Based Hiring: Promise vs. Reality

**The Pattern**: 81% of employers claim to use skills-based hiring, but actual implementation is minimal.

**Evidence**:
- **Doc 1**: TestGorilla 2024—81% adoption at policy level
- **Doc 1**: Harvard Business School/Burning Glass Institute—actual hiring changes in "not even 1 in 700 hires"

**Implication**: Candidates should still prioritize traditional signals while the transition unfolds.

---

### AI Resume Detection Is Evolving

**Evidence**:
- **Doc 1**: 49% of hiring managers reject detected AI-generated resumes (resume.io, n=3,000)
- **Doc 1**: MIT Sloan—AI-boosted resumes 8% more likely selected, 8.4% higher wage offers (when not obvious)
- **Doc 3**: Indeed FutureWorks 2025—employers increasingly vigilant against "robotic resumes"

**Key markers of AI-generated content**:
- "Delve," "pivotal," "leverage," "synergies"
- Repetitive sentence structures
- Lack of specific anecdotes
- Generic achievements without context

**Confidence Level**: **MODERATE** (emerging 2024-2025 trend)

---

### Employment Gaps Are Becoming More Acceptable

**The Pattern**: Gaps bridged by "Continuous Learning" signals (certifications, projects) are viewed more favorably post-2020.

**Evidence**:
- **Doc 3**: 60% of companies reported increase in time-to-hire in 2024
- **Doc 3**: Technical badges 30% more effective at generating callbacks than traditional tenure markers
- **Doc 1**: 49% of ATS systems auto-filter gaps >6 months (requiring explanation)

**Actionable Rule (CG-TIME-001)**: If employment gap >3 months, search for certification or project anchor during that timeframe.

---

## Section 11: Consolidated CareerGating Rules

### Critical Severity (FAIL) — Strong Evidence, High Rejection Rate

| Rule ID | Name | What It Catches | Evidence Base | Sources |
|---------|------|-----------------|---------------|---------|
| CG-ERR-001 | SPELLING_CHECK | Any spelling errors | 18.5pp penalty (5 errors); 77% dealbreaker | Ghent 2023, CareerBuilder, Zety |
| CG-ERR-002 | GRAMMAR_CHECK | Grammar errors, verb tense inconsistency | 7.3pp penalty (2 errors) | Ghent 2023 |
| CG-FMT-001 | ATS_SCAN_TEST | Scanned PDFs, image-based files | 0% parse rate | Enhancv 2024 |
| CG-FMT-002 | TABLE_DETECT | Tables in resume content | Content scrambled; 7% lower parse rate | Enhancv, Interview Guys, ATZ |
| CG-FMT-003 | TEXT_BOX_DETECT | Text boxes or shapes | Content invisible to ATS | Vendor documentation |
| CG-CON-001 | CONTACT_MISSING | Missing email or phone | Basic requirement; iCIMS fails import | Multiple |
| CG-CON-002 | CONTACT_IN_HEADER | Contact info in document header/footer | 25% of info missed | Interview Guys, ATZ |
| CG-REG-001 | PHOTO_US | Photo included on US resume | 80%+ rejection | Multiple sources |
| CG-ATS-001 | OCR_BLOCKER | Tables, text boxes, multi-column | Content scrambled | TopResume, ATZ 2025 |
| CG-PERS-001 | THIRD_PERSON | Using "John is..." or "He managed..." | 40% rejection rate | Flair.hr |
| CG-VIS-001 | F_PATTERN_FAIL | Job titles centered or right-aligned | Misses F-pattern hot zone | Ladders eye-tracking |

---

### High Severity (WARN) — Strong to Moderate Evidence

| Rule ID | Name | What It Catches | Evidence Base | Sources |
|---------|------|-----------------|---------------|---------|
| CG-STR-001 | TOP_THIRD_OPT | Critical info not in top third | 80% attention on 6 data points | Ladders, Texas A&M |
| CG-STR-002 | F_PATTERN_COMPLIANCE | Key info not left-aligned | 20-28% of content read | Nielsen Norman |
| CG-QNT-001 | QUANTIFICATION_RATE | <50% of bullets contain numbers | 40% more interviews; 2.5× callbacks | LinkedIn, Resumly, Zety |
| CG-QNT-002 | VAGUE_QUANTITY | "Several," "numerous," "many," "various" | Replace with specific numbers | Synthesis |
| CG-LNG-001 | BUZZWORD_CRITICAL | "Synergy," "best of breed," "think outside the box" | 51% contain buzzwords; recruiter fatigue | CareerBuilder, CultivatedCulture |
| CG-LNG-002 | WEAK_ACTION_VERB | "Responsible for," "helped with," "assisted" | Reduces perceived ownership | Harvard, Indeed |
| CG-LNG-003 | BUZZWORD_MODERATE | "Results-driven," "team player," "hard worker" | Treated as "stopwords" | LinkedIn, Jobvite |
| CG-LNG-004 | SUPERLATIVE_UNSUPPORTED | "Best," "expert," "guru," "ninja" without evidence | 72% overconfidence turnoff | TopInterview |
| CG-LNG-005 | PASSIVE_VOICE_RATIO | >10% passive constructions | Waters down impact | Harvard, Indeed |
| CG-FMT-004 | MULTI_COLUMN | Two or more columns | 86% vs. 93% parse rate | Enhancv |
| CG-FMT-005 | PARAGRAPH_DENSITY | Paragraphs >4 lines without bullets | Dense paragraphs ignored | Wonsulting, Ladders |
| CG-LEN-001 | LENGTH_EXPERIENCE | Entry-level with >1 page | Appropriate length matters | ResumeGo |
| CG-LEN-002 | EXCESSIVE_LENGTH | >2 pages (non-academic) | 17% dealbreaker | CareerBuilder |
| CG-CON-003 | UNPROFESSIONAL_EMAIL | Numbers, childish names in email | 30-35% rejection | CareerBuilder |
| CG-KWD-001 | KEYWORD_MATCH_LOW | <65% match to job description | May not appear in searches | Jobscan |
| CG-TIME-001 | WORD_COUNT_SWEET | <475 or >600 words | Interview rate drops to <5% | Flair.hr, TalentWorks |
| CG-VIS-002 | COGNITIVE_LOAD | Skill bars, graphics, charts | 19% fixation on photos | Ladders (LinkedIn profiles) |
| CG-LANG-004 | RULE_BENDER | "Ambitious strategist," "bypasses obstacles" | Attracts narcissistic candidates | Management Science 2024 |
| CG-PERS-002 | ROBOTIC_POLISH | AI-typical phrasing, zero anecdotes | 49% reject detected AI | Resume.io, Indeed |

---

### Medium Severity (INFO) — Moderate Evidence or Context-Dependent

| Rule ID | Name | What It Catches | Evidence Base | Sources |
|---------|------|-----------------|---------------|---------|
| CG-PERS-003 | PRONOUN_START | Bullets starting with "I," "my" | Industry consensus | Flair.hr |
| CG-GAP-001 | EMPLOYMENT_GAP | >3 months unexplained | Triggers attribution; prompt explanation | Multiple |
| CG-LNK-001 | LINKEDIN_MISSING | No LinkedIn URL | 71% higher callback with profile | ResumeGo |
| CG-AI-001 | AI_SIGNAL_WORDS | "Delve," "pivotal" >2× | 49% reject detected AI | Resume.io |
| CG-AI-002 | REPETITIVE_STRUCTURE | Identical sentence structures | AI pattern marker | Synthesis |
| CG-REG-002 | PHOTO_REQUIRED_DE | Missing photo (Germany) | Regional expectation | TopResume |
| CG-REG-003 | PHOTO_REQUIRED_JP | Missing passport photo (Japan) | Required | TopResume |
| CG-REG-007 | PERSONAL_STATEMENT_UK | Using "Professional Summary" (UK) | Regional terminology | TopResume |
| CG-TRUST-001 | SOCIAL_PROOF_GAP | No verifiable credentials/links | Reduces credibility | Pearson/Credly |
| CG-SYCO-001 | SYCOPHANCY_DETECT | "Honor," "privilege," "dream job" | Triggers manipulation attribution | ResearchGate |

---

## Key Evidence Sources with Confidence Ratings

### Strong Evidence (Peer-Reviewed, Replicated, Large Samples)

| Citation | Sample | Method | Key Finding |
|----------|--------|--------|-------------|
| Sterkens et al. 2023 (PLOS One) | n=445 recruiters, 1,335 resumes | Controlled experiment | Spelling error penalty quantified |
| Texas A&M/MDPI 2023 | n=221 recruiters, 2,043 resumes | Eye-tracking + ML | 0.767 AUC predicting decisions |
| Bertrand & Mullainathan 2004 | ~5,000 fictitious resumes | Field experiment | 50% callback differential by name |
| Moore, Lee, Kim & Cable 2015 | n=1,635 | Field study | Authenticity increases job offers |
| Nielsen Norman Group 2006-2017 | n=232 users | Eye-tracking | F-pattern reading confirmed |
| CareerBuilder 2018 (Harris Poll) | n=2,153 HR managers | Survey | 77% typo rejection rate |
| ResumeGo field experiments | n=24,570 resumes | Field experiment | LinkedIn/customization impact |

### Moderate Evidence (Single Studies, Industry Research)

| Citation | Sample | Method | Key Finding |
|----------|--------|--------|-------------|
| TheLadders 2012/2018 | n=30 recruiters | Eye-tracking | 6-7.4 second scan |
| Zety 2025 | n=753 recruiters | Survey | 68% typo rejection; 89% expect metrics |
| Enhancv 2024 | Multiple ATS | Parsing test | Format impact quantified |
| Resume.io 2024 | n=3,000 | Survey | 49% reject AI resumes |
| Seybert et al. 2024 (Management Science) | Accounting field | Experimental | "Rule-bender" language study |

### Weak Evidence (Small Samples, Anecdotal)

- Single recruiter opinion pieces
- Vendor marketing claims without methodology
- Pre-2015 studies (unless foundational)

---

## Critical Research Gaps

1. **Optimal bullet points per role**: No controlled study exists
2. **Industry-specific language preferences**: Most studies don't segment by industry
3. **Remote vs. on-site application differences**: Post-2020 comparison lacking
4. **ATS optimization vs. human readability tradeoffs**: No experimental validation
5. **Generational differences in evaluation**: Boomer vs. Gen X vs. Millennial hiring managers not studied
6. **Cover letter impact**: Evidence mixed and declining in relevance

---

## Conclusions: The Science of CareerGating

This synthesis reveals three "masters" that every resume must satisfy:

1. **The ATS Parser**: Requires structural simplicity, exact-match keywords, and header/footer-free contact data
2. **The Human Recruiter**: Requires clear F-pattern hierarchy, high-agency verbs, and front-loaded tracking indicators within 7.4 seconds
3. **The Hiring Manager**: Requires the XYZ formula (Problem/Solution/Impact), social proof, and authentic anecdotes

The convergence of evidence across three independent analyses provides high confidence in the core CareerGating rules. The 77% rejection rate for typos, the 6-7.4 second scan window, and the 40%+ callback improvement from quantified achievements are now established findings with multiple supporting studies.

The emerging challenge is AI-generated content detection, where the evidence remains moderate but the 49% rejection rate for detected AI suggests this will become a critical rule category by 2026.

---

## Appendix: Source Document Comparison Matrix

| Topic | Document 1 | Document 2 | Document 3 | Agreement Level |
|-------|------------|------------|------------|-----------------|
| Scan time | 6-7.4s (Ladders, Texas A&M) | 6-7s (Ladders, Wonsulting) | 7.4s (Ladders) | **Full** |
| Typo rejection | 77% (CareerBuilder) | 68% (Zety) | 26% formatting (Flair) | **Partial** (range 68-77%) |
| Quantification impact | 40% more interviews | 2.5× callbacks, 89% expect | 36% rejected without | **Full** |
| ATS parsing issues | Tables, text boxes, columns | Headers/footers 25% missed | Multi-column scrambles | **Full** |
| Buzzword fatigue | CareerBuilder 2014 list | 51% contain buzzwords | "Stopwords" concept | **Full** |
| AI detection | 49% reject (Resume.io) | Not covered | Indeed FutureWorks | **Partial** |
| Cross-cultural | Comprehensive regional rules | Not covered | US vs EU vs Asia | **Partial** |
| Similarity bias | Bertrand & Mullainathan | Northwestern "mini-me" | Warmth/competence | **Full** |
| "Rule-bender" language | Not covered | Not covered | Management Science 2024 | **Unique to Doc 3** |
| Sycophancy triggers | Not covered | Arrogance #2 turnoff | Ingratiation research | **Partial** |
