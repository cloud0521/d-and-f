import type { ReactNode } from 'react';
import { stefanoMhykaWedding } from '../data/weddings/stefano-mhyka';
import { AppProviders } from './providers';

export function AppShell({ children }: { children: ReactNode }) {
  return <AppProviders experience={stefanoMhykaWedding}>{children}</AppProviders>;
}
