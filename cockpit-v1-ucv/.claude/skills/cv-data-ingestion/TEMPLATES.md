# CV Data Ingestion Templates

Quick-copy templates for creating content from raw data.

---

## Experience Entry Template

```yaml
  - company: "COMPANY_NAME"
    role: "JOB_TITLE"
    period: "YYYY – YYYY"
    location: "City, State"
    logo: "/images/logos/company.svg"
    highlights:
      - "METRIC: Specific achievement with number (e.g., 'Drove 15× revenue growth')"
      - "TECHNICAL: Stack/technology accomplishment (e.g., 'Built multi-client validator architecture')"
      - "SCALE: Scope indicator (e.g., 'Serving 1M+ daily API requests')"
      - "LEADERSHIP: Team/cross-functional impact (e.g., 'Led cross-functional team of 8')"
      - "DECISION: Key judgment call (e.g., 'Chose in-house validators over third-party for compliance')"
    tags: ["Domain", "Technology", "Skill"]
```

---

## Case Study Frontmatter Template

```yaml
---
id: NEXT_NUMBER
slug: project-slug-lowercase
title: "Project Title"
company: "Company Name"
year: "YYYY-YY"
tags: [Tag1, Tag2, Tag3, Tag4, Tag5]
duration: "X months"
role: "Your Role Title"

hook:
  headline: "One sentence summarizing impact and what you did"
  impactMetric:
    value: "XX%"
    label: "what was improved"
  subMetrics:
    - value: "YYK"
      label: "users/requests/clients"
    - value: "ZZ"
      label: "secondary metric"
  thumbnail: /images/case-study-slug.png

cta:
  headline: "Question that invites conversation about this type of work"
  subtext: "Optional: What you'd love to discuss"
  action: calendly
  linkText: "Let's talk →"

# Optional links
demoUrl: null
githubUrl: null
docsUrl: null
media: []
---
```

---

## Case Study Body Template

```markdown
Opening hook: One sentence about why this project mattered / the stakes.

## The Challenge

What problem needed solving? Include:
- Business context
- Technical constraints
- Stakeholder requirements
- Why existing solutions didn't work

**The constraints were steep:**
- Constraint 1
- Constraint 2
- Constraint 3

## The Approach

Your hypothesis and chosen path.

### Alternatives Considered

| Option | Trade-offs | Why Not |
|--------|------------|---------|
| Alternative 1 | Pros/cons | Reason eliminated |
| Alternative 2 | Pros/cons | Reason eliminated |
| Alternative 3 | Pros/cons | Reason eliminated |

**Chosen path:** What you decided and why.

## Key Decision

**Decision title**

Context for the decision. What was the tension?

> Quote or insight that captures the essence of the decision.

## Execution

### Phase 1: Discovery (X weeks)
- What you learned
- Key activities

### Phase 2: Design (X weeks)
- Architecture decisions
- Technical approach

### Phase 3: Build (X weeks)
- Implementation details
- Challenges overcome

### Phase 4: Launch (X weeks)
- Rollout strategy
- Client feedback

## Results

- **Metric 1** — Context for why this matters
- **Metric 2** — Impact statement
- **Metric 3** — Business outcome

Summary of overall impact.

## What I Learned

**What worked:**
- Learning 1
- Learning 2
- Learning 3

**What didn't:**
- Learning 1
- Learning 2
- Learning 3

> Closing insight or quote about the broader lesson.

If I did it again: One thing you'd change.
```

---

## Testimonial Entry Template

```yaml
  - quote: >
      Full testimonial text. Should be specific about what you did
      and the impact. 2-4 sentences ideal. Include concrete examples
      if possible.
    author: "Full Name"
    initials: "FN"
    role: "Their Role at the Time"
    company: "Company Name"
    avatar: null
    featured: true
```

---

## Skills Category Template

```yaml
categories:
  - name: "Category Name"
    skills:
      - name: "Skill Name"
        level: "expert"  # expert | advanced | intermediate
        evidence: "Specific project or achievement demonstrating this skill"

      - name: "Another Skill"
        level: "advanced"
        evidence: "Evidence statement"
```

---

## Passion Project Entry Template

```yaml
  - id: NEXT_NUMBER
    slug: project-slug
    title: "Project Title"
    tagline: "One line describing what it does"
    year: "YYYY"
    tags: [Category1, Category2, Type]
    thumbnail: null
    githubUrl: https://github.com/username/repo
    liveUrl: null
    docsUrl: null
```

---

## Certification Entry Template

```yaml
  - name: "Certification Name"
    issuer: "Issuing Organization"
    instructor: "Instructor Name"  # or null
    instructorRole: "Their Title/Context"  # or null
    date: "Month YYYY"
    credentialId: "credential-id"
    url: "https://verification-link"
    featured: true
```

---

## Profile Sections Template

```yaml
# Hero Section
hero:
  status: "Open to [ROLE_TYPE] roles — [Domain1], [Domain2], [Domain3]"
  headline:
    - text: "Action verb"
      style: "italic"
    - text: "connecting phrase"
      style: "muted"
    - text: "key value"
      style: "accent"
  subheadline: >
    [Current role] shipping [what].
    From [past highlight] to [recent achievement].
    Now exploring [future interest].
  cta:
    primary:
      label: "View Work"
      href: "#work"
    secondary:
      label: "Download Resume"
      href: "/resume.pdf"

# About Section
about:
  tagline: >
    [X years] shipping products where [domain context]—
    from [range start] to [range end] to [future direction].
  bio:
    - >
      Current paragraph: What you do now, for whom, key responsibilities.
      Mention notable clients or scale.
    - >
      Career arc paragraph: How you got here, what draws you to this work,
      where you're heading next.
  stats:
    - value: "X+"
      label: "Metric Label"
    - value: "Y"
      label: "Metric Label"
    - value: "Z"
      label: "Metric Label"
```

---

## Data Extraction Patterns

### From LinkedIn CSV

| LinkedIn Column | Maps To |
|-----------------|---------|
| Company Name | `experience.company` |
| Title | `experience.role` |
| Started On / Finished On | `experience.period` |
| Location | `experience.location` |
| Description | Parse for `highlights` |

### From Resume Text

Look for patterns:
- **Bullet points** → `highlights`
- **Percentages/numbers** → `impactMetric.value`
- **Date ranges** → `period`
- **"Led", "Built", "Shipped"** → Achievement indicators

### From Obsidian Notes

Common frontmatter fields:
```yaml
---
company:
role:
start_date:
end_date:
tags:
---
```

Common heading patterns:
- `## Achievements` → `highlights`
- `## Projects` → Case study candidates
- `## Learnings` → Case study "What I Learned"
