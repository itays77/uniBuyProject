import { useGetMyOrders } from '@/api/OrderApi';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Clock,
  Package,
  ShoppingBag,
  Loader2,
  XCircle,
} from 'lucide-react';
import { OrderStatus } from '@/types';

// Helper function to format date without date-fns
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);

  
  if (isNaN(date.getTime())) return 'N/A';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return date.toLocaleDateString('en-US', options);
};

// Type for order object
interface OrderItem {
  itemNumber: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  user: string;
  failureReason?: string;
}

const MyOrdersPage = () => {
  const { orders, isLoading } = useGetMyOrders();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign In Required</CardTitle>
              <CardDescription>
                You need to be logged in to view your orders
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-4">
              <ShoppingBag className="h-16 w-16 text-gray-400" />
            </CardContent>
            <CardContent className="flex justify-center">
              <Button onClick={() => loginWithRedirect()}>Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">No Orders Found</CardTitle>
            <CardDescription>You haven't placed any orders yet</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-4">
            <Package className="h-16 w-16 text-gray-400" />
          </CardContent>
          <CardContent className="flex justify-center">
            <Button
              onClick={() => navigate('/items')}
              className="flex items-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Orders</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            View and manage your previous orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: Order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    {order.status === OrderStatus.PAID ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Paid
                      </Badge>
                    ) : order.status === OrderStatus.FAILED ? (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center">
                        <XCircle className="h-3 w-3 mr-1" />
                        Failed
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/order-confirmation/${order._id}`)
                      }
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyOrdersPage;
