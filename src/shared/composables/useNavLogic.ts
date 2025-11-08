import { useRouter } from 'vue-router'

export function useNavLogic() {

  const router = useRouter()

  const goHome = () => {
    router.push('/')
  }

  const goBack = () => router.back()

  const goToCart = () => router.push('/cart')

  return {

    goHome,
    goBack,
    goToCart
  }
}
