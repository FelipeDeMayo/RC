import { useState, type FormEvent } from 'react';
import { toast } from 'react-toastify';
import { forgotPassword } from '../services/authService';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: calc(100vh - 70px);
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 450px;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
`;

const InfoText = styled.p`
  text-align: center;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BackLink = styled(Link)`
    display: block;
    text-align: center;
    margin-top: 1rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.9rem;
`;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await forgotPassword(email);
      toast.info(response.message); 
      setEmail('');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Ocorreu um erro ao processar o pedido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <FormWrapper>
        <Title>Redefinir Senha</Title>
        <InfoText>
          Insira o seu e-mail de registo. Se a conta existir, enviaremos um link para criar uma nova senha.
        </InfoText>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'A enviar...' : 'Enviar Link de Redefinição'}
          </Button>
        </Form>
        <BackLink to="/login">Voltar para o Login</BackLink>
      </FormWrapper>
    </PageContainer>
  );
};

export default ForgotPasswordPage;
