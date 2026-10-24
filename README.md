# AI Quizmaster

An AI-assisted quiz application built with React, Vite, TypeScript, and Google's Gemini API.

## Tech stack

- React 19
- Vite 6
- TypeScript
- Google GenAI SDK
- Recharts

## Run locally

**Prerequisites:** Node.js and npm.

1. Clone the repository and enter the project directory.
   ```bash
   git clone https://github.com/pkrRepo00/v4.ai-quizmaster.git
   cd v4.ai-quizmaster
   ```
2. Install dependencies.
   ```bash
   npm install
   ```
3. Create a local `.env.local` file in the project root:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the development server.
   ```bash
   npm run dev
   ```
5. Open the local URL printed by Vite.

## Available scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |

## Security notes

- Never commit your API key or place it directly in source code.
- The repository's `.gitignore` excludes `*.local` files, including `.env.local`.
- For public production deployments, verify that the Gemini API key is not exposed in client-side bundles. Consider routing API calls through a server-side endpoint.

## Contributing

Issues with clear reproduction steps and focused pull requests are welcome. Include relevant setup details when changing configuration.

## License

See the repository's [LICENSE](LICENSE) file.
