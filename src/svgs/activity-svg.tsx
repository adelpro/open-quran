import React from 'react';

interface ActivitySVGProps extends React.SVGProps<SVGSVGElement> {
  fill?: string;
  stroke?: string;
}

export default function ActivitySVG(props: ActivitySVGProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      aria-hidden="true"
      {...props}
    >
      <path
        fill={props.fill || 'none'}
        stroke={props.stroke || 'currentColor'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 16h6l4-11 6 22 4-11h6"
      />
    </svg>
  );
}
