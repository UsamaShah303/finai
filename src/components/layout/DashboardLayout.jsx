import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#EEF3EE] dark:bg-[#060D08]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="p-4 lg:p-6 pt-14 lg:pt-6 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
