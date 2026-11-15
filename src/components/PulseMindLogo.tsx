import React from 'react';

interface PulseMindLogoProps {
  className?: string;
  size?: number;
}

export const PulseMindLogo: React.FC<PulseMindLogoProps> = ({
  className = '',
  size = 24,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        width="32"
        height="32"
        rx="9"
        className="fill-blue-700 dark:fill-blue-600"
      />
      <path
        d="M5.5 17H10.2L12.8 10.5L16.3 22L19.4 13.8L21.5 17H26.5"
        stroke="white"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
