import React from 'react';
import zxcvbn from 'zxcvbn';

type PasswordStrengthProps = {
  password: string;
  className?: string;
};

const strengthLabels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['#EF4444', '#F59E0B', '#FACC15', '#22C55E', '#16A34A'];

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, className }) => {
  const score = password ? zxcvbn(password).score : 0;
  const pct = ((score + 1) / 5) * 100;
  const color = strengthColors[score];
  const label = strengthLabels[score];

  return (
    <div className={className} aria-live="polite">
      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label="Password strength">
        <div className="h-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className="mt-2 text-xs" style={{ color }}>{label}</div>
    </div>
  );
};

export default PasswordStrength;

