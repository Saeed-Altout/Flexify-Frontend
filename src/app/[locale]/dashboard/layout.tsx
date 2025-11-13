import { getSession } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication check in Data Access Layer (server component)
  const session = await getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return <>{children}</>;
}
