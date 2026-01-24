export interface MockProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  bio: string;
  interests: string[];
  avatarColor: string;
  avatarEmoji: string;
}

export const MOCK_PROFILES: MockProfile[] = [
  {
    id: '1',
    name: 'Sophie Chen',
    age: 28,
    city: 'Paris',
    bio: 'Adventure seeker and coffee enthusiast. Love exploring new places and meeting creative minds. Looking for someone to share experiences with!',
    interests: ['Travel', 'Photography', 'Coffee', 'Hiking', 'Art'],
    avatarColor: '#FF6B9D',
    avatarEmoji: '👩‍🎨',
  },
  {
    id: '2',
    name: 'Marcus Williams',
    age: 31,
    city: 'London',
    bio: 'Tech entrepreneur by day, jazz musician by night. Passionate about innovation and good conversations over wine.',
    interests: ['Music', 'Startups', 'Wine', 'Basketball', 'Reading'],
    avatarColor: '#4ECDC4',
    avatarEmoji: '🎷',
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    age: 26,
    city: 'Barcelona',
    bio: 'Yoga instructor and plant mom. Believe in mindful living and spontaneous adventures. Fluent in 4 languages!',
    interests: ['Yoga', 'Plants', 'Languages', 'Beach', 'Cooking'],
    avatarColor: '#9B59B6',
    avatarEmoji: '🧘‍♀️',
  },
];
