## 📦 Installation

1. **Clone the repository** (or navigate to the project folder).
2. **Install dependencies**:
   ```bash
   npm install
   ```

## 🏃 Running the Project

To start the development server:

```bash
npx expo start
```

- **Android**: Press `a` to open in the Android Emulator.
- **iOS**: Press `i` to open in the iOS Simulator (macOS only).
- **Physical Device**: Scan the QR code with the **Expo Go** app.

## 🔐 Demonstration & Testing

### Authentication Flow
- By default, transaction amounts are **masked** (`***.**`).
- Tap the **"Reveal All"** button in the header or the **eye icon** next to any transaction to authenticate.
- If your device/emulator supports biometrics, you will see a system prompt.
- **PIN Fallback**: If biometrics fail or are not set up, a 6-digit keypad will appear.
  - **Demo PIN**: `123456` (You can change it in /services/authService.ts in line 49 DEMO_PIN)

### Fetch Data
- *Note: There is a small intentional chance of a simulated "network error" to demonstrate error handling UI. You can change the probability in /services/mockData.ts in line 75. (default 0.05)*