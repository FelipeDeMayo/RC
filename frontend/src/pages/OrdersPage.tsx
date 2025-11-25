import { useEffect, useState } from 'react';
import { fetchMyOrders } from '../services/saleService';
import { toast } from 'react-toastify';
import {
  Container,
  Title,
  OrderCard,
  OrderHeader,
  ItemList,
  Item,
  EmptyMessage
} from '../styles/OrderPageStyles';

interface SaleItem {
  id: number;
  quantity: number;
  unitPriceAtSale: number;
  product: {
    name: string;
    image?: string;
  };
}

interface Sale {
  id: number;
  saleDate: string;
  totalAmount: number;
  saleItems: SaleItem[];
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders()
      .then((data) => setOrders(data))
      .catch((error) => {
        console.error(error);
        toast.error('Erro ao carregar pedidos.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Carregando histórico...</p>;

  return (
    <Container>
      <Title>Meus Pedidos</Title>
      
      {orders.length === 0 ? (
        <EmptyMessage>Você ainda não realizou nenhuma compra.</EmptyMessage>
      ) : (
        orders.map((order) => (
          <OrderCard key={order.id}>
            <OrderHeader>
              <span>Data: {new Date(order.saleDate).toLocaleDateString('pt-BR')}</span>
              <span>Total: {order.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </OrderHeader>
            <ItemList>
              {order.saleItems.map((item) => (
                <Item key={item.id}>
                  <span>{item.quantity}x {item.product.name}</span>
                  <span>{(item.unitPriceAtSale * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </Item>
              ))}
            </ItemList>
          </OrderCard>
        ))
      )}
    </Container>
  );
};

export default OrdersPage;