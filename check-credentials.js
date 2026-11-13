import 'dotenv/config';
import { RoomServiceClient } from 'livekit-server-sdk';

const url = process.env.LIVEKIT_URL.replace('wss://', 'https://');
console.log('URL:', url);

const svc = new RoomServiceClient(
  url,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

svc.listRooms()
  .then((rooms) => console.log('OK: credentials are valid. Rooms:', rooms.length))
  .catch((err) => console.log('FAIL:', err.message));