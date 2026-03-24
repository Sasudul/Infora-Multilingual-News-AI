'use client';

import dynamic from 'next/dynamic';
import { ReporterProvider } from './ReporterProvider';

// Re-export the hook for convenient imports
export { useReporter } from './ReporterProvider';

const NewsReporterAvatar = dynamic(
  () => import('./NewsReporterAvatar').then((mod) => ({ default: mod.NewsReporterAvatar })),
  { ssr: false }
);

export function NewsReporterAvatarWrapper({ children }: { children?: React.ReactNode }) {
  return (
    <ReporterProvider>
      {children}
      <NewsReporterAvatar />
    </ReporterProvider>
  );
}
