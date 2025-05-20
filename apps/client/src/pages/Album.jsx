import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const AlbumContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--cor-primaria-escura);
  text-align: center;
  margin-bottom: 2rem;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--cor-borda);
  flex-wrap: wrap;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? 'var(--cor-primaria-escura)' : 'var(--cor-texto)'};
  position: relative;
  cursor: pointer;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: var(--cor-primaria-escura);
    opacity: ${props => props.active ? '1' : '0'};
    transition: opacity 0.3s ease;
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
`;

const Carousel = styled.div`
  position: relative;
  margin-bottom: 3rem;
`;

const CarouselInner = styled.div`
  display: flex;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CarouselSlide = styled.div`
  min-width: 100%;
  transition: transform 0.5s ease;
  transform: translateX(${props => props.offset}%);
`;

const CarouselImage = styled.div`
  width: 100%;
  height: 500px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }
  
  &.prev {
    left: 10px;
  }
  
  &.next {
    right: 10px;
  }
`;

const MosaicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const MosaicItem = styled.div`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const MosaicImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  @media (max-width: 768px) {
    height: 200px;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: var(--cor-branco);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 1rem;
  text-align: center;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  color: var(--cor-primaria-escura);
  margin-bottom: 0.5rem;
`;

const Gallery = styled.div`
  columns: 3;
  column-gap: 1rem;
  
  @media (max-width: 992px) {
    columns: 2;
  }
  
  @media (max-width: 576px) {
    columns: 1;
  }
`;

const GalleryItem = styled.div`
  break-inside: avoid;
  margin-bottom: 1rem;
  cursor: pointer;
`;

const GalleryImage = styled.img`
  width: 100%;
  border-radius: 8px;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90%;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
  border-radius: 4px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: var(--cor-branco);
  font-size: 2rem;
  cursor: pointer;
`;

const Album = () => {
  const [activeTab, setActiveTab] = useState('preWedding');
  const [photos, setPhotos] = useState({
    preWedding: [],
    momentos: [],
    padrinhos: [],
    festa: []
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/album');
        if (response.data) {
          setPhotos(response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar fotos:', error);
        // Usar dados de exemplo em caso de erro
        setPhotos({
          preWedding: Array(5).fill({ image: '/images/placeholder.jpg', title: 'Foto Pré-Wedding' }),
          momentos: Array(6).fill({ image: '/images/placeholder.jpg', title: 'Momento Especial' }),
          padrinhos: Array(8).fill({ image: '/images/placeholder.jpg', title: 'Padrinho/Madrinha' }),
          festa: Array(12).fill({ image: '/images/placeholder.jpg', title: 'Foto da Festa' })
        });
      }
    };
    
    fetchPhotos();
  }, []);
  
  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? photos.preWedding.length - 1 : prev - 1));
  };
  
  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev === photos.preWedding.length - 1 ? 0 : prev + 1));
  };
  
  const openModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };
  
  return (
    <AlbumContainer>
      <PageTitle>Álbum</PageTitle>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'preWedding'} 
          onClick={() => setActiveTab('preWedding')}
        >
          Pré-Wedding
        </Tab>
        <Tab 
          active={activeTab === 'momentos'} 
          onClick={() => setActiveTab('momentos')}
        >
          Momentos Especiais
        </Tab>
        <Tab 
          active={activeTab === 'padrinhos'} 
          onClick={() => setActiveTab('padrinhos')}
        >
          Padrinhos
        </Tab>
        <Tab 
          active={activeTab === 'festa'} 
          onClick={() => setActiveTab('festa')}
        >
          Festa
        </Tab>
      </TabsContainer>
      
      {activeTab === 'preWedding' && (
        <Carousel>
          <CarouselButton className="prev" onClick={handlePrevSlide}>
            &#8249;
          </CarouselButton>
          <CarouselInner>
            {photos.preWedding.map((photo, index) => (
              <CarouselSlide 
                key={index} 
                offset={-100 * currentSlide}
              >
                <CarouselImage src={photo.image || '/images/placeholder.jpg'} />
              </CarouselSlide>
            ))}
          </CarouselInner>
          <CarouselButton className="next" onClick={handleNextSlide}>
            &#8250;
          </CarouselButton>
        </Carousel>
      )}
      
      {activeTab === 'momentos' && (
        <MosaicGrid>
          {photos.momentos.map((photo, index) => (
            <MosaicItem key={index} onClick={() => openModal(photo.image || '/images/placeholder.jpg')}>
              <MosaicImage src={photo.image || '/images/placeholder.jpg'} alt={photo.title || 'Momento Especial'} />
            </MosaicItem>
          ))}
        </MosaicGrid>
      )}
      
      {activeTab === 'padrinhos' && (
        <CardGrid>
          {photos.padrinhos.map((photo, index) => (
            <Card key={index}>
              <CardImage src={photo.image || '/images/placeholder.jpg'} alt={photo.title || 'Padrinho/Madrinha'} />
              <CardContent>
                <CardTitle>{photo.title || `Padrinho ${index + 1}`}</CardTitle>
              </CardContent>
            </Card>
          ))}
        </CardGrid>
      )}
      
      {activeTab === 'festa' && (
        <Gallery>
          {photos.festa.map((photo, index) => (
            <GalleryItem key={index} onClick={() => openModal(photo.image || '/images/placeholder.jpg')}>
              <GalleryImage src={photo.image || '/images/placeholder.jpg'} alt={photo.title || 'Foto da Festa'} />
            </GalleryItem>
          ))}
        </Gallery>
      )}
      
      <Modal show={modalOpen} onClick={closeModal}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <CloseButton onClick={closeModal}>&times;</CloseButton>
          <ModalImage src={selectedImage} alt="Foto ampliada" />
        </ModalContent>
      </Modal>
    </AlbumContainer>
  );
};

export default Album;
