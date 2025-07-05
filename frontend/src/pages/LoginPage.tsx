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
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  text-align: left;
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    box-sizing: border-box;
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

const LogoImage = styled.img`
  width: 150px;
  height: auto;
  margin-bottom: 2rem;
`;

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
      <LogoImage src="/logo.png" alt="RC Fitness Logo" />
      <h2>Login</h2>

      {!isAwaiting2FA ? (
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