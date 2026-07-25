export interface DashboardResidentMetricsDto {
  pendingVisitorsCount: number;
  activeNoticesCount: number;
  openComplaintsCount: number;
  upcomingBookingsCount: number;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    time: string;
  }>;
}

export interface DashboardAdminMetricsDto {
  totalResidents: number;
  activeComplaints: number;
  pendingVisitorsToday: number;
  totalFacilities: number;
  quickStats: {
    collectedMaintenancePercentage: number;
    pendingBookings: number;
  };
}

export interface DashboardGuardMetricsDto {
  checkedInVisitorsCount: number;
  expectedVisitorsCount: number;
  recentCheckIns: Array<{
    id: string;
    visitorName: string;
    vehicleNumber?: string;
    flat: string;
    checkInTime: string;
  }>;
}

export interface DashboardOwnerMetricsDto {
  unitInfo: {
    tower: string;
    flat: string;
  };
  tenantDetails?: {
    name: string;
    email: string;
    phone: string;
  };
  outstandingDues: number;
  recentPayments: Array<{
    id: string;
    amount: number;
    date: string;
    status: string;
  }>;
}

export type DashboardMetricsDto =
  | DashboardResidentMetricsDto
  | DashboardAdminMetricsDto
  | DashboardGuardMetricsDto
  | DashboardOwnerMetricsDto;

export interface GetDashboardResponseDto {
  success: boolean;
  role: "RESIDENT" | "ADMIN" | "GUARD" | "OWNER";
  metrics: DashboardMetricsDto;
}
