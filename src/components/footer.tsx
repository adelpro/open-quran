import React from 'react';

import { FooterLink } from './footer-link';

export default function Footer() {
  return (
    <div className="absolute bottom-0 flex w-full items-center justify-center p-2">
      <div className="align-center flex w-full max-w-md flex-row-reverse justify-center gap-3">
        <FooterLink href="/">
          <p>الصفحة الرئيسية</p>
        </FooterLink>
        <FooterLink href="/about">
          <p>معلومات عن التطبيق</p>
        </FooterLink>
        <FooterLink href="/contact">
          <p>اتصل بنا</p>
        </FooterLink>
      </div>
    </div>
  );
}
