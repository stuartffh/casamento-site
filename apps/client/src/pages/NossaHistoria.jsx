import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const NossaHistoriaContainer = styled.div`
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

const StoryContent = styled.div`
  line-height: 1.8;
  font-size: 1.1rem;
  
  p {
    margin-bottom: 1.5rem;
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 3rem 0;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const Photo = styled.div`
  width: 100%;
  height: 300px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    height: 250px;
  }
`;

const NossaHistoria = () => {
  const [content, setContent] = useState('');
  
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/content/historia');
        if (response.data && response.data.content) {
          setContent(response.data.content);
        }
      } catch (error) {
        console.error('Erro ao buscar conteúdo:', error);
      }
    };
    
    fetchContent();
  }, []);
  
  // Transformar quebras de linha em parágrafos
  const formattedContent = content.split('\n\n').map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
  
  return (
    <NossaHistoriaContainer>
      <PageTitle>Nossa História</PageTitle>
      
      <PhotoGrid>
        <Photo src="/images/placeholder.jpg" />
        <Photo src="/images/placeholder.jpg" />
      </PhotoGrid>
      
      <StoryContent>
        {formattedContent}
      </StoryContent>
      
      <PhotoGrid>
        <Photo src="/images/placeholder.jpg" />
        <Photo src="/images/placeholder.jpg" />
      </PhotoGrid>
    </NossaHistoriaContainer>
  );
};

export default NossaHistoria;
