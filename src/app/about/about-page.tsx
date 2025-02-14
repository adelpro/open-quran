import React from 'react';

export default function AboutPage() {
  return (
    <div
      dir="rtl"
      className="mt-10 flex w-full flex-col items-center justify-center bg-background text-foreground"
    >
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-6 text-center text-3xl font-bold">
          حول تطبيق Open Quran
        </h1>

        <div className="space-y-4 rounded border-2 border-gray-200 p-8 text-right text-lg shadow-sm dark:border-gray-700">
          <p>
            Open Quran هو تطبيق قرآن مفتوح المصدر صمم لتوفير تجربة استماع مثالية
            عبر مختلف المنصات. بُني التطبيق باستخدام تقنيات ويب حديثة لضمان:
          </p>

          <ul className="list-outside list-disc space-y-3 ps-8">
            <li className="ps-2">أداء عالي السرعة واستجابة سريعة</li>
            <li className="ps-2">عمل دون اتصال بالإنترنت</li>
            <li className="ps-2">تصميم سريع الاستجابة لجميع أحجام الشاشات</li>
            <li className="ps-2">
              استخدام تقنية WebTorrent للتخزين اللامركزي لمحتوى المصحف، مما يلغي
              الحاجة لخادم مركزي ويضمن استمرارية الوصول إلى المحتوى
            </li>
            <li className="ps-2">تحديثات وتطوير مستمر من المجتمع المفتوح</li>
          </ul>

          <p className="mt-4">
            يسعى التطبيق إلى توفير مصدر متاح للجميع ودائم للقرآن الكريم، مع
            الحفاظ على أعلى معايير الجودة التقنية والتصميمية.
          </p>
        </div>
      </div>
    </div>
  );
}
