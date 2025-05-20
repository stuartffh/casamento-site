import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RSVPContainer = styled.div`
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

const SearchContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--cor-borda);
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--cor-primaria-clara);
  }
`;

const SearchButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--cor-primaria-escura);
  color: var(--cor-branco);
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--cor-primaria-clara);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: var(--cor-branco);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background-color: var(--cor-primaria-escura);
  color: var(--cor-branco);
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--cor-borda);
`;

const Tr = styled.tr`
  &:last-child td {
    border-bottom: none;
  }
  
  &:hover {
    background-color: var(--cor-fundo);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  background-color: ${props => props.active ? 'var(--cor-primaria-escura)' : 'var(--cor-branco)'};
  color: ${props => props.active ? 'var(--cor-branco)' : 'var(--cor-texto)'};
  border: 1px solid var(--cor-borda);
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--cor-primaria-escura)' : 'var(--cor-fundo)'};
  }
  
  &:disabled {
    opacity: 0.5;
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

const RSVP = () => {
  const [rsvps, setRSVPs] = useState([]);
  const [filteredRSVPs, setFilteredRSVPs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchRSVPs();
  }, []);
  
  const fetchRSVPs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/rsvp', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setRSVPs(response.data);
      setFilteredRSVPs(response.data);
    } catch (error) {
      console.error('Erro ao buscar RSVPs:', error);
      setError('Erro ao carregar RSVPs. Tente novamente mais tarde.');
    }
  };
  
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredRSVPs(rsvps);
      return;
    }
    
    const filtered = rsvps.filter(rsvp => 
      rsvp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rsvp.email && rsvp.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rsvp.phone && rsvp.phone.includes(searchTerm))
    );
    
    setFilteredRSVPs(filtered);
    setCurrentPage(1);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/rsvp/export', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      // Criar link para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'rsvps.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setSuccess('CSV exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      setError('Erro ao exportar CSV. Tente novamente mais tarde.');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  };
  
  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRSVPs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRSVPs.length / itemsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <RSVPContainer>
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
            <NavLink to="/admin/album">Álbum</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/rsvp" className="active">RSVPs</NavLink>
          </NavItem>
        </NavMenu>
      </Sidebar>
      
      <Content>
        <Header>
          <PageTitle>Confirmações de Presença</PageTitle>
          <div>
            <ActionButton onClick={handleExportCSV}>Exportar CSV</ActionButton>
            <ActionButton onClick={handleLogout} style={{ marginLeft: '1rem', background: 'none', border: '1px solid var(--cor-primaria-escura)', color: 'var(--cor-primaria-escura)' }}>Sair</ActionButton>
          </div>
        </Header>
        
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
          />
          <SearchButton onClick={handleSearch}>Buscar</SearchButton>
        </SearchContainer>
        
        <Table>
          <thead>
            <tr>
              <Th>Nome</Th>
              <Th>Acompanhantes</Th>
              <Th>Contato</Th>
              <Th>Mensagem</Th>
              <Th>Data</Th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map(rsvp => (
                <Tr key={rsvp.id}>
                  <Td>{rsvp.name}</Td>
                  <Td>{rsvp.companions}</Td>
                  <Td>
                    {rsvp.email && <div>{rsvp.email}</div>}
                    {rsvp.phone && <div>{rsvp.phone}</div>}
                  </Td>
                  <Td>{rsvp.message || '-'}</Td>
                  <Td>{formatDate(rsvp.createdAt)}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan="5" style={{ textAlign: 'center' }}>Nenhuma confirmação de presença encontrada.</Td>
              </Tr>
            )}
          </tbody>
        </Table>
        
        {totalPages > 1 && (
          <Pagination>
            <PageButton 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              Anterior
            </PageButton>
            
            {[...Array(totalPages).keys()].map(number => (
              <PageButton
                key={number + 1}
                active={currentPage === number + 1}
                onClick={() => paginate(number + 1)}
              >
                {number + 1}
              </PageButton>
            ))}
            
            <PageButton 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              Próxima
            </PageButton>
          </Pagination>
        )}
      </Content>
    </RSVPContainer>
  );
};

export default RSVP;
