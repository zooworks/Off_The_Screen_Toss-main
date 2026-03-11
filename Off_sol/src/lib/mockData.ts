import { Content, Location, User } from "@/types/api";

export const mockUsers: User[] = [
    {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        provider: "local",
        profileImage: "https://placehold.co/100x100?text=User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: "USER",
        notificationEnabled: true
    }
];

export const mockContents: Content[] = [
    // 1. Korea / Drama / Romance
    {
        id: "content-1",
        title: "K-Drama Romance",
        titleEn: "K-Drama Romance",
        type: "Drama",
        thumbnailUrl: "https://placehold.co/300x400?text=K-Drama",
        description: "A popular Korean romance drama.",
        descriptionEn: "A popular Korean romance drama.",
        viewCount: 1500,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        country: "KR",
        category: ["Romance", "Culture"],
        trending: "HOT",
        isActive: true
    },
    // 2. USA / Movie / Action / Trending: POPULAR
    {
        id: "content-2",
        title: "Hollywood Action",
        titleEn: "Hollywood Action",
        type: "Drama",
        thumbnailUrl: "https://placehold.co/300x400?text=USA-Action",
        description: "Explosive action movie from USA.",
        descriptionEn: "Explosive action movie from USA.",
        viewCount: 2000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        country: "US",
        category: ["Action", "Street"],
        trending: "POPULAR",
        isActive: true
    },
    // 3. Japan / Animation / Fantasy / Trending: NEW
    {
        id: "content-3",
        title: "Japan Anime",
        titleEn: "Japan Anime",
        type: "Drama",
        thumbnailUrl: "https://placehold.co/300x400?text=Anime",
        description: "Beautiful fantasy animation.",
        descriptionEn: "Beautiful fantasy animation.",
        viewCount: 800,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        country: "JP",
        category: ["Animation", "Culture"],
        trending: "NEW",
        isActive: true
    },
    // 4. Korea / Reality / Food
    {
        id: "content-4",
        title: "Korean Food Tour",
        titleEn: "Korean Food Tour",
        type: "Reality",
        thumbnailUrl: "https://placehold.co/300x400?text=K-Food",
        description: "Reality show about Korean food.",
        descriptionEn: "Reality show about Korean food.",
        viewCount: 1200,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        country: "KR",
        category: ["Food", "Travel"],
        trending: null,
        isActive: true
    },
    // 5. China / Documentary / Nature
    {
        id: "content-5",
        title: "China Nature Doc",
        titleEn: "China Nature Doc",
        type: "Documentary",
        thumbnailUrl: "https://placehold.co/300x400?text=Nature-Doc",
        description: "Documentary about China's nature.",
        descriptionEn: "Documentary about China's nature.",
        viewCount: 500,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        country: "CN",
        category: ["Nature", "Landmark"],
        trending: null,
        isActive: true
    },
    // 6. USA / Reality / Music
    {
        id: "content-6",
        title: "USA Talent Show",
        titleEn: "USA Talent Show",
        type: "Reality",
        thumbnailUrl: "https://placehold.co/300x400?text=Talent-Show",
        description: "Music talent show.",
        descriptionEn: "Music talent show.",
        viewCount: 3000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        country: "US",
        category: ["Music", "Culture"],
        trending: "HOT",
        isActive: true
    },
    // 7. Mixed / Travel / Street
    {
        id: "content-7",
        title: "World Travel",
        titleEn: "World Travel",
        type: "Documentary",
        thumbnailUrl: "https://placehold.co/300x400?text=Travel",
        description: "Travelling around the world.",
        descriptionEn: "Travelling around the world.",
        viewCount: 900,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        country: "US",
        category: ["Street", "Travel"], // Mapped to 'travel' or 'DOCUMENTARY' filters often? Frontend logic says 'travel' maps to DOCUMENTARY type filter, but separate category filter? 
        // Frontend 'travel' filter maps to type=DOCUMENTARY. 
        // Let's add explicit categories matching filter modal options: Food, Culture, Nature, Street, Landmark.
        trending: "new",
        isActive: true
    },
    // 8. Drama & Food (Cross category)
    {
        id: "content-8",
        title: "Midnight Diner",
        titleEn: "Midnight Diner",
        type: "Drama", // Matches Drama filter
        thumbnailUrl: "https://placehold.co/300x400?text=Diner",
        description: "Drama happening in a diner.",
        descriptionEn: "Drama happening in a diner.",
        viewCount: 200,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        country: "JP",
        category: ["Food", "Culture"], // Matches Food and Culture filters
        trending: null,
        isActive: true
    }
];

export const mockLocations: Location[] = [
    {
        id: "loc-1",
        name: "Mock Location 1",
        address: "123 Mock St, Mock City",
        latitude: 37.5665,
        longitude: 126.9780,
        thumbnailUrl: "https://placehold.co/400x300?text=Location1",
        description: "Mock location description",
        viewCount: 50,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contentId: "content-1",
        isChef: false,
        isOffTheScreen: true,
        onScreen: "Scene description",
        openingHours: "09:00 - 18:00",
        price: "10,000 KRW",
        accessibility: true,
        parking: "Available",
        rating: 4.5,
        reviewCount: 10,
        isActive: true,
        ownerDescription: "Owner desc",
        owner: "mock-owner-id"
    },
    {
        id: "loc-2",
        name: "Mock Location 2",
        address: "456 Mock Ave, Mock Town",
        latitude: 37.5665,
        longitude: 126.9790,
        thumbnailUrl: "https://placehold.co/400x300?text=Location2",
        description: "Another mock location",
        viewCount: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contentId: "content-1",
        rating: 4.0,
        reviewCount: 5,
        isActive: true,
        isChef: false,
        isOffTheScreen: false,
        accessibility: false,
        owner: "mock-owner-id",
        openingHours: "10:00 - 22:00",
        price: "Free",
        parking: "No Parking",
        ownerDescription: "Owner desc",
        onScreen: "Scene desc"
    },
    {
        id: "loc-3",
        name: "Mock Location 3",
        address: "789 Mock Blvd, Mock Village",
        latitude: 37.5665,
        longitude: 126.9800,
        thumbnailUrl: "https://placehold.co/400x300?text=Location3",
        description: "Third mock location",
        viewCount: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contentId: "content-1",
        rating: 3.5,
        reviewCount: 2,
        isActive: true,
        isChef: false,
        isOffTheScreen: false,
        accessibility: true,
        owner: "mock-owner-id",
        openingHours: "09:00 - 18:00",
        price: "5,000 KRW",
        parking: "Valet",
        ownerDescription: "Owner desc",
        onScreen: "Scene desc"
    },
    {
        id: "loc-4",
        name: "Mock Location 4",
        address: "101 Mock Lane, Mock City",
        latitude: 37.5665,
        longitude: 126.9810,
        thumbnailUrl: "https://placehold.co/400x300?text=Location4",
        description: "Fourth mock location",
        viewCount: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contentId: "content-1",
        rating: 5.0,
        reviewCount: 20,
        isActive: true,
        isChef: true,
        isOffTheScreen: true,
        accessibility: true,
        owner: "mock-owner-id",
        openingHours: "24 Hours",
        price: "Free",
        parking: "Public Parking",
        ownerDescription: "Owner desc",
        onScreen: "Scene desc"
    },
    {
        id: "loc-5",
        name: "Mock Location 5",
        address: "202 Mock Road, Mock Town",
        latitude: 37.5665,
        longitude: 126.9820,
        thumbnailUrl: "https://placehold.co/400x300?text=Location5",
        description: "Fifth mock location",
        viewCount: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contentId: "content-1",
        rating: 4.2,
        reviewCount: 8,
        isActive: true,
        isChef: false,
        isOffTheScreen: false,
        accessibility: false,
        owner: "mock-owner-id",
        openingHours: "11:00 - 21:00",
        price: "15,000 KRW",
        parking: "Street Parking",
        ownerDescription: "Owner desc",
        onScreen: "Scene desc"
    },
    {
        id: "loc-6",
        name: "Mock Location 6",
        address: "999 Mock Blvd, Mock Village",
        latitude: 37.5670,
        longitude: 126.9805,
        thumbnailUrl: "https://placehold.co/400x300?text=Location6",
        description: "Sixth mock location",
        viewCount: 22,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contentId: "content-1",
        rating: 4.8,
        reviewCount: 12,
        isActive: true,
        isChef: false,
        isOffTheScreen: true,
        accessibility: true,
        owner: "mock-owner-id",
        openingHours: "10:00 - 20:00",
        price: "Free",
        parking: "Available",
        ownerDescription: "Owner desc",
        onScreen: "Scene desc"
    }
];

export const getMockResponse = (endpoint: string, method: string, params?: any) => {
    console.log(`[MOCK API] ${method} ${endpoint}`, params);

    // Locations
    if (endpoint === '/locations' && method === 'GET') {
        return { data: mockLocations, total: mockLocations.length, limit: 10, offset: 0 };
    }
    if (endpoint.startsWith('/locations/content/') && method === 'GET') {
        return mockLocations;
    }
    if (endpoint.startsWith('/locations/') && method === 'GET') {
        // detail
        const id = endpoint.split('/').pop();
        return mockLocations.find(l => l.id === id) || mockLocations[0];
    }

    // Contents
    if (endpoint === '/contents' && method === 'GET') {
        let filtered = [...mockContents];
        const { country, type, category, trending, search } = params || {};

        if (country && country !== 'ALL') {
            filtered = filtered.filter(c => c.country === country);
        }

        if (type) {
            const types = (type as string).split(',');
            filtered = filtered.filter(c => types.includes(c.type));
        }

        if (category) {
            const cats = (category as string).split(',');
            filtered = filtered.filter(c => {
                // Mock content category is array of strings
                // Check if any of the filter categories exist in content categories
                if (Array.isArray(c.category)) {
                    return cats.some(cat => c.category.includes(cat));
                }
                // If content category is not array (some old mocks might be string), handle gracefully
                return false;
            });
        }

        if (trending) {
            filtered = filtered.filter(c => c.trending === trending);
        }

        return { data: filtered, total: filtered.length, limit: 10, offset: 0 };
    }
    if (endpoint.startsWith('/contents/') && method === 'GET') {
        const id = endpoint.split('/').pop();
        return mockContents.find(c => c.id === id) || mockContents[0];
    }

    // Auth
    if (endpoint === '/auth/me' && method === 'GET') {
        return mockUsers[0];
    }
    if (endpoint === '/auth/login/google' || endpoint === '/auth/login/kakao') {
        return { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token', user: mockUsers[0] };
    }

    // Admin Auth
    if (endpoint === '/admin/login' && method === 'POST') {
        return {
            accessToken: 'mock-admin-token',
            user: {
                id: 'admin-1',
                email: 'admin@example.com',
                name: 'Mock Admin',
                role: 'ADMIN'
            }
        };
    }

    // Admin Contents
    if (endpoint.startsWith('/admin/contents') && method === 'GET') {
        const id = endpoint.split('/').pop();
        // List
        if (id === 'contents' || endpoint.includes('?')) {
            return { data: mockContents, meta: { total: mockContents.length, page: 1, limit: 10, totalPages: 1 } };
        }
        // Detail
        return mockContents.find(c => c.id === id) || mockContents[0];
    }
    if (endpoint === '/admin/contents' && method === 'POST') {
        const newContent = { ...mockContents[0], id: `new-${Date.now()}`, ...params };
        return newContent;
    }
    if (endpoint.startsWith('/admin/contents/') && (method === 'PUT' || method === 'PATCH')) {
        const id = endpoint.split('/').pop();
        return { ...mockContents.find(c => c.id === id), ...params };
    }
    if (endpoint.startsWith('/admin/contents/') && method === 'DELETE') {
        return {};
    }

    return {};
};
