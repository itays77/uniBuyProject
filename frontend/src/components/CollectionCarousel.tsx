import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Item } from '@/types';

interface CollectionCarouselProps {
  items: Item[] | undefined;
  isLoading: boolean;
  title?: string;
  hideViewDetails?: boolean;
}

const CollectionCarousel = ({
  items,
  isLoading,
  title = 'Our Collection',
  hideViewDetails = false,
}: CollectionCarouselProps) => {
  const navigate = useNavigate();

  // State for carousel
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const [displayedItems, setDisplayedItems] = useState<Item[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  // Update carousel when items are loaded
  useEffect(() => {
    if (items && items.length > 0) {
      setTotalPages(Math.ceil(items.length / itemsPerPage));
      updateDisplayedItems(0);
    }
  }, [items]);

  // Function to update displayed items based on current page
  const updateDisplayedItems = (page: number) => {
    if (!items) return;

    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedItems(items.slice(startIndex, endIndex));
  };

  // Handle previous slide
  const handlePrevSlide = () => {
    const newPage = currentPage > 0 ? currentPage - 1 : totalPages - 1;
    setCurrentPage(newPage);
    updateDisplayedItems(newPage);
  };

  // Handle next slide
  const handleNextSlide = () => {
    const newPage = currentPage < totalPages - 1 ? currentPage + 1 : 0;
    setCurrentPage(newPage);
    updateDisplayedItems(newPage);
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{title}</h2>
        <div className="flex space-x-2 items-center">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={handlePrevSlide}
            disabled={isLoading || !items?.length}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>

          {/* Page indicator */}
          {totalPages > 1 && (
            <div className="text-sm text-gray-500">
              {currentPage + 1}/{totalPages}
            </div>
          )}

          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={handleNextSlide}
            disabled={isLoading || !items?.length}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedItems.map((item) => (
            <Card key={item.itemNumber} className="overflow-hidden">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <div className="text-6xl font-bold text-gray-400">
                  {item.country.slice(0, 2)}
                </div>
              </div>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>
                  {item.country} • {item.kitType} • {item.season}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${item.price.toFixed(2)}</p>
              </CardContent>
              {!hideViewDetails && (
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/items/${item.itemNumber}`)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionCarousel;
