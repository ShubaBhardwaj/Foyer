import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {
  AppScreen,
  H2,
  Title,
  Subtitle,
  Body,
  Caption,
  Label,
  AppSectionHeader,
  AppCard,
  AppButton,
  AppIconButton,
  AppStatusPill,
  AppListRow,
  AppAvatar,
} from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import {
  HOME_DUMMY_DATA,
  QuickActionItem,
  OverviewStat,
  VisitorRequest,
  ComplaintItem,
  BookingItem,
  NoticeItem,
  AdminActionItem,
} from "@/constants/homeDummyData";
import {
  UserPlus,
  FilePlus,
  Vote,
  CalendarPlus,
  Users,
  UserCheck,
  AlertCircle,
  Calendar,
  Shield,
  BarChart3,
  Bell,
  ArrowRight,
  Clock,
  Building2,
  ChevronRight,
  CheckCircle2,
} from "lucide-react-native";

export default function HomeScreen() {
  const theme = useAppTheme();
  const router = useRouter();

  // TODO: Fetch user profile & role from Auth context/store
  const { userProfile, quickActions, overviewStats, visitorRequests, recentComplaints, upcomingBookings, recentNotices, adminActions } = HOME_DUMMY_DATA;
  const role = userProfile.role; // Hardcoded for now: "society_admin"

  // TODO: Replace dummy dashboard data with API response
  // useEffect(() => {
  //   fetchDashboardData();
  // }, []);

  // Handler for Quick Actions
  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "visitor":
        // TODO: Navigate to Add Visitor screen
        break;
      case "notice":
        // TODO: Navigate to Create Notice screen
        break;
      case "poll":
        // TODO: Navigate to Create Poll screen
        break;
      case "booking":
        // TODO: Navigate to Book Facility screen
        break;
      default:
        break;
    }
  };

  // Handler for Approving Visitor
  const handleApproveVisitor = (visitorId: string) => {
    // TODO: Call API to approve visitor request
    // approveVisitor(visitorId);
  };

  // Handler for Admin Quick Navigation
  const handleAdminAction = (actionId: string) => {
    switch (actionId) {
      case "manage_residents":
        // TODO: Navigate to Manage Residents screen
        // router.push("/(home)/manage-residents");
        break;
      case "manage_guards":
        // TODO: Navigate to Manage Guards screen
        // router.push("/(home)/manage-guards");
        break;
      case "todays_analytics":
        // TODO: Navigate to Today's Analytics screen
        // router.push("/(home)/todays-analytics");
        break;
      default:
        break;
    }
  };

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header Section ──────────────────────────────────────────────── */}
      <View style={styles.headerContainer}>
        <View style={styles.greetingHeader}>
          <H2 style={{ color: theme.colors.onBackground }}>
            👋 Good Morning, {userProfile.name}
          </H2>
          {/* TODO: Navigate to Notifications Screen */}
          <AppIconButton
            icon={Bell}
            variant="tonal"
            size={40}
            onPress={() => {
              // TODO: router.push("/(home)/notifications")
            }}
            accessibilityLabel="Notifications"
          />
        </View>
        <Body style={{ color: theme.colors.primary, fontWeight: "600", marginTop: spacing.xs }}>
          {userProfile.societyName}
        </Body>
        <Body style={{ color: theme.colors.onSurfaceVariant }}>
          {userProfile.unitDetails}
        </Body>
      </View>

      {/* ─── Quick Actions Section ────────────────────────────────────────── */}
      <AppSectionHeader title="Quick Actions" style={styles.sectionMargin} />
      <View style={styles.gridContainer}>
        {quickActions.map((action) => {
          const IconComponent = getQuickActionIcon(action.iconName);
          return (
            <AppCard
              key={action.id}
              variant="elevated"
              onPress={() => handleQuickAction(action.id)}
              style={styles.quickActionCard}
              accessibilityLabel={action.label}
              accessibilityHint={action.accessibilityHint}
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
      <AppSectionHeader title="Today's Overview" style={styles.sectionMargin} />
      <View style={styles.gridContainer}>
        {overviewStats.map((stat) => {
          const StatIcon = getStatIcon(stat.iconName);
          return (
            <AppCard
              key={stat.id}
              variant="outlined"
              style={styles.overviewCard}
              accessibilityLabel={`${stat.title}: ${stat.value}`}
            >
              <View style={styles.overviewCardHeader}>
                <Subtitle style={{ color: theme.colors.onSurfaceVariant, flex: 1 }} numberOfLines={1}>
                  {stat.title}
                </Subtitle>
                <StatIcon size={18} color={theme.colors.primary} />
              </View>
              <H2 style={{ color: theme.colors.onSurface, marginVertical: spacing.xs }}>
                {stat.value}
              </H2>
              <Caption style={{ color: theme.colors.outline }}>
                {stat.caption}
              </Caption>
            </AppCard>
          );
        })}
      </View>

      {/* ─── Recent Visitor Requests ────────────────────────────────────── */}
      <AppSectionHeader
        title="Recent Visitor Requests"
        style={styles.sectionMargin}
        action={
          <AppButton
            variant="text"
            size="sm"
            label="View All"
            rightIcon={ChevronRight}
            onPress={() => {
              // TODO: Navigate to Visitors Tab
              // router.push("/(tabs)/(visitors)");
            }}
          />
        }
      />
      <AppCard variant="elevated" style={styles.listCardContainer}>
        {visitorRequests.map((visitor, index) => (
          <View key={visitor.id}>
            <AppListRow
              title={visitor.name}
              subtitle={`${visitor.unit} • ${visitor.timeAgo}`}
              leading={
                <AppAvatar
                  mode="initials"
                  initials={visitor.initials}
                  size="md"
                />
              }
              trailing={
                <View style={styles.visitorTrailing}>
                  <AppStatusPill status={visitor.status} />
                  {visitor.status === "pending" && (
                    <AppButton
                      label="Approve"
                      variant="tonal"
                      size="sm"
                      leftIcon={CheckCircle2}
                      onPress={() => handleApproveVisitor(visitor.id)}
                      accessibilityLabel={`Approve entry for ${visitor.name}`}
                    />
                  )}
                </View>
              }
              divider={index < visitorRequests.length - 1}
              onPress={() => {
                // TODO: Navigate to Visitor Details modal/screen
              }}
            />
          </View>
        ))}
      </AppCard>

      {/* ─── Recent Complaints Section ───────────────────────────────────── */}
      <AppSectionHeader
        title="Recent Complaints"
        style={styles.sectionMargin}
        action={
          <AppButton
            variant="text"
            size="sm"
            label="View All"
            rightIcon={ChevronRight}
            onPress={() => {
              // TODO: Navigate to Complaints list
            }}
          />
        }
      />
      <AppCard variant="elevated" style={styles.listCardContainer}>
        {recentComplaints.map((complaint, index) => (
          <AppListRow
            key={complaint.id}
            title={complaint.title}
            subtitle={`${complaint.category} • ${complaint.timestamp}`}
            leading={
              <View style={[styles.categoryIconBg, { backgroundColor: theme.colors.tertiaryContainer }]}>
                <AlertCircle size={18} color={theme.colors.onTertiaryContainer} />
              </View>
            }
            trailing={<AppStatusPill status={complaint.status} />}
            divider={index < recentComplaints.length - 1}
            onPress={() => {
              // TODO: Navigate to Complaint Details
              // router.push(`/(home)/complaint-details/${complaint.id}`)
            }}
          />
        ))}
      </AppCard>

      {/* ─── Upcoming Bookings Section ───────────────────────────────────── */}
      <AppSectionHeader
        title="Upcoming Bookings"
        style={styles.sectionMargin}
        action={
          <AppButton
            variant="text"
            size="sm"
            label="View All"
            rightIcon={ChevronRight}
            onPress={() => {
              // TODO: Navigate to Facilities Tab
              // router.push("/(tabs)/(facilities)");
            }}
          />
        }
      />
      <AppCard variant="elevated" style={styles.listCardContainer}>
        {upcomingBookings.map((booking, index) => (
          <AppListRow
            key={booking.id}
            title={booking.facilityName}
            subtitle={booking.bookingTime}
            leading={
              <View style={[styles.categoryIconBg, { backgroundColor: theme.colors.secondaryContainer }]}>
                <Building2 size={18} color={theme.colors.onSecondaryContainer} />
              </View>
            }
            trailing={<AppStatusPill status={booking.status} />}
            divider={index < upcomingBookings.length - 1}
            onPress={() => {
              // TODO: Navigate to Facility Booking Details
            }}
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
            onPress={() => {
              // TODO: Navigate to Community Tab / Notices
            }}
          />
        }
      />
      <View style={styles.noticeList}>
        {recentNotices.map((notice) => (
          <AppCard key={notice.id} variant="outlined" style={styles.noticeCard}>
            <View style={styles.noticeCardHeader}>
              <Subtitle style={{ color: theme.colors.onSurface, flex: 1 }} numberOfLines={1}>
                {notice.title}
              </Subtitle>
              {notice.isUrgent && (
                <AppStatusPill status="rejected" label="Urgent" />
              )}
            </View>
            <Body
              style={{ color: theme.colors.onSurfaceVariant, marginVertical: spacing.xs }}
              numberOfLines={2}
            >
              {notice.preview}
            </Body>
            <View style={styles.noticeCardFooter}>
              <Caption style={{ color: theme.colors.outline }}>
                {notice.date}
              </Caption>
              <AppButton
                variant="text"
                size="sm"
                label="Read →"
                onPress={() => {
                  // TODO: Navigate to Notice Detail modal
                }}
              />
            </View>
          </AppCard>
        ))}
      </View>

      {/* ─── Admin Management Features (Society Admin Only) ──────────────── */}
      {role === "society_admin" && (
        <>
          <AppSectionHeader
            title="Admin Dashboard Controls"
            subtitle="Admin-only resident, guard, and analytics management"
            style={styles.sectionMargin}
          />
          <AppCard variant="filled" style={styles.adminCardContainer}>
            {adminActions.map((adminItem, index) => {
              const AdminIcon = getAdminIcon(adminItem.iconName);
              return (
                <AppListRow
                  key={adminItem.id}
                  title={adminItem.title}
                  subtitle={adminItem.subtitle}
                  leading={
                    <View style={[styles.adminIconBg, { backgroundColor: theme.colors.primary }]}>
                      <AdminIcon size={18} color={theme.colors.onPrimary} />
                    </View>
                  }
                  trailing={
                    <View style={styles.adminTrailing}>
                      {adminItem.countBadge !== undefined && (
                        <View style={[styles.badgeContainer, { backgroundColor: theme.colors.error }]}>
                          <Label style={{ color: theme.colors.onError, fontSize: 10 }}>
                            {adminItem.countBadge}
                          </Label>
                        </View>
                      )}
                      <ChevronRight size={18} color={theme.colors.onSurfaceVariant} />
                    </View>
                  }
                  divider={index < adminActions.length - 1}
                  onPress={() => handleAdminAction(adminItem.id)}
                />
              );
            })}
          </AppCard>
        </>
      )}
    </AppScreen>
  );
}

// ─── Helper Icon Mappers ───────────────────────────────────────────────────

function getQuickActionIcon(iconName: QuickActionItem["iconName"]) {
  switch (iconName) {
    case "UserPlus":
      return UserPlus;
    case "FilePlus":
      return FilePlus;
    case "Vote":
      return Vote;
    case "CalendarPlus":
      return CalendarPlus;
  }
}

function getStatIcon(iconName: OverviewStat["iconName"]) {
  switch (iconName) {
    case "Users":
      return Users;
    case "UserCheck":
      return UserCheck;
    case "AlertCircle":
      return AlertCircle;
    case "Calendar":
      return Calendar;
  }
}

function getAdminIcon(iconName: AdminActionItem["iconName"]) {
  switch (iconName) {
    case "Users":
      return Users;
    case "Shield":
      return Shield;
    case "BarChart3":
      return BarChart3;
  }
}

// ─── Stylesheet ────────────────────────────────────────────────────────────

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
  categoryIconBg: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  noticeList: {
    gap: spacing.md,
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
  noticeCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.xs,
  },
  adminCardContainer: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginBottom: spacing.xl,
    overflow: "hidden",
  },
  adminIconBg: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  adminTrailing: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  badgeContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
});
