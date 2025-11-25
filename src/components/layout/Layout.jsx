import { Outlet } from 'react-router-dom';
import { SidebarProvider, useSidebar } from './SidebarContext';
import Sidebar from './Sidebar';
import './Layout.css';

/**
 * Composant interne qui utilise le contexte de la sidebar
 */
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

/**
 * Composant Layout - Wrapper pour les pages avec sidebar
 * Inclut la sidebar verticale et le contenu principal
 */
function Layout() {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
}

export default Layout;

