'use client';

import { useState, useEffect } from 'react';
import { useGetAllItems } from '@/api/ItemApi';
import { ItemCountry, KitType } from '@/types';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const ItemsPage = () => {
  const { items, isLoading } = useGetAllItems();
  console.log('Items from API:', items);

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

      {/* Items grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.itemNumber}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-6xl">
                  {countryFlags[item.country] || '👕'}
                </span>
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {item.kitType}
                  </span>
                </div>
                <CardDescription>
                  {countryFlags[item.country]} {item.country} • Season:{' '}
                  {item.season}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold">
                  ${item.price.toFixed(2)}
                </span>
                <Button>Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700">
            No items found
          </h2>
          <p className="text-gray-500 mt-2">
            Try adjusting your filters or check back later
          </p>
        </div>
      )}
    </div>
  );
};

export default ItemsPage;
