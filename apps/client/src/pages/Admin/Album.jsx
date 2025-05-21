import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AlbumContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: var(--cor-primaria-escura);
  color: var(--cor-branco);
  padding: 2rem 0;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-family: 'Playfair Display', serif;
    color: var(--cor-branco);
    font-size: 1.5rem;
    
    span {
      color: var(--cor-primaria-clara);
    }
  }
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
`;

const NavLink = styled(Link)`
  display: block;
  padding: 0.75rem 1.5rem;
  color: var(--cor-branco);
  text-decoration: none;
  transition: background-color 0.3s ease;
  
  &:hover, &.active {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    border-left: 3px solid var(--cor-primaria-clara);
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: var(--cor-fundo);
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h2`
  color: var(--cor-primaria-escura);
  font-size: 1.8rem;
`;

const ActionButton = styled.button`
  background-color: var(--cor-primaria-escura);
  color: var(--cor-branco);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--cor-primaria-clara);
  }
`;

const TabsContainer = styled.div`
  display: flex;
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
`;

const PhotoGrid = styled.div`
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

const PhotoCard = styled.div`
  background-color: var(--cor-branco);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const PhotoInfo = styled.div`
  padding: 1rem;
`;

const PhotoTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--cor-primaria-escura);
`;

const PhotoActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const EditButton = styled.button`
  background-color: var(--cor-primaria-clara);
  color: var(--cor-branco);
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const DeleteButton = styled.button`
  background-color: var(--cor-erro);
  color: var(--cor-branco);
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const OrderBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background-color: var(--cor-primaria-escura);
  color: var(--cor-branco);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--cor-branco);
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  color: var(--cor-primaria-escura);
  font-size: 1.5rem;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--cor-texto);
  
  &:hover {
    color: var(--cor-primaria-escura);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--cor-primaria-escura);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--cor-borda);
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--cor-primaria-clara);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--cor-borda);
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--cor-primaria-clara);
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--cor-primaria-escura);
  color: var(--cor-branco);
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--cor-primaria-clara);
  }
  
  &:disabled {
    background-color: var(--cor-borda);
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  background-color: var(--cor-sucesso);
  color: var(--cor-branco);
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

const ErrorMessage = styled.div`
  background-color: var(--cor-erro);
  color: var(--cor-branco);
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

const Album = () => {
  const [activeGallery, setActiveGallery] = useState('preWedding');
  const [photos, setPhotos] = useState({
    preWedding: [],
    momentos: [],
    padrinhos: [],
    festa: []
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentPhoto, setCurrentPhoto] = useState({
    id: null,
    gallery: 'preWedding',
    image: '',
    title: '',
    order: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchPhotos();
  }, []);
  
  const fetchPhotos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/album');
      if (response.data) {
        setPhotos(response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar fotos:', error);
      setError('Erro ao carregar fotos. Tente novamente mais tarde.');
    }
  };
  
  const handleGalleryChange = (gallery) => {
    setActiveGallery(gallery);
    setSuccess('');
    setError('');
  };
  
  const handleOpenModal = (mode, photo = null) => {
    setModalMode(mode);
    
    if (mode === 'edit' && photo) {
      setCurrentPhoto({
        id: photo.id,
        gallery: photo.gallery,
        image: photo.image,
        title: photo.title || '',
        order: photo.order
      });
    } else {
      setCurrentPhoto({
        id: null,
        gallery: activeGallery,
        image: '',
        title: '',
        order: photos[activeGallery] ? photos[activeGallery].length : 0
      });
    }
    
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSuccess('');
    setError('');
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPhoto({
      ...currentPhoto,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentPhoto.image) {
      setError('URL da imagem é obrigatória.');
      return;
    }
    
    setIsLoading(true);
    setSuccess('');
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      if (modalMode === 'add') {
        await axios.post('http://localhost:3001/api/album', currentPhoto, { headers });
        setSuccess('Foto adicionada com sucesso!');
      } else {
        await axios.put(`http://localhost:3001/api/album/${currentPhoto.id}`, currentPhoto, { headers });
        setSuccess('Foto atualizada com sucesso!');
      }
      
      fetchPhotos();
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar foto:', error);
      setError('Erro ao salvar foto. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta foto?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/album/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      fetchPhotos();
      setSuccess('Foto excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir foto:', error);
      setError('Erro ao excluir foto. Tente novamente mais tarde.');
    }
  };
  
  const handleReorder = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Reordenar fotos da galeria atual
      const updatedPhotos = [...photos[activeGallery]].map((photo, index) => ({
        ...photo,
        order: index
      }));
      
      await axios.put('http://localhost:3001/api/album/reorder', {
        photos: updatedPhotos
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      fetchPhotos();
      setSuccess('Ordem das fotos atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao reordenar fotos:', error);
      setError('Erro ao reordenar fotos. Tente novamente mais tarde.');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  };
  
  const galleryNames = {
    preWedding: 'Pré-Wedding',
    momentos: 'Momentos Especiais',
    padrinhos: 'Padrinhos',
    festa: 'Festa'
  };
  
  return (
    <AlbumContainer>
      <Sidebar>
        <Logo>
          <h1>
            Marília <span>&</span> Iago
          </h1>
        </Logo>
        
        <NavMenu>
          <NavItem>
            <NavLink to="/admin">Dashboard</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/presentes">Presentes</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/config">Configurações</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/conteudo">Conteúdo</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/historia">Nossa História</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/album" className="active">Álbum</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/rsvp">RSVPs</NavLink>
          </NavItem>
        </NavMenu>
      </Sidebar>
      
      <Content>
        <Header>
          <PageTitle>Gerenciar Álbum</PageTitle>
          <div>
            <ActionButton onClick={() => handleOpenModal('add')}>Adicionar Foto</ActionButton>
            <ActionButton onClick={handleLogout} style={{ marginLeft: '1rem', background: 'none', border: '1px solid var(--cor-primaria-escura)', color: 'var(--cor-primaria-escura)' }}>Sair</ActionButton>
          </div>
        </Header>
        
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <TabsContainer>
          <Tab 
            active={activeGallery === 'preWedding'} 
            onClick={() => handleGalleryChange('preWedding')}
          >
            Pré-Wedding
          </Tab>
          <Tab 
            active={activeGallery === 'momentos'} 
            onClick={() => handleGalleryChange('momentos')}
          >
            Momentos Especiais
          </Tab>
          <Tab 
            active={activeGallery === 'padrinhos'} 
            onClick={() => handleGalleryChange('padrinhos')}
          >
            Padrinhos
          </Tab>
          <Tab 
            active={activeGallery === 'festa'} 
            onClick={() => handleGalleryChange('festa')}
          >
            Festa
          </Tab>
        </TabsContainer>
        
        <PhotoGrid>
          {photos[activeGallery] && photos[activeGallery].length > 0 ? (
            photos[activeGallery].map((photo, index) => (
              <PhotoCard key={photo.id}>
                <OrderBadge>{index + 1}</OrderBadge>
                <PhotoImage src={photo.image || '/images/placeholder.jpg'} alt={photo.title} />
                <PhotoInfo>
                  <PhotoTitle>{photo.title || `Foto ${index + 1}`}</PhotoTitle>
                  <PhotoActions>
                    <EditButton onClick={() => handleOpenModal('edit', photo)}>Editar</EditButton>
                    <DeleteButton onClick={() => handleDelete(photo.id)}>Excluir</DeleteButton>
                  </PhotoActions>
                </PhotoInfo>
              </PhotoCard>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              Nenhuma foto cadastrada nesta galeria.
            </div>
          )}
        </PhotoGrid>
      </Content>
      
      <Modal show={showModal} onClick={handleCloseModal}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>{modalMode === 'add' ? 'Adicionar Foto' : 'Editar Foto'}</ModalTitle>
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
          </ModalHeader>
          
          {success && <SuccessMessage>{success}</SuccessMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="gallery">Galeria</Label>
              <Select
                id="gallery"
                name="gallery"
                value={currentPhoto.gallery}
                onChange={handleChange}
              >
                <option value="preWedding">Pré-Wedding</option>
                <option value="momentos">Momentos Especiais</option>
                <option value="padrinhos">Padrinhos</option>
                <option value="festa">Festa</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="image">URL da Imagem *</Label>
              <Input
                type="text"
                id="image"
                name="image"
                value={currentPhoto.image}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="title">Título</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={currentPhoto.title}
                onChange={handleChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="order">Ordem</Label>
              <Input
                type="number"
                id="order"
                name="order"
                value={currentPhoto.order}
                onChange={handleChange}
                min="0"
              />
            </FormGroup>
            
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Foto'}
            </SubmitButton>
          </form>
        </ModalContent>
      </Modal>
    </AlbumContainer>
  );
};

export default Album;
