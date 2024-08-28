import { faker } from '@faker-js/faker';
import { Home } from '../types';

// Create a cache to store generated homes
const homeCache: Map<string, Home> = new Map();

const generateMockHome = (baseLat?: number, baseLng?: number): Home => {
  const latitude = baseLat ?? faker.location.latitude();
  const longitude = baseLng ?? faker.location.longitude();
  return {
    id: faker.string.uuid(),
    address: faker.location.streetAddress(true),
    image: faker.image.urlLoremFlickr({ category: 'house' }),
    description: faker.lorem.paragraph(),
    latitude,
    longitude,
    price: faker.number.int({ min: 100000, max: 1000000 }),
    bedrooms: faker.number.int({ min: 1, max: 5 }),
    bathrooms: faker.number.int({ min: 1, max: 4 }),
    squareFootage: faker.number.int({ min: 500, max: 5000 }),
    isUnlocked: false
  };
};

const generateMockHomes = (count: number, baseLat?: number, baseLng?: number): void => {
  for (let i = 0; i < count; i++) {
    const home = generateMockHome(baseLat, baseLng);
    homeCache.set(home.id, home);
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  login: async (username: string, password: string): Promise<boolean> => {
    await delay(1000);
    return username === 'test' && password === 'password';
  },
  
  getHomes: async ({ page = 1, limit = 10, baseLat, baseLng }: {
    page: number;
    limit?: number;
    baseLat?: number;
    baseLng?: number;
  }): Promise<{ homes: Home[]; totalPages: number }> => {
    await delay(1000);
    const totalHomes = 100; // Simulate a total of 100 homes in the database
    const totalPages = Math.ceil(totalHomes / limit);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Generate more homes if needed
    if (homeCache.size < endIndex) {
      generateMockHomes(endIndex - homeCache.size, baseLat, baseLng);
    }
    
    const homes = Array.from(homeCache.values()).slice(startIndex, endIndex);
    return { homes, totalPages };
  },
  
  getHomeById: async (id: string): Promise<Home | null> => {
    await delay(500);
    return homeCache.get(id) || null;
  },
  
  unlockHome: async (homeId: string): Promise<boolean> => {
    await delay(1000);
    const success = Math.random() > 0.2; // 80% success rate
    if (success) {
      const home = homeCache.get(homeId);
      if (home) {
        homeCache.set(homeId, { ...home, isUnlocked: true });
      }
    }
    return success;
  },
};