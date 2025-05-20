import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  width: 100vw;
  max-width: 100%;
  margin-top: calc(5.5 * var(--header-height));
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

const GiftTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  border-bottom: 1px solid rgba(182, 149, 192, 0.3);
  width: 100%;
`;

const GiftTab = styled.div`
  padding: 15px 30px;
  margin: 0 5px;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? 'var(--primary)' : 'transparent'};
  font-family: var(--font-serif);
  font-size: 1.2rem;
  transition: all 0.3s ease;
  color: ${props => props.active ? 'var(--primary)' : 'var(--accent)'};
  
  &:hover {
    color: var(--primary);
  }
`;

const GiftGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  width: 100%;
`;

const GiftCard = styled.div`
  background-color: var(--white);
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;

const GiftImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const GiftInfo = styled.div`
  padding: 25px;
`;

const GiftName = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.3rem;
  margin-bottom: 10px;
`;

const GiftPrice = styled.div`
  color: var(--accent);
  font-weight: 500;
  margin-bottom: 20px;
`;

const GiftButton = styled.button`
  width: 100%;
  text-align: center;
`;

const PixContainer = styled.div`
  background-color: var(--white);
  border-radius: 5px;
  padding: 40px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const PixQRCode = styled.div`
  width: 200px;
  height: 200px;
  background-color: #f0f0f0;
  margin: 30px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: #666;
`;

const PixKey = styled.div`
  background-color: rgba(182, 149, 192, 0.1);
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
  font-family: monospace;
  font-size: 1.1rem;
`;

const ListaPresentes = () => {
  const [activeTab, setActiveTab] = useState('online');
  const [gifts, setGifts] = useState([
    {
      id: 1,
      name: 'Jogo de Panelas',
      price: 'R$ 450,00',
      image: '/images/couple-background.png',
      type: 'online'
    },
    {
      id: 2,
      name: 'Liquidificador',
      price: 'R$ 250,00',
      image: '/images/couple-background.png',
      type: 'online'
    },
    {
      id: 3,
      name: 'Jogo de Toalhas',
      price: 'R$ 180,00',
      image: '/images/couple-background.png',
      type: 'online'
    },
    {
      id: 4,
      name: 'Cafeteira',
      price: 'R$ 320,00',
      image: '/images/couple-background.png',
      type: 'online'
    },
    {
      id: 5,
      name: 'Jogo de Talheres',
      price: 'R$ 280,00',
      image: '/images/couple-background.png',
      type: 'online'
    },
    {
      id: 6,
      name: 'Aspirador de Pó',
      price: 'R$ 550,00',
      image: '/images/couple-background.png',
      type: 'online'
    },
    {
      id: 7,
      name: 'Jogo de Copos',
      price: 'R$ 200,00',
      image: '/images/couple-background.png',
      type: 'fisica'
    },
    {
      id: 8,
      name: 'Conjunto de Potes',
      price: 'R$ 150,00',
      image: '/images/couple-background.png',
      type: 'fisica'
    },
    {
      id: 9,
      name: 'Ferro de Passar',
      price: 'R$ 220,00',
      image: '/images/couple-background.png',
      type: 'fisica'
    }
  ]);
  
  const filteredGifts = gifts.filter(gift => gift.type === activeTab);
  
  return (
    <PageContainer className="lista-presentes-page">
      <PageContent>
        <SectionTitle>Lista de Presentes</SectionTitle>
        
        <GiftTabs>
          <GiftTab 
            active={activeTab === 'online'} 
            onClick={() => setActiveTab('online')}
          >
            Lista Online
          </GiftTab>
          <GiftTab 
            active={activeTab === 'pix'} 
            onClick={() => setActiveTab('pix')}
          >
            PIX
          </GiftTab>
        </GiftTabs>
        
        {activeTab === 'pix' ? (
          <PixContainer>
            <h3>Contribua com o valor que desejar</h3>
            <p>Você pode nos ajudar com qualquer valor através do PIX abaixo:</p>
            
            <PixQRCode>
              QR Code do PIX
            </PixQRCode>
            
            <p>Ou copie a chave PIX:</p>
            <PixKey>marilia.iago@casamento.com</PixKey>
            
            <p>Agradecemos muito pela sua contribuição!</p>
          </PixContainer>
        ) : (
          <GiftGrid>
            {filteredGifts.map(gift => (
              <GiftCard key={gift.id}>
                <GiftImage src={gift.image} alt={gift.name} />
                <GiftInfo>
                  <GiftName>{gift.name}</GiftName>
                  <GiftPrice>{gift.price}</GiftPrice>
                  <GiftButton>
                    {activeTab === 'online' ? 'Presentear' : 'Reservar'}
                  </GiftButton>
                </GiftInfo>
              </GiftCard>
            ))}
          </GiftGrid>
        )}
      </PageContent>
    </PageContainer>
  );
};

export default ListaPresentes;
