import React from 'react';
import { ArrowLeft, Filter, SortAsc, Plus, Minus, Star } from 'lucide-react';
import { CartItem } from '../App';

interface SearchResultsProps {
  query: string;
  category: string;
  onClearSearch: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  getItemQuantity: (id: string) => number;
  updateQuantity: (id: string, quantity: number) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ 
  query, 
  category, 
  onClearSearch,
  addToCart,
  getItemQuantity,
  updateQuantity
}) => {
  const displayTitle = query ? `Results for "${query}"` : 
                      category ? `${getCategoryName(category)}` : 
                      'Search Results';

  // Sample search results
  const searchResults = [
    {
      id: 'search-1',
      name: 'Organic Basmati Rice',
      store: 'amazon',
      rating: 4.3,
      weight: '1 kg',
      price: 150,
      originalPrice: 180,
      discount: '17% OFF',
      image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: 'search-2',
      name: 'Premium Tea Leaves',
      store: 'amazon',
      rating: 4.5,
      weight: '500 g',
      price: 120,
      originalPrice: 150,
      discount: '20% OFF',
      image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: 'search-3',
      name: 'Fresh Vegetables Mix',
      store: 'amazon',
      rating: 4.2,
      weight: '1 kg',
      price: 80,
      originalPrice: 100,
      discount: '20% OFF',
      image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: 'search-4',
      name: 'Dairy Fresh Milk',
      store: 'amazon',
      rating: 4.6,
      weight: '1 L',
      price: 50,
      originalPrice: null,
      discount: null,
      image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=200'
    }
  ];

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      store: product.store,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      weight: product.weight
    });
  };

  return (
    <div>
      <div className="px-4 py-4 bg-white border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClearSearch}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-gray-900">{displayTitle}</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md text-sm">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md text-sm">
              <SortAsc className="h-4 w-4" />
              <span>Sort</span>
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm">
          Found 50+ results • Delivering in 12-30 minutes
        </p>
      </div>
      
      <div className="px-4 py-4 pb-20">
        <div className="grid grid-cols-3 gap-2">
          {searchResults.map((product) => {
            const quantity = getItemQuantity(product.id);
            return (
              <div key={product.id} className="bg-white rounded-lg p-2 border border-gray-200">
                <div className="relative mb-2">
                  {product.discount && (
                    <div className="absolute top-1 left-1 bg-orange-500 text-white px-1 py-0.5 rounded text-xs font-bold z-10">
                      {product.discount}
                    </div>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-20 object-cover rounded-md"
                  />
                </div>
                
                <div className="mb-1">
                  <p className="text-xs text-gray-500 mb-1">{product.store}</p>
                  <h3 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                  </div>
                  <p className="text-xs text-gray-600">{product.weight}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                  
                  {quantity > 0 ? (
                    <div className="flex items-center bg-yellow-400 rounded-full text-xs">
                      <button 
                        className="p-0.5"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                      >
                        <Minus className="h-3 w-3 text-black" />
                      </button>
                      <span className="px-2 py-0.5 text-black font-bold">{quantity}</span>
                      <button 
                        className="p-0.5"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                      >
                        <Plus className="h-3 w-3 text-black" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="bg-yellow-400 text-black p-1.5 rounded-full hover:bg-yellow-500"
                      onClick={() => handleAddToCart(product)}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function getCategoryName(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'top-picks': 'Top Picks',
    'local-day': 'Local Day Deals',
    'fresh-vegetables': 'Fresh Vegetables',
    'oils-ghee': 'Oils, Ghee & Masala',
    'dairy-bread': 'Dairy, Bread & Eggs',
  };
  return categoryMap[category] || category;
}