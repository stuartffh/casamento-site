import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DashboardContainer = styled.div`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: var(--cor-branco);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--cor-primaria-escura);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: var(--cor-texto);
  font-size: 1rem;
`;

const RecentActivity = styled.div`
  background-color: var(--cor-branco);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const ActivityTitle = styled.h3`
  color: var(--cor-primaria-escura);
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ActivityItem = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid var(--cor-borda);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityDate = styled.span`
  font-size: 0.9rem;
  color: #777;
  margin-left: 0.5rem;
`;

const Dashboard = () => {
  const [stats, setStats] = useState({
    rsvps: 0,
    presentes: 0,
    fotos: 0
  });
  const [recentRSVPs, setRecentRSVPs] = useState([]);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Em um caso real, teríamos endpoints específicos para estatísticas
        // Aqui estamos simulando com os endpoints existentes
        
        const rsvpsResponse = await axios.get('http://localhost:3001/api/rsvp', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const presentesResponse = await axios.get('http://localhost:3001/api/presentes');
        
        const albumResponse = await axios.get('http://localhost:3001/api/album');
        
        // Calcular total de fotos em todas as galerias
        let totalFotos = 0;
        if (albumResponse.data) {
          Object.values(albumResponse.data).forEach(gallery => {
            totalFotos += gallery.length;
          });
        }
        
        setStats({
          rsvps: rsvpsResponse.data.length,
          presentes: presentesResponse.data.length,
          fotos: totalFotos
        });
        
        // Pegar os 5 RSVPs mais recentes
        if (rsvpsResponse.data.length > 0) {
          const sorted = [...rsvpsResponse.data].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setRecentRSVPs(sorted.slice(0, 5));
        }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }
    };
    
    fetchStats();
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  return (
    <DashboardContainer>
      <Sidebar>
        <Logo>
          <h1>
            Marília <span>&</span> Iago
          </h1>
        </Logo>
        
        <NavMenu>
          <NavItem>
            <NavLink to="/admin" className="active">Dashboard</NavLink>
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
          <PageTitle>Dashboard</PageTitle>
          <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
        </Header>
        
        <StatsGrid>
          <StatCard>
            <StatValue>{stats.rsvps}</StatValue>
            <StatLabel>Confirmações de Presença</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.presentes}</StatValue>
            <StatLabel>Presentes Cadastrados</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.fotos}</StatValue>
            <StatLabel>Fotos no Álbum</StatLabel>
          </StatCard>
        </StatsGrid>
        
        <RecentActivity>
          <ActivityTitle>Confirmações Recentes</ActivityTitle>
          
          <ActivityList>
            {recentRSVPs.length > 0 ? (
              recentRSVPs.map((rsvp, index) => (
                <ActivityItem key={index}>
                  {rsvp.name} confirmou presença
                  {rsvp.companions > 0 && ` com ${rsvp.companions} acompanhante(s)`}
                  <ActivityDate>{formatDate(rsvp.createdAt)}</ActivityDate>
                </ActivityItem>
              ))
            ) : (
              <ActivityItem>Nenhuma confirmação de presença ainda.</ActivityItem>
            )}
          </ActivityList>
        </RecentActivity>
      </Content>
    </DashboardContainer>
  );
};

export default Dashboard;
