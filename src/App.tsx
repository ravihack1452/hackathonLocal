import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { ProductGrid } from './components/ProductGrid';
import { LocalStores } from './components/LocalStores';
import { StoreProducts } from './components/StoreProducts';
import { SearchResults } from './components/SearchResults';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Payment } from './components/Payment';
import { OrderTracking } from './components/OrderTracking';
import { BottomCart } from './components/BottomCart';

export interface CartItem {
  id: string;
  name: string;
  store: string;
  price: number;
  originalPrice?: number;
  image: string;
  weight: string;
  quantity: number;
}

export interface SellerCart {
  sellerId: string;
  sellerName: string;
  items: CartItem[];
  deliveryTime: string;
  isWaitlisted?: boolean;
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [currentLocation, setCurrentLocation] = useState('MG Road, Bengaluru 560001');
  const [currentView, setCurrentView] = useState<'home' | 'cart' | 'checkout' | 'payment' | 'tracking'>('home');
  const [sellerCarts, setSellerCarts] = useState<SellerCart[]>([]);
  const [selectedSellerCart, setSelectedSellerCart] = useState<string>('');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [ecoFriendlyDelivery, setEcoFriendlyDelivery] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedStore('');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setSelectedStore('');
  };

  const handleStoreSelect = (storeId: string) => {
    setSelectedStore(storeId);
    setSearchQuery('');
    setSelectedCategory('');
  };

  const handleBackToHome = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStore('');
    setCurrentView('home');
  };

  const handleLocationChange = (location: string) => {
    setCurrentLocation(location);
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setSellerCarts(prev => {
      const sellerId = getSellerId(item.store);
      const existingSellerCart = prev.find(cart => cart.sellerId === sellerId);
      
      if (existingSellerCart) {
        const existingItem = existingSellerCart.items.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
          return prev.map(cart =>
            cart.sellerId === sellerId
              ? {
                  ...cart,
                  items: cart.items.map(cartItem =>
                    cartItem.id === item.id
                      ? { ...cartItem, quantity: cartItem.quantity + 1 }
                      : cartItem
                  )
                }
              : cart
          );
        } else {
          return prev.map(cart =>
            cart.sellerId === sellerId
              ? { ...cart, items: [...cart.items, { ...item, quantity: 1 }] }
              : cart
          );
        }
      } else {
        return [...prev, {
          sellerId,
          sellerName: item.store,
          items: [{ ...item, quantity: 1 }],
          deliveryTime: getDeliveryTime(sellerId)
        }];
      }
    });
  };

  const getDeliveryTime = (sellerId: string): string => {
    const deliveryTimes: { [key: string]: string } = {
      'zara': '15-20 mins',
      'zudio': '18-25 mins',
      'mayuri-bakery': '10-15 mins',
      'nandini': '8-12 mins',
      'medplus': '20-30 mins',
      'karachi-bakery': '15-20 mins',
      'grocery-store': '12-15 mins',
      'spice-market': '14-18 mins'
    };
    return deliveryTimes[sellerId] || '15-20 mins';
  };

  const toggleWaitlist = (sellerId: string) => {
    setSellerCarts(prev => 
      prev.map(cart => 
        cart.sellerId === sellerId 
          ? { ...cart, isWaitlisted: !cart.isWaitlisted }
          : cart
      )
    );
  };
  const updateQuantity = (sellerId: string, itemId: string, quantity: number) => {
    setSellerCarts(prev => {
      return prev.map(cart => {
        if (cart.sellerId === sellerId) {
          if (quantity === 0) {
            const updatedItems = cart.items.filter(item => item.id !== itemId);
            return updatedItems.length > 0 ? { ...cart, items: updatedItems } : null;
          } else {
            return {
              ...cart,
              items: cart.items.map(item =>
                item.id === itemId ? { ...item, quantity } : item
              )
            };
          }
        }
        return cart;
      }).filter(Boolean) as SellerCart[];
    });
  };

  const getItemQuantity = (id: string) => {
    for (const cart of sellerCarts) {
      const item = cart.items.find(item => item.id === id);
      if (item) return item.quantity;
    }
    return 0;
  };

  const getTotalAmount = (sellerId?: string) => {
    if (sellerId) {
      const cart = sellerCarts.find(cart => cart.sellerId === sellerId);
      return cart ? cart.items.reduce((total, item) => total + (item.price * item.quantity), 0) : 0;
    }
    return sellerCarts.reduce((total, cart) => 
      total + cart.items.reduce((cartTotal, item) => cartTotal + (item.price * item.quantity), 0), 0
    );
  };

  const getTotalItems = () => {
    return sellerCarts.reduce((total, cart) => 
      total + cart.items.reduce((cartTotal, item) => cartTotal + item.quantity, 0), 0
    );
  };

  const getSellerId = (storeName: string): string => {
    const storeMap: { [key: string]: string } = {
      'Zara': 'zara',
      'Zudio': 'zudio',
      'Mayuri Bakery': 'mayuri-bakery',
      'Nandini Milk Parlour': 'nandini',
      'MedPlus': 'medplus',
      'Karachi Bakery': 'karachi-bakery',
      'Grocery Store': 'grocery-store',
      'Spice Market': 'spice-market'
    };
    return storeMap[storeName] || storeName.toLowerCase().replace(/\s+/g, '-');
  };

  const handleViewCart = () => {
    setCurrentView('cart');
  };

  const handleCheckout = (sellerId: string) => {
    setSelectedSellerCart(sellerId);
    setCurrentView('checkout');
  };

  const handleCheckoutAll = () => {
    setCurrentView('checkout');
  };

  const handlePayment = (checkoutData: any) => {
    setOrderDetails(checkoutData);
    setCurrentView('payment');
  };

  const handlePaymentComplete = () => {
    setCurrentView('tracking');
    // Clear the specific seller cart after successful payment
    if (selectedSellerCart) {
      setSellerCarts(prev => prev.filter(cart => cart.sellerId !== selectedSellerCart));
    }
  };

  if (currentView === 'cart') {
    return (
      <Cart
        sellerCarts={sellerCarts}
        onUpdateQuantity={updateQuantity}
        onBack={handleBackToHome}
        onCheckout={handleCheckoutAll}
        getTotalAmount={getTotalAmount}
      />
    );
  }

  if (currentView === 'checkout') {
    return (
      <Checkout
        sellerCarts={sellerCarts.filter(cart => !cart.isWaitlisted)}
        waitlistedCarts={sellerCarts.filter(cart => cart.isWaitlisted)}
        totalAmount={getTotalAmount()}
        onBack={() => setCurrentView('cart')}
        onProceedToPayment={handlePayment}
        onToggleWaitlist={toggleWaitlist}
        ecoFriendlyDelivery={ecoFriendlyDelivery}
        onToggleEcoDelivery={setEcoFriendlyDelivery}
      />
    );
  }

  if (currentView === 'payment') {
    return (
      <Payment
        orderDetails={orderDetails}
        onBack={() => setCurrentView('checkout')}
        onPaymentComplete={handlePaymentComplete}
      />
    );
  }

  if (currentView === 'tracking') {
    return (
      <OrderTracking
        orderDetails={orderDetails}
        onBackToHome={handleBackToHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={handleSearch} 
        searchQuery={searchQuery}
        currentLocation={currentLocation}
        onLocationChange={handleLocationChange}
      />
      
      {!searchQuery && !selectedCategory && !selectedStore && (
        <>
          <Hero />
          <Categories onCategorySelect={handleCategorySelect} />
          <ProductGrid 
            addToCart={addToCart}
            getItemQuantity={getItemQuantity}
            updateQuantity={(id, quantity) => {
              // Find which seller cart contains this item
              for (const cart of sellerCarts) {
                const item = cart.items.find(item => item.id === id);
                if (item) {
                  updateQuantity(cart.sellerId, id, quantity);
                  break;
                }
              }
            }}
          />
          <LocalStores 
            onStoreSelect={handleStoreSelect}
            currentLocation={currentLocation}
          />
        </>
      )}
      
      {selectedStore && (
        <StoreProducts 
          storeId={selectedStore}
          onBack={handleBackToHome}
          addToCart={addToCart}
          getItemQuantity={getItemQuantity}
          updateQuantity={(id, quantity) => {
            for (const cart of sellerCarts) {
              const item = cart.items.find(item => item.id === id);
              if (item) {
                updateQuantity(cart.sellerId, id, quantity);
                break;
              }
            }
          }}
        />
      )}
      
      {(searchQuery || selectedCategory) && !selectedStore && (
        <SearchResults 
          query={searchQuery} 
          category={selectedCategory}
          onClearSearch={handleBackToHome}
          addToCart={addToCart}
          getItemQuantity={getItemQuantity}
          updateQuantity={(id, quantity) => {
            for (const cart of sellerCarts) {
              const item = cart.items.find(item => item.id === id);
              if (item) {
                updateQuantity(cart.sellerId, id, quantity);
                break;
              }
            }
          }}
        />
      )}
      
      {getTotalItems() > 0 && currentView === 'home' && (
        <BottomCart 
          totalAmount={getTotalAmount()}
          totalItems={getTotalItems()}
          onViewCart={handleViewCart}
        />
      )}
    </div>
  );
}

export default App;