import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  width: 100vw;
  max-width: 100%;
  margin-top: calc(10 * var(--header-height));
`;

const PageContent = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 60px 20px;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 50px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 1px;
    background-color: var(--primary);
  }
`;

const Timeline = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: 100%;
    background-color: var(--primary);
  }
  
  @media (max-width: 768px) {
    &::before {
      left: 30px;
    }
  }
`;

const TimelineItem = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 40px;
  position: relative;
  margin-bottom: 60px;
  
  &:nth-child(even) {
    justify-content: flex-start;
    padding-right: 0;
    padding-left: 40px;
  }
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-right: 0;
    padding-left: 70px;
    
    &:nth-child(even) {
      padding-left: 70px;
    }
  }
`;

const TimelineContent = styled.div`
  width: 45%;
  padding: 30px;
  background-color: var(--white);
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: var(--white);
    top: 20px;
    transform: rotate(45deg);
  }
  
  ${TimelineItem}:nth-child(odd) &::before {
    right: -10px;
  }
  
  ${TimelineItem}:nth-child(even) &::before {
    left: -10px;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    
    &::before {
      left: -10px;
    }
  }
`;

const TimelineDate = styled.div`
  font-family: var(--font-serif);
  color: var(--primary);
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const TimelineDot = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: var(--primary);
  border: 3px solid var(--white);
  z-index: 1;
  
  @media (max-width: 768px) {
    left: 30px;
  }
`;

const TimelineImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 15px;
`;

const TimelineTitle = styled.h3`
  font-family: var(--font-serif);
  margin-bottom: 10px;
`;

const TimelineText = styled.p`
  margin-bottom: 0;
`;

const NossaHistoria = () => {
  const [timelineEvents, setTimelineEvents] = useState([
    {
      date: 'Janeiro de 2020',
      title: 'Primeiro Encontro',
      text: 'Nos conhecemos em uma festa de amigos em comum. Foi uma conexão instantânea.',
      image: '/images/couple-background.png'
    },
    {
      date: 'Março de 2020',
      title: 'Primeiro Beijo',
      text: 'Depois de algumas semanas conversando, tivemos nosso primeiro beijo em um piquenique no parque.',
      image: '/images/couple-background.png'
    },
    {
      date: 'Junho de 2020',
      title: 'Pedido de Namoro',
      text: 'Em um jantar romântico à luz de velas, oficializamos nosso relacionamento.',
      image: '/images/couple-background.png'
    },
    {
      date: 'Dezembro de 2021',
      title: 'Primeira Viagem Juntos',
      text: 'Passamos o Ano Novo em uma praia paradisíaca, onde fortalecemos ainda mais nossa relação.',
      image: '/images/couple-background.png'
    },
    {
      date: 'Setembro de 2023',
      title: 'Pedido de Casamento',
      text: 'Durante um pôr do sol incrível, ele se ajoelhou e fez o pedido. Obviamente, a resposta foi sim!',
      image: '/images/couple-background.png'
    }
  ]);
  
  return (
    <PageContainer className="nossa-historia-page">
      <PageContent>
        <SectionTitle>Nossa História</SectionTitle>
        
        <Timeline>
          {timelineEvents.map((event, index) => (
            <TimelineItem key={index}>
              <TimelineDot />
              <TimelineContent>
                <TimelineImage src={event.image} alt={event.title} />
                <TimelineDate>{event.date}</TimelineDate>
                <TimelineTitle>{event.title}</TimelineTitle>
                <TimelineText>{event.text}</TimelineText>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </PageContent>
    </PageContainer>
  );
};

export default NossaHistoria;
