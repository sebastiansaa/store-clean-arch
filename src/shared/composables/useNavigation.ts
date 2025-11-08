import { useRouter } from "vue-router"
import { useNavStore } from "@/stores";


export const useNavigation = () => {

  const router = useRouter();
  const navStore = useNavStore(); // setCategory,    setCurrentSection,    toggleNavCat,

  const handleCategory = (category: string) => {
    navStore.setCategory(category);
    router.push(`/products/${category}`);
  }

  const handleSection = (section: string) => {
    navStore.setCurrentSection(section)
    switch (section) {
      case 'about':
        router.push('/about');
        break;
      case 'stores':
        router.push('/stores');
        break;
      case 'payment':
        router.push('/payment');
        break;
      case 'cart':
        router.push('/cart');
        break;
      case 'search':
        router.push('/search');
        break;
      case 'home':
        router.push('/');
        break;
      default:
        break;
    }
  }

  return {
    handleCategory,
    handleSection,

    navStore, // return este store para acceder a estado de navegación
    router  // return router por si se necesita exponer el obj router
  }
}
