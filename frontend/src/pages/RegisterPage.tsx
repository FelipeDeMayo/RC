import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register } from '../services/authService';
import { 
  RegisterContainer, 
  FormWrapper, 
  Title, 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  Button,
  ErrorMessage
} from '../styles/RegisterPageStyles';
import styled from 'styled-components';

const PasswordRequirement = styled.li<{ met: boolean }>`
  color: ${({ met, theme }) => (met ? theme.colors.success : theme.colors.danger)};
  transition: color 0.3s;
  
  &::before {
    content: '${({ met }) => (met ? '✓' : '✗')}';
    margin-right: 0.5rem;
  }
`;

const PasswordRequirementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 1rem 0;
  font-size: 0.9rem;
`;

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const passwordRequirements = useMemo(() => [
    { rule: /.{8,}/, text: 'Pelo menos 8 caracteres' },
    { rule: /[A-Z]/, text: 'Pelo menos uma letra maiúscula' },
    { rule: /[a-z]/, text: 'Pelo menos uma letra minúscula' },
    { rule: /[0-9]/, text: 'Pelo menos um número' },
    { rule: /[^A-Za-z0-9]/, text: 'Pelo menos um caractere especial (!@#...)' },
  ], []);

  const [metRequirements, setMetRequirements] = useState<boolean[]>(Array(passwordRequirements.length).fill(false));
  const allRequirementsMet = metRequirements.every(Boolean);

  useEffect(() => {
    const newMet = passwordRequirements.map(req => req.rule.test(password));
    setMetRequirements(newMet);
  }, [password, passwordRequirements]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!allRequirementsMet) {
      setError('Sua senha não atende a todos os requisitos de segurança.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      toast.success('Conta criada com sucesso! Agora você pode fazer o login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Não foi possível criar a conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <FormWrapper>
        <Title>Criar Conta</Title>
        <Form onSubmit={handleSubmit}>
          
          <FormGroup>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </FormGroup>
          
          <PasswordRequirementsList>
            {passwordRequirements.map((req, index) => (
              <PasswordRequirement key={index} met={metRequirements[index]}>
                {req.text}
              </PasswordRequirement>
            ))}
          </PasswordRequirementsList>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
          </FormGroup>
          
          <Button type="submit" disabled={loading || !allRequirementsMet || password !== confirmPassword}>
            {loading ? 'Criando...' : 'Cadastrar'}
          </Button>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
      </FormWrapper>
    </RegisterContainer>
  );
};

export default RegisterPage;