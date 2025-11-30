import { Outlet } from 'react-router-dom';
import { SidebarProvider, useSidebar } from './SidebarContext';
import Sidebar from './Sidebar';
import './Layout.css';

function LayoutContent() {
  const { isExpanded } = useSidebar();
  
  return (
    <div className="layout-container">
      <Sidebar />
      <main className={`layout-main ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <Outlet />
      </main>
    </div>
  );
}

function Layout() {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
}

export default Layout;

