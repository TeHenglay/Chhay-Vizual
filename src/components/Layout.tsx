import type { ReactNode } from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-brutalist-black text-brutalist-grey font-sans antialiased">
      <Sidebar />
      <div className="lg:pl-[var(--sidebar)]">
        <main className="px-5 pt-24 lg:pt-10 lg:pr-12 lg:pl-0 max-w-[1240px]">{children}</main>
        <footer className="px-5 lg:pl-0 lg:pr-12 max-w-[1240px] mt-32 pb-10">
          <div className="border-t border-line pt-6 flex flex-col sm:flex-row justify-between gap-2 text-[12px] text-muted">
            <p>All works © Chhay Vizual · Te Hengchhay</p>
            <p>Please do not reproduce without permission.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
