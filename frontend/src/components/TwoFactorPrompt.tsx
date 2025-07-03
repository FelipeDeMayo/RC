import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PromptContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 5px solid ${({ theme }) => theme.colors.primary};
  padding: 1.5rem;
  margin: 2rem 0;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const PromptText = styled.p`
  margin: 0;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const PromptButton = styled(Link)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  white-space: nowrap;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const TwoFactorPrompt: React.FC = () => {
  return (
    <PromptContainer>
      <PromptText>
        Proteja sua conta. Habilite a autenticação de dois fatores.
      </PromptText>
      <PromptButton to="/profile/security">
        Habilitar Agora
      </PromptButton>
    </PromptContainer>
  );
};

export default TwoFactorPrompt;