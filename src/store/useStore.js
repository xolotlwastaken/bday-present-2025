import { create } from 'zustand';

const useStore = create((set) => ({
  // Track which gifts have been collected
  collectedGifts: [],

  // Current gift being viewed
  currentGift: null,

  // Gift data - each gift has a room, photo, and message
  gifts: [
    {
      id: 'living-room',
      room: 'Living Room',
      position: [7.5, 0.5, 5],
      photo: '/placeholder-living-room.jpg',
      message: 'Happy Birthday! This is from the Living Room.',
      from: 'Your Family'
    },
    {
      id: 'bedroom-1',
      room: 'Bedroom 1',
      position: [-7.5, 0.5, 5],
      photo: '/placeholder-bedroom1.jpg',
      message: 'Wishing you all the best on your special day!',
      from: 'Your Loved Ones'
    },
    {
      id: 'bedroom-2',
      room: 'Bedroom 2',
      position: [-3, 0.5, -5],
      photo: '/placeholder-bedroom2.jpg',
      message: 'May this year bring you joy and happiness!',
      from: 'With Love'
    },
    {
      id: 'kitchen',
      room: 'Kitchen',
      position: [3, 0.5, -5],
      photo: '/placeholder-kitchen.jpg',
      message: 'Celebrating you today and always!',
      from: 'Your Family'
    },
    {
      id: 'master-bedroom',
      room: 'Master Bedroom',
      position: [0, 0.5, 2],
      photo: '/placeholder-master.jpg',
      message: 'You are loved more than you know!',
      from: 'Everyone'
    }
  ],

  // Actions
  collectGift: (giftId) => set((state) => ({
    collectedGifts: [...state.collectedGifts, giftId],
    currentGift: state.gifts.find(g => g.id === giftId)
  })),

  closeGift: () => set({ currentGift: null }),

  isGiftCollected: (giftId) => {
    const state = useStore.getState();
    return state.collectedGifts.includes(giftId);
  }
}));

export default useStore;
