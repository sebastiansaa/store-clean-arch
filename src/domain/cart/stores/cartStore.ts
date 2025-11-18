import type { ProductInterface } from "@/domain/products/products/interfaces";
import type { CartItem } from "@/domain/cart/interface";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const STORAGE_KEY = 'myapp_cart_v1'// clave para guardar datos en el localStorage

export const cartStore = defineStore('cartStore', () => {

  // Estado interno (privado)
  const _cartItems = ref<CartItem[]>([]);
  const _totalPrice = ref<number>(0);

  // Getters (computed)
  const cartItems = computed(() => _cartItems.value);
  const totalPrice = computed(() => _totalPrice.value);
  const count = computed(() => _cartItems.value.reduce((s, it) => s + (it.quantity || 0), 0));



  // Métodos internos (privados)
  const _loadFromStorage = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return;
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        _cartItems.value = parsed;
      }
    } catch (error) {
      console.error("Error loading cart from storage:", error);
    }
    _recomputeTotal();
  }

  const _saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_cartItems.value));
    } catch (error) {
      console.error("Error saving cart to storage:", error);
    }
  }

  const _recomputeTotal = () => {
    _totalPrice.value = _cartItems.value.reduce((total, item) => {
      const price = Number(item.product?.price ?? 0);
      return total + price * (item.quantity ?? 0);
    }, 0);
  }

  // Actions públicas
  const addToCart = (product: ProductInterface) => {
    const existingItem = _cartItems.value.find(item => item.product.id === product.id)
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      _cartItems.value.push({ product, quantity: 1 });
    }
    _recomputeTotal();
    _saveToStorage();
  }

  const removeFromCart = (id: number) => {
    const index = _cartItems.value.findIndex(item => item.product.id === id);
    //Si lo encuentra el item "(index !== -1)", lo elimina
    if (index !== -1) {
      _cartItems.value.splice(index, 1);
      _recomputeTotal();
      _saveToStorage();
    }
  }

  const updateQuantity = (id: number, quantity: number) => {
    const item = _cartItems.value.find(item => item.product.id === id);
    if (!item) return; // Si no se encuentra el item, salir
    item.quantity = Math.max(0, Math.trunc(quantity)); // Evitar cantidades negativas y decimales
    if (item.quantity === 0) {
      removeFromCart(id);
    }
    _recomputeTotal();
    _saveToStorage();
  }

  const clearCart = () => {
    _cartItems.value = [];
    _recomputeTotal();
    _saveToStorage();
  }

  //Inicializar el store cargando datos del local storage
  _loadFromStorage();

  return {
    // Getters (readonly computed)
    cartItems,
    totalPrice,
    count,
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
});
