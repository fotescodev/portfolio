/**
 * Base Portfolio Page
 *
 * Default portfolio without variant customization
 */

import { VariantProvider } from '../context/VariantContext';
import { profile } from '../lib/content';
import Portfolio from '../components/Portfolio';

export default function BasePortfolio() {
  return (
    <VariantProvider profile={profile}>
      <Portfolio />
    </VariantProvider>
  );
}
