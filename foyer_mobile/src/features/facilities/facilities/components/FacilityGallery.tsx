import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { AppSectionHeader, Caption } from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { Image as ImageIcon } from "lucide-react-native";

export const FacilityGallery = React.memo(function FacilityGallery() {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <AppSectionHeader title="Photo Gallery" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {[1, 2, 3, 4].map((item) => (
          <View
            key={item}
            style={[
              styles.galleryItem,
              { backgroundColor: theme.colors.surfaceVariant ?? "#F5F0E8" },
            ]}
          >
            <ImageIcon size={24} color={theme.colors.outline} />
            <Caption style={{ color: theme.colors.outline, marginTop: 4 }}>
              Photo {item}
            </Caption>
          </View>
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  scrollContent: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  galleryItem: {
    width: 130,
    height: 90,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
});
