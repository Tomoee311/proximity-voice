import 'dotenv/config';
import express from 'express';
import { AccessToken } from 'livekit-server-sdk';

const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
const PORT = process.env.PORT || 3000;
const ROOM_NAME = 'game-room';

// Stop early with a clear message if .env is not filled in
if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
  console.error('Missing LIVEKIT_URL, LIVEKIT_API_KEY or LIVEKIT_API_SECRET.');
  console.error('Copy .env.example to .env and fill in your LiveKit values.');
  process.exit(1);
}

const app = express();
app.use(express.static('public'));

// The browser asks this endpoint for a token. The secret never leaves the server.
app.get('/token', async (req, res) => {
  const name = (req.query.name || '').toString().trim();
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  try {
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, { identity: name });
    at.addGrant({ roomJoin: true, room: ROOM_NAME });
    res.json({ token: await at.toJwt(), url: LIVEKIT_URL });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'could not create token' });
  }
});

app.listen(PORT, () => {
  console.log('Server start: http://localhost:' + PORT);
});