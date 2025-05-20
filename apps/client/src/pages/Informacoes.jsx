import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  width: 100vw;
  max-width: 100%;
  padding-top: var(--header-height);
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

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  width: 100%;
`;

const InfoCard = styled.div`
  text-align: center;
  padding: 40px 30px;
  background-color: var(--white);
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const InfoIcon = styled.div`
  font-size: 2.5rem;
  color: var(--primary);
  margin-bottom: 20px;
`;

const InfoTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.5rem;
  margin-bottom: 15px;
`;

const MapContainer = styled.div`
  height: 400px;
  margin-top: 30px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  width: 100%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
`;

const Informacoes = () => {
  const [infoSections, setInfoSections] = useState([
    {
      icon: '🏛️',
      title: 'Cerimônia',
      text: 'A cerimônia será realizada na Igreja Nossa Senhora das Graças, às 16h. Pedimos que os convidados cheguem com 30 minutos de antecedência.',
      map: true
    },
    {
      icon: '🥂',
      title: 'Recepção',
      text: 'A festa será no Espaço Villa Verde, a partir das 18h. O local conta com estacionamento gratuito para os convidados.',
      map: true
    },
    {
      icon: '👔',
      title: 'Dress Code',
      text: 'Traje social completo. Homens de terno e mulheres com vestido longo ou midi. Evite cores brancas, off-white e tons muito claros.'
    },
    {
      icon: '🏨',
      title: 'Hospedagem Sugerida',
      text: 'Para convidados de fora da cidade, sugerimos o Hotel Royal Palace, que oferece 10% de desconto para os convidados do nosso casamento. Basta mencionar o código "MARILIA&IAGO".'
    },
    {
      icon: '🚗',
      title: 'Transporte',
      text: 'Disponibilizaremos transporte da igreja para o local da festa. O ônibus sairá 15 minutos após o término da cerimônia.'
    }
  ]);
  
  return (
    <PageContainer className="informacoes-page">
      <PageContent>
        <SectionTitle>Informações</SectionTitle>
        
        <InfoGrid>
          {infoSections.map((section, index) => (
            <InfoCard key={index}>
              <InfoIcon>{section.icon}</InfoIcon>
              <InfoTitle>{section.title}</InfoTitle>
              <p>{section.text}</p>
              
              {section.map && (
                <MapContainer>
                  Mapa será exibido aqui
                </MapContainer>
              )}
            </InfoCard>
          ))}
        </InfoGrid>
      </PageContent>
    </PageContainer>
  );
};

export default Informacoes;
