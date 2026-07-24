import React, { useRef, useMemo, useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Text, Card, TextInput, useTheme } from "react-native-paper";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { FlashList } from "@shopify/flash-list";
import QRCode from "react-native-qrcode-svg";
import LottieView from "lottie-react-native";
import Toast from "react-native-toast-message";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import { ShieldCheck, Sparkles, QrCode as QrIcon, Heart, Zap, Layers } from "lucide-react-native";

import { useAppForm } from "@/hooks/use-app-form";
import { z } from "@/lib/form";
import { useAuthStore } from "@/store/use-auth-store";

// Inline lightweight checkmark animation for Lottie verification
const sampleLottieData = {
  v: "5.5.7",
  fr: 60,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Checkmark",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Shape",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              ks: {
                a: 0,
                k: {
                  i: [[0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0]],
                  v: [[-20, 0], [-5, 15], [20, -15]],
                  c: false,
                },
              },
            },
            {
              ty: "st",
              c: { a: 0, k: [0, 0.4, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 8 },
              lc: 2,
              lj: 2,
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
    },
  ],
};

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface ListDataItem {
  id: string;
  name: string;
  tag: string;
}

const mockFlashListData: ListDataItem[] = [
  { id: "1", name: "Expo SDK 55 Engine", tag: "Core" },
  { id: "2", name: "React Native Reanimated 4", tag: "Animation" },
  { id: "3", name: "Gorhom Bottom Sheet v5", tag: "UI" },
  { id: "4", name: "Shopify FlashList", tag: "Performance" },
];

export function DemoShowcase() {
  const theme = useTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["45%"], []);

  const { user } = useAuthStore();

  // React Query status verification
  const { data: healthData } = useQuery({
    queryKey: ["app-health"],
    queryFn: async () => {
      return { status: "Operational", sdk: "Expo SDK 55" };
    },
  });

  // Reanimated shared values
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressAnimate = () => {
    scale.value = withSequence(
      withTiming(1.15, { duration: 150 }),
      withSpring(1, { damping: 6 })
    );
  };

  // Gesture Handler gesture
  const tapGesture = Gesture.Tap().onEnd(() => {
    scale.value = withSequence(withTiming(0.9, { duration: 100 }), withSpring(1));
  });

  // React Hook Form + Zod
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm(formSchema, {
    defaultValues: { title: "" },
  });

  const onSubmit = (data: FormValues) => {
    Toast.show({
      type: "success",
      text1: "Form Submitted!",
      text2: `Valid title: ${data.title}`,
    });
    reset();
  };

  const handleOpenSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.rowBetween}>
            <View style={styles.rowGap}>
              <ShieldCheck color={theme.colors.primary} size={28} />
              <View>
                <Text variant="titleMedium" style={styles.boldText}>
                  Expo SDK 55 Suite
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                  System Health: {healthData?.status ?? "Loading..."}
                </Text>
              </View>
            </View>
            <Zap color="#EAB308" size={24} />
          </View>

          <Text variant="bodyMedium" style={styles.marginTop}>
            Welcome, <Text style={{ fontWeight: "700" }}>{user?.name}</Text>
          </Text>
        </Card.Content>
      </Card>

      {/* Expo Image & Blur Card */}
      <Card style={styles.card}>
        <Card.Title title="Expo Image & Blur View" left={() => <Sparkles size={20} color={theme.colors.primary} />} />
        <Card.Content>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: "https://picsum.photos/seed/expo55/600/300" }}
              style={styles.image}
              contentFit="cover"
              transition={300}
            />
            <BlurView intensity={60} tint="dark" style={styles.blurOverlay}>
              <Text variant="labelLarge" style={styles.whiteText}>
                Expo Blur Overlay
              </Text>
            </BlurView>
          </View>
        </Card.Content>
      </Card>

      {/* Reanimated & Gesture Handler & Lottie & QR */}
      <Card style={styles.card}>
        <Card.Title title="Reanimated, QR Code & Lottie" left={() => <QrIcon size={20} color={theme.colors.primary} />} />
        <Card.Content>
          <View style={styles.rowAround}>
            <GestureDetector gesture={tapGesture}>
              <Animated.View style={[styles.interactiveBox, animatedStyle]}>
                <QRCode value="https://expo.dev" size={80} color={theme.colors.onSurface} backgroundColor="transparent" />
                <Text variant="labelSmall" style={styles.marginTopSmall}>
                  Tap to Animate
                </Text>
              </Animated.View>
            </GestureDetector>

            <View style={styles.interactiveBox}>
              <LottieView
                source={sampleLottieData}
                autoPlay
                loop
                style={styles.lottie}
              />
              <Text variant="labelSmall" style={styles.marginTopSmall}>
                Lottie Animation
              </Text>
            </View>
          </View>

          <Button mode="contained-tonal" onPress={handlePressAnimate} style={styles.marginTop}>
            Trigger Reanimated Spring
          </Button>
        </Card.Content>
      </Card>

      {/* React Hook Form + Zod */}
      <Card style={styles.card}>
        <Card.Title title="React Hook Form + Zod" left={() => <Heart size={20} color={theme.colors.primary} />} />
        <Card.Content>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Feature Title"
                mode="outlined"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.title}
              />
            )}
          />
          {errors.title && (
            <Text variant="bodySmall" style={{ color: theme.colors.error, marginTop: 4 }}>
              {errors.title.message}
            </Text>
          )}

          <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.marginTop}>
            Submit Form
          </Button>
        </Card.Content>
      </Card>

      {/* FlashList Verification */}
      <Card style={styles.card}>
        <Card.Title title="Shopify FlashList" left={() => <Layers size={20} color={theme.colors.primary} />} />
        <Card.Content>
          <View style={styles.flashListHeight}>
            <FlashList
              data={mockFlashListData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text variant="bodyMedium" style={styles.boldText}>
                    {item.name}
                  </Text>
                  <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
                    {item.tag}
                  </Text>
                </View>
              )}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Bottom Sheet & Toast Actions */}
      <Card style={styles.card}>
        <Card.Title title="Bottom Sheet & Toast Actions" />
        <Card.Content style={styles.columnGap}>
          <Button mode="outlined" onPress={handleOpenSheet}>
            Open Gorhom Bottom Sheet
          </Button>
          <Button
            mode="contained"
            onPress={() =>
              Toast.show({
                type: "info",
                text1: "Toast Notification",
                text2: "Global Toast component configured successfully!",
              })
            }
          >
            Show Global Toast
          </Button>
        </Card.Content>
      </Card>

      {/* Gorhom Bottom Sheet Modal */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Text variant="titleLarge" style={styles.boldText}>
            Gorhom Bottom Sheet v5
          </Text>
          <Text variant="bodyMedium" style={styles.marginTop}>
            Configured with GestureHandlerRootView & BottomSheetModalProvider in AppProvider.
          </Text>
          <Button
            mode="contained"
            onPress={() => bottomSheetModalRef.current?.dismiss()}
            style={styles.marginTopLarge}
          >
            Close Sheet
          </Button>
        </BottomSheetView>
      </BottomSheetModal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    borderRadius: 12,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowAround: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  rowGap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  boldText: {
    fontWeight: "700",
  },
  marginTop: {
    marginTop: 12,
  },
  marginTopSmall: {
    marginTop: 6,
  },
  marginTopLarge: {
    marginTop: 24,
  },
  imageContainer: {
    height: 160,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  blurOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  whiteText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  interactiveBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  lottie: {
    width: 80,
    height: 80,
  },
  flashListHeight: {
    height: 200,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E2E8F0",
  },
  columnGap: {
    gap: 12,
  },
  sheetContent: {
    flex: 1,
    padding: 24,
    alignItems: "center",
  },
});
