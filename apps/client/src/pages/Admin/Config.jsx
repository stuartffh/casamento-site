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

const ImagePreview = styled.div`
  margin-top: 1rem;
  width: 200px;
  height: 200px;
  border: 1px dashed var(--cor-borda);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #f0f0f0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ImageUploadButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--cor-primaria-escura);
  color: var(--cor-branco);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: var(--cor-primaria-clara);
  }
`;

// Componente de preview de imagem com tratamento de erro
const ImagePreviewWithFallback = ({ src, alt, onClick }) => {
  const [hasError, setHasError] = useState(false);
  
  if (!src) {
    return (
      <ImagePreview onClick={onClick}>
        <span>Clique para selecionar uma imagem</span>
      </ImagePreview>
    );
  }
  
  if (hasError) {
    return (
      <ImagePreview onClick={onClick}>
        <span>Imagem não disponível. Clique para selecionar outra.</span>
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

const Config = () => {
  const [formData, setFormData] = useState({
    pixKey: '',
    pixDescription: '',
    mercadoPagoToken: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [pixQrCodeFile, setPixQrCodeFile] = useState(null);
  const [pixQrCodePreview, setPixQrCodePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Referência para o input de arquivo
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
            mercadoPagoToken: response.data.mercadoPagoToken || ''
          });
          
          // Se houver uma imagem de QR Code, definir o preview
          if (response.data.pixQrCodeImage) {
            setPixQrCodePreview(response.data.pixQrCodeImage);
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
    
    setPixQrCodeFile(file);
    
    // Criar preview da imagem
    const reader = new FileReader();
    reader.onloadend = () => {
      setPixQrCodePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const uploadImage = async () => {
    if (!pixQrCodeFile) return null;
    
    try {
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('image', pixQrCodeFile);
      
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3001/api/config/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.url;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw new Error('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setUploadingImage(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    setSuccess('');
    setError('');
    
    try {
      // Fazer upload da imagem se houver uma nova
      let pixQrCodeImage = pixQrCodePreview;
      if (pixQrCodeFile) {
        const imageUrl = await uploadImage();
        if (imageUrl) {
          pixQrCodeImage = imageUrl;
        }
      }
      
      const configData = {
        ...formData,
        pixQrCodeImage
      };
      
      await axios.put('http://localhost:3001/api/config', configData, {
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
              
              <FormGroup>
                <Label>QR Code do PIX</Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                />
                
                <ImagePreviewWithFallback
                  src={pixQrCodePreview}
                  alt="QR Code do PIX"
                  onClick={handleImageClick}
                />
                
                <ImageUploadButton type="button" onClick={handleImageClick}>
                  {pixQrCodePreview ? 'Alterar QR Code' : 'Selecionar QR Code'}
                </ImageUploadButton>
              </FormGroup>
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
            
            <SubmitButton type="submit" disabled={isLoading || uploadingImage}>
              {isLoading || uploadingImage ? 'Salvando...' : 'Salvar Configurações'}
            </SubmitButton>
          </form>
        </FormContainer>
      </Content>
    </ConfigContainer>
  );
};

export default Config;
