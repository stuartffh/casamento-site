import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AdminContainer,
  Sidebar,
  Logo,
  NavMenu,
  NavItem,
  NavLink,
  Content,
  Header,
  PageTitle,
  ActionButton,
  SecondaryButton,
  FormGroup,
  Label,
  Input,
  Select,
  SuccessMessage,
  ErrorMessage,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  EditButton,
  DeleteButton
} from '../../styles/AdminStyles';
import styled from 'styled-components';

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(182, 149, 192, 0.3);
  flex-wrap: wrap;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? 'var(--accent)' : 'var(--text)'};
  position: relative;
  cursor: pointer;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: var(--accent);
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
  background-color: var(--white);
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
  color: var(--accent);
`;

const PhotoActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const OrderBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background-color: var(--accent);
  color: var(--white);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ImagePreview = styled.div`
  margin-top: 1rem;
  width: 100%;
  max-width: 300px;
  height: 200px;
  border: 1px dashed rgba(182, 149, 192, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #f0f0f0;
  cursor: pointer;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageUploadButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--accent);
  color: var(--white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary);
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--accent);
  color: var(--white);
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--primary);
  }
  
  &:disabled {
    background-color: rgba(182, 149, 192, 0.3);
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  grid-column: 1 / -1;
  
  h3 {
    color: var(--accent);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text);
    margin-bottom: 1.5rem;
  }
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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // Referência para o input de arquivo
  const fileInputRef = React.createRef();
  
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
      setImagePreview(photo.image || '');
    } else {
      setCurrentPhoto({
        id: null,
        gallery: activeGallery,
        image: '',
        title: '',
        order: photos[activeGallery] ? photos[activeGallery].length : 0
      });
      setImagePreview('');
    }
    
    setImageFile(null);
    setSuccess('');
    setError('');
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
  
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Verificar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de arquivo não suportado. Apenas imagens são permitidas.');
      return;
    }
    
    // Verificar tamanho do arquivo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. O tamanho máximo é 5MB.');
      return;
    }
    
    setImageFile(file);
    
    // Criar preview da imagem
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const uploadImage = async () => {
    if (!imageFile) return null;
    
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3001/api/album/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.url;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw new Error('Erro ao fazer upload da imagem. Tente novamente.');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentPhoto.image && !imageFile) {
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
      
      // Fazer upload da imagem se houver uma nova
      let imageUrl = currentPhoto.image;
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          throw new Error('Erro ao fazer upload da imagem.');
        }
      }
      
      const photoData = {
        ...currentPhoto,
        image: imageUrl
      };
      
      if (modalMode === 'add') {
        await axios.post('http://localhost:3001/api/album', photoData, { headers });
        setSuccess('Foto adicionada com sucesso!');
      } else {
        await axios.put(`http://localhost:3001/api/album/${currentPhoto.id}`, photoData, { headers });
        setSuccess('Foto atualizada com sucesso!');
      }
      
      fetchPhotos();
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar foto:', error);
      setError(error.message || 'Erro ao salvar foto. Tente novamente mais tarde.');
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
    <AdminContainer>
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
            <SecondaryButton onClick={handleLogout} style={{ marginLeft: '1rem' }}>Sair</SecondaryButton>
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
                <PhotoImage 
                  src={photo.image || '/images/placeholder.jpg'} 
                  alt={photo.title}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
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
            <EmptyState>
              <h3>Nenhuma foto cadastrada</h3>
              <p>Adicione fotos para a galeria {galleryNames[activeGallery]}.</p>
              <ActionButton onClick={() => handleOpenModal('add')}>Adicionar Foto</ActionButton>
            </EmptyState>
          )}
        </PhotoGrid>
        
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
                <Label>Imagem *</Label>
                <ImagePreview onClick={handleImageClick}>
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      onError={() => {
                        setImagePreview('');
                        setError('Erro ao carregar imagem. Tente novamente.');
                      }}
                    />
                  ) : (
                    <span>Clique para selecionar uma imagem</span>
                  )}
                </ImagePreview>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <ImageUploadButton type="button" onClick={handleImageClick}>
                  Selecionar Imagem
                </ImageUploadButton>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="title">Título</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={currentPhoto.title}
                  onChange={handleChange}
                  placeholder="Ex: Ensaio na praia"
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
                {isLoading ? 'Salvando...' : 'Salvar'}
              </SubmitButton>
            </form>
          </ModalContent>
        </Modal>
      </Content>
    </AdminContainer>
  );
};

export default Album;
