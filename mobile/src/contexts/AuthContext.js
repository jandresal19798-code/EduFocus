import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  
  initialize: async () => {
    try {
      const [userStr, token] = await AsyncStorage.multiGet(['user', 'token']);
      if (userStr[1] && token[1]) {
        set({ user: JSON.parse(userStr[1]), token: token[1], isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
  
  login: async (userData, token) => {
    await AsyncStorage.multiSet([
      ['user', JSON.stringify(userData)],
      ['token', token]
    ]);
    set({ user: userData, token });
  },
  
  logout: async () => {
    await AsyncStorage.multiRemove(['user', 'token']);
    set({ user: null, token: null });
  },
  
  updateUser: async (updates) => {
    const newUser = { ...get().user, ...updates };
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    set({ user: newUser });
  }
}));

export default useAuthStore;
