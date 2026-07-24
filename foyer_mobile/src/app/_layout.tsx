import { Stack } from "expo-router";
import { AppProvider } from "@/providers/app-provider";
import "../global.css";

export const unstable_settings = {
  initialRouteName: "(app)",
};

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </AppProvider>
  );
}
