<h3 align="center">idata2503-project</h3>
<p align="center">Examination project for the course IDATA2503 Mobile applications at NTNU</p>

## Useful resources

- [Use case diagram](docs/diagrams/use-cases.drawio.svg)
- [Figma wireframe](https://www.figma.com/file/bxtclztaQN2EbRWWXXD8Kh/Wireframe?type=design&node-id=0-1&mode=design)

## Showcase

## Architecture

## Contributing

### Prerequisites

- [Node.js](https://nodejs.org/)
- [PNPM](https://pnpm.io/)
- Android or iOS emulator/device ([Windows Subsystem for Android][wsa], [Android Virtual Device][avd] or similar)
- A [Supabase](https://supabase.com/) project
- A [OneSignal](https://onesignal.com/) project (optional, required for Push notifications)

Note: To use a real device you need to install [Expo Go](https://expo.dev/client)

[wsa]: https://docs.microsoft.com/en-us/windows/android/wsa/
[avd]: https://developer.android.com/studio/run/managing-avds

### Getting started

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Set environment variables in `.env` (see [`.env.example`](.env.example))
4. Start the development server with `pnpm start`
