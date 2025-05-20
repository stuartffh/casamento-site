import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ListaPresentesContainer = styled.div`
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

const PresentesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const PresenteCard = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const PresenteImage = styled.div`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const PresenteInfo = styled.div`
  padding: 1.5rem;
  background-color: var(--cor-branco);
`;

const PresenteName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--cor-primaria-escura);
`;

const PresenteDescription = styled.p`
  font-size: 0.9rem;
  color: var(--cor-texto);
  margin-bottom: 1rem;
`;

const PresentePrice = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--cor-primaria-escura);
  margin-bottom: 1rem;
`;

const PresenteButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--cor-primaria-escura);
  color: var(--cor-branco);
  border: none;
  border-radius: 4px;
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

const PixContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  padding: 2rem;
  border: 1px solid var(--cor-borda);
  border-radius: 8px;
`;

const QRCode = styled.div`
  width: 200px;
  height: 200px;
  background-image: url(${props => props.src});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin: 2rem auto;
`;

const PixKey = styled.div`
  padding: 1rem;
  background-color: var(--cor-fundo);
  border-radius: 4px;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const CopyButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: var(--cor-primaria-escura);
  color: var(--cor-branco);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--cor-primaria-clara);
  }
`;

const ListaFisicaContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const ListaPresentes = () => {
  const [activeTab, setActiveTab] = useState('online');
  const [presentes, setPresentes] = useState([]);
  const [pixConfig, setPixConfig] = useState({
    key: '',
    description: ''
  });
  
  useEffect(() => {
    const fetchPresentes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/presentes');
        setPresentes(response.data);
      } catch (error) {
        console.error('Erro ao buscar presentes:', error);
      }
    };
    
    const fetchPixConfig = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/config');
        if (response.data) {
          setPixConfig({
            key: response.data.pixKey || '',
            description: response.data.pixDescription || ''
          });
        }
      } catch (error) {
        console.error('Erro ao buscar configuração PIX:', error);
      }
    };
    
    fetchPresentes();
    fetchPixConfig();
  }, []);
  
  const handleComprar = async (presente) => {
    try {
      const response = await axios.post('http://localhost:3001/api/mercadopago/create-payment', {
        presentId: presente.id,
        customerName: 'Convidado', // Em um caso real, seria coletado do usuário
        customerEmail: 'convidado@exemplo.com' // Em um caso real, seria coletado do usuário
      });
      
      if (response.data && response.data.checkoutUrl) {
        window.open(response.data.checkoutUrl, '_blank');
      }
    } catch (error) {
      console.error('Erro ao iniciar pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente mais tarde.');
    }
  };
  
  const copyPixKey = () => {
    navigator.clipboard.writeText(pixConfig.key)
      .then(() => alert('Chave PIX copiada!'))
      .catch(err => console.error('Erro ao copiar:', err));
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  return (
    <ListaPresentesContainer>
      <PageTitle>Lista de Presentes</PageTitle>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'online'} 
          onClick={() => setActiveTab('online')}
        >
          Lista Online
        </Tab>
        <Tab 
          active={activeTab === 'fisica'} 
          onClick={() => setActiveTab('fisica')}
        >
          Lista Física
        </Tab>
        <Tab 
          active={activeTab === 'pix'} 
          onClick={() => setActiveTab('pix')}
        >
          PIX
        </Tab>
      </TabsContainer>
      
      {activeTab === 'online' && (
        <PresentesGrid>
          {presentes.map(presente => (
            <PresenteCard key={presente.id}>
              <PresenteImage src="/images/placeholder.jpg" />
              <PresenteInfo>
                <PresenteName>{presente.name}</PresenteName>
                <PresenteDescription>{presente.description}</PresenteDescription>
                <PresentePrice>{formatPrice(presente.price)}</PresentePrice>
                <PresenteButton 
                  onClick={() => handleComprar(presente)}
                  disabled={presente.stock <= 0}
                >
                  {presente.stock > 0 ? 'Presentear' : 'Indisponível'}
                </PresenteButton>
              </PresenteInfo>
            </PresenteCard>
          ))}
        </PresentesGrid>
      )}
      
      {activeTab === 'fisica' && (
        <ListaFisicaContainer>
          <p>
            Para quem prefere a experiência tradicional, também temos uma lista física nas lojas parceiras:
          </p>
          <ul style={{ listStyle: 'none', margin: '2rem 0' }}>
            <li style={{ marginBottom: '1rem' }}>
              <strong>Camicado</strong> - Shopping RioMar Recife
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <strong>Tok&Stok</strong> - Shopping Recife
            </li>
          </ul>
          <p>
            Basta informar o nome dos noivos: <strong>Marília & Iago</strong>
          </p>
        </ListaFisicaContainer>
      )}
      
      {activeTab === 'pix' && (
        <PixContainer>
          <h3>Contribua com o valor que desejar</h3>
          <p>
            Se preferir, você pode nos presentear com uma contribuição via PIX.
          </p>
          
          <QRCode src="/images/placeholder.jpg" />
          
          <p><strong>Chave PIX:</strong></p>
          <PixKey>{pixConfig.key}</PixKey>
          
          <CopyButton onClick={copyPixKey}>
            Copiar Chave PIX
          </CopyButton>
          
          <p style={{ marginTop: '1.5rem' }}>
            <strong>Descrição:</strong> {pixConfig.description}
          </p>
        </PixContainer>
      )}
    </ListaPresentesContainer>
  );
};

export default ListaPresentes;
