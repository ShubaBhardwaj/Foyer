import React from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import {
  AppScreen,
  AppTextField,
  AppButton,
  AppCard,
  H1,
  Subtitle,
  Body,
  Caption,
} from "@/components/ui";
import { spacing, radius, colors } from "@/theme";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { Building2, CheckCircle2, ShieldCheck, LogIn, KeyRound } from "lucide-react-native";

export default function LoginScreen() {
  const {
    societyCode,
    setSocietyCode,
    isValidatingCode,
    validatedSociety,
    isGoogleLoading,
    handleValidateCode,
    handleGoogleSignIn,
  } = useLogin();

  const isSocietyValid = !!validatedSociety && validatedSociety.valid;

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
              Enter your 6-character Society Invitation Code to join your residential community.
            </Subtitle>
          </View>

          {/* Form Card */}
          <AppCard variant="elevated" style={styles.card}>
            <AppTextField
              label="Society Invitation Code"
              placeholder="e.g. RgvKtk"
              value={societyCode}
              onChangeText={setSocietyCode}
              maxLength={6}
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={KeyRound}
              helperText="Enter the 6-character code provided by your society management."
            />

            <AppButton
              label={isValidatingCode ? "Validating Code..." : "Validate Society Code"}
              variant="tonal"
              size="md"
              loading={isValidatingCode}
              disabled={societyCode.trim().length < 6 || isValidatingCode}
              onPress={() => handleValidateCode()}
              style={styles.validateButton}
            />

            {/* Validation Banner / Badge */}
            {isSocietyValid && validatedSociety && (
              <View style={styles.societyBadge}>
                <CheckCircle2 size={24} color="#3A7D44" />
                <View style={styles.societyBadgeText}>
                  <Caption style={styles.joiningLabel}>Joining Community</Caption>
                  <Body style={styles.societyNameText}>
                    {validatedSociety.societyName || "Green Valley Residency"}
                  </Body>
                </View>
              </View>
            )}
          </AppCard>

          {/* Authentication Section */}
          <View style={styles.authSection}>
            <AppButton
              label={isGoogleLoading ? "Signing in with Google..." : "Continue with Google"}
              variant="filled"
              size="lg"
              leftIcon={LogIn}
              loading={isGoogleLoading}
              disabled={!isSocietyValid || isGoogleLoading}
              onPress={handleGoogleSignIn}
              fullWidth
            />

            {!isSocietyValid && (
              <Caption style={styles.disabledNote}>
                Validate your 6-character society code above to enable Google Sign In.
              </Caption>
            )}
          </View>

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
  validateButton: {
    marginTop: spacing.md,
  },
  societyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D4EDDA",
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  societyBadgeText: {
    flex: 1,
  },
  joiningLabel: {
    color: "#1E3A24",
    fontWeight: "500",
  },
  societyNameText: {
    color: "#1E3A24",
    fontWeight: "700",
  },
  authSection: {
    marginBottom: spacing.xxl,
  },
  disabledNote: {
    textAlign: "center",
    color: colors.outline,
    marginTop: spacing.sm,
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
