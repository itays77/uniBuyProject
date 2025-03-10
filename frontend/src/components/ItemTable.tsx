import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingCart } from 'lucide-react';
import { Item } from '@/types';

interface ItemTableProps {
  items: Item[];
  isLoading: boolean;
  onAddToCart: (item: Item) => void;
  countryFlags: Record<string, string>;
}

const ItemTable = ({
  items,
  isLoading,
  onAddToCart,
  countryFlags,
}: ItemTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <Table>
          <TableCaption>
            {items.length === 0
              ? 'No items found. Try adjusting your filters.'
              : `A list of ${items.length} ${
                  items.length === 1 ? 'item' : 'items'
                }`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Item #</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Kit Type</TableHead>
              <TableHead>Season</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.itemNumber}>
                <TableCell className="font-medium">{item.itemNumber}</TableCell>
                <TableCell>
                  <div>
                    <div>{item.name}</div>
                    {item.description && (
                      <div className="text-sm text-gray-500">
                        {item.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1">
                    {countryFlags[item.country]} {item.country}
                  </span>
                </TableCell>
                <TableCell>{item.kitType}</TableCell>
                <TableCell>{item.season}</TableCell>
                <TableCell className="text-right font-medium">
                  ${item.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => onAddToCart(item)}
                    className="font-bold hover:bg-gray-200"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ItemTable;
