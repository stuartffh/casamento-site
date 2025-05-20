import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ConfirmePresencaContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--cor-primaria-escura);
  text-align: center;
  margin-bottom: 2rem;
`;

const FormContainer = styled.div`
  background-color: var(--cor-branco);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
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
  width: 100%;
  padding: 1rem;
  background-color: var(--cor-primaria-escura);
  color: var(--cor-branco);
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
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
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ErrorMessage = styled.div`
  background-color: var(--cor-erro);
  color: var(--cor-branco);
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ConfirmePresenca = () => {
  const [formData, setFormData] = useState({
    name: '',
    companions: 0,
    email: '',
    phone: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      setSubmitError('Por favor, informe seu nome.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await axios.post('http://localhost:3001/api/rsvp', formData);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        companions: 0,
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Erro ao enviar RSVP:', error);
      setSubmitError('Ocorreu um erro ao confirmar sua presença. Por favor, tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ConfirmePresencaContainer>
      <PageTitle>Confirme sua Presença</PageTitle>
      
      <FormContainer>
        {submitSuccess && (
          <SuccessMessage>
            Sua presença foi confirmada com sucesso! Estamos ansiosos para celebrar com você.
          </SuccessMessage>
        )}
        
        {submitError && (
          <ErrorMessage>
            {submitError}
          </ErrorMessage>
        )}
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="companions">Número de Acompanhantes</Label>
            <Input
              type="number"
              id="companions"
              name="companions"
              min="0"
              value={formData.companions}
              onChange={handleChange}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">E-mail</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="message">Mensagem para os Noivos</Label>
            <TextArea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Confirmar Presença'}
          </SubmitButton>
        </form>
      </FormContainer>
    </ConfirmePresencaContainer>
  );
};

export default ConfirmePresenca;
