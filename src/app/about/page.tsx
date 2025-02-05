import { clientConfig } from '@/utils';

import AboutPage from './about-page';

export async function generateMetadata() {
  const title = 'Contact - ' + clientConfig.APP_NAME;
  const description = 'Contact page for ' + clientConfig.APP_NAME;

  return {
    title,
    description,
  };
}
export default function page() {
  return <AboutPage />;
}
