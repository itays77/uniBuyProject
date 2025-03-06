'use client';

import { useGetAllItems, useDeleteItem } from '@/api/ItemApi';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';
import ItemForm from '../forms/ItemForm';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, Trash2 } from 'lucide-react';

const AdminPage = () => {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    loginWithRedirect,
  } = useAuth0();
  const { items, isLoading: isItemsLoading, refetch } = useGetAllItems();
  const { deleteItem, isLoading: isDeleting } = useDeleteItem();
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      toast.error('You need to be logged in to access this page');
      loginWithRedirect();
    }
  }, [isAuthenticated, isAuthLoading, loginWithRedirect]);

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItem(id);
      toast.success('Item deleted successfully');
      refetch(); // Refresh the items list
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Item Management</CardTitle>
              <CardDescription>
                Manage your items inventory from this dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isItemsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableCaption>
                    A list of all items in your inventory.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Number</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Season</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items && items.length > 0 ? (
                      items.map((item) => (
                        <TableRow key={item.itemNumber}>
                          <TableCell className="font-medium">
                            {item.itemNumber}
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell>{item.country}</TableCell>
                          <TableCell>{item.kitType}</TableCell>
                          <TableCell>{item.season}</TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the item from your
                                    inventory.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteItem(item.itemNumber)
                                    }
                                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                  >
                                    {isDeleting ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="mr-2 h-4 w-4" />
                                    )}
                                    <span>Delete</span>
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center h-24 text-muted-foreground"
                        >
                          No items found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}

              <div className="mt-4">
                <Button onClick={() => navigate('/')} variant="outline">
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Add New Item</CardTitle>
              <CardDescription>
                Create a new item to add to your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ItemForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
