import { ref } from 'vue'

const isLoggedIn = ref(false)

export function useAuth() {
  return {
    isLoggedIn,
    login: () => { isLoggedIn.value = true },
    logout: () => { isLoggedIn.value = false },
  }
}