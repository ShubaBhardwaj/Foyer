import React, { useState, useRef, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import {
  H1,
  H2,
  Title,
  Subtitle,
  Body,
  Caption,
  Label,
  AppButton,
  AppIconButton,
  AppCard,
  AppAvatar,
  AppBadge,
  AppStatusPill,
  AppChip,
  AppDivider,
  AppTextField,
  AppSearchBar,
  AppSectionHeader,
  AppLoader,
  AppScreen,
  AppListRow,
  AppBottomSheet,
  BottomSheetTextInput,
  AppBottomSheetRef,
  AppDialog,
  AppEmptyState,
  AppSegmentedControl,
  AppOtpInput,
  AppAvatarPicker,
} from "@/components/ui";
import {
  Bell,
  Heart,
  Plus,
  Trash2,
  User,
  CheckCircle,
  AlertTriangle,
  Info,
  ShieldAlert,
  Settings,
  Mail,
  Lock,
  Filter,
} from "lucide-react-native";
import Toast from "react-native-toast-message";

export default function DesignSystemScreen() {
  // State for interactive component demos
  const [selectedSegment, setSelectedSegment] = useState("all");
  const [chipSelected, setChipSelected] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [otpMasked, setOtpMasked] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);

  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  const handleOpenSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleConfirmDialog = useCallback(() => {
    setDialogLoading(true);
    setTimeout(() => {
      setDialogLoading(false);
      setDialogVisible(false);
      Toast.show({
        type: "success",
        text1: "Action Confirmed",
        text2: "Dialog confirm action completed successfully",
      });
    }, 1500);
  }, []);

  return (
    <AppScreen scrollable style={styles.screen}>
      <H1 style={styles.mainTitle}>Foyer Design System</H1>
      <Body style={styles.mainSubtitle}>
        Production-grade Material 3 Design System — 21 Reusable UI Components
      </Body>

      <AppDivider spacing={16} />

      {/* 1. Typography Scale */}
      <AppSectionHeader
        title="1. Typography Scale"
        subtitle="Plus Jakarta Sans geometric font scale"
      />
      <View style={styles.sectionCard}>
        <H1>H1 Heading (28pt Bold)</H1>
        <H2>H2 Heading (24pt Bold)</H2>
        <Title>Title Text (20pt SemiBold)</Title>
        <Subtitle>Subtitle Text (16pt SemiBold)</Subtitle>
        <Body>Body Text (14pt Regular) — Primary text across screens.</Body>
        <Caption>Caption Text (12pt Regular) — Helper messages and metadata.</Caption>
        <Label>Label Text (12pt Medium) — Badges and buttons.</Label>
      </View>

      {/* 2. Buttons */}
      <AppSectionHeader
        title="2. Buttons (<AppButton />)"
        subtitle="5 variants, 3 sizes, icon slots, loading/disabled & haptics"
      />
      <View style={styles.sectionCard}>
        <Subtitle>Variants (Medium Size)</Subtitle>
        <View style={styles.rowWrap}>
          <AppButton label="Filled" variant="filled" leftIcon={Plus} />
          <AppButton label="Tonal" variant="tonal" leftIcon={Bell} />
          <AppButton label="Outlined" variant="outlined" leftIcon={Settings} />
          <AppButton label="Text" variant="text" />
          <AppButton label="Danger" variant="danger" leftIcon={Trash2} />
        </View>

        <Subtitle style={styles.subHeader}>Sizes & States</Subtitle>
        <View style={styles.rowWrap}>
          <AppButton label="Small" size="sm" variant="filled" />
          <AppButton label="Medium" size="md" variant="filled" />
          <AppButton label="Large" size="lg" variant="filled" />
          <AppButton label="Loading" variant="filled" loading />
          <AppButton label="Disabled" variant="filled" disabled />
        </View>
      </View>

      {/* 3. Icon Buttons */}
      <AppSectionHeader
        title="3. Icon Buttons (<AppIconButton />)"
        subtitle="4 sizes (32, 40, 48, 56dp), 3 variants"
      />
      <View style={styles.sectionCard}>
        <View style={styles.rowWrap}>
          <AppIconButton icon={Heart} variant="filled" size={32} accessibilityLabel="Like" />
          <AppIconButton icon={Bell} variant="tonal" size={40} accessibilityLabel="Notifications" />
          <AppIconButton icon={Settings} variant="outlined" size={48} accessibilityLabel="Settings" />
          <AppIconButton icon={User} variant="filled" size={56} accessibilityLabel="User Profile" />
        </View>
      </View>

      {/* 4. Cards */}
      <AppSectionHeader
        title="4. Cards (<AppCard />)"
        subtitle="Elevated, outlined, filled variants with optional press animation"
      />
      <View style={styles.columnGap}>
        <AppCard variant="elevated" onPress={() => Toast.show({ text1: "Card Pressed" })}>
          <Title>Elevated Card (Interactive)</Title>
          <Body style={styles.cardBody}>Tap to trigger scale animation & haptics.</Body>
        </AppCard>

        <AppCard variant="outlined">
          <Title>Outlined Card</Title>
          <Body style={styles.cardBody}>Clean border for secondary content.</Body>
        </AppCard>

        <AppCard variant="filled">
          <Title>Filled Card</Title>
          <Body style={styles.cardBody}>Subtle container fill tone.</Body>
        </AppCard>
      </View>

      {/* 5. Avatars */}
      <AppSectionHeader
        title="5. Avatars (<AppAvatar />)"
        subtitle="Image, initials, and icon modes across 4 sizes"
      />
      <View style={styles.sectionCard}>
        <View style={styles.rowWrap}>
          <AppAvatar mode="initials" initials="SB" size="sm" />
          <AppAvatar mode="initials" initials="JD" size="md" />
          <AppAvatar mode="icon" icon={User} size="lg" />
          <AppAvatar mode="initials" initials="FY" size="xl" />
        </View>
      </View>

      {/* 6. Badge vs 7. StatusPill */}
      <AppSectionHeader
        title="6. Badge vs 7. StatusPill"
        subtitle="Generic UI Labels (Badge) vs Domain Entity Status (StatusPill)"
      />
      <View style={styles.sectionCard}>
        <Subtitle>Badges (Generic UI Labels - Counts, Tags, Categories)</Subtitle>
        <View style={styles.rowWrap}>
          <AppBadge label="Success" status="success" icon={CheckCircle} />
          <AppBadge label="Warning" status="warning" icon={AlertTriangle} />
          <AppBadge label="Error" status="error" icon={ShieldAlert} />
          <AppBadge label="Info" status="info" icon={Info} />
          <AppBadge label="New Notice" status="neutral" />
        </View>

        <Subtitle style={styles.subHeader}>
          StatusPills (Domain Entity Status - Requests, Complaints, Bookings)
        </Subtitle>
        <View style={styles.rowWrap}>
          <AppStatusPill status="pending" label="Visitor Pending" />
          <AppStatusPill status="approved" label="Approved Gate Pass" />
          <AppStatusPill status="rejected" label="Complaint Rejected" />
          <AppStatusPill status="neutral" label="Expired" />
        </View>
        <Subtitle style={styles.subHeader}>Compact StatusPills (Dot Only)</Subtitle>
        <View style={styles.rowWrap}>
          <AppStatusPill status="pending" variant="compact" />
          <AppStatusPill status="approved" variant="compact" />
          <AppStatusPill status="rejected" variant="compact" />
        </View>
      </View>

      {/* 8. Chips */}
      <AppSectionHeader
        title="8. Chips (<AppChip />)"
        subtitle="Filter, suggestion, input modes with leading & trailing icons"
      />
      <View style={styles.sectionCard}>
        <View style={styles.rowWrap}>
          <AppChip
            label="Filter Chip"
            mode="filter"
            leadingIcon={Filter}
            selected={chipSelected}
            onPress={() => setChipSelected(!chipSelected)}
          />
          <AppChip
            label="Suggestion"
            mode="suggestion"
            onPress={() => Toast.show({ text1: "Suggestion Selected" })}
          />
          <AppChip
            label="Input Tag"
            mode="input"
            trailingIcon={Trash2}
            onTrailingIconPress={() => Toast.show({ text1: "Tag Removed" })}
          />
        </View>
      </View>

      {/* 9. Segmented Control */}
      <AppSectionHeader
        title="9. Segmented Control (<AppSegmentedControl />)"
        subtitle="2–4 segments with Reanimated spring animated indicator"
      />
      <View style={styles.sectionCard}>
        <AppSegmentedControl
          value={selectedSegment}
          onChange={setSelectedSegment}
          segments={[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
          ]}
        />
      </View>

      {/* 10. Divider */}
      <AppSectionHeader
        title="10. Divider (<AppDivider />)"
        subtitle="Horizontal & vertical orientation"
      />
      <View style={styles.sectionCard}>
        <Body>Text block above divider</Body>
        <AppDivider spacing={12} />
        <Body>Text block below divider</Body>
      </View>

      {/* 11. Search Bar */}
      <AppSectionHeader
        title="11. Search Bar (<AppSearchBar />)"
        subtitle="Custom debounced search bar (300ms default) with clear button"
      />
      <View style={styles.sectionCard}>
        <AppSearchBar
          placeholder="Search residents, visitors, complaints..."
          onDebouncedChange={(text) => setSearchQuery(text)}
        />
        <Caption style={styles.searchOutput}>
          Debounced Search Result: &quot;{searchQuery}&quot;
        </Caption>
      </View>

      {/* 12. Text Fields */}
      <AppSectionHeader
        title="12. Text Fields (<AppTextField />)"
        subtitle="Paper TextInput wrapper with error validation, helper text, and password toggle"
      />
      <View style={styles.columnGap}>
        <AppTextField
          label="Full Name"
          placeholder="Enter resident name"
          leftIcon={User}
          helperText="Enter your official society registered name"
        />
        <AppTextField
          label="Email Address"
          placeholder="email@foyer.app"
          leftIcon={Mail}
          errorMessage="Invalid email address format"
        />
        <AppTextField
          label="Password"
          placeholder="••••••••"
          leftIcon={Lock}
          isPassword
        />
      </View>

      {/* 13. Loaders & Skeletons */}
      <AppSectionHeader
        title="13. Loaders & Skeletons (<AppLoader />)"
        subtitle="Inline, animated skeletons for list rows, cards, and avatars"
      />
      <View style={styles.sectionCard}>
        <Subtitle>Inline Loader</Subtitle>
        <AppLoader mode="inline" size="large" />

        <Subtitle style={styles.subHeader}>List Row Skeleton</Subtitle>
        <AppLoader mode="skeleton" skeletonVariant="list-row" />

        <Subtitle style={styles.subHeader}>Card Skeleton</Subtitle>
        <AppLoader mode="skeleton" skeletonVariant="card" />
      </View>

      {/* 14. List Rows */}
      <AppSectionHeader
        title="14. List Rows (<AppListRow />)"
        subtitle="High-leverage FlashList rows for residents, guards, visitors, and complaints"
      />
      <View style={styles.sectionCardPaddingNone}>
        <AppListRow
          title="Shubham Bhardwaj"
          subtitle="Tower A - Flat 402 • Resident Owner"
          leading={<AppAvatar mode="initials" initials="SB" size="md" />}
          trailing={<AppStatusPill status="approved" label="Resident" />}
          showChevron
          onPress={() => Toast.show({ text1: "Selected Resident" })}
        />
        <AppListRow
          title="Delivery Executive — Amazon"
          subtitle="Gate Pass #8492 • Arrived 12:45 PM"
          leading={<AppAvatar mode="icon" icon={User} size="md" />}
          trailing={<AppStatusPill status="pending" label="Pending Gate" />}
          showChevron
          onPress={() => Toast.show({ text1: "Selected Visitor Pass" })}
        />
      </View>

      {/* 15. OTP Input */}
      <AppSectionHeader
        title="15. OTP / PIN Input (<AppOtpInput />)"
        subtitle="6-digit entry, paste support, masked PIN mode, error handling"
      />
      <View style={styles.sectionCard}>
        <AppOtpInput
          length={6}
          value={otpCode}
          onChange={setOtpCode}
          masked={otpMasked}
          error={otpError ? "Incorrect verification code entered" : undefined}
          onComplete={(code) =>
            Toast.show({
              type: "success",
              text1: "OTP Entered",
              text2: `Code: ${code}`,
            })
          }
        />

        <View style={[styles.rowWrap, { marginTop: 16 }]}>
          <AppButton
            label={otpMasked ? "Unmask PIN" : "Mask PIN"}
            variant="outlined"
            size="sm"
            onPress={() => setOtpMasked(!otpMasked)}
          />
          <AppButton
            label={otpError ? "Clear Error" : "Trigger Error"}
            variant="danger"
            size="sm"
            onPress={() => setOtpError(!otpError)}
          />
        </View>
      </View>

      {/* 16. Avatar Picker */}
      <AppSectionHeader
        title="16. Avatar Photo Picker (<AppAvatarPicker />)"
        subtitle="Expo Image Picker (Camera / Library) with camera badge overlay"
      />
      <View style={styles.sectionCardCenter}>
        <AppAvatarPicker
          source={avatarUri}
          onImagePicked={(uri) => setAvatarUri(uri)}
          size={100}
        />
        <Caption style={{ marginTop: 8 }}>Tap circle to take or select photo</Caption>
      </View>

      {/* 17. Empty State */}
      <AppSectionHeader
        title="17. Empty State (<AppEmptyState />)"
        subtitle="Illustration/icon, title, description, and action button"
      />
      <View style={styles.sectionCard}>
        <AppEmptyState
          icon={Bell}
          title="No Visitor Requests"
          description="You have no pending visitor pre-approvals or gate notifications."
          actionLabel="Pre-Approve Guest"
          onActionPress={() => Toast.show({ text1: "Opening Guest Pre-Approval" })}
        />
      </View>

      {/* 18. Dialog / Modal */}
      <AppSectionHeader
        title="18. Dialog / Modal (<AppDialog />)"
        subtitle="Paper Dialog wrapper with confirm loading state"
      />
      <View style={styles.sectionCard}>
        <AppButton
          label="Open Confirmation Dialog"
          variant="filled"
          onPress={() => setDialogVisible(true)}
        />
        <AppDialog
          visible={dialogVisible}
          title="Approve Visitor Gate Pass?"
          message="Are you sure you want to approve entry for Delivery Executive (Amazon)?"
          confirmLabel="Approve Entry"
          confirmVariant="filled"
          cancelLabel="Cancel"
          confirmLoading={dialogLoading}
          onConfirm={handleConfirmDialog}
          onCancel={() => setDialogVisible(false)}
          onDismiss={() => setDialogVisible(false)}
        />
      </View>

      {/* 19. Bottom Sheet */}
      <AppSectionHeader
        title="19. Bottom Sheet (<AppBottomSheet />)"
        subtitle="Gorhom BottomSheet modal with backdrop dismiss & BottomSheetTextInput"
      />
      <View style={styles.sectionCard}>
        <AppButton
          label="Open Pre-Approval Bottom Sheet"
          variant="filled"
          onPress={handleOpenSheet}
        />
        <AppBottomSheet
          ref={bottomSheetRef}
          title="Pre-Approve Guest"
          snapPoints={["60%", "90%"]}
        >
          <Title style={{ marginBottom: 12 }}>Guest Details</Title>
          <BottomSheetTextInput
            placeholder="Guest Full Name"
            style={styles.sheetInput}
          />
          <BottomSheetTextInput
            placeholder="Guest Phone Number"
            keyboardType="phone-pad"
            style={styles.sheetInput}
          />
          <AppButton
            label="Generate Gate Code"
            variant="filled"
            fullWidth
            onPress={() => {
              bottomSheetRef.current?.dismiss();
              Toast.show({
                type: "success",
                text1: "Guest Code Generated",
                text2: "Share 6-digit code with your guest",
              });
            }}
          />
        </AppBottomSheet>
      </View>

      <AppDivider spacing={24} />

      <Title center style={{ marginBottom: 32 }}>
        Foyer Design System — Phase 4 Completed ✅
      </Title>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 16,
  },
  mainTitle: {
    marginTop: 8,
  },
  mainSubtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  sectionCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.03)",
    marginBottom: 16,
  },
  sectionCardCenter: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.03)",
    marginBottom: 16,
    alignItems: "center",
  },
  sectionCardPaddingNone: {
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.03)",
    marginBottom: 16,
    overflow: "hidden",
  },
  subHeader: {
    marginTop: 16,
    marginBottom: 8,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  columnGap: {
    gap: 12,
    marginBottom: 16,
  },
  cardBody: {
    marginTop: 4,
    opacity: 0.7,
  },
  searchOutput: {
    marginTop: 8,
  },
  sheetInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
});
