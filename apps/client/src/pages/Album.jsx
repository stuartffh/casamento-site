import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  width: 100%;
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

const AlbumTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  border-bottom: 1px solid rgba(182, 149, 192, 0.3);
  width: 100%;
`;

const AlbumTab = styled.div`
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

const AlbumCarousel = styled.div`
  margin-bottom: 40px;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 600px;
  object-fit: cover;
  
  @media (max-width: 992px) {
    height: 500px;
  }
  
  @media (max-width: 768px) {
    height: 400px;
  }
  
  @media (max-width: 576px) {
    height: 300px;
  }
`;

const CarouselNav = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--accent);
  transition: all 0.3s ease;
  z-index: 2;
  
  &:hover {
    background-color: var(--white);
  }
`;

const CarouselPrev = styled(CarouselNav)`
  left: 20px;
`;

const CarouselNext = styled(CarouselNav)`
  right: 20px;
`;

const AlbumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  
  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const AlbumThumbnail = styled.div`
  height: 250px;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 576px) {
    height: 150px;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Album = () => {
  const [activeTab, setActiveTab] = useState('pre-wedding');
  const [activeImage, setActiveImage] = useState(0);
  const [albums, setAlbums] = useState({
    'pre-wedding': [
      '/images/couple-background.png',
      '/images/couple-background.png',
      '/images/couple-background.png',
      '/images/couple-background.png',
      '/images/couple-background.png',
      '/images/couple-background.png'
    ],
    'momentos': [
      '/images/couple-background.png',
      '/images/couple-background.png',
      '/images/couple-background.png',
      '/images/couple-background.png'
    ],
    'padrinhos': [
      '/images/couple-background.png',
      '/images/couple-background.png',
      '/images/couple-background.png'
    ],
    'festa': [
      '/images/couple-background.png',
      '/images/couple-background.png',
      '/images/couple-background.png',
      '/images/couple-background.png',
      '/images/couple-background.png'
    ]
  });
  
  const handlePrev = () => {
    setActiveImage(prev => (prev === 0 ? albums[activeTab].length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setActiveImage(prev => (prev === albums[activeTab].length - 1 ? 0 : prev + 1));
  };
  
  const handleThumbnailClick = (index) => {
    setActiveImage(index);
  };
  
  return (
    <PageContainer className="album-page">
      <PageContent>
        <SectionTitle>Álbum</SectionTitle>
        
        <AlbumTabs>
          <AlbumTab 
            active={activeTab === 'pre-wedding'} 
            onClick={() => { setActiveTab('pre-wedding'); setActiveImage(0); }}
          >
            Pré-Wedding
          </AlbumTab>
          <AlbumTab 
            active={activeTab === 'momentos'} 
            onClick={() => { setActiveTab('momentos'); setActiveImage(0); }}
          >
            Momentos Especiais
          </AlbumTab>
          <AlbumTab 
            active={activeTab === 'padrinhos'} 
            onClick={() => { setActiveTab('padrinhos'); setActiveImage(0); }}
          >
            Padrinhos
          </AlbumTab>
          <AlbumTab 
            active={activeTab === 'festa'} 
            onClick={() => { setActiveTab('festa'); setActiveImage(0); }}
          >
            Festa
          </AlbumTab>
        </AlbumTabs>
        
        <AlbumCarousel>
          <CarouselImage 
            src={albums[activeTab][activeImage]} 
            alt={`Foto ${activeImage + 1} do álbum ${activeTab}`} 
          />
          <CarouselPrev onClick={handlePrev}>❮</CarouselPrev>
          <CarouselNext onClick={handleNext}>❯</CarouselNext>
        </AlbumCarousel>
        
        <AlbumGrid>
          {albums[activeTab].map((image, index) => (
            <AlbumThumbnail 
              key={index} 
              onClick={() => handleThumbnailClick(index)}
              style={{ border: activeImage === index ? '3px solid var(--primary)' : 'none' }}
            >
              <ThumbnailImage 
                src={image} 
                alt={`Miniatura ${index + 1} do álbum ${activeTab}`} 
              />
            </AlbumThumbnail>
          ))}
        </AlbumGrid>
      </PageContent>
    </PageContainer>
  );
};

export default Album;
