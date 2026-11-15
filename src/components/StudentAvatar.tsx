import React, { useState } from 'react';
import { User } from 'lucide-react';

interface StudentAvatarProps {
  name: string;
  sizeClass?: string;
}

const AVATAR_SRC = '/src/assets/images/avatar_nursing_student_1794735616986.jpg';

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
  name,
  sizeClass = 'w-9 h-9',
}) => {
  const [failed, setFailed] = useState(false);

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  if (failed) {
    return (
      <div
        className={`${sizeClass} rounded-full bg-blue-700 dark:bg-blue-600 text-white flex items-center justify-center font-display text-xs font-semibold shrink-0 select-none`}
        aria-label={name}
      >
        {initials || <User className="w-4 h-4" />}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0`}
    >
      <img
        src={AVATAR_SRC}
        alt={`${name} portrait`}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover object-top scale-125"
      />
    </div>
  );
};
