import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { maintenanceRepository } from "@/repositories/maintenance.repository";

export function useMaintenanceInvoices() {
  const queryClient = useQueryClient();

  const {
    data: invoices,
    isLoading,
    isRefetching,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.maintenance.invoices(),
    queryFn: () => maintenanceRepository.fetchInvoicesList(),
  });

  const payInvoiceMutation = useMutation({
    mutationFn: ({ invoiceId, amount, paymentMethod }: { invoiceId: string; amount: number; paymentMethod: string }) =>
      maintenanceRepository.initiateInvoicePayment(invoiceId, amount, paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });

  return {
    invoices: invoices || [],
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
    payInvoice: (invoiceId: string, amount: number, paymentMethod: string = "UPI") =>
      payInvoiceMutation.mutateAsync({ invoiceId, amount, paymentMethod }),
    isPaying: payInvoiceMutation.isPending,
  };
}

export function useInvoiceDetails(invoiceId: string) {
  const {
    data: invoice,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.maintenance.invoice(invoiceId),
    queryFn: () => maintenanceRepository.fetchInvoiceById(invoiceId),
    enabled: !!invoiceId,
  });

  return {
    invoice,
    isLoading,
    isError,
    error,
    refetch,
  };
}
