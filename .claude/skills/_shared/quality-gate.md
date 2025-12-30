# Quality Gate Template

Shared quality checks for all content-producing skills.

## Universal Checks

Before marking any content task complete:

- [ ] All outputs validated against schema (`npm run validate`)
- [ ] All claims verifiable against knowledge base
- [ ] Key metrics are specific and quantified
- [ ] No placeholder content (TODO, TBD, [X])

## Content-Specific Checks

### For Case Studies / Blog Posts
- [ ] STAR format complete (Situation, Task, Action, Result)
- [ ] Key quote/insight is memorable
- [ ] Tags align with knowledge base themes

### For Variants
- [ ] All claims traced to `content/knowledge/achievements/`
- [ ] companyAccent is set (REQUIRED)
- [ ] Red team passes (0 FAIL findings)
- [ ] Would defend every claim in an interview

### For Resumes
- [ ] All jobs included (count them!)
- [ ] Single page (no scrollbar at /resume)
- [ ] All text is selectable (ATS-friendly)

### For Interview Stories (HPARL)
- [ ] Hook creates genuine curiosity (stakes + constraint + tease)
- [ ] Actions use "I" not "we"
- [ ] Results have 2+ quantified metrics
- [ ] Total timing is 2-3 minutes when spoken

## Validation Commands

```bash
npm run validate           # Schema validation
npm run build              # Build check
npm run test               # Test suite
```
