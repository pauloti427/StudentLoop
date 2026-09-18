type PostRecord = { id: string; name: string; avatar: string; major: string; time: string; category: string; text: string; image?: string; likes: number; liked?: boolean; saved?: boolean; comments: { name: string; text: string }[] };

const isConfigured = Boolean(process.env.DATABASE_URL);

export default function handler(_req: any, res: any) {
  res.status(200).json({
    status: 'ok',
    storage: isConfigured ? 'postgresql' : 'demo-memory',
  });
}
