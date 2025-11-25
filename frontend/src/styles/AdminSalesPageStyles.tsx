import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.surface};
  min-width: 600px; /* Garante que não quebre em telas muito pequenas */
`;

export const Th = styled.th`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 1rem;
  text-align: left;
  font-weight: 600;
`;

export const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  vertical-align: top;

  strong {
    color: ${({ theme }) => theme.colors.success};
  }
`;

export const CustomerInfo = styled.div`
  font-weight: 500;
  small {
    display: block;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 400;
  }
`;