import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import {
  AppScreen,
  H2,
  Subtitle,
  Body,
  Caption,
  AppSectionHeader,
  AppCard,
  AppButton,
  AppIconButton,
  AppStatusPill,
  AppListRow,
  AppAvatar,
} from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { useAuthStore } from "@/store/use-auth-store";
import { useDashboard } from "@/hooks/useDashboard";
import { useVisitors } from "@/features/visitors/hooks/useVisitors";
import { useComplaints } from "@/hooks/useComplaints";
import { useBookings } from "@/features/facilities/bookings/hooks/useBookings";
import { useNotices } from "@/features/community/notices/hooks/useNotices";
import {
  UserPlus,
  FilePlus,
  Vote,
  CalendarPlus,
  Users,
  AlertCircle,
  Calendar,
  Bell,
  ChevronRight,
  CheckCircle2,
} from "lucide-react-native";

export default function HomeScreen() {
  const theme = useAppTheme();
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const society = useAuthStore((s) => s.society);
  const role = useAuthStore((s) => s.role);

  const { metrics, isLoading: isDashboardLoading } = useDashboard();
  const { visitors, handleApproveVisitor } = useVisitors();
  const { complaints } = useComplaints();
  const { bookings } = useBookings();
  const { notices } = useNotices();

  const userName = user?.name || "Resident";
  const societyName = society?.name || "Foyer Smart Residence";
  const unitDetails = user?.flatNumber ? `${user.tower ? user.tower + " - " : ""}${user.flatNumber}` : "Unit Details";

  const quickActions = [
    { id: "visitor", label: "Add Visitor", icon: UserPlus, route: "/(visitors)/add" },
    { id: "complaint", label: "Raise Issue", icon: FilePlus, route: "/(community)" },
    { id: "poll", label: "Polls", icon: Vote, route: "/(community)/polls" },
    { id: "booking", label: "Book Facility", icon: CalendarPlus, route: "/(facilities)" },
  ];

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header Section ──────────────────────────────────────────────── */}
      <View style={styles.headerContainer}>
        <View style={styles.greetingHeader}>
          <H2 style={{ color: theme.colors.onBackground }}>
            👋 Welcome, {userName}
          </H2>
          <AppIconButton
            icon={Bell}
            variant="tonal"
            size={40}
            onPress={() => router.push("/(profile)/notifications")}
            accessibilityLabel="Notifications"
          />
        </View>
        <Body style={{ color: theme.colors.primary, fontWeight: "600", marginTop: spacing.xs }}>
          {societyName}
        </Body>
        <Body style={{ color: theme.colors.onSurfaceVariant }}>
          {unitDetails} • {role || "RESIDENT"}
        </Body>
      </View>

      {/* ─── Quick Actions Section ────────────────────────────────────────── */}
      <AppSectionHeader title="Quick Actions" style={styles.sectionMargin} />
      <View style={styles.gridContainer}>
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <AppCard
              key={action.id}
              variant="elevated"
              onPress={() => router.push(action.route as any)}
              style={styles.quickActionCard}
              accessibilityLabel={action.label}
            >
              <View style={[styles.quickActionIconBg, { backgroundColor: theme.colors.primaryContainer }]}>
                <IconComponent size={22} color={theme.colors.onPrimaryContainer} />
              </View>
              <Subtitle style={{ color: theme.colors.onSurface, marginTop: spacing.sm, textAlign: "center" }}>
                {action.label}
              </Subtitle>
            </AppCard>
          );
        })}
      </View>

      {/* ─── Today's Overview Section ─────────────────────────────────────── */}
      <AppSectionHeader title="Overview" style={styles.sectionMargin} />
      {isDashboardLoading ? (
        <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: spacing.md }} />
      ) : (
        <View style={styles.gridContainer}>
          <AppCard variant="outlined" style={styles.overviewCard}>
            <View style={styles.overviewCardHeader}>
              <Subtitle style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}>Pending Visitors</Subtitle>
              <Users size={18} color={theme.colors.primary} />
            </View>
            <H2 style={{ color: theme.colors.onSurface, marginVertical: spacing.xs }}>
              {(metrics as any)?.pendingVisitorsCount ?? visitors.filter(v => v.status === "pending").length}
            </H2>
            <Caption style={{ color: theme.colors.outline }}>Awaiting host approval</Caption>
          </AppCard>

          <AppCard variant="outlined" style={styles.overviewCard}>
            <View style={styles.overviewCardHeader}>
              <Subtitle style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}>Active Notices</Subtitle>
              <Bell size={18} color={theme.colors.primary} />
            </View>
            <H2 style={{ color: theme.colors.onSurface, marginVertical: spacing.xs }}>
              {(metrics as any)?.activeNoticesCount ?? notices.length}
            </H2>
            <Caption style={{ color: theme.colors.outline }}>Broadcasted by society</Caption>
          </AppCard>

          <AppCard variant="outlined" style={styles.overviewCard}>
            <View style={styles.overviewCardHeader}>
              <Subtitle style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}>Open Complaints</Subtitle>
              <AlertCircle size={18} color={theme.colors.primary} />
            </View>
            <H2 style={{ color: theme.colors.onSurface, marginVertical: spacing.xs }}>
              {(metrics as any)?.openComplaintsCount ?? complaints.filter(c => c.status === "OPEN").length}
            </H2>
            <Caption style={{ color: theme.colors.outline }}>In progress / pending</Caption>
          </AppCard>

          <AppCard variant="outlined" style={styles.overviewCard}>
            <View style={styles.overviewCardHeader}>
              <Subtitle style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}>Bookings</Subtitle>
              <Calendar size={18} color={theme.colors.primary} />
            </View>
            <H2 style={{ color: theme.colors.onSurface, marginVertical: spacing.xs }}>
              {(metrics as any)?.upcomingBookingsCount ?? bookings.length}
            </H2>
            <Caption style={{ color: theme.colors.outline }}>Upcoming reservations</Caption>
          </AppCard>
        </View>
      )}

      {/* ─── Recent Visitor Requests ────────────────────────────────────── */}
      <AppSectionHeader
        title="Recent Visitors"
        style={styles.sectionMargin}
        action={
          <AppButton
            variant="text"
            size="sm"
            label="View All"
            rightIcon={ChevronRight}
            onPress={() => router.push("/(visitors)")}
          />
        }
      />
      <AppCard variant="elevated" style={styles.listCardContainer}>
        {visitors.slice(0, 3).map((visitor, index) => (
          <AppListRow
            key={visitor._id}
            title={visitor.name}
            subtitle={`${visitor.purpose} • ${visitor.expectedTime || "Today"}`}
            leading={<AppAvatar mode="initials" initials={visitor.name.slice(0, 2).toUpperCase()} size="md" />}
            trailing={
              <View style={styles.visitorTrailing}>
                <AppStatusPill status={visitor.status} />
                {visitor.status === "pending" && (
                  <AppButton
                    label="Approve"
                    variant="tonal"
                    size="sm"
                    leftIcon={CheckCircle2}
                    onPress={() => handleApproveVisitor(visitor._id)}
                  />
                )}
              </View>
            }
            divider={index < Math.min(visitors.length, 3) - 1}
            onPress={() => router.push(`/(visitors)/${visitor._id}` as any)}
          />
        ))}
      </AppCard>

      {/* ─── Recent Notices Section ──────────────────────────────────────── */}
      <AppSectionHeader
        title="Recent Notices"
        style={styles.sectionMargin}
        action={
          <AppButton
            variant="text"
            size="sm"
            label="View All"
            rightIcon={ChevronRight}
            onPress={() => router.push("/(community)/notices")}
          />
        }
      />
      <View style={styles.noticeList}>
        {notices.slice(0, 2).map((notice) => (
          <AppCard key={notice.id} variant="outlined" style={styles.noticeCard}>
            <View style={styles.noticeCardHeader}>
              <Subtitle style={{ color: theme.colors.onSurface, flex: 1 }} numberOfLines={1}>
                {notice.title}
              </Subtitle>
              {notice.isPinned && <AppStatusPill status="approved" label="Pinned" />}
            </View>
            <Body style={{ color: theme.colors.onSurfaceVariant, marginVertical: spacing.xs }} numberOfLines={2}>
              {notice.description}
            </Body>
          </AppCard>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: spacing.md,
  },
  greetingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionMargin: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  quickActionCard: {
    width: "47.5%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
  },
  quickActionIconBg: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  overviewCard: {
    width: "47.5%",
    padding: spacing.md,
  },
  overviewCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listCardContainer: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    overflow: "hidden",
  },
  visitorTrailing: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  noticeList: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  noticeCard: {
    padding: spacing.md,
  },
  noticeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
});
