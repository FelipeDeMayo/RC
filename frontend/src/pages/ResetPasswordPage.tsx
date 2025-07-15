import { useState, useMemo, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '../services/authService';
import styled from 'styled-components';

// --- Estilos ---
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
  margin-bottom: 1.5rem;
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
  }
`;

const PasswordRequirement = styled.li<{ met: boolean }>`
  color: ${({ met, theme }) => (met ? theme.colors.success : theme.colors.danger)};
  font-size: 0.9rem;
  &::before {
    content: '${({ met }) => (met ? '✓' : '✗')}';
    margin-right: 0.5rem;
  }
`;

const PasswordRequirementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
`;

// --- Componente da Página ---
const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  // Lógica de validação de senha
  const passwordRequirements = useMemo(() => [
    { rule: /.{8,}/, text: 'Pelo menos 8 caracteres' },
    { rule: /[A-Z]/, text: 'Pelo menos uma letra maiúscula' },
    { rule: /[a-z]/, text: 'Pelo menos uma letra minúscula' },
    { rule: /[0-9]/, text: 'Pelo menos um número' },
    { rule: /[^A-Za-z0-9]/, text: 'Pelo menos um caractere especial' },
  ], []);

  const [metRequirements, setMetRequirements] = useState<boolean[]>(Array(passwordRequirements.length).fill(false));
  const allRequirementsMet = metRequirements.every(Boolean);

  useEffect(() => {
    const newMet = passwordRequirements.map(req => req.rule.test(password));
    setMetRequirements(newMet);
  }, [password, passwordRequirements]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!allRequirementsMet) {
      toast.error('A nova senha não atende a todos os requisitos de segurança.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }
    
    if (!token) {
        toast.error('Token de redefinição inválido ou ausente.');
        return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(password, token);
      toast.success(response.message);
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Não foi possível redefinir a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <FormWrapper>
        <Title>Crie uma Nova Senha</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <PasswordRequirementsList>
            {passwordRequirements.map((req, index) => (
              <PasswordRequirement key={index} met={metRequirements[index]}>
                {req.text}
              </PasswordRequirement>
            ))}
          </PasswordRequirementsList>
          <Input
            type="password"
            placeholder="Confirme a nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />
          <Button type="submit" disabled={loading || !allRequirementsMet || password !== confirmPassword}>
            {loading ? 'A guardar...' : 'Redefinir Senha'}
          </Button>
        </Form>
      </FormWrapper>
    </PageContainer>
  );
};

export default ResetPasswordPage;
