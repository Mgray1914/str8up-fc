import { activePromo } from '../../config/promoMeta';

// Eligibility notice (copy is a placeholder pending counsel). Informational only:
// it does not block anyone; geoblocking is not implemented yet.
export default function EligibilityNotice({ className = '' }) {
  if (!activePromo.eligibilityNotice) return null;
  return (
    <div role="note" className={`bg-[#1f1a0a] border border-yellow-800 rounded-xl p-4 text-sm text-yellow-200 text-left ${className}`}>
      <p className="font-semibold mb-1">Eligibility</p>
      <p>{activePromo.eligibilityNotice}</p>
    </div>
  );
}
