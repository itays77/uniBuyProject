import { Order } from '@/types';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type CreateOrderRequest = {
  items: {
    itemNumber: string;
    quantity: number;
  }[];
};

type CreateCheckoutSessionRequest = {
  orderId: string;
  customerEmail?: string;
};

type CheckoutSessionResponse = {
  sessionToken: string;
  sessionId: string;
  shortLink?: string;  
  checkoutUrl?: string; 
  fallbackMode?: boolean; 
};

// Create a new order
export const useCreateOrder = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createOrderRequest = async (data: CreateOrderRequest) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create order');
    }

    return response.json();
  };

  const {
    mutateAsync: createOrder,
    isLoading,
    isError,
    isSuccess,
  } = useMutation(createOrderRequest);

  return {
    createOrder,
    isLoading,
    isError,
    isSuccess,
  };
};

export const useCreateCheckoutSession = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createCheckoutSessionRequest = async (
    data: CreateCheckoutSessionRequest
  ): Promise<CheckoutSessionResponse> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(
      `${API_BASE_URL}/api/orders/checkout/create-checkout-session`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create checkout session');
    }

    return response.json();
  };

  const {
    mutateAsync: createCheckoutSession,
    isLoading,
    isError,
    isSuccess,
  } = useMutation(createCheckoutSessionRequest);

  return {
    createCheckoutSession,
    isLoading,
    isError,
    isSuccess,
  };
};

// Get all orders for the current user
export const useGetMyOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyOrdersRequest = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  };

  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useQuery('fetchMyOrders', getMyOrdersRequest);

  if (error) {
    toast.error(error.toString());
  }

  return { orders, isLoading, refetch };
};

// Get a specific order by ID
export const useGetOrderById = (id: string) => {
  const { getAccessTokenSilently } = useAuth0();

  const getOrderByIdRequest = async (): Promise<Order> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch order');
    }

    return response.json();
  };

  const {
    data: order,
    isLoading,
    error,
  } = useQuery(['fetchOrder', id], getOrderByIdRequest);

  if (error) {
    toast.error(error.toString());
  }

  return { order, isLoading };
};
