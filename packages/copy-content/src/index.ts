/**
 * copy-content package
 *
 * Provides tone-indexed copy alternatives for every `data-copy-id` element
 * used in the Yoga / Pilates Studio Website Configurator.
 *
 * Each key maps to an array of 6 strings ordered by tone:
 *   [0] Professional / neutral   (default)
 *   [1] Warm / inviting / personal
 *   [2] Premium / luxury positioning
 *   [3] Community / inclusive focus
 *   [4] Results / transformation driven
 *   [5] Spiritual / mindful
 */

import { heroCopyEn, heroCopyVi } from './sections/hero';
import { aboutCopyEn, aboutCopyVi } from './sections/about';
import { scheduleCopyEn, scheduleCopyVi } from './sections/schedule';
import { instructorsCopyEn, instructorsCopyVi } from './sections/instructors';
import { pricingCopyEn, pricingCopyVi } from './sections/pricing';
import { testimonialsCopyEn, testimonialsCopyVi } from './sections/testimonials';
import { contactCopyEn, contactCopyVi } from './sections/contact';
import { navCopyEn, navCopyVi } from './sections/nav';
import { optionalCopyEn, optionalCopyVi } from './sections/optional';

export type { CopyAlternatives } from './sections/hero';

/**
 * Complete map of every copy ID to its 6 tone-indexed alternatives (English).
 */
export const allCopyEn: Record<string, string[]> = {
  ...heroCopyEn,
  ...aboutCopyEn,
  ...scheduleCopyEn,
  ...instructorsCopyEn,
  ...pricingCopyEn,
  ...testimonialsCopyEn,
  ...contactCopyEn,
  ...navCopyEn,
  ...optionalCopyEn,
};

/**
 * Complete map of every copy ID to its 6 tone-indexed alternatives (Vietnamese).
 */
export const allCopyVi: Record<string, string[]> = {
  ...heroCopyVi,
  ...aboutCopyVi,
  ...scheduleCopyVi,
  ...instructorsCopyVi,
  ...pricingCopyVi,
  ...testimonialsCopyVi,
  ...contactCopyVi,
  ...navCopyVi,
  ...optionalCopyVi,
};

/**
 * Backward-compatible alias — defaults to English.
 */
export const allCopy: Record<string, string[]> = allCopyEn;

/* Re-export individual section maps for consumers that only need a subset. */
export {
  heroCopyEn,
  heroCopyVi,
  aboutCopyEn,
  aboutCopyVi,
  scheduleCopyEn,
  scheduleCopyVi,
  instructorsCopyEn,
  instructorsCopyVi,
  pricingCopyEn,
  pricingCopyVi,
  testimonialsCopyEn,
  testimonialsCopyVi,
  contactCopyEn,
  contactCopyVi,
  navCopyEn,
  navCopyVi,
  optionalCopyEn,
  optionalCopyVi,
};
