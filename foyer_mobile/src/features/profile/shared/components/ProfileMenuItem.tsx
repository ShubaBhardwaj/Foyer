import React from "react";
import { AppListRow } from "@/components/ui";
import { ChevronRight } from "lucide-react-native";
import { useAppTheme } from "@/theme";

interface ProfileMenuItemProps {
  title: string;
  subtitle?: string;
  icon: any;
  onPress: () => void;
  divider?: boolean;
  destructive?: boolean;
}

export const ProfileMenuItem = React.memo(function ProfileMenuItem({
  title,
  subtitle,
  icon: IconComponent,
  onPress,
  divider = true,
  destructive = false,
}: ProfileMenuItemProps) {
  const theme = useAppTheme();
  const iconColor = destructive ? theme.colors.error : theme.colors.primary;

  return (
    <AppListRow
      title={title}
      subtitle={subtitle}
      leading={<IconComponent size={20} color={iconColor} />}
      trailing={<ChevronRight size={18} color={theme.colors.outline} />}
      divider={divider}
      onPress={onPress}
    />
  );
});
