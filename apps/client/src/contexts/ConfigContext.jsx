import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Criando o contexto
const ConfigContext = createContext();

// Hook personalizado para usar o contexto
export const useConfig = () => useContext(ConfigContext);

// Provedor do contexto
export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    siteTitle: 'Noiva & Noivo', // Valor padrão
    weddingDate: '',
    pixKey: '',
    pixDescription: '',
    pixQrCodeImage: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar as configurações
  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:3001/api/config');
      
      if (response.data) {
        setConfig({
          siteTitle: response.data.siteTitle || 'Noiva & Noivo',
          weddingDate: response.data.weddingDate || '',
          pixKey: response.data.pixKey || '',
          pixDescription: response.data.pixDescription || '',
          pixQrCodeImage: response.data.pixQrCodeImage || ''
        });
      }
    } catch (err) {
      console.error('Erro ao buscar configurações:', err);
      setError('Não foi possível carregar as configurações do site.');
    } finally {
      setLoading(false);
    }
  };

  // Buscar configurações ao montar o componente
  useEffect(() => {
    fetchConfig();
  }, []);

  // Função para formatar a data do casamento
  const formatWeddingDate = () => {
    if (!config.weddingDate) return '';
    
    try {
      const date = new Date(config.weddingDate);
      return new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (err) {
      console.error('Erro ao formatar data:', err);
      return config.weddingDate;
    }
  };

  // Valores e funções expostos pelo contexto
  const value = {
    config,
    loading,
    error,
    refreshConfig: fetchConfig,
    formatWeddingDate
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};
