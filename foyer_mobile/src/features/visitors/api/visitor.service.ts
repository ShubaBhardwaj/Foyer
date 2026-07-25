import { visitorRepository } from "@/repositories/visitor.repository";
import { CreateVisitorRequestDto, VisitorDto, VisitorStatus } from "@/types/api/visitor";

export async function getVisitorsList(params?: { status?: string; search?: string }) {
  return visitorRepository.fetchVisitorsList(params);
}

export async function getVisitorDetailById(visitorId: string): Promise<VisitorDto> {
  return visitorRepository.fetchVisitorById(visitorId);
}

export async function createVisitorRequest(data: CreateVisitorRequestDto): Promise<VisitorDto> {
  return visitorRepository.createVisitorPass(data);
}

export async function updateVisitorStatus(visitorId: string, status: VisitorStatus, reason?: string): Promise<VisitorDto> {
  return visitorRepository.updateStatus(visitorId, status, reason);
}

export async function getVisitorQrPass(visitorId: string) {
  return visitorRepository.fetchQrPass(visitorId);
}
