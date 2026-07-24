import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useAppTheme } from "@/theme";

export const unstable_settings = {
  initialRouteName: "(home)",
};

export default function TabsLayout() {
  const theme = useAppTheme();

  return (
    <NativeTabs tintColor={theme.colors.primary} minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Icon
          sf={{ default: "house", selected: "house.fill" }}
          md="home"
        />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(visitors)">
        <NativeTabs.Trigger.Icon
          sf={{ default: "person.badge.clock", selected: "person.badge.clock.fill" }}
          md="badge"
        />
        <NativeTabs.Trigger.Label>Visitor</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(community)">
        <NativeTabs.Trigger.Icon
          sf={{ default: "person.3", selected: "person.3.fill" }}
          md="groups"
        />
        <NativeTabs.Trigger.Label>Community</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(facilities)">
        <NativeTabs.Trigger.Icon
          sf={{ default: "building.2", selected: "building.2.fill" }}
          md="apartment"
        />
        <NativeTabs.Trigger.Label>Facilities</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(profile)">
        <NativeTabs.Trigger.Icon
          sf={{ default: "person.crop.circle", selected: "person.crop.circle.fill" }}
          md="person"
        />
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}