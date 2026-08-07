import type { ReactNode } from 'react';
import { paolaRyanWedding } from '../data/weddings/paola-ryan';
import { AppProviders } from './providers';

export function AppShell({ children }: { children: ReactNode }) {
  return <AppProviders experience={paolaRyanWedding}>{children}</AppProviders>;
}
