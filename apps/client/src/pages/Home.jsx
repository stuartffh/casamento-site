import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeroSection = styled.section`
  width: 100%;
  height: 80vh;
  background-image: url('/images/placeholder.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--cor-branco);
  text-align: center;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  padding: 0 2rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 576px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const CTAButton = styled.a`
  display: inline-block;
  background-color: var(--cor-primaria-escura);
  color: var(--cor-branco);
  padding: 1rem 2rem;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--cor-primaria-clara);
  }
`;

const ContentSection = styled.section`
  padding: 4rem 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--cor-primaria-escura);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CountdownContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 3rem 0;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
  
  @media (max-width: 576px) {
    flex-wrap: wrap;
  }
`;

const CountdownItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CountdownNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: var(--cor-primaria-escura);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 576px) {
    font-size: 2rem;
  }
`;

const CountdownLabel = styled.div`
  font-size: 1rem;
  color: var(--cor-texto);
`;

const Home = () => {
  const [content, setContent] = useState('Estamos muito felizes em ter você aqui!');
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Data do casamento: 20 de setembro de 2025
  const weddingDate = new Date('2025-09-20T19:00:00');
  
  useEffect(() => {
    // Buscar conteúdo da página inicial
    const fetchContent = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/content/home');
        if (response.data && response.data.content) {
          setContent(response.data.content);
        }
      } catch (error) {
        console.error('Erro ao buscar conteúdo:', error);
      }
    };
    
    fetchContent();
    
    // Atualizar contagem regressiva
    const timer = setInterval(() => {
      const now = new Date();
      
      if (now >= weddingDate) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        clearInterval(timer);
        return;
      }
      
      setCountdown({
        days: differenceInDays(weddingDate, now),
        hours: differenceInHours(weddingDate, now) % 24,
        minutes: differenceInMinutes(weddingDate, now) % 60,
        seconds: differenceInSeconds(weddingDate, now) % 60
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formattedDate = format(weddingDate, "dd 'de' MMMM 'de' yyyy, 'às' HH:mm", { locale: ptBR });
  
  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Marília & Iago</HeroTitle>
          <HeroSubtitle>Estamos muito felizes em ter você aqui!</HeroSubtitle>
          <CTAButton href="/confirme-sua-presenca">Confirme sua presença</CTAButton>
        </HeroContent>
      </HeroSection>
      
      <ContentSection>
        <SectionTitle>Nosso Casamento</SectionTitle>
        <p>{content}</p>
        
        <p style={{ marginTop: '2rem', fontSize: '1.2rem' }}>
          Junte-se a nós neste dia especial:
          <br />
          <strong>{formattedDate}</strong>
        </p>
        
        <CountdownContainer>
          <CountdownItem>
            <CountdownNumber>{countdown.days}</CountdownNumber>
            <CountdownLabel>Dias</CountdownLabel>
          </CountdownItem>
          <CountdownItem>
            <CountdownNumber>{countdown.hours}</CountdownNumber>
            <CountdownLabel>Horas</CountdownLabel>
          </CountdownItem>
          <CountdownItem>
            <CountdownNumber>{countdown.minutes}</CountdownNumber>
            <CountdownLabel>Minutos</CountdownLabel>
          </CountdownItem>
          <CountdownItem>
            <CountdownNumber>{countdown.seconds}</CountdownNumber>
            <CountdownLabel>Segundos</CountdownLabel>
          </CountdownItem>
        </CountdownContainer>
        
        <CTAButton href="/confirme-sua-presenca">Confirme sua presença</CTAButton>
      </ContentSection>
    </HomeContainer>
  );
};

export default Home;
