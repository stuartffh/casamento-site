import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: var(--cor-primaria-escura);
  color: var(--cor-branco);
  padding: 2rem 0;
  margin-top: 3rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Names = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  
  span {
    color: var(--cor-primaria-clara);
  }
`;

const Date = styled.p`
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 1.5rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SocialLink = styled.a`
  color: var(--cor-branco);
  font-size: 1.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--cor-primaria-clara);
  }
`;

const EventDate = styled.div`
  font-size: 1.2rem;
  margin-top: 10px;
`;


const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Não mostrar o footer nas páginas de admin
  if (window.location.pathname.startsWith('/admin')) {
    return null;
  }
  
  return (
    <FooterContainer>
      <FooterContent>
        <Names>
          Marília <span>&</span> Iago
        </Names>
        <EventDate>20 de Setembro de 2025</EventDate>
        <Copyright>
          © {currentYear} - Todos os direitos reservados
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
