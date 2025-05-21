import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

const PageContainer = styled.div`
  width: 100%;
`;

const PageContent = styled.div`
  width: 100%;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 60px var(--container-padding);
  
  @media (max-width: 768px) {
    padding: 40px var(--container-padding);
  }
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

const GiftTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  border-bottom: 1px solid var(--border-color);
  width: 100%;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
  }
`;

const GiftTab = styled.div`
  padding: 15px 30px;
  margin: 0 5px;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? 'var(--primary)' : 'transparent'};
  font-family: var(--font-serif);
  font-size: 1.2rem;
  transition: var(--transition);
  color: ${props => props.active ? 'var(--primary)' : 'var(--accent)'};
  
  &:hover {
    color: var(--primary);
  }
  
  @media (max-width: 576px) {
    width: 100%;
    text-align: center;
    margin: 5px 0;
  }
`;

const GiftGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const GiftCard = styled.div`
  background-color: var(--white);
  border-radius: 5px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`;

const GiftImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: #f0f0f0;
`;

const GiftImageFallback = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #999;
  font-size: 0.9rem;
`;

const GiftInfo = styled.div`
  padding: 25px;
`;

const GiftName = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.3rem;
  margin-bottom: 10px;
`;

const GiftPrice = styled.div`
  color: var(--accent);
  font-weight: 500;
  margin-bottom: 20px;
`;

const GiftButton = styled.button`
  width: 100%;
  text-align: center;
  background-color: var(--primary);
  color: var(--white);
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--accent);
  }
`;

const PixContainer = styled.div`
  background-color: var(--white);
  border-radius: 5px;
  padding: 40px;
  box-shadow: var(--shadow-md);
  text-align: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const PixQRCode = styled.div`
  width: 250px;
  height: 250px;
  margin: 30px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: #666;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  @media (max-width: 576px) {
    width: 200px;
    height: 200px;
  }
`;

const PixQRCodeFallback = styled.div`
  width: 250px;
  height: 250px;
  margin: 30px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #666;
  font-size: 0.9rem;
  border-radius: 5px;
  
  @media (max-width: 576px) {
    width: 200px;
    height: 200px;
  }
`;

const PixKey = styled.div`
  background-color: rgba(182, 149, 192, 0.1);
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
  font-family: monospace;
  font-size: 1.1rem;
  word-break: break-all;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  width: 100%;
  font-size: 1.2rem;
  color: var(--accent);
`;

const ErrorContainer = styled.div`
  background-color: var(--error);
  color: var(--error-text);
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  margin: 20px auto;
  max-width: 800px;
`;

const ListaPresentes = () => {
  const [activeTab, setActiveTab] = React.useState('online');
  const [gifts, setGifts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [pixInfo, setPixInfo] = React.useState({
    key: 'marilia.iago@casamento.com',
    description: 'Presente de Casamento',
    qrCodeImage: ''
  });
  
  // Usando useCallback para evitar recriação das funções a cada render
  const fetchPresentes = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/presentes');
      setGifts(response.data);
      setError('');
    } catch (error) {
      console.error('Erro ao buscar presentes:', error);
      setError('Não foi possível carregar a lista de presentes. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchPixInfo = React.useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/config');
      if (response.data) {
        setPixInfo({
          key: response.data.pixKey || 'marilia.iago@casamento.com',
          description: response.data.pixDescription || 'Presente de Casamento',
          qrCodeImage: response.data.pixQrCodeImage || ''
        });
      }
    } catch (error) {
      console.error('Erro ao buscar informações do PIX:', error);
      // Mantém as informações padrão do PIX em caso de erro
    }
  }, []);
  
  // useEffect com dependências explícitas
  React.useEffect(() => {
    // Usando uma flag para garantir que as chamadas só aconteçam uma vez
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await fetchPresentes();
        await fetchPixInfo();
      }
    };
    
    loadData();
    
    // Cleanup function para evitar memory leaks
    return () => {
      isMounted = false;
    };
  }, [fetchPresentes, fetchPixInfo]);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  const handlePresentear = (gift) => {
    // Implementação futura: integração com checkout
    alert(`Você selecionou o presente: ${gift.name}`);
  };
  
  // Componente de imagem com tratamento de erro melhorado
  const GiftImageWithFallback = ({ src, alt }) => {
    const [hasError, setHasError] = React.useState(false);
    
    // Se já sabemos que a imagem não existe, renderizamos o fallback diretamente
    if (hasError) {
      return <GiftImageFallback>{alt || 'Imagem não disponível'}</GiftImageFallback>;
    }
    
    return (
      <GiftImage 
        src={src} 
        alt={alt}
        onError={() => {
          // Em vez de tentar carregar outra imagem, apenas marcamos que houve erro
          setHasError(true);
        }}
      />
    );
  };
  
  // Componente para QR Code com tratamento de erro
  const QRCodeWithFallback = ({ src, alt }) => {
    const [hasError, setHasError] = React.useState(false);
    
    if (!src || hasError) {
      return <PixQRCodeFallback>QR Code não disponível</PixQRCodeFallback>;
    }
    
    return (
      <PixQRCode>
        <img 
          src={`http://localhost:3001${src}`} 
          alt={alt || 'QR Code PIX'} 
          onError={() => setHasError(true)}
        />
      </PixQRCode>
    );
  };
  
  const renderContent = () => {
    if (loading) {
      return <LoadingContainer>Carregando presentes...</LoadingContainer>;
    }
    
    if (error) {
      return <ErrorContainer>{error}</ErrorContainer>;
    }
    
    if (activeTab === 'pix') {
      return (
        <PixContainer>
          <h3>Contribua com o valor que desejar</h3>
          <p>Você pode nos ajudar com qualquer valor através do PIX abaixo:</p>
          
          <QRCodeWithFallback src={pixInfo.qrCodeImage} alt="QR Code PIX" />
          
          <p>Ou copie a chave PIX:</p>
          <PixKey>{pixInfo.key}</PixKey>
          
          <p>{pixInfo.description}</p>
          
          <p>Agradecemos muito pela sua contribuição!</p>
        </PixContainer>
      );
    }
    
    const filteredGifts = gifts.filter(gift => gift.stock > 0);
    
    if (filteredGifts.length === 0) {
      return <ErrorContainer>Nenhum presente disponível no momento.</ErrorContainer>;
    }
    
    return (
      <GiftGrid>
        {filteredGifts.map(gift => (
          <GiftCard key={gift.id}>
            <GiftImageWithFallback 
              src={gift.image || ''} 
              alt={gift.name}
            />
            <GiftInfo>
              <GiftName>{gift.name}</GiftName>
              <GiftPrice>{formatPrice(gift.price)}</GiftPrice>
              <GiftButton onClick={() => handlePresentear(gift)}>
                Presentear
              </GiftButton>
            </GiftInfo>
          </GiftCard>
        ))}
      </GiftGrid>
    );
  };
  
  return (
    <PageContainer>
      <PageContent>
        <SectionTitle>Lista de Presentes</SectionTitle>
        
        <GiftTabs>
          <GiftTab 
            active={activeTab === 'online'} 
            onClick={() => setActiveTab('online')}
          >
            Lista Online
          </GiftTab>
          <GiftTab 
            active={activeTab === 'pix'} 
            onClick={() => setActiveTab('pix')}
          >
            PIX
          </GiftTab>
        </GiftTabs>
        
        {renderContent()}
      </PageContent>
    </PageContainer>
  );
};

export default ListaPresentes;
