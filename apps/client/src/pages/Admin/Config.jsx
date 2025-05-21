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
  TextArea,
  SuccessMessage,
  ErrorMessage
} from '../../styles/AdminStyles';
import styled from 'styled-components';

const ConfigContainer = styled.div`
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ConfigTitle = styled.h3`
  color: var(--accent);
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(182, 149, 192, 0.3);
  padding-bottom: 0.5rem;
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
    object-fit: contain;
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

const Config = () => {
  const [config, setConfig] = useState({
    siteTitle: '',
    weddingDate: '',
    pixKey: '',
    pixDescription: ''
  });
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [qrCodePreview, setQrCodePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Referência para o input de arquivo
  const fileInputRef = React.createRef();
  
  useEffect(() => {
    fetchConfig();
  }, []);
  
  const fetchConfig = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/config');
      
      if (response.data) {
        setConfig({
          siteTitle: response.data.siteTitle || '',
          weddingDate: response.data.weddingDate || '',
          pixKey: response.data.pixKey || '',
          pixDescription: response.data.pixDescription || ''
        });
        
        // Verificar se há QR Code
        if (response.data.pixQrCode) {
          setQrCodePreview(`http://localhost:3001/uploads/pix/${response.data.pixQrCode}`);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      setError('Erro ao carregar configurações. Tente novamente mais tarde.');
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig({
      ...config,
      [name]: value
    });
  };
  
  const handleQrCodeClick = () => {
    fileInputRef.current.click();
  };
  
  const handleQrCodeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Verificar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de arquivo não suportado. Apenas imagens são permitidas.');
      return;
    }
    
    // Verificar tamanho do arquivo (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Arquivo muito grande. O tamanho máximo é 2MB.');
      return;
    }
    
    setQrCodeImage(file);
    
    // Criar preview da imagem
    const reader = new FileReader();
    reader.onloadend = () => {
      setQrCodePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    setSuccess('');
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      // Primeiro, fazer upload do QR Code se houver um novo
      let qrCodeFilename = null;
      if (qrCodeImage) {
        const formData = new FormData();
        formData.append('qrcode', qrCodeImage);
        
        const uploadResponse = await axios.post('http://localhost:3001/api/config/upload-qrcode', formData, {
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        qrCodeFilename = uploadResponse.data.filename;
      }
      
      // Depois, atualizar as configurações
      const configData = {
        ...config
      };
      
      if (qrCodeFilename) {
        configData.pixQrCode = qrCodeFilename;
      }
      
      await axios.put('http://localhost:3001/api/config', configData, { headers });
      
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
          <SecondaryButton onClick={handleLogout}>Sair</SecondaryButton>
        </Header>
        
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <form onSubmit={handleSubmit}>
          <ConfigContainer>
            <ConfigTitle>Configurações Gerais</ConfigTitle>
            
            <FormGroup>
              <Label htmlFor="siteTitle">Título do Site</Label>
              <Input
                type="text"
                id="siteTitle"
                name="siteTitle"
                value={config.siteTitle}
                onChange={handleChange}
                placeholder="Ex: Casamento Marília & Iago"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="weddingDate">Data do Casamento</Label>
              <Input
                type="date"
                id="weddingDate"
                name="weddingDate"
                value={config.weddingDate}
                onChange={handleChange}
              />
            </FormGroup>
          </ConfigContainer>
          
          <ConfigContainer>
            <ConfigTitle>Configurações de PIX</ConfigTitle>
            
            <FormGroup>
              <Label htmlFor="pixKey">Chave PIX</Label>
              <Input
                type="text"
                id="pixKey"
                name="pixKey"
                value={config.pixKey}
                onChange={handleChange}
                placeholder="Ex: email@exemplo.com"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="pixDescription">Descrição do PIX</Label>
              <TextArea
                id="pixDescription"
                name="pixDescription"
                value={config.pixDescription}
                onChange={handleChange}
                placeholder="Ex: Presente de casamento para Marília e Iago"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>QR Code PIX</Label>
              <ImagePreview onClick={handleQrCodeClick}>
                {qrCodePreview ? (
                  <img 
                    src={qrCodePreview} 
                    alt="QR Code PIX" 
                    onError={() => {
                      setQrCodePreview('');
                      setError('Erro ao carregar imagem do QR Code.');
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
                onChange={handleQrCodeChange}
              />
              <ImageUploadButton type="button" onClick={handleQrCodeClick}>
                Selecionar QR Code
              </ImageUploadButton>
            </FormGroup>
          </ConfigContainer>
          
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Configurações'}
          </SubmitButton>
        </form>
      </Content>
    </AdminContainer>
  );
};

export default Config;
