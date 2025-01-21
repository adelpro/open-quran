import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'brand-dark-100': '#f5f6f7',
        'brand-CTA-dark-200': '#e5e7eb',
        'brand-CTA-dark-500': '#6B7280',
        'brand-CTA-dark-600': '#222222',
        'brand-CTA-blue-500': '#3B82F6',
        'brand-CTA-blue-600': '#2363eb',
        'brand-CTA-green-500': '#10B981',
        'brand-CTA-green-600': '#059669',
        'brand-CTA-red-500': '#FF4B4B',
        'brand-CTA-red-600': '#DB2727',
        'brand-success': '#4BB543',
        'brand-info': '#4D71F9',
        'brand-warning': '#FFA800',
        'brand-danger': '#FF4B4B',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animated'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
