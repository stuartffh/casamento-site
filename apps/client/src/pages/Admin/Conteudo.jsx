import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ConteudoContainer = styled.div`
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

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--cor-borda);
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

const EditorContainer = styled.div`
  background-color: var(--cor-branco);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 400px;
  padding: 1rem;
  border: 1px solid var(--cor-borda);
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--cor-primaria-clara);
  }
`;

const InfoFieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoField = styled.div`
  border: 1px solid var(--cor-borda);
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #f9f9f9;
`;

const InfoFieldHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const InfoFieldIcon = styled.div`
  font-size: 1.5rem;
  margin-right: 0.5rem;
`;

const InfoFieldTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--cor-primaria-escura);
  margin: 0;
`;

const InfoFieldTextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 1px solid var(--cor-borda);
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--cor-primaria-clara);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const SaveButton = styled.button`
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

const PreviewContainer = styled.div`
  margin-top: 2rem;
  background-color: var(--cor-branco);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const PreviewTitle = styled.h3`
  color: var(--cor-primaria-escura);
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const PreviewContent = styled.div`
  line-height: 1.8;
  
  p {
    margin-bottom: 1rem;
  }
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const PreviewCard = styled.div`
  border: 1px solid var(--cor-borda);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
`;

const PreviewCardIcon = styled.div`
  font-size: 2rem;
  color: var(--cor-primaria-escura);
  margin-bottom: 1rem;
`;

const PreviewCardTitle = styled.h4`
  font-size: 1.2rem;
  color: var(--cor-primaria-escura);
  margin-bottom: 1rem;
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

const Conteudo = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [content, setContent] = useState('');
  const [infoFields, setInfoFields] = useState({
    cerimonia: '',
    recepcao: '',
    dressCode: '',
    hospedagem: '',
    transporte: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  useEffect(() => {
    fetchContent(activeTab);
  }, [activeTab]);
  
  const fetchContent = async (section) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3001/api/content/${section}`);
      
      if (response.data && response.data.content) {
        if (section === 'informacoes') {
          try {
            // Tentar fazer parse do JSON para os campos separados
            const parsedContent = JSON.parse(response.data.content);
            setInfoFields({
              cerimonia: parsedContent.cerimonia || '',
              recepcao: parsedContent.recepcao || '',
              dressCode: parsedContent.dressCode || '',
              hospedagem: parsedContent.hospedagem || '',
              transporte: parsedContent.transporte || ''
            });
          } catch (e) {
            // Se não for JSON, é o formato antigo (texto único)
            // Vamos tentar extrair as informações do texto único
            const contentText = response.data.content;
            
            // Extrair seções baseadas em emojis ou títulos
            const extractSection = (emoji, title) => {
              const emojiRegex = new RegExp(`${emoji}[^\\n]*\\n([\\s\\S]*?)(?=\\n\\n|$)`, 'i');
              const titleRegex = new RegExp(`${title}[^\\n]*\\n([\\s\\S]*?)(?=\\n\\n|$)`, 'i');
              
              let match = contentText.match(emojiRegex);
              if (!match) {
                match = contentText.match(titleRegex);
              }
              
              return match ? match[1].trim() : '';
            };
            
            setInfoFields({
              cerimonia: extractSection('📍 Cerimônia', 'Cerimônia'),
              recepcao: extractSection('📍 Recepção', 'Recepção'),
              dressCode: extractSection('👗 Dress Code', 'Dress Code'),
              hospedagem: extractSection('🏨 Hospedagem', 'Hospedagem'),
              transporte: extractSection('🚖 Transporte', 'Transporte')
            });
          }
        } else {
          setContent(response.data.content);
        }
      } else {
        if (section === 'informacoes') {
          setInfoFields({
            cerimonia: '',
            recepcao: '',
            dressCode: '',
            hospedagem: '',
            transporte: ''
          });
        } else {
          setContent('');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar conteúdo:', error);
      setError('Erro ao carregar conteúdo. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSuccess('');
    setError('');
    setShowPreview(false);
  };
  
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };
  
  const handleInfoFieldChange = (field, value) => {
    setInfoFields(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSave = async () => {
    try {
      setIsLoading(true);
      setSuccess('');
      setError('');
      
      const token = localStorage.getItem('token');
      
      if (activeTab === 'informacoes') {
        // Salvar os campos de informações como JSON
        const contentJson = JSON.stringify(infoFields);
        
        await axios.put(`http://localhost:3001/api/content/${activeTab}`, {
          content: contentJson
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.put(`http://localhost:3001/api/content/${activeTab}`, {
          content
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      setSuccess('Conteúdo salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error);
      setError('Erro ao salvar conteúdo. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };
  
  const formatPreview = () => {
    if (activeTab === 'informacoes') {
      return (
        <PreviewGrid>
          <PreviewCard>
            <PreviewCardIcon>🏛️</PreviewCardIcon>
            <PreviewCardTitle>Cerimônia</PreviewCardTitle>
            <p>{infoFields.cerimonia}</p>
          </PreviewCard>
          <PreviewCard>
            <PreviewCardIcon>🥂</PreviewCardIcon>
            <PreviewCardTitle>Recepção</PreviewCardTitle>
            <p>{infoFields.recepcao}</p>
          </PreviewCard>
          <PreviewCard>
            <PreviewCardIcon>👔</PreviewCardIcon>
            <PreviewCardTitle>Dress Code</PreviewCardTitle>
            <p>{infoFields.dressCode}</p>
          </PreviewCard>
          <PreviewCard>
            <PreviewCardIcon>🏨</PreviewCardIcon>
            <PreviewCardTitle>Hospedagem Sugerida</PreviewCardTitle>
            <p>{infoFields.hospedagem}</p>
          </PreviewCard>
          <PreviewCard>
            <PreviewCardIcon>🚗</PreviewCardIcon>
            <PreviewCardTitle>Transporte</PreviewCardTitle>
            <p>{infoFields.transporte}</p>
          </PreviewCard>
        </PreviewGrid>
      );
    } else {
      return content.split('\n\n').map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ));
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  };
  
  const renderEditor = () => {
    if (activeTab === 'informacoes') {
      return (
        <InfoFieldsContainer>
          <InfoField>
            <InfoFieldHeader>
              <InfoFieldIcon>🏛️</InfoFieldIcon>
              <InfoFieldTitle>Cerimônia</InfoFieldTitle>
            </InfoFieldHeader>
            <InfoFieldTextArea
              value={infoFields.cerimonia}
              onChange={(e) => handleInfoFieldChange('cerimonia', e.target.value)}
              placeholder="Informe os detalhes da cerimônia..."
            />
          </InfoField>
          
          <InfoField>
            <InfoFieldHeader>
              <InfoFieldIcon>🥂</InfoFieldIcon>
              <InfoFieldTitle>Recepção</InfoFieldTitle>
            </InfoFieldHeader>
            <InfoFieldTextArea
              value={infoFields.recepcao}
              onChange={(e) => handleInfoFieldChange('recepcao', e.target.value)}
              placeholder="Informe os detalhes da recepção..."
            />
          </InfoField>
          
          <InfoField>
            <InfoFieldHeader>
              <InfoFieldIcon>👔</InfoFieldIcon>
              <InfoFieldTitle>Dress Code</InfoFieldTitle>
            </InfoFieldHeader>
            <InfoFieldTextArea
              value={infoFields.dressCode}
              onChange={(e) => handleInfoFieldChange('dressCode', e.target.value)}
              placeholder="Informe o dress code..."
            />
          </InfoField>
          
          <InfoField>
            <InfoFieldHeader>
              <InfoFieldIcon>🏨</InfoFieldIcon>
              <InfoFieldTitle>Hospedagem Sugerida</InfoFieldTitle>
            </InfoFieldHeader>
            <InfoFieldTextArea
              value={infoFields.hospedagem}
              onChange={(e) => handleInfoFieldChange('hospedagem', e.target.value)}
              placeholder="Informe as opções de hospedagem..."
            />
          </InfoField>
          
          <InfoField>
            <InfoFieldHeader>
              <InfoFieldIcon>🚗</InfoFieldIcon>
              <InfoFieldTitle>Transporte</InfoFieldTitle>
            </InfoFieldHeader>
            <InfoFieldTextArea
              value={infoFields.transporte}
              onChange={(e) => handleInfoFieldChange('transporte', e.target.value)}
              placeholder="Informe as opções de transporte..."
            />
          </InfoField>
        </InfoFieldsContainer>
      );
    } else {
      return (
        <TextArea 
          value={content} 
          onChange={handleContentChange}
          placeholder="Digite o conteúdo aqui..."
        />
      );
    }
  };
  
  return (
    <ConteudoContainer>
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
            <NavLink to="/admin/conteudo" className="active">Conteúdo</NavLink>
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
          <PageTitle>Gerenciar Conteúdo</PageTitle>
          <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
        </Header>
        
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <TabsContainer>
          <Tab 
            active={activeTab === 'home'} 
            onClick={() => handleTabChange('home')}
          >
            Home
          </Tab>
          <Tab 
            active={activeTab === 'historia'} 
            onClick={() => handleTabChange('historia')}
          >
            Nossa História
          </Tab>
          <Tab 
            active={activeTab === 'informacoes'} 
            onClick={() => handleTabChange('informacoes')}
          >
            Informações
          </Tab>
        </TabsContainer>
        
        <EditorContainer>
          {renderEditor()}
          
          <ButtonContainer>
            <SaveButton 
              onClick={togglePreview} 
              style={{ 
                marginRight: '1rem', 
                background: 'none', 
                border: '1px solid var(--cor-primaria-escura)', 
                color: 'var(--cor-primaria-escura)' 
              }}
            >
              {showPreview ? 'Ocultar Prévia' : 'Mostrar Prévia'}
            </SaveButton>
            <SaveButton onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Conteúdo'}
            </SaveButton>
          </ButtonContainer>
        </EditorContainer>
        
        {showPreview && (
          <PreviewContainer>
            <PreviewTitle>Prévia</PreviewTitle>
            <PreviewContent>
              {formatPreview()}
            </PreviewContent>
          </PreviewContainer>
        )}
      </Content>
    </ConteudoContainer>
  );
};

export default Conteudo;
