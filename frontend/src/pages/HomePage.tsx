
import { useNavigate } from 'react-router-dom';
import { useGetAllItems } from '@/api/ItemApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, ShoppingBag } from 'lucide-react';
import CollectionCarousel from '@/components/CollectionCarousel';

const HomePage = () => {
  const navigate = useNavigate();
  const { items, isLoading } = useGetAllItems();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-12 md:py-16 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Football Kits Collection
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl">
            Authentic jerseys from top national teams
          </p>
          <Button size="lg" onClick={() => navigate('/items')}>
            <ShoppingBag className="mr-2 h-5 w-5" />
            Shop Collection
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Collection Carousel */}
        <CollectionCarousel
          items={items}
          isLoading={isLoading}
          hideViewDetails={true}
        />

        {/* CTA Section */}
        <Card>
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Ready to Shop?</h3>
              <p className="text-gray-600 max-w-md">
                Explore our full collection of authentic football jerseys.
              </p>
            </div>
            <Button onClick={() => navigate('/items')}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Shop Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;