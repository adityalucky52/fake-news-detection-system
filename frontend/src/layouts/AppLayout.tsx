import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { useSidebarStore } from '@/stores/sidebarStore';

export default function AppLayout() {
  const { collapsed } = useSidebarStore();
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div 
        className={`flex-1 transition-all duration-300 ease-in-out pt-14 md:pt-0 ${
          collapsed ? 'md:ml-[72px]' : 'md:ml-60'
        }`}
      >
        <main className="p-4 md:p-8 max-w-[1200px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
