import type { ReactNode } from 'react';
import { divineFrancisWedding } from '../data/weddings/divine-francis';
import { AppProviders } from './providers';

export function AppShell({ children }: { children: ReactNode }) {
  return <AppProviders experience={divineFrancisWedding}>{children}</AppProviders>;
}
