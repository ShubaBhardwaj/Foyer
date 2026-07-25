import {
  visitorRequests,
  visitorDetailsMap,
  preApprovedGuests,
  visitorStatistics,
} from "../data/visitorDummyData";
import { VisitorRequest, VisitorDetailRecord, PreApprovedGuest } from "../types";

/**
 * Dummy API service layer for Visitors Module.
 * Future backend integration should update this file or wire React Query hooks.
 */

// TODO: Replace with GET /api/v1/visitors endpoint
export async function getVisitorsList(): Promise<VisitorRequest[]> {
  return Promise.resolve(visitorRequests);
}

// TODO: Replace with GET /api/v1/visitors/:visitorId endpoint
export async function getVisitorDetailById(
  visitorId: string
): Promise<VisitorDetailRecord | undefined> {
  const record = visitorDetailsMap[visitorId] ?? visitorDetailsMap["v001"];
  return Promise.resolve(record);
}

// TODO: Replace with GET /api/v1/guests/pre-approved endpoint
export async function getPreApprovedGuests(): Promise<PreApprovedGuest[]> {
  return Promise.resolve(preApprovedGuests);
}

// TODO: Replace with POST /api/v1/visitors endpoint
export async function createVisitorRequest(
  data: Partial<VisitorDetailRecord>
): Promise<VisitorDetailRecord> {
  const newRecord: VisitorDetailRecord = {
    id: `v_${Date.now()}`,
    name: data.name ?? "New Visitor",
    phone: data.phone ?? "",
    purpose: data.purpose ?? "",
    vehicleNumber: data.vehicleNumber ?? "N/A",
    expectedDate: data.expectedDate ?? "Today",
    expectedTime: data.expectedTime ?? "Now",
    visitorIdCode: `FYR-VIS-${Math.floor(1000 + Math.random() * 9000)}`,
    status: "pending",
    initials: (data.name ?? "NV")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2),
    resident: data.resident ?? {
      name: "Resident Host",
      tower: "Tower A",
      flat: "Flat 101",
      phone: "+91 99999 88888",
    },
  };
  return Promise.resolve(newRecord);
}

// TODO: Replace with PATCH /api/v1/visitors/:visitorId/approve endpoint
export async function approveVisitor(visitorId: string): Promise<boolean> {
  return Promise.resolve(true);
}

// TODO: Replace with PATCH /api/v1/visitors/:visitorId/reject endpoint
export async function rejectVisitor(
  visitorId: string,
  reason?: string
): Promise<boolean> {
  return Promise.resolve(true);
}

// TODO: Replace with DELETE /api/v1/visitors/:visitorId endpoint
export async function deleteVisitor(visitorId: string): Promise<boolean> {
  return Promise.resolve(true);
}
