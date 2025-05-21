import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaImage, FaCalendarAlt, FaHeading, FaAlignLeft, FaSortAmountDown } from 'react-icons/fa';

const StoryContainer = styled.div`
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

const LogoutButton = styled.button`
  background: none;
  border: 1px solid var(--cor-primaria-escura);
  color: var(--cor-primaria-escura);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--cor-primaria-escura);
    color: var(--cor-branco);
  }
`;

const ActionButton = styled.button`
  background-color: var(--cor-primaria-escura);
  color: var(--cor-branco);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--cor-primaria-clara);
  }
`;

const StoryList = styled.div`
  background-color: var(--cor-branco);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-top: 1.5rem;
`;

const StoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--cor-borda);
  }
  
  th {
    font-weight: 600;
    color: var(--cor-primaria-escura);
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const StoryImage = styled.img`
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;

const StoryImagePlaceholder = styled.div`
  width: 80px;
  height: 60px;
  background-color: #f0f0f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.8rem;
  text-align: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditButton = styled.button`
  background-color: var(--cor-primaria-escura);
  color: var(--cor-branco);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--cor-primaria-clara);
  }
`;

const DeleteButton = styled.button`
  background-color: var(--cor-erro);
  color: var(--cor-branco);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--cor-branco);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    color: var(--cor-primaria-escura);
    font-size: 1.5rem;
    margin: 0;
  }
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--cor-borda);
  border-radius: 4px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--cor-primaria-clara);
  }
`;

const ImageUploadContainer = styled.div`
  margin-top: 1rem;
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 200px;
  border: 2px dashed var(--cor-borda);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  span {
    color: var(--cor-texto);
    font-size: 0.9rem;
  }
  
  &:hover {
    border-color: var(--cor-primaria-clara);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const CancelButton = styled.button`
  background: none;
  border: 1px solid var(--cor-borda);
  color: var(--cor-texto);
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--cor-borda);
  }
`;

const SaveButton = styled.button`
  background-color: var(--cor-primaria-escura);
  color: var(--cor-branco);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
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

const ConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ConfirmContent = styled.div`
  background-color: var(--cor-branco);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  padding: 2rem;
  text-align: center;
`;

const ConfirmTitle = styled.h3`
  color: var(--cor-primaria-escura);
  margin-bottom: 1rem;
`;

const ConfirmText = styled.p`
  margin-bottom: 2rem;
  color: var(--cor-texto);
`;

const ConfirmButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
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

const ImagePreviewWithFallback = ({ src, alt, onClick }) => {
  const [hasError, setHasError] = useState(!src);
  
  if (!src || hasError) {
    return (
      <ImagePreview onClick={onClick}>
        <span>Clique para selecionar uma imagem</span>
      </ImagePreview>
    );
  }
  
  return (
    <ImagePreview onClick={onClick}>
      <img 
        src={src} 
        alt={alt || 'Preview'} 
        onError={() => setHasError(true)}
      />
    </ImagePreview>
  );
};

const StoryImageWithFallback = ({ src, alt }) => {
  const [hasError, setHasError] = useState(!src);
  
  if (!src || hasError) {
    return (
      <StoryImagePlaceholder>
        Sem imagem
      </StoryImagePlaceholder>
    );
  }
  
  return (
    <StoryImage 
      src={src} 
      alt={alt}
      onError={() => setHasError(true)}
    />
  );
};

const NossaHistoria = () => {
  const [storyEvents, setStoryEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({
    id: null,
    date: '',
    title: '',
    text: '',
    image: '',
    order: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchStoryEvents();
  }, []);
  
  const fetchStoryEvents = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:3001/api/story-events', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      setStoryEvents(response.data);
    } catch (error) {
      console.error('Erro ao buscar eventos da história:', error);
      setError('Erro ao carregar eventos da história. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenModal = (event = null) => {
    if (event) {
      setCurrentEvent(event);
      setIsEditing(true);
    } else {
      setCurrentEvent({
        id: null,
        date: '',
        title: '',
        text: '',
        image: '',
        order: storyEvents.length
      });
      setIsEditing(false);
    }
    
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEvent({
      id: null,
      date: '',
      title: '',
      text: '',
      image: '',
      order: 0
    });
    setIsEditing(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      uploadImage(file);
    }
  };
  
  const uploadImage = async (file) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post('http://localhost:3001/api/story-events/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      setCurrentEvent(prev => ({
        ...prev,
        image: response.data.imageUrl
      }));
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      setError('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = async () => {
    try {
      setIsLoading(true);
      setSuccess('');
      setError('');
      
      // Validações básicas
      if (!currentEvent.date || !currentEvent.title || !currentEvent.text) {
        setError('Data, título e texto são obrigatórios.');
        setIsLoading(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      
      if (isEditing) {
        // Atualizar evento existente
        await axios.put(`http://localhost:3001/api/story-events/${currentEvent.id}`, currentEvent, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setSuccess('Evento atualizado com sucesso!');
      } else {
        // Criar novo evento
        await axios.post('http://localhost:3001/api/story-events', currentEvent, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setSuccess('Evento criado com sucesso!');
      }
      
      // Recarregar a lista de eventos
      fetchStoryEvents();
      
      // Fechar o modal após um breve delay
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      setError('Erro ao salvar evento. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenConfirmModal = (event) => {
    setEventToDelete(event);
    setIsConfirmModalOpen(true);
  };
  
  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setEventToDelete(null);
  };
  
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:3001/api/story-events/${eventToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Recarregar a lista de eventos
      fetchStoryEvents();
      
      setSuccess('Evento excluído com sucesso!');
      handleCloseConfirmModal();
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      setError('Erro ao excluir evento. Tente novamente mais tarde.');
      handleCloseConfirmModal();
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  };
  
  return (
    <StoryContainer>
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
            <NavLink to="/admin/historia" className="active">Nossa História</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/album">Álbum</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/rsvp">RSVPs</NavLink>
          </NavItem>
        </NavMenu>
      </Sidebar>
      
      <Content>
        <Header>
          <PageTitle>Gerenciar Nossa História</PageTitle>
          <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
        </Header>
        
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ActionButton onClick={() => handleOpenModal()}>
            <FaPlus /> Adicionar Evento
          </ActionButton>
        </div>
        
        <StoryList>
          <StoryTable>
            <thead>
              <tr>
                <th>Imagem</th>
                <th>Data</th>
                <th>Título</th>
                <th>História</th>
                <th>Ordem</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {storyEvents.length > 0 ? (
                storyEvents.map(event => (
                  <tr key={event.id}>
                    <td>
                      <StoryImageWithFallback src={event.image} alt={event.title} />
                    </td>
                    <td>{event.date}</td>
                    <td>{event.title}</td>
                    <td>{event.text.length > 50 ? `${event.text.substring(0, 50)}...` : event.text}</td>
                    <td>{event.order}</td>
                    <td>
                      <ActionButtons>
                        <EditButton onClick={() => handleOpenModal(event)}>
                          <FaEdit />
                        </EditButton>
                        <DeleteButton onClick={() => handleOpenConfirmModal(event)}>
                          <FaTrash />
                        </DeleteButton>
                      </ActionButtons>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    Nenhum evento cadastrado. Clique em "Adicionar Evento" para começar.
                  </td>
                </tr>
              )}
            </tbody>
          </StoryTable>
        </StoryList>
        
        {/* Modal de Adicionar/Editar Evento */}
        {isModalOpen && (
          <Modal>
            <ModalContent>
              <ModalHeader>
                <h3>{isEditing ? 'Editar Evento' : 'Adicionar Evento'}</h3>
                <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
              </ModalHeader>
              
              {success && <SuccessMessage>{success}</SuccessMessage>}
              {error && <ErrorMessage>{error}</ErrorMessage>}
              
              <FormGroup>
                <Label htmlFor="date">
                  <FaCalendarAlt /> Data
                </Label>
                <Input
                  type="text"
                  id="date"
                  name="date"
                  value={currentEvent.date}
                  onChange={handleInputChange}
                  placeholder="Ex: Janeiro de 2020"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="title">
                  <FaHeading /> Título
                </Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={currentEvent.title}
                  onChange={handleInputChange}
                  placeholder="Ex: Primeiro Encontro"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="text">
                  <FaAlignLeft /> História
                </Label>
                <TextArea
                  id="text"
                  name="text"
                  value={currentEvent.text}
                  onChange={handleInputChange}
                  placeholder="Descreva o evento..."
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="order">
                  <FaSortAmountDown /> Ordem
                </Label>
                <Input
                  type="number"
                  id="order"
                  name="order"
                  value={currentEvent.order}
                  onChange={handleInputChange}
                  min="0"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <FaImage /> Imagem
                </Label>
                <ImageUploadContainer>
                  <ImagePreviewWithFallback
                    src={currentEvent.image}
                    alt={currentEvent.title}
                    onClick={() => document.getElementById('image-upload').click()}
                  />
                  <FileInput
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                </ImageUploadContainer>
              </FormGroup>
              
              <ModalFooter>
                <CancelButton onClick={handleCloseModal}>Cancelar</CancelButton>
                <SaveButton onClick={handleSave} disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </SaveButton>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
        
        {/* Modal de Confirmação de Exclusão */}
        {isConfirmModalOpen && (
          <ConfirmModal>
            <ConfirmContent>
              <ConfirmTitle>Confirmar Exclusão</ConfirmTitle>
              <ConfirmText>
                Tem certeza que deseja excluir o evento "{eventToDelete?.title}"?
                Esta ação não pode ser desfeita.
              </ConfirmText>
              <ConfirmButtons>
                <CancelButton onClick={handleCloseConfirmModal}>Cancelar</CancelButton>
                <DeleteButton onClick={handleDelete} disabled={isLoading}>
                  {isLoading ? 'Excluindo...' : 'Excluir'}
                </DeleteButton>
              </ConfirmButtons>
            </ConfirmContent>
          </ConfirmModal>
        )}
      </Content>
    </StoryContainer>
  );
};

export default NossaHistoria;
