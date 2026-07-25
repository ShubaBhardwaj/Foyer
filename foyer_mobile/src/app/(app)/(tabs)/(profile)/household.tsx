import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {
  AppScreen,
  AppButton,
  AppSectionHeader,
  AppCard,
  AppBottomSheet,
  AppBottomSheetRef,
  AppTextField,
  Subtitle,
  Body,
} from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import {
  useHousehold,
  HouseholdMemberCard,
  ProfileEmptyState,
  HouseholdMember,
  inviteHouseholdMember,
} from "@/features/profile";
import { UserPlus, CheckCircle2, Trash2, ShieldCheck, Phone } from "lucide-react-native";

export default function HouseholdScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);
  const inviteSheetRef = useRef<AppBottomSheetRef>(null);

  const [selectedMember, setSelectedMember] = useState<HouseholdMember | null>(null);

  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    members,
    handleRemoveMember,
    handleVerifyMember,
  } = useHousehold();

  const handleMemberPress = (member: HouseholdMember) => {
    setSelectedMember(member);
    bottomSheetRef.current?.expand();
  };

  const handleInviteSubmit = async () => {
    setIsSubmitting(true);
    try {
      await inviteHouseholdMember({
        name,
        relation: "OTHER",
        phone,
      });
      inviteSheetRef.current?.close();
      setName("");
      setRelationship("");
      setPhone("");
    } catch (err) {
      console.warn("Failed to invite household member:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      <AppSectionHeader title="My Household Members" />

      <Body style={{ color: theme.colors.onSurfaceVariant, marginBottom: spacing.md }}>
        Manage residents, family members, tenants, domestic helpers, and drivers associated with your flat.
      </Body>

      {members.length === 0 ? (
        <ProfileEmptyState
          type="household"
          onActionPress={() => inviteSheetRef.current?.expand()}
        />
      ) : (
        <AppCard variant="elevated" style={styles.cardList}>
          {members.map((member, index) => (
            <HouseholdMemberCard
              key={member.id}
              member={member}
              onPress={handleMemberPress}
              divider={index < members.length - 1}
            />
          ))}
        </AppCard>
      )}

      <View style={styles.fabRow}>
        <AppButton
          label="+ Invite Household Member"
          variant="filled"
          size="md"
          leftIcon={UserPlus}
          onPress={() => inviteSheetRef.current?.expand()}
          fullWidth
        />
      </View>

      <AppBottomSheet
        ref={bottomSheetRef}
        title={selectedMember ? selectedMember.name : "Member Options"}
      >
        {selectedMember && (
          <View style={styles.sheetContent}>
            <Subtitle style={{ color: theme.colors.onSurface }}>
              {selectedMember.role} • {selectedMember.relationship}
            </Subtitle>

            <View style={styles.sheetButtons}>
              {!selectedMember.isVerified && (
                <AppButton
                  label="Verify Security Status"
                  variant="filled"
                  leftIcon={ShieldCheck}
                  onPress={() => {
                    handleVerifyMember(selectedMember.id);
                    bottomSheetRef.current?.close();
                  }}
                  fullWidth
                />
              )}

              <AppButton
                label="Call Member"
                variant="tonal"
                leftIcon={Phone}
                onPress={() => {
                  bottomSheetRef.current?.close();
                }}
                fullWidth
              />

              <AppButton
                label="Remove Member from Flat"
                variant="danger"
                leftIcon={Trash2}
                onPress={() => {
                  handleRemoveMember(selectedMember.id);
                  bottomSheetRef.current?.close();
                }}
                fullWidth
              />
            </View>
          </View>
        )}
      </AppBottomSheet>

      <AppBottomSheet ref={inviteSheetRef} title="Invite Household Member">
        <View style={styles.sheetForm}>
          <AppTextField
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Ramesh Kumar"
          />
          <AppTextField
            label="Relationship / Role"
            value={relationship}
            onChangeText={setRelationship}
            placeholder="e.g. Family Member, Tenant, Driver"
          />
          <AppTextField
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
          />
          <AppButton
            label="Send Invitation Pass"
            variant="filled"
            loading={isSubmitting}
            leftIcon={CheckCircle2}
            onPress={handleInviteSubmit}
            fullWidth
          />
        </View>
      </AppBottomSheet>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  cardList: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginVertical: spacing.sm,
    overflow: "hidden",
  },
  fabRow: {
    marginVertical: spacing.md,
  },
  sheetContent: {
    paddingVertical: spacing.sm,
  },
  sheetButtons: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  sheetForm: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
});
