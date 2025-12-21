#!/usr/bin/env tsx
/**
 * Content Validation CLI
 *
 * Validates all portfolio content files against Zod schemas.
 * Run before committing to catch content errors early.
 *
 * Usage:
 *   npm run validate
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';
import { z } from 'zod';
import {
  ProfileSchema,
  ExperienceSchema,
  TestimonialsSchema,
  CertificationsSchema,
  SkillsSchema,
  SocialSchema,
  CaseStudySchema,
  PassionProjectsSchema,
  BlogPostSchema,
  VariantSchema
} from '../src/lib/schemas.js';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m'
};

interface ValidationResult {
  file: string;
  success: boolean;
  errors?: string[];
}

// Parse frontmatter from markdown
function parseFrontmatter(raw: string): { frontmatter: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content: raw };

  const frontmatterStr = match[1];
  const content = match[2].trim();

  try {
    const frontmatter = YAML.parse(frontmatterStr);
    return { frontmatter, content };
  } catch (error) {
    console.error('Failed to parse frontmatter:', error);
    return { frontmatter: {}, content: raw };
  }
}

// Validate a single file against a Zod schema
function validateFile(
  filePath: string,
  schema: z.ZodSchema,
  data: unknown
): ValidationResult {
  try {
    schema.parse(data);
    return { file: filePath, success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => {
        const path = err.path.join('.');
        return `  ${colors.red}✗${colors.reset} ${path}: ${err.message}`;
      });
      return { file: filePath, success: false, errors };
    }
    return {
      file: filePath,
      success: false,
      errors: [`  ${colors.red}✗${colors.reset} Unknown error: ${error}`]
    };
  }
}

// Validate YAML files
function validateYamlFile(filePath: string, schema: z.ZodSchema): ValidationResult {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const data = YAML.parse(content);
    return validateFile(filePath, schema, data);
  } catch (error) {
    return {
      file: filePath,
      success: false,
      errors: [`  ${colors.red}✗${colors.reset} Failed to read/parse: ${error}`]
    };
  }
}

// Validate markdown files with frontmatter
function validateMarkdownFile(filePath: string, schema: z.ZodSchema): ValidationResult {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const { frontmatter, content: body } = parseFrontmatter(content);

    // Combine frontmatter with content for validation
    const data = { ...frontmatter, content: body };
    return validateFile(filePath, schema, data);
  } catch (error) {
    return {
      file: filePath,
      success: false,
      errors: [`  ${colors.red}✗${colors.reset} Failed to read/parse: ${error}`]
    };
  }
}

// Main validation function
async function validateAllContent(): Promise<void> {
  console.log(`${colors.blue}Validating portfolio content...${colors.reset}\n`);

  const results: ValidationResult[] = [];
  const contentDir = join(process.cwd(), 'content');

  // Validate single YAML files
  const singleYamlFiles = [
    { path: 'profile.yaml', schema: ProfileSchema, label: 'Profile' },
    { path: 'experience/index.yaml', schema: ExperienceSchema, label: 'Experience' },
    { path: 'testimonials/index.yaml', schema: TestimonialsSchema, label: 'Testimonials' },
    { path: 'certifications/index.yaml', schema: CertificationsSchema, label: 'Certifications' },
    { path: 'skills/index.yaml', schema: SkillsSchema, label: 'Skills' },
    { path: 'social/index.yaml', schema: SocialSchema, label: 'Social' },
    { path: 'passion-projects/index.yaml', schema: PassionProjectsSchema, label: 'Passion Projects' }
  ];

  console.log(`${colors.gray}Validating YAML files...${colors.reset}`);
  for (const { path, schema, label } of singleYamlFiles) {
    const fullPath = join(contentDir, path);
    const result = validateYamlFile(fullPath, schema);
    results.push(result);

    if (result.success) {
      console.log(`${colors.green}✓${colors.reset} ${label} (${path})`);
    } else {
      console.log(`${colors.red}✗${colors.reset} ${label} (${path})`);
      result.errors?.forEach(err => console.log(err));
    }
  }

  // Validate case studies
  console.log(`\n${colors.gray}Validating case studies...${colors.reset}`);
  const caseStudiesDir = join(contentDir, 'case-studies');
  const caseStudyFiles = readdirSync(caseStudiesDir).filter(f => f.endsWith('.md'));

  for (const file of caseStudyFiles) {
    const fullPath = join(caseStudiesDir, file);
    const result = validateMarkdownFile(fullPath, CaseStudySchema);
    results.push(result);

    if (result.success) {
      console.log(`${colors.green}✓${colors.reset} Case Study: ${file}`);
    } else {
      console.log(`${colors.red}✗${colors.reset} Case Study: ${file}`);
      result.errors?.forEach(err => console.log(err));
    }
  }

  // Validate blog posts
  console.log(`\n${colors.gray}Validating blog posts...${colors.reset}`);
  const blogDir = join(contentDir, 'blog');
  const blogFiles = readdirSync(blogDir).filter(f => f.endsWith('.md'));

  for (const file of blogFiles) {
    const fullPath = join(blogDir, file);
    const result = validateMarkdownFile(fullPath, BlogPostSchema);
    results.push(result);

    if (result.success) {
      console.log(`${colors.green}✓${colors.reset} Blog Post: ${file}`);
    } else {
      console.log(`${colors.red}✗${colors.reset} Blog Post: ${file}`);
      result.errors?.forEach(err => console.log(err));
    }
  }

  // Validate variants
  console.log(`\n${colors.gray}Validating portfolio variants...${colors.reset}`);
  const variantsDir = join(contentDir, 'variants');
  try {
    const variantFiles = readdirSync(variantsDir).filter(f => f.endsWith('.yaml') && !f.startsWith('_'));

    if (variantFiles.length === 0) {
      console.log(`${colors.gray}  No variants found (this is OK)${colors.reset}`);
    } else {
      for (const file of variantFiles) {
        const fullPath = join(variantsDir, file);
        const result = validateYamlFile(fullPath, VariantSchema);
        results.push(result);

        if (result.success) {
          console.log(`${colors.green}✓${colors.reset} Variant: ${file}`);
        } else {
          console.log(`${colors.red}✗${colors.reset} Variant: ${file}`);
          result.errors?.forEach(err => console.log(err));
        }
      }
    }
  } catch (error) {
    console.log(`${colors.gray}  Variants directory not found (this is OK)${colors.reset}`);
  }

  // Summary
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log('\n' + '─'.repeat(50));
  if (failed === 0) {
    console.log(`${colors.green}✓ All ${passed} content files validated successfully!${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`${colors.red}✗ ${failed} file(s) failed validation${colors.reset}`);
    console.log(`${colors.green}✓ ${passed} file(s) passed${colors.reset}`);
    process.exit(1);
  }
}

// Run validation
validateAllContent().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
