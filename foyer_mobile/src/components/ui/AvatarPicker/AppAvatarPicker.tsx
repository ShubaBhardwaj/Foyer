import React, { useState, useCallback } from "react";
import { View, Pressable, ActivityIndicator, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { Camera } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useAppTheme, radius, opacity, fontFamily } from "@/theme";
import { Body } from "../Typography";
import type { AppAvatarPickerProps } from "./types";

export const AppAvatarPicker = React.memo(function AppAvatarPicker({
  source: externalSource,
  onImagePicked,
  initials = "U",
  size = 96,
  loading = false,
  disabled = false,
  accessibilityLabel = "Avatar photo picker",
  testID,
}: AppAvatarPickerProps) {
  const theme = useAppTheme();
  const [localUri, setLocalUri] = useState<string | null>(null);

  const imageUri =
    localUri ??
    (typeof externalSource === "string"
      ? externalSource
      : (externalSource as any)?.uri);

  const pickImageFromLibrary = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access photo library was denied."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      const uri = result.assets[0].uri;
      setLocalUri(uri);
      onImagePicked?.(uri);
    }
  }, [onImagePicked]);

  const takePhotoWithCamera = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access camera was denied."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      const uri = result.assets[0].uri;
      setLocalUri(uri);
      onImagePicked?.(uri);
    }
  }, [onImagePicked]);

  const handlePress = useCallback(() => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Alert.alert(
      "Select Photo",
      "Choose a photo source",
      [
        { text: "Camera", onPress: takePhotoWithCamera },
        { text: "Photo Library", onPress: pickImageFromLibrary },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  }, [disabled, loading, takePhotoWithCamera, pickImageFromLibrary]);

  const editBadgeSize = Math.max(28, Math.round(size * 0.3));

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          opacity: disabled ? opacity.disabled : 1,
        },
      ]}
    >
      <View
        style={[
          styles.previewCircle,
          {
            width: size,
            height: size,
            borderRadius: radius.full,
            backgroundColor: theme.colors.primaryContainer,
          },
        ]}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={[
              styles.image,
              {
                width: size,
                height: size,
                borderRadius: radius.full,
              },
            ]}
            contentFit="cover"
          />
        ) : (
          <Body
            style={{
              fontSize: size * 0.35,
              fontFamily: fontFamily.bold,
              color: theme.colors.onPrimaryContainer,
            }}
          >
            {initials.toUpperCase().slice(0, 2)}
          </Body>
        )}

        {loading && (
          <View
            style={[
              styles.loadingOverlay,
              { borderRadius: radius.full },
            ]}
          >
            <ActivityIndicator size="small" color={theme.colors.onPrimary} />
          </View>
        )}
      </View>

      {/* Edit Camera Icon Badge */}
      {!loading && (
        <View
          style={[
            styles.badge,
            {
              width: editBadgeSize,
              height: editBadgeSize,
              borderRadius: radius.full,
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.surface,
            },
          ]}
        >
          <Camera size={editBadgeSize * 0.55} color={theme.colors.onPrimary} />
        </View>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  previewCircle: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    position: "absolute",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
