import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

const HeaderContainer = styled.header`
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  border-bottom: 1px solid rgba(182, 149, 192, 0.2);
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent);
  text-decoration: none;
  
  span {
    color: var(--primary);
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.95);
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const NavLink = styled(Link)`
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--primary);
    transition: width 0.3s ease;
  }
  
  &:hover:after, &.active:after {
    width: 100%;
  }
  
  &.active {
    color: var(--primary);
    font-weight: 600;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--accent);
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Não mostrar o header nas páginas de admin
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  
  return (
    <HeaderContainer>
      <NavContainer>
        <Logo to="/">
          Marília <span>&</span> Iago
        </Logo>
        
        <MobileMenuButton onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>
        
        <NavLinks $isOpen={isMenuOpen}>
          <NavLink to="/" className={isActive('/') ? 'active' : ''}>
            Home
          </NavLink>
          <NavLink to="/nossa-historia" className={isActive('/nossa-historia') ? 'active' : ''}>
            Nossa História
          </NavLink>
          <NavLink to="/lista-de-presentes" className={isActive('/lista-de-presentes') ? 'active' : ''}>
            Lista de Presentes
          </NavLink>
          <NavLink to="/confirme-sua-presenca" className={isActive('/confirme-sua-presenca') ? 'active' : ''}>
            Confirme sua Presença
          </NavLink>
          <NavLink to="/informacoes" className={isActive('/informacoes') ? 'active' : ''}>
            Informações
          </NavLink>
          <NavLink to="/album" className={isActive('/album') ? 'active' : ''}>
            Álbum
          </NavLink>
        </NavLinks>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header;
