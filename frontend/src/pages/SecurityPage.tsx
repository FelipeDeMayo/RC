
import { useState, type FormEvent } from 'react';
import QRCode from 'qrcode';
import { generateTwoFactorSecret, verifyTwoFactor } from '../services/authService';
import { toast } from 'react-toastify';
import styled from 'styled-components';

// --- Estilos para a página ---
const SecurityContainer = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: 2rem auto;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: ${({ theme }) => theme.colors.text};
`;

const QRCodeWrapper = styled.div`
  display: flex;
  justify-content: center; /* Centraliza horizontalmente */
  padding: 1.5rem 0;      /* Adiciona um espaçamento vertical bonito */
`;

const StyledButton = styled.button`
    padding: 0.6rem 1.2rem;
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${({ theme }) => theme.colors.primaryHover};
    }
`;

const SecretCode = styled.code`
  background: ${({ theme }) => theme.colors.background};
  padding: 8px;
  border-radius: 4px;
  display: block;
  margin: 0.5rem 0;
  font-family: monospace;
  word-break: break-all;
`;

const StyledInput = styled.input`
  padding: 0.5rem;
  margin-right: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
`;


// --- Componente da Página ---
const SecurityPage = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [setupSecret, setSetupSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSetupVisible, setIsSetupVisible] = useState(false);

  const handleEnable2FA = async () => {
    try {
      const { otpauth, secret } = await generateTwoFactorSecret();
      const imageUrl = await QRCode.toDataURL(otpauth);

      setQrCodeUrl(imageUrl);
      setSetupSecret(secret);
      setIsSetupVisible(true);
    } catch (error) {
      toast.error('Não foi possível iniciar a configuração do 2FA.');
    }
  };

  const handleVerify2FA = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await verifyTwoFactor(verificationCode);
      toast.success('Autenticação de dois fatores habilitada com sucesso!');

      setIsSetupVisible(false);
      setQrCodeUrl('');
      setVerificationCode('');
    } catch (error) {
      toast.error('Código de verificação inválido. Tente novamente.');
    }
  };

  return (
    <SecurityContainer>
      <h2>Segurança da Conta</h2>
      <p style={{color: 'grey', marginBottom: '1rem'}}>Autenticação de Dois Fatores (2FA)</p>

      {!isSetupVisible ? (
        <div>
            <p>Proteja sua conta com uma camada extra de segurança usando um aplicativo autenticador.</p>
            <StyledButton onClick={handleEnable2FA} style={{marginTop: '1rem'}}>
              Habilitar 2FA
            </StyledButton>
        </div>
      ) : (
        <div>
          <h3>Configure seu App Autenticador</h3>
          <p>1. Escaneie o QR Code abaixo com seu app (Google Authenticator, Authy, etc.).</p>
          <QRCodeWrapper>
          {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code para 2FA" style={{ border: '5px solid white', borderRadius: '8px' }} />}
          </QRCodeWrapper>

          <p>Se não puder escanear, insira este código manualmente:</p>
          <SecretCode>{setupSecret}</SecretCode>

          <form onSubmit={handleVerify2FA} style={{ marginTop: '2rem' }}>
            <p>3. Para finalizar, insira o código de 6 dígitos gerado pelo seu app.</p>
            <StyledInput
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Código de 6 dígitos"
              maxLength={6}
              required
            />
            <StyledButton type="submit">Verificar e Ativar</StyledButton>
          </form>
        </div>
      )}
    </SecurityContainer>
  );
};

export default SecurityPage;