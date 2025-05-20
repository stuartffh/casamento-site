import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const InformacoesContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--cor-primaria-escura);
  text-align: center;
  margin-bottom: 2rem;
`;

const InfoSection = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: var(--cor-primaria-escura);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const InfoContent = styled.div`
  background-color: var(--cor-branco);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  line-height: 1.8;
  
  p {
    margin-bottom: 1rem;
  }
  
  strong {
    color: var(--cor-primaria-escura);
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const Informacoes = () => {
  const [content, setContent] = useState('');
  
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/content/informacoes');
        if (response.data && response.data.content) {
          setContent(response.data.content);
        }
      } catch (error) {
        console.error('Erro ao buscar conteúdo:', error);
      }
    };
    
    fetchContent();
  }, []);
  
  // Extrair seções do conteúdo
  const sections = {
    cerimonia: content.match(/📍 Cerimônia:([\s\S]*?)(?=📍 Recepção:|$)/)?.[1]?.trim() || '',
    recepcao: content.match(/📍 Recepção:([\s\S]*?)(?=👗 Dress Code:|$)/)?.[1]?.trim() || '',
    dressCode: content.match(/👗 Dress Code:([\s\S]*?)(?=🏨 Hospedagem Sugerida:|$)/)?.[1]?.trim() || '',
    hospedagem: content.match(/🏨 Hospedagem Sugerida:([\s\S]*?)(?=🚖 Transporte:|$)/)?.[1]?.trim() || '',
    transporte: content.match(/🚖 Transporte:([\s\S]*?)$/)?.[1]?.trim() || ''
  };
  
  return (
    <InformacoesContainer>
      <PageTitle>Informações</PageTitle>
      
      <InfoSection>
        <SectionTitle>
          <span role="img" aria-label="Localização">📍</span> Cerimônia
        </SectionTitle>
        <InfoContent>
          <p>{sections.cerimonia}</p>
          <MapContainer>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.3979641959105!2d-34.88133!3d-8.063187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab18a48ed72541%3A0x6a3a3309a435492a!2sConcatedral%20de%20S%C3%A3o%20Pedro%20dos%20Cl%C3%A9rigos!5e0!3m2!1spt-BR!2sbr!4v1621436289012!5m2!1spt-BR!2sbr" 
              allowFullScreen="" 
              loading="lazy"
              title="Mapa da Cerimônia"
            ></iframe>
          </MapContainer>
        </InfoContent>
      </InfoSection>
      
      <InfoSection>
        <SectionTitle>
          <span role="img" aria-label="Localização">📍</span> Recepção
        </SectionTitle>
        <InfoContent>
          <p>{sections.recepcao}</p>
          <MapContainer>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.5923881959105!2d-34.89133!3d-8.093187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab1be1f89e9b27%3A0x6c8d4201a5e661e3!2sEcomariner!5e0!3m2!1spt-BR!2sbr!4v1621436289012!5m2!1spt-BR!2sbr" 
              allowFullScreen="" 
              loading="lazy"
              title="Mapa da Recepção"
            ></iframe>
          </MapContainer>
        </InfoContent>
      </InfoSection>
      
      <InfoSection>
        <SectionTitle>
          <span role="img" aria-label="Vestimenta">👗</span> Dress Code
        </SectionTitle>
        <InfoContent>
          <p>{sections.dressCode}</p>
        </InfoContent>
      </InfoSection>
      
      <InfoSection>
        <SectionTitle>
          <span role="img" aria-label="Hospedagem">🏨</span> Hospedagem Sugerida
        </SectionTitle>
        <InfoContent>
          <p>{sections.hospedagem}</p>
        </InfoContent>
      </InfoSection>
      
      <InfoSection>
        <SectionTitle>
          <span role="img" aria-label="Transporte">🚖</span> Transporte
        </SectionTitle>
        <InfoContent>
          <p>{sections.transporte}</p>
        </InfoContent>
      </InfoSection>
    </InformacoesContainer>
  );
};

export default Informacoes;
