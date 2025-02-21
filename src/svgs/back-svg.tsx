import * as React from 'react';

export default function BackSVG(props: React.SVGProps<SVGSVGElement>) {
  const {
    fill = '#6B7280',
    width = '800px',
    height = '800px',
    ...rest
  } = props;
  return (
    <svg
      width={width}
      height={height}
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 52.502 52.502"
      xmlSpace="preserve"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path
        fill={fill}
        d="M51.718,50.857l-1.341-2.252C40.075,31.295,25.975,32.357,22.524,32.917v13.642L0,23.995L22.524,1.644v13.43
          c0.115,0,0.229-0.001,0.344-0.001c12.517,0,18.294,5.264,18.542,5.496c13.781,11.465,10.839,27.554,10.808,27.715L51.718,50.857z
          M25.505,30.735c5.799,0,16.479,1.923,24.993,14.345c0.128-4.872-0.896-15.095-10.41-23.012c-0.099-0.088-5.935-5.364-18.533-4.975
          l-1.03,0.03V6.447L2.832,24.001l17.692,17.724V31.311l0.76-0.188C21.338,31.109,22.947,30.735,25.505,30.735z"
      />
    </svg>
  );
}
