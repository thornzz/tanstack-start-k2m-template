import { createServerFn } from '@tanstack/react-start'

// Mock user data
const mockUsers = [
    { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', role: 'Admin', status: 'Aktif' },
    { id: 2, name: 'Ayşe Demir', email: 'ayse@example.com', role: 'User', status: 'Aktif' },
    { id: 3, name: 'Mehmet Kaya', email: 'mehmet@example.com', role: 'Editor', status: 'Pasif' },
    { id: 4, name: 'Fatma Çelik', email: 'fatma@example.com', role: 'User', status: 'Aktif' },
    { id: 5, name: 'Ali Öztürk', email: 'ali@example.com', role: 'Admin', status: 'Aktif' },
]

// Server function to fetch all users
export const getUsers = createServerFn().handler(async () => {
    // Simulate server delay
    await new Promise((resolve) => setTimeout(resolve, 100))
    console.log('[Server] Fetching all users...')
    return mockUsers
})
