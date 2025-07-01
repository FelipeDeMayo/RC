import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components'; 

const LoginPageContainer = styled.div`
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  
  // Novo estado para controlar qual formulário mostrar
  const [isAwaiting2FA, setIsAwaiting2FA] = useState(false);

  const [loading, setLoading] = useState(false);
  const { login, loginWith2FA } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  // Função para lidar com o envio de email e senha
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Agora chamamos a função 'login' do nosso contexto
    const result = await login({ email, password });

    setLoading(false);
    if (result.success) {
      if (result.twoFactorRequired) {
        // Se o backend pedir o 2FA, mudamos o estado para mostrar o outro form
        setIsAwaiting2FA(true);
      } else {
        // Se não, é um login normal e bem-sucedido
        navigate(from, { replace: true });
        toast.success('Login realizado com sucesso!');
      }
    } else {
      toast.error('Credenciais inválidas ou erro no servidor.');
    }
  };

  // Nova função para lidar com o envio do código de 6 dígitos
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
      <h2>Login</h2>
      
      {/* Aqui está a renderização condicional */}
      {!isAwaiting2FA ? (
        // FORMULÁRIO 1: Email e Senha
        <form onSubmit={handlePasswordSubmit}>
          <FormGroup>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="password">Senha:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </FormGroup>
          <StyledButton type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </StyledButton>
        </form>
      ) : (
        // FORMULÁRIO 2: Código 2FA
        <form onSubmit={handle2FASubmit}>
          <p>Abra seu app autenticador e insira o código de 6 dígitos.</p>
          <FormGroup>
            <label htmlFor="2fa-code">Código de verificação:</label>
            <input
              id="2fa-code"
              type="text"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              required
              disabled={loading}
            />
          </FormGroup>
          <StyledButton type="submit" disabled={loading}>
            {loading ? 'Verificando...' : 'Verificar e Entrar'}
          </StyledButton>
        </form>
      )}
    </LoginPageContainer>
  );
};

export default LoginPage;