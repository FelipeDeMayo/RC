import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

// --- Estilos ---
const LoginPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: calc(100vh - 70px);
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
  }
`;

const ForgotPasswordLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// --- Componente ---
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isAwaiting2FA, setIsAwaiting2FA] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login, loginWith2FA } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);
    if (result.success) {
      if (result.twoFactorRequired) {
        setIsAwaiting2FA(true);
      } else {
        navigate(from, { replace: true });
        toast.success('Login realizado com sucesso!');
      }
    } else {
      toast.error('Credenciais inválidas ou erro no servidor.');
    }
  };

  const handle2FASubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await loginWith2FA(twoFactorCode);
    setLoading(false);
    if (result.success) {
      navigate(from, { replace: true });
      toast.success('Login realizado com sucesso!');
    } else {
      toast.error('Código de dois fatores inválido.');
    }
  };

  return (
    <LoginPageContainer>
      <FormWrapper>
        <Title>Login</Title>
        
        {!isAwaiting2FA ? (
          <form onSubmit={handlePasswordSubmit}>
            <FormGroup>
              <label htmlFor="email">Email:</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
            </FormGroup>
            <FormGroup>
              <label htmlFor="password">Senha:</label>
              <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} />
            </FormGroup>
            <StyledButton type="submit" disabled={loading}>
              {loading ? 'A entrar...' : 'Entrar'}
            </StyledButton>
          </form>
        ) : (
          <form onSubmit={handle2FASubmit}>
            <p>Abra a sua app de autenticação e insira o código de 6 dígitos.</p>
            <FormGroup>
              <label htmlFor="2fa-code">Código de verificação:</label>
              <input id="2fa-code" type="text" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} placeholder="123456" maxLength={6} required disabled={loading} />
            </FormGroup>
            <StyledButton type="submit" disabled={loading}>
              {loading ? 'A verificar...' : 'Verificar e Entrar'}
            </StyledButton>
          </form>
        )}
        {!isAwaiting2FA && (
          <ForgotPasswordLink to="/forgot-password">
            Esqueceu a senha?
          </ForgotPasswordLink>
        )}
      </FormWrapper>
    </LoginPageContainer>
  );
};

export default LoginPage;