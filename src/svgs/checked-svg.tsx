import * as React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  strokeColor?: string;
  fillColor?: string;
  width?: number | string;
  height?: number | string;
  alt?: string; // alt text for accessibility
}

export default function CheckedSVG({
  strokeColor = '#6B7280',
  fillColor = 'none',
  width = 24,
  height = 24,
  alt,
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      aria-label={alt}
      aria-hidden={alt ? 'false' : 'true'}
      focusable="false"
      {...props}
    >
      {alt && <title>{alt}</title>}
      <g
        fill={fillColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="9.25" />
        <path
          strokeLinejoin="round"
          d="m16.375 9.194l-5.611 5.612l-3.139-3.134"
        />
      </g>
    </svg>
  );
}
