import { useEffect, useState } from 'react';
import { fetchAllSalesAdmin } from '../services/saleService';
import { toast } from 'react-toastify';
import {
  Container,
  Title,
  TableWrapper,
  Table,
  Th,
  Td,
  CustomerInfo
} from '../styles/AdminSalesPageStyles';

interface AdminSaleItem {
  id: number;
  quantity: number;
  product: {
    name: string;
  };
}

interface AdminSale {
  id: number;
  saleDate: string;
  totalAmount: number;
  customer: {
    name: string;
    email: string;
  };
  saleItems: AdminSaleItem[];
}

const AdminSalesPage = () => {
  const [sales, setSales] = useState<AdminSale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllSalesAdmin()
      .then((data) => setSales(data))
      .catch((error) => {
        console.error(error);
        toast.error('Erro ao carregar relatório de vendas.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Carregando relatório...</p>;

  return (
    <Container>
      <Title>Relatório de Vendas</Title>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Cliente</Th>
              <Th>Data</Th>
              <Th>Itens</Th>
              <Th>Total</Th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <Td>#{sale.id}</Td>
                <Td>
                  <CustomerInfo>
                    {sale.customer.name}
                    <small>{sale.customer.email}</small>
                  </CustomerInfo>
                </Td>
                <Td>{new Date(sale.saleDate).toLocaleDateString('pt-BR')}</Td>
                <Td>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                    {sale.saleItems.map((item) => (
                      <li key={item.id}>
                        {item.quantity}x {item.product.name}
                      </li>
                    ))}
                  </ul>
                </Td>
                <Td><strong>{sale.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></Td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <Td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                  Nenhuma venda registrada.
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default AdminSalesPage;