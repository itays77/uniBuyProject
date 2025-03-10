import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ItemCountry, KitType } from '@/types';

interface ItemFiltersProps {
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  selectedKitType: string;
  setSelectedKitType: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  resetFilters: () => void;
}

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

const ItemFilters = ({
  selectedCountry,
  setSelectedCountry,
  selectedKitType,
  setSelectedKitType,
  searchTerm,
  setSearchTerm,
  resetFilters,
}: ItemFiltersProps) => {
  return (
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
      <Button variant="outline" onClick={resetFilters} className="mt-4">
        Reset Filters
      </Button>
    </div>
  );
};

export default ItemFilters;
