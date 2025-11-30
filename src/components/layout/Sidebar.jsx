import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from './SidebarContext';
import './Sidebar.css';
import logo from '../../assets/logo.svg';
import menuBurger from '../../assets/menu-burger.png';
import dashboardIcon from '../../assets/dashboard.png';
import effectifIcon from '../../assets/effectif.png';
import statistiquesIcon from '../../assets/statistiques.png';
import matchIcon from '../../assets/match.png';
import presencesIcon from '../../assets/présences.png';
import messagerieIcon from '../../assets/messagerie.png';
import parametreIcon from '../../assets/parametre.png';
import profilIcon from '../../assets/user.png';

function Sidebar() {
  const { isExpanded, toggleSidebar } = useSidebar();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', icon: dashboardIcon, label: 'Dashboard', enabled: true },
    { path: '/match', icon: matchIcon, label: 'Match', enabled: true },
    { path: '/presences', icon: presencesIcon, label: 'Présences', enabled: true },
    { path: '/effectif', icon: effectifIcon, label: 'Effectif', enabled: true },
    { path: '/statistiques', icon: statistiquesIcon, label: 'Statistiques', enabled: true },
    { path: '/messagerie', icon: messagerieIcon, label: 'Messagerie', enabled: false }, // Mise en stand-by - fonctionnalité complexe non prioritaire
    { path: '/parametres', icon: parametreIcon, label: 'Paramètres', enabled: true },
    { path: '/profil', icon: profilIcon, label: 'Profil', enabled: true },
  ];

  return (
    <aside className={`sidebar ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <div className="sidebar-logo">
        <img src={logo} alt="Team Up" className="logo-img" />
      </div>

      <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar}
        aria-label={isExpanded ? 'Réduire le menu' : 'Agrandir le menu'}
      >
        <img src={menuBurger} alt="Menu" className="menu-icon" />
      </button>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const NavComponent = item.enabled ? Link : 'div';
          const navProps = item.enabled 
            ? { to: item.path, className: `nav-item ${isActive(item.path) ? 'nav-item-active' : ''}` }
            : { className: `nav-item nav-item-disabled` };

          return (
            <NavComponent
              key={item.path}
              {...navProps}
              title={item.label}
            >
              <img src={item.icon} alt={item.label} className="nav-icon" />
              {isExpanded && <span className="nav-label">{item.label}</span>}
            </NavComponent>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;

