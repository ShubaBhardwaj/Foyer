import React, { useCallback, useMemo } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetTextInput as GorhomBottomSheetTextInput,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { X } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useAppTheme, spacing, radius } from "@/theme";
import { Title } from "../Typography";
import type { AppBottomSheetProps, AppBottomSheetRef } from "./types";

export const BottomSheetTextInput = GorhomBottomSheetTextInput;

export const AppBottomSheet = React.forwardRef<
  AppBottomSheetRef,
  AppBottomSheetProps
>(function AppBottomSheet(
  {
    title,
    children,
    snapPoints: customSnapPoints,
    index = 0,
    dismissOnBackdropTap = true,
    onDismiss,
    customHeader,
    scrollable = true,
    testID,
  },
  ref
) {
  const theme = useAppTheme();
  const defaultSnapPoints = useMemo(() => ["50%", "90%"], []);
  const snapPoints = customSnapPoints ?? defaultSnapPoints;

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={dismissOnBackdropTap ? "close" : "none"}
      />
    ),
    [dismissOnBackdropTap]
  );

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (typeof ref === "object" && ref?.current) {
      ref.current.dismiss();
    }
  }, [ref]);

  const ContentContainer = scrollable ? BottomSheetScrollView : BottomSheetView;

  return (
    <BottomSheetModal
      ref={ref}
      index={index}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      onDismiss={onDismiss}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{
        backgroundColor: theme.colors.surface,
        borderRadius: radius.xl,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.outline,
      }}
    >
      {customHeader ? (
        customHeader
      ) : title ? (
        <View
          style={[
            styles.header,
            { borderBottomColor: theme.colors.outline },
          ]}
        >
          <Title style={styles.headerTitle}>{title}</Title>
          <Pressable
            onPress={handleClose}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Close bottom sheet"
            style={styles.closeButton}
          >
            <X size={20} color={theme.colors.onSurfaceVariant} />
          </Pressable>
        </View>
      ) : null}

      <ContentContainer
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {children}
      </ContentContainer>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 18,
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
});
