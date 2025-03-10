import { Item } from '@/types';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get all items (public)
export const useGetAllItems = () => {
  const getAllItemsRequest = async (): Promise<Item[]> => {
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }

    return response.json();
  };

  const {
    data: items,
    isLoading,
    error,
    refetch,
  } = useQuery('fetchAllItems', getAllItemsRequest);

  if (error) {
    toast.error(error.toString());
  }

  return { items, isLoading, refetch };
};

// Get item by ID (public)
export const useGetItemById = (id: string) => {
  const getItemByIdRequest = async (): Promise<Item> => {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch item');
    }

    return response.json();
  };

  const {
    data: item,
    isLoading,
    error,
  } = useQuery(['fetchItem', id], getItemByIdRequest);

  if (error) {
    toast.error(error.toString());
  }

  return { item, isLoading };
};

// Create a new item (protected)
export const useCreateItem = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createItemRequest = async (item: Omit<Item, '_id' | 'itemNumber'>) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error('Failed to create item');
    }

    return response.json();
  };

  const {
    mutateAsync: createItem,
    isLoading,
    isError,
    isSuccess,
  } = useMutation(createItemRequest);

  return {
    createItem,
    isLoading,
    isError,
    isSuccess,
  };
};

// Update an item (protected)
export const useUpdateItem = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateItemRequest = async ({
    id,
    item,
  }: {
    id: string;
    item: Partial<Item>;
  }) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error('Failed to update item');
    }

    return response.json();
  };

  const {
    mutateAsync: updateItem,
    isLoading,
    isError,
    isSuccess,
  } = useMutation(updateItemRequest);

  return {
    updateItem,
    isLoading,
    isError,
    isSuccess,
  };
};

// Delete an item (protected)
export const useDeleteItem = () => {
  const { getAccessTokenSilently } = useAuth0();

  const deleteItemRequest = async (id: string) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete item');
    }

    return response.json();
  };

  const {
    mutateAsync: deleteItem,
    isLoading,
    isError,
    isSuccess,
  } = useMutation(deleteItemRequest);

  return {
    deleteItem,
    isLoading,
    isError,
    isSuccess,
  };
};
