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

/**
 * Composant Sidebar - Navigation verticale dépliable
 * Affiche le logo Team Up et les icônes de navigation
 * Peut être réduite/étendue via le bouton menu burger
 */
function Sidebar() {
  const { isExpanded, toggleSidebar } = useSidebar();
  const location = useLocation();

  /**
   * Vérifie si une route est active
   * @param {string} path - Le chemin à vérifier
   * @returns {boolean} - True si la route est active
   */
  const isActive = (path) => {
    return location.pathname === path;
  };

  /**
   * Configuration des éléments de navigation
   * Seuls dashboard et effectif sont activés pour l'instant
   */
  const navItems = [
    { path: '/dashboard', icon: dashboardIcon, label: 'Dashboard', enabled: true },
    { path: '/effectif', icon: effectifIcon, label: 'Effectif', enabled: true },
    { path: '/statistiques', icon: statistiquesIcon, label: 'Statistiques', enabled: true },
    { path: '/match', icon: matchIcon, label: 'Match', enabled: false },
    { path: '/presences', icon: presencesIcon, label: 'Présences', enabled: true },
    { path: '/messagerie', icon: messagerieIcon, label: 'Messagerie', enabled: false },
    { path: '/parametre', icon: parametreIcon, label: 'Paramètres', enabled: false },
    { path: '/profil', icon: profilIcon, label: 'Profil', enabled: false },
  ];

  return (
    <aside className={`sidebar ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      {/* Logo Team Up */}
      <div className="sidebar-logo">
        <img src={logo} alt="Team Up" className="logo-img" />
      </div>

      {/* Bouton menu burger */}
      <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar}
        aria-label={isExpanded ? 'Réduire le menu' : 'Agrandir le menu'}
      >
        <img src={menuBurger} alt="Menu" className="menu-icon" />
      </button>

      {/* Navigation */}
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

