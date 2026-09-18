import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from 'node:crypto';

const initialPosts = [
  {
    id: '1',
    name: 'Sophie Chen',
    avatar: '47',
    major: 'Design · Junior',
    time: '24 min ago',
    category: 'Campus life',
    text: 'Petition to make studying on the quad count as touching grass 🌱\nThe weather is doing its thing today. Who’s out here?',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=85',
    likes: 124,
    comments: [{ name: 'Alex Morgan', text: 'The best study spot on campus, hands down.' }, { name: 'Marcus Johnson', text: 'On my way with an iced coffee ☕' }],
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    avatar: '12',
    major: 'Computer Science · Sophomore',
    time: '48 min ago',
    category: 'Study buddies',
    text: 'Anyone else in their “I’ll start the assignment after one more song” era? 🎧\nAnyway… CS 201 study session at the library, 7pm. Bring your laptop and your emotional support coffee.',
    likes: 86,
    comments: [{ name: 'Sophie Chen', text: 'The emotional support coffee is essential.' }],
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: '44',
    major: 'Business · Senior',
    time: '1 hr ago',
    category: 'Looking for',
    text: 'Looking for a fourth roommate for next semester! A sunny apartment, a very good coffee machine, and three very average cooks. Message me if you’re interested 🏡',
    likes: 32,
    comments: [],
  },
  {
    id: '4',
    name: 'Daniel Park',
    avatar: '13',
    major: 'Music · Junior',
    time: '2 hr ago',
    category: 'Campus life',
    text: 'Our little band is playing at the student union Friday night! Come for the music, stay for the free pizza. Everyone’s welcome 🍕🎸',
    likes: 57,
    comments: [],
  },
];

const storage = new Map<string, any>(initialPosts.map((post) => [post.id, post]));

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    res.status(200).json(Array.from(storage.values()));
    return;
  }

  if (req.method === 'PUT') {
    const post = req.body;
    if (!post || typeof post !== 'object') {
      res.status(400).json({ error: 'Invalid post' });
      return;
    }

    const valid = typeof post.id === 'string' && typeof post.text === 'string' && post.text.trim().length > 0;
    if (!valid) {
      res.status(400).json({ error: 'Invalid post' });
      return;
    }

    const normalized = {
      ...post,
      id: post.id || randomUUID(),
      comments: Array.isArray(post.comments) ? post.comments : [],
      likes: Number.isFinite(post.likes) ? post.likes : 0,
    };

    storage.set(normalized.id, normalized);
    res.status(200).json(normalized);
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
