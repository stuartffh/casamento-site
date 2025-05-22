import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
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
  Table,
  Th,
  Td,
  Tr,
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


const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  
  h3 {
    font-size: 1rem;
    color: var(--accent);
    margin-bottom: 10px;
  }
  
  p {
    font-size: 1.8rem;
    font-weight: bold;
    color: var(--primary);
  }
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterSelect = styled.select`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: var(--accent);
`;

const ErrorContainer = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const NoDataContainer = styled.div`
  text-align: center;
  padding: 40px 0;
  color: var(--accent);
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 5px;
  
  button {
    padding: 8px 12px;
    border: 1px solid #ddd;
    background-color: white;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: #f5f5f5;
    }
    
    &.active {
      background-color: var(--primary);
      color: white;
      border-color: var(--primary);
    }
    
    &:disabled {
      background-color: #f5f5f5;
      color: #aaa;
      cursor: not-allowed;
    }
  }
`;

const AdminVendas = () => {
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalAmount: 0,
    salesByMethod: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [salesResponse, statsResponse] = await Promise.all([
        axios.get('http://localhost:3001/api/sales', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:3001/api/sales/stats/summary', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setSales(salesResponse.data);
      setStats(statsResponse.data);
      setError('');
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
      setError('Não foi possível carregar as vendas. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchSales();
  }, [fetchSales]);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'mercadopago':
        return 'Mercado Pago';
      case 'pix':
        return 'PIX';
      default:
        return method;
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };
  
  // Filtrar vendas
  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sale.customerEmail && sale.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sale.present && sale.present.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <Pagination>
        <button 
          onClick={() => paginate(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          &laquo;
        </button>
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}
        
        <button 
          onClick={() => paginate(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          &raquo;
        </button>
      </Pagination>
    );
  };
  
  if (loading) {
    return (
      <AdminContainer>
        <PageTitle>Vendas</PageTitle>
        <LoadingContainer>Carregando vendas...</LoadingContainer>
      </AdminContainer>
    );
  }
  
  if (error) {
    return (
      <AdminContainer>
        <PageTitle>Vendas</PageTitle>
        <ErrorContainer>{error}</ErrorContainer>
      </AdminContainer>
    );
  }
  
  return (
    <AdminContainer>
      <StatsContainer>
        <StatCard>
          <h3>Total de Vendas</h3>
          <p>{stats.totalSales}</p>
        </StatCard>
        <StatCard>
          <h3>Valor Total</h3>
          <p>{formatCurrency(stats.totalAmount)}</p>
        </StatCard>
        {stats.salesByMethod.map((method) => (
          <StatCard key={method.paymentMethod}>
            <h3>Vendas via {getPaymentMethodLabel(method.paymentMethod)}</h3>
            <p>{method._count.id}</p>
          </StatCard>
        ))}
      </StatsContainer>
      
      <FilterContainer>
        <SearchInput 
          type="text" 
          placeholder="Buscar por nome, email ou presente..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <FilterSelect 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos os status</option>
          <option value="paid">Pagos</option>
          <option value="pending">Pendentes</option>
          <option value="cancelled">Cancelados</option>
        </FilterSelect>
      </FilterContainer>
      
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th>Presente</th>
              <th>Valor</th>
              <th>Método</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((sale) => (
                <tr key={sale.id}>
                  <td>{formatDate(sale.createdAt)}</td>
                  <td>
                    {sale.customerName}
                    {sale.customerEmail && <div><small>{sale.customerEmail}</small></div>}
                  </td>
                  <td>{sale.present ? sale.present.name : 'Produto não encontrado'}</td>
                  <td>{formatCurrency(sale.amount)}</td>
                  <td>{getPaymentMethodLabel(sale.paymentMethod)}</td>
                  <td>
                    <span className={`status ${sale.status}`}>
                      {getStatusLabel(sale.status)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  <NoDataContainer>
                    Nenhuma venda encontrada com os filtros atuais.
                  </NoDataContainer>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableContainer>
      
      {renderPagination()}
    </AdminContainer>
  );
};

export default AdminVendas;
