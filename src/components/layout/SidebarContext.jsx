import { createContext, useContext, useState } from 'react';

/**
 * Contexte pour partager l'état d'expansion de la sidebar
 * Permet au Layout d'ajuster la marge du contenu principal
 */
const SidebarContext = createContext();

/**
 * Hook personnalisé pour accéder au contexte de la sidebar
 * @returns {Object} - L'état et les fonctions de la sidebar
 */
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

/**
 * Provider pour le contexte de la sidebar
 * @param {Object} props - Les props du composant
 * @param {React.ReactNode} props.children - Les enfants du provider
 */
export const SidebarProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <SidebarContext.Provider value={{ isExpanded, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

