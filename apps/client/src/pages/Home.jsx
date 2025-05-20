import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HomeContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin-top: calc(2 * var(--header-height));
`;

const HeroSection = styled.section`
  height: 100vh;
  width: 100vw;
  background-image: url('/images/couple-background.png');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  text-align: center;
  color: var(--white);
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(80, 52, 89, 0.5), rgba(66, 89, 67, 0.5));
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 800px;
  padding: 0 20px;
`;

const HeroTitle = styled.h1`
  font-size: 4.5rem;
  margin-bottom: 1rem;
  color: var(--white);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Cormorant Garamond', serif;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.8rem;
  margin-bottom: 2rem;
  font-weight: 300;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const HeroDate = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  margin-bottom: 2rem;
  letter-spacing: 2px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CountdownContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px 0;
  
  @media (max-width: 576px) {
    flex-wrap: wrap;
  }
`;

const CountdownItem = styled.div`
  margin: 0 15px;
  text-align: center;
  
  @media (max-width: 576px) {
    margin: 10px;
  }
`;

const CountdownNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  padding: 10px 20px;
  min-width: 100px;
  display: inline-block;
  backdrop-filter: blur(5px);
  
  @media (max-width: 768px) {
    font-size: 2rem;
    min-width: 80px;
    padding: 8px 15px;
  }
  
  @media (max-width: 576px) {
    font-size: 1.5rem;
    min-width: 60px;
    padding: 5px 10px;
  }
`;

const CountdownLabel = styled.div`
  font-size: 1rem;
  margin-top: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const HeroButton = styled(Link)`
  background-color: var(--primary);
  color: var(--white);
  padding: 15px 30px;
  font-size: 1.1rem;
  border-radius: 3px;
  display: inline-block;
  transition: all 0.3s ease;
  border: 2px solid var(--primary);
  text-decoration: none;
  
  &:hover {
    background-color: transparent;
    color: var(--white);
    border-color: var(--white);
  }
  
  @media (max-width: 768px) {
    padding: 12px 25px;
    font-size: 1rem;
  }
`;

const Home = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const weddingDate = new Date('September 20, 2025 19:00:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = weddingDate - now;
      
      setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <HomeContainer>
      <HeroSection>
        <HeroOverlay />
        <HeroContent>
          <HeroTitle className="fade-in">Marília & Iago</HeroTitle>
          <HeroSubtitle className="fade-in delay-1">
            Estamos muito felizes em ter você aqui!
          </HeroSubtitle>
          <HeroDate className="fade-in delay-2">
            20 de setembro de 2025, às 19:00
          </HeroDate>
          
          <CountdownContainer className="fade-in delay-3">
            <CountdownItem>
              <CountdownNumber>{days}</CountdownNumber>
              <CountdownLabel>Dias</CountdownLabel>
            </CountdownItem>
            <CountdownItem>
              <CountdownNumber>{hours}</CountdownNumber>
              <CountdownLabel>Horas</CountdownLabel>
            </CountdownItem>
            <CountdownItem>
              <CountdownNumber>{minutes}</CountdownNumber>
              <CountdownLabel>Minutos</CountdownLabel>
            </CountdownItem>
            <CountdownItem>
              <CountdownNumber>{seconds}</CountdownNumber>
              <CountdownLabel>Segundos</CountdownLabel>
            </CountdownItem>
          </CountdownContainer>
          
          <HeroButton to="/confirme-sua-presenca" className="fade-in delay-3">
            Confirme sua presença
          </HeroButton>
        </HeroContent>
      </HeroSection>
    </HomeContainer>
  );
};

export default Home;
