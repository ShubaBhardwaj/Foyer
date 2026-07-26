import { visitorRepository } from "@/repositories/visitor.repository";
import { CreateVisitorRequestDto, VisitorDto } from "@/types/api/visitor";

export async function getVisitorsList(params?: { status?: string; search?: string }) {
  return visitorRepository.fetchVisitorsList(params);
}

export async function getVisitorDetailById(visitorId: string): Promise<VisitorDto> {
  return visitorRepository.fetchVisitorById(visitorId);
}

export async function createVisitorRequest(data: CreateVisitorRequestDto): Promise<VisitorDto> {
  return visitorRepository.createVisitorPass(data);
}

export async function approveVisitorRequest(visitorId: string, statusRemark?: string): Promise<VisitorDto> {
  return visitorRepository.approveVisitor(visitorId, statusRemark);
}

export async function rejectVisitorRequest(visitorId: string, statusRemark: string): Promise<VisitorDto> {
  return visitorRepository.rejectVisitor(visitorId, statusRemark);
}

export async function cancelVisitorRequest(visitorId: string, statusRemark?: string): Promise<VisitorDto> {
  return visitorRepository.cancelVisitor(visitorId, statusRemark);
}

export async function checkInVisitorRequest(visitorId: string, entryCode?: string): Promise<VisitorDto> {
  return visitorRepository.checkInVisitor(visitorId, entryCode);
}

export async function checkOutVisitorRequest(visitorId: string): Promise<VisitorDto> {
  return visitorRepository.checkOutVisitor(visitorId);
}

