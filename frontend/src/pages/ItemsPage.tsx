'use client';

import { useState } from 'react';
import { useGetAllItems } from '@/api/ItemApi';
import { useCart } from '@/context/CartContext';
import { Item, ItemCountry, KitType } from '@/types';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2, ShoppingCart } from 'lucide-react';

const ItemsPage = () => {
  const { items, isLoading } = useGetAllItems();
  const { addToCart } = useCart();

  // Filter state
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedKitType, setSelectedKitType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter items based on criteria
  const filteredItems = items
    ? items.filter((item) => {
        return (
          // Apply country filter
          (selectedCountry === 'all' || item.country === selectedCountry) &&
          // Apply kit type filter
          (selectedKitType === 'all' || item.kitType === selectedKitType) &&
          // Apply search term filter
          (searchTerm
            ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (item.description &&
                item.description
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()))
            : true)
        );
      })
    : [];

  // Mapping of countries to flag emojis for visual display
  const countryFlags: Record<string, string> = {
    England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    Spain: '🇪🇸',
    Germany: '🇩🇪',
    Italy: '🇮🇹',
    Brazil: '🇧🇷',
    Argentina: '🇦🇷',
    France: '🇫🇷',
    Portugal: '🇵🇹',
    Netherlands: '🇳🇱',
    Belgium: '🇧🇪',
    Israel: '🇮🇱',
  };

  // Handle adding item to cart with proper type
  const handleAddToCart = (item: Item) => {
    addToCart(item);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Browse Items</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Filter Items</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search
            </label>
            <Input
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description..."
            />
          </div>

          {/* Country filter */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Country
            </label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {Object.values(ItemCountry).map((country) => (
                  <SelectItem key={country} value={country}>
                    {countryFlags[country]} {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Kit type filter */}
          <div>
            <label
              htmlFor="kitType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Kit Type
            </label>
            <Select value={selectedKitType} onValueChange={setSelectedKitType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.values(KitType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reset filters button */}
        <Button
          variant="outline"
          onClick={() => {
            setSelectedCountry('all');
            setSelectedKitType('all');
            setSearchTerm('');
          }}
          className="mt-4"
        >
          Reset Filters
        </Button>
      </div>

      {/* Items table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableCaption>
              {filteredItems.length === 0
                ? 'No items found. Try adjusting your filters.'
                : `A list of ${filteredItems.length} ${
                    filteredItems.length === 1 ? 'item' : 'items'
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
              {filteredItems.map((item) => (
                <TableRow key={item.itemNumber}>
                  <TableCell className="font-medium">
                    {item.itemNumber}
                  </TableCell>
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
                      onClick={() => handleAddToCart(item)}
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
        </div>
      )}
    </div>
  );
};

export default ItemsPage;
