import React from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import {
  AppScreen,
  AppTextField,
  AppButton,
  AppCard,
  H1,
  Subtitle,
  Caption,
} from "@/components/ui";
import { spacing, radius, colors } from "@/theme";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { Building2, ShieldCheck, LogIn, KeyRound, ArrowRight } from "lucide-react-native";

export default function LoginScreen() {
  const {
    societyCode,
    setSocietyCode,
    showSocietyCodeScreen,
    isGoogleLoading,
    isLinkingLoading,
    handleGoogleSignIn,
    handleLinkAccount,
  } = useLogin();

  return (
    <AppScreen statusBarStyle="dark" backgroundColor={colors.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header & Branding */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Building2 size={40} color={colors.primary} />
            </View>
            <H1 style={styles.title}>Welcome to Foyer</H1>
            <Subtitle style={styles.subtitle}>
              {showSocietyCodeScreen
                ? "Enter your Society Code to link your Google account to your community."
                : "Enterprise Society Management Platform."}
            </Subtitle>
          </View>

          {showSocietyCodeScreen ? (
            /* Step 4: Enter Society Code Screen */
            <AppCard variant="elevated" style={styles.card}>
              <AppTextField
                label="Enter Society Code"
                placeholder="e.g. RgvKtk"
                value={societyCode}
                onChangeText={setSocietyCode}
                maxLength={10}
                keyboardType="default"
                autoCapitalize="characters"
                autoCorrect={false}
                leftIcon={KeyRound}
                helperText="Enter the invitation code provided by your society management."
              />

              <AppButton
                label={isLinkingLoading ? "Linking Account..." : "Continue"}
                variant="filled"
                size="lg"
                rightIcon={ArrowRight}
                loading={isLinkingLoading}
                disabled={!societyCode.trim() || isLinkingLoading}
                onPress={handleLinkAccount}
                fullWidth
                style={styles.actionButton}
              />
            </AppCard>
          ) : (
            /* Step 1: Single Authentication Button: Continue with Google */
            <View style={styles.authSection}>
              <AppButton
                label={isGoogleLoading ? "Authenticating..." : "Continue with Google"}
                variant="filled"
                size="lg"
                leftIcon={LogIn}
                loading={isGoogleLoading}
                disabled={isGoogleLoading}
                onPress={handleGoogleSignIn}
                fullWidth
              />
            </View>
          )}

          {/* Security Assurance Footer */}
          <View style={styles.footer}>
            <ShieldCheck size={18} color={colors.outline} />
            <Caption style={styles.footerText}>
              Verified Society Access • Role-Based Security Powered by Foyer
            </Caption>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    justifyContent: "center",
    minHeight: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: {
    textAlign: "center",
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    textAlign: "center",
    color: colors.outline,
    paddingHorizontal: spacing.md,
  },
  card: {
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  actionButton: {
    marginTop: spacing.lg,
  },
  authSection: {
    marginBottom: spacing.xxl,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    marginTop: "auto",
    paddingTop: spacing.lg,
  },
  footerText: {
    color: colors.outline,
  },
});

