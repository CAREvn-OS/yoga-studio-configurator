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

import { heroCopy } from './sections/hero';
import { aboutCopy } from './sections/about';
import { scheduleCopy } from './sections/schedule';
import { instructorsCopy } from './sections/instructors';
import { pricingCopy } from './sections/pricing';
import { testimonialsCopy } from './sections/testimonials';
import { contactCopy } from './sections/contact';
import { navCopy } from './sections/nav';
import { optionalCopy } from './sections/optional';

export type { CopyAlternatives } from './sections/hero';

/**
 * Complete map of every copy ID to its 6 tone-indexed alternatives.
 */
export const allCopy: Record<string, string[]> = {
  ...heroCopy,
  ...aboutCopy,
  ...scheduleCopy,
  ...instructorsCopy,
  ...pricingCopy,
  ...testimonialsCopy,
  ...contactCopy,
  ...navCopy,
  ...optionalCopy,
};

/* Re-export individual section maps for consumers that only need a subset. */
export {
  heroCopy,
  aboutCopy,
  scheduleCopy,
  instructorsCopy,
  pricingCopy,
  testimonialsCopy,
  contactCopy,
  navCopy,
  optionalCopy,
};
