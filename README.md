# Proximity Voice Chat Demo

A browser demo of **proximity voice chat**: players hear each other louder when
their characters are close, quieter when far apart, and not at all beyond a set
distance. Built with [LiveKit](https://livekit.io) (WebRTC), Node.js and Express.

Author: tomoee113 (WebRTC / voice)

## How it works

1. The browser asks the Node server for a **token** (`GET /token?name=...`).
   The server signs it with the LiveKit API secret, so the secret never reaches the browser.
2. The browser joins the LiveKit room `game-room` with that token and publishes the microphone.
3. Every 100 ms each player sends their `{x, y}` position to the room using LiveKit **data messages** (topic `pos`).
4. When a position arrives, the client calculates the distance and sets that
   player's audio volume:

   ```
   volume = 1 - distance / MAX_DIST     (0 when distance >= MAX_DIST)
   ```

## Requirements

- Node.js 20 or newer
- A LiveKit project (free LiveKit Cloud account, or your own LiveKit server)
- A microphone and headphones (headphones avoid echo)

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and fill in your values:

```bash
copy .env.example .env        # Windows
cp .env.example .env          # macOS / Linux
```

```
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
```

Optional: verify your credentials.

```bash
npm run check
```

## Run

```bash
npm start
```

Open `http://localhost:3000/index.html` in **two separate browser windows**
(side by side, not tabs), use a **different name** in each, click **Join room**
and allow the microphone.

- Move with the arrow keys.
- Blue dot = you, red dots = other players.
- The grey circle is your hearing range (`MAX_DIST`).
- Walk closer to hear louder, walk away to hear quieter.

## Project structure

```
server.js        Express server, creates LiveKit tokens
public/index.html  Client: canvas, movement, LiveKit room, distance-based volume
check-credentials.js  Checks that the LiveKit credentials in .env are valid
.env.example     Template for the environment variables
```

## Notes and limitations

- Browsers only allow the microphone on `localhost` or `https`. A deployed
  version must be served over HTTPS.
- Each player needs a unique name. LiveKit removes an older connection that
  uses the same identity.
- `/token` has no login. It is a demo; a real game must authenticate players
  before issuing tokens.
- Volume falls off linearly with distance. Other curves can be used in
  `volumeFromDistance()`.
- Positions are sent unreliably (`reliable: false`) for low latency; a lost
  packet is replaced by the next one 100 ms later.

## Using it in the game

Replace the `me` and `others` position objects in `public/index.html` with the
real player positions from the game, and keep the `volumeFromDistance()` logic.

## Security

Never commit `.env`. It holds the LiveKit API secret. Only `.env.example` is
committed.