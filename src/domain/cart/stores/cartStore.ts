import type { ProductInterface } from "@/domain/products/products/interfaces";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const STORAGE_KEY = 'myapp_cart_v1'// clave para guardar datos en el localStorage

export const cartStore = defineStore('cartStore', () => {

  const cartItems = ref<{ product: ProductInterface; quantity: number }[]>([]);
  const totalPrice = ref<number>(0);

  // Contador total de items en el carrito
  const count = computed(() => cartItems.value.reduce((s, it) => s + (it.quantity || 0), 0));



  //cargar el local storage
  const LoadFromStorage = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return;
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        cartItems.value = parsed;
      }
    } catch (error) {
      console.error("Error loading cart from storage:", error);
    }
    recomputeTotal();
  }

  //guardar en el local storage
  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems.value));
    } catch (error) {
      console.error("Error saving cart to storage:", error);
    }
  }

  //calcular el total del carrito
  const recomputeTotal = () => {
    totalPrice.value = cartItems.value.reduce((total, item) => {
      const price = Number(item.product?.price ?? 0);
      return total + price * (item.quantity ?? 0);
    }, 0);

  }

  const addToCart = (product: ProductInterface) => {
    const existingItem = cartItems.value.find(item => item.product.id === product.id)
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.value.push({ product, quantity: 1 });
    }
    recomputeTotal();
    saveToStorage();
  }

  const removeFromCart = (id: number) => {
    const index = cartItems.value.findIndex(item => item.product.id === id);
    //Si lo encuentra el item "(index !== -1)", lo elimina
    if (index !== -1) {
      cartItems.value.splice(index, 1);
      recomputeTotal();
      saveToStorage();
    }
  }

  const updateQuantity = (id: number, quantity: number) => {
    const item = cartItems.value.find(item => item.product.id === id);
    if (!item) return; // Si no se encuentra el item, salir
    item.quantity = Math.max(0, Math.trunc(quantity)); // Evitar cantidades negativas y decimales
    if (item.quantity === 0) {
      removeFromCart(id);
    }
    recomputeTotal();
    saveToStorage();
  }

  const clearCart = () => {
    cartItems.value = [];
    recomputeTotal();
    saveToStorage();
  }

  //Inicializar el store cargando datos del local storage
  LoadFromStorage();

  return {
    cartItems,
    totalPrice,
    count,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
});
