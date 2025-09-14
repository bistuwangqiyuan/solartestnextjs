import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Navigation } from '@/components/layout/navigation';

export default async function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await auth.getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <>
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
    </>
  );
}