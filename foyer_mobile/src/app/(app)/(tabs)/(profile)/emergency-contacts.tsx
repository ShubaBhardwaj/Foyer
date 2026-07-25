import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {
  AppScreen,
  AppButton,
  AppSectionHeader,
  AppBottomSheet,
  AppBottomSheetRef,
  AppTextField,
  Body,
} from "@/components/ui";
import { spacing } from "@/theme";
import {
  useEmergencyContacts,
  EmergencyContactCard,
  ProfileEmptyState,
} from "@/features/profile";
import { PhoneCall, CheckCircle2 } from "lucide-react-native";

export default function EmergencyContactsScreen() {
  const router = useRouter();
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  const { contacts, handleRemoveContact, handleSetPrimary } = useEmergencyContacts();

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <AppSectionHeader title="Emergency Contacts" />
      <Body style={{ color: "gray", marginBottom: spacing.md }}>
        Contacts listed here will be notified immediately during security or medical emergencies in your flat.
      </Body>

      {/* ─── Contacts List / Empty State ───────────────────────────────── */}
      {contacts.length === 0 ? (
        <ProfileEmptyState
          type="contacts"
          onActionPress={() => bottomSheetRef.current?.expand()}
        />
      ) : (
        <View style={styles.listContainer}>
          {contacts.map((contact) => (
            <EmergencyContactCard
              key={contact.id}
              contact={contact}
              onCall={(phoneNum) => {
                // TODO: Trigger phone call
              }}
            />
          ))}
        </View>
      )}

      {/* ─── Floating Action Button ─────────────────────────────────────── */}
      <View style={styles.fabRow}>
        <AppButton
          label="+ Add Emergency Contact"
          variant="filled"
          size="md"
          leftIcon={PhoneCall}
          onPress={() => bottomSheetRef.current?.expand()}
          fullWidth
        />
      </View>

      {/* ─── Add Contact Bottom Sheet ──────────────────────────────────── */}
      <AppBottomSheet ref={bottomSheetRef} title="Add Emergency Contact">
        <View style={styles.sheetForm}>
          <AppTextField
            label="Contact Full Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Dr. Suresh Gupta"
          />
          <AppTextField
            label="Relationship / Role"
            value={relation}
            onChangeText={setRelation}
            placeholder="e.g. Spouse, Physician, Family Friend"
          />
          <AppTextField
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
          />
          <AppButton
            label="Save Emergency Contact"
            variant="filled"
            leftIcon={CheckCircle2}
            onPress={() => {
              // TODO: Save contact
              bottomSheetRef.current?.close();
            }}
            fullWidth
          />
        </View>
      </AppBottomSheet>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    marginVertical: spacing.xs,
    gap: spacing.xs,
  },
  fabRow: {
    marginVertical: spacing.md,
  },
  sheetForm: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
});
