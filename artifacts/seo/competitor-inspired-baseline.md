# Competitor-Inspired Baseline

## Overview
This document establishes a UX and content baseline derived from analyzing competitors like govtschemes.in, sarkariyojana.com, and others. The goal is to provide superior value, better user experience, and faster load times.

## UX Improvements Identified
1. **Simplified Homepage Directory**: Competitors often clutter their homepages. We will feature only the highest-priority schemes (top 6-9) to improve cognitive load and time-to-interact.
2. **Icon-only Cards**: Heavy images in scheme cards slow down mobile rendering. We replaced scheme images with semantic Category Icons on cards to drastically improve Largest Contentful Paint (LCP) and visual hierarchy.
3. **Structured Updates**: We replaced moving marquees with a clean, readable list of updates featuring semantic dates. This is better for accessibility and SEO.
4. **Fast Filtering**: We implement client-side filtering via Fuse.js for immediate search results, preventing unnecessary page loads compared to competitors.

## Content Improvements Identified
1. **Fact-First Presentation**: Competitors often bury eligibility in 1000 words of SEO fluff. We present exact, actionable facts first.
2. **Mobile Presentation**: Clean, responsive layout that removes unnecessary sidebars and maximizes screen real estate on mobile devices.
3. **No Unofficial Claims**: Clear disclaimers and source URLs on every page to build trust with users compared to generic affiliate-style competitors.
