import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ConfigContainer = styled.div`
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

const FormContainer = styled.div`
  background-color: var(--cor-branco);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--cor-borda);
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const SectionTitle = styled.h3`
  color: var(--cor-primaria-escura);
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
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
  min-height: 100px;
  resize: vertical;
  
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

// Novos componentes para upload de imagem
const ImageUploadContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const ImagePreview = styled.div`
  width: 200px;
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
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  &:hover {
    border-color: var(--cor-primaria-clara);
  }
`;

const ImageUploadButton = styled.button`
  background-color: var(--cor-primaria-escura);
  color: var(--cor-branco);
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background-color: var(--cor-primaria-clara);
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const Config = () => {
  const [formData, setFormData] = useState({
    pixKey: '',
    pixDescription: '',
    mercadoPagoToken: '',
    pixQrCodeImage: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [qrCodePreview, setQrCodePreview] = useState('');
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/config', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data) {
          setFormData({
            pixKey: response.data.pixKey || '',
            pixDescription: response.data.pixDescription || '',
            mercadoPagoToken: response.data.mercadoPagoToken || '',
            pixQrCodeImage: response.data.pixQrCodeImage || ''
          });
          
          if (response.data.pixQrCodeImage) {
            setQrCodePreview(`http://localhost:3001${response.data.pixQrCodeImage}`);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
        setError('Erro ao carregar configurações. Tente novamente mais tarde.');
      }
    };
    
    fetchConfig();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Tipo de arquivo inválido. Use JPG, PNG, GIF ou WebP.');
      return;
    }
    
    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. O tamanho máximo é 5MB.');
      return;
    }
    
    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setQrCodePreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    // Preparar para upload
    uploadImage(file);
  };
  
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('qrcode', file);
      
      const response = await axios.post('http://localhost:3001/api/config/upload-qrcode', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setFormData(prev => ({
        ...prev,
        pixQrCodeImage: response.data.imagePath
      }));
      
      setSuccess('Imagem do QR Code enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      setError('Erro ao fazer upload da imagem. Tente novamente.');
      throw new Error('Erro ao fazer upload da imagem. Tente novamente.');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    setSuccess('');
    setError('');
    
    try {
      await axios.put('http://localhost:3001/api/config', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setSuccess('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setError('Erro ao salvar configurações. Tente novamente mais tarde.');
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
    <ConfigContainer>
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
            <NavLink to="/admin/config" className="active">Configurações</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/conteudo">Conteúdo</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/historia">Nossa História</NavLink>
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
          <PageTitle>Configurações</PageTitle>
          <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
        </Header>
        
        <FormContainer>
          {success && <SuccessMessage>{success}</SuccessMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <form onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle>Configurações de PIX</SectionTitle>
              
              <FormGroup>
                <Label htmlFor="pixKey">Chave PIX</Label>
                <Input
                  type="text"
                  id="pixKey"
                  name="pixKey"
                  value={formData.pixKey}
                  onChange={handleChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="pixDescription">Descrição do PIX</Label>
                <TextArea
                  id="pixDescription"
                  name="pixDescription"
                  value={formData.pixDescription}
                  onChange={handleChange}
                />
              </FormGroup>
              
              <ImageUploadContainer>
                <Label>QR Code do PIX</Label>
                <ImagePreview onClick={handleImageClick}>
                  {qrCodePreview ? (
                    <img src={qrCodePreview} alt="QR Code do PIX" />
                  ) : (
                    <span>Clique para selecionar uma imagem</span>
                  )}
                </ImagePreview>
                <HiddenFileInput
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                />
                <ImageUploadButton type="button" onClick={handleImageClick}>
                  Selecionar QR Code
                </ImageUploadButton>
              </ImageUploadContainer>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Configurações do Mercado Pago</SectionTitle>
              
              <FormGroup>
                <Label htmlFor="mercadoPagoToken">Access Token do Mercado Pago</Label>
                <Input
                  type="text"
                  id="mercadoPagoToken"
                  name="mercadoPagoToken"
                  value={formData.mercadoPagoToken}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormSection>
            
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Configurações'}
            </SubmitButton>
          </form>
        </FormContainer>
      </Content>
    </ConfigContainer>
  );
};

export default Config;
