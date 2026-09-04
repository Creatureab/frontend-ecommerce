'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    router.push('/checkout');
  };

  const handleRemoveItem = (productId: string) => {
    if (confirm('Are you sure you want to remove this item?')) {
      removeFromCart(productId);
    }
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.push('/')}>
              ← Back to Products
            </Button>
            <h1 className="text-2xl font-bold">Shopping Cart ({cartCount} items)</h1>
          </div>
        </div>
      </header>

      {/* Cart Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cart.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Button onClick={() => router.push('/')}>Continue Shopping</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.product.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-24 h-24 object-cover rounded"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.product.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.product.category?.name ?? "Uncategorized"}</p>
                        <p className="text-lg font-bold">${item.product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center border rounded">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="px-3 py-1">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.countInStock}
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveItem(item.product.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="w-full"
              >
                Clear Cart
              </Button>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-semibold">${(cartTotal * 0.1).toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${(cartTotal * 1.1).toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/')}
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
