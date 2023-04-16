import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.prototype.frietor",
  appName: "Frietor Wallet Social",
  webDir: "build",
  bundledWebRuntime: false,
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: [
        "apple.com",
        "facebook.com",
        "gc.apple.com",
        "github.com",
        "google.com",
        "microsoft.com",
        "playgames.google.com",
        "twitter.com",
        "yahoo.com",
        "phone",
      ],
    },
  },
};

export default config;
