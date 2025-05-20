import React, { useState } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  width: 100vw;
  max-width: 100%;
  padding-top: var(--header-height);
`;

const PageContent = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 60px 20px;
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

const FormContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background-color: var(--white);
  padding: 50px;
  border-radius: 5px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100px;
    height: 100px;
    background-image: url('/images/floral-corner.png');
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.2;
  }
  
  &::before {
    top: 20px;
    left: 20px;
  }
  
  &::after {
    bottom: 20px;
    right: 20px;
    transform: rotate(180deg);
  }
  
  @media (max-width: 768px) {
    padding: 30px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  font-family: var(--font-serif);
  font-size: 1.1rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 15px;
  border: 1px solid rgba(182, 149, 192, 0.3);
  border-radius: 4px;
  font-family: var(--font-sans);
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 15px;
  border: 1px solid rgba(182, 149, 192, 0.3);
  border-radius: 4px;
  font-family: var(--font-sans);
  font-size: 1rem;
  transition: border-color 0.3s ease;
  height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const FormButton = styled.button`
  background-color: var(--primary);
  color: var(--white);
  border: none;
  padding: 15px 30px;
  font-family: var(--font-sans);
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 3px;
  width: 100%;
  
  &:hover {
    background-color: var(--accent);
  }
`;

const ThankYouMessage = styled.div`
  text-align: center;
  padding: 30px;
  
  h3 {
    font-family: var(--font-serif);
    font-size: 2rem;
    margin-bottom: 20px;
    color: var(--primary);
  }
  
  p {
    font-size: 1.2rem;
    margin-bottom: 30px;
  }
`;

const ConfirmePresenca = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui seria feita a integração com o backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };
  
  return (
    <PageContainer className="confirme-presenca-page">
      <PageContent>
        <SectionTitle>Confirme sua Presença</SectionTitle>
        
        <FormContainer>
          {submitted ? (
            <ThankYouMessage>
              <h3>Obrigado!</h3>
              <p>Sua presença foi confirmada com sucesso. Estamos ansiosos para celebrar este momento especial com você!</p>
              <FormButton onClick={() => setSubmitted(false)}>Enviar outra confirmação</FormButton>
            </ThankYouMessage>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel htmlFor="name">Nome Completo</FormLabel>
                <FormInput
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="email">E-mail</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="phone">Telefone</FormLabel>
                <FormInput
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="guests">Número de Acompanhantes</FormLabel>
                <FormInput
                  type="number"
                  id="guests"
                  name="guests"
                  min="0"
                  value={formData.guests}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="message">Mensagem (opcional)</FormLabel>
                <FormTextarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                />
              </FormGroup>
              
              <FormButton type="submit">Confirmar Presença</FormButton>
            </form>
          )}
        </FormContainer>
      </PageContent>
    </PageContainer>
  );
};

export default ConfirmePresenca;
