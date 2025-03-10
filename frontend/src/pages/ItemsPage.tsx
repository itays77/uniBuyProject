'use client';

import { useState, useMemo } from 'react';
import { useGetAllItems } from '@/api/ItemApi';
import { useCart } from '@/context/CartContext';
import { Item } from '@/types';
import ItemFilters from '@/components/ItemFilters';
import ItemTable from '@/components/ItemTable';

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

const ItemsPage = () => {
  const { items, isLoading } = useGetAllItems();
  const { addToCart } = useCart();

  // Filter state
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedKitType, setSelectedKitType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Reset filters function
  const resetFilters = () => {
    setSelectedCountry('all');
    setSelectedKitType('all');
    setSearchTerm('');
  };

  // Filter items based on criteria
  const filteredItems = useMemo(() => {
    if (!items) return [];

    return items.filter((item) => {
      return (
        // Apply country filter
        (selectedCountry === 'all' || item.country === selectedCountry) &&
        // Apply kit type filter
        (selectedKitType === 'all' || item.kitType === selectedKitType) &&
        // Apply search term filter
        (searchTerm
          ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description &&
              item.description.toLowerCase().includes(searchTerm.toLowerCase()))
          : true)
      );
    });
  }, [items, selectedCountry, selectedKitType, searchTerm]);

  // Handle adding item to cart with proper type
  const handleAddToCart = (item: Item) => {
    addToCart(item);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Browse Items</h1>

      {/* Filters Component */}
      <ItemFilters
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        selectedKitType={selectedKitType}
        setSelectedKitType={setSelectedKitType}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        resetFilters={resetFilters}
      />

      {/* Items Table Component */}
      <ItemTable
        items={filteredItems}
        isLoading={isLoading}
        onAddToCart={handleAddToCart}
        countryFlags={countryFlags}
      />
    </div>
  );
};

export default ItemsPage;
