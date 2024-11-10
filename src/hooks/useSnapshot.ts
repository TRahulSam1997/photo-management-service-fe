import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { snapshotApi } from "../services/api";
import { CreateSnapshotDTO, SnapshotStatus } from "../types/snapshot";

export const useSnapshots = () => {
  const queryClient = useQueryClient();

  const { data: snapshots, isLoading } = useQuery({
    queryKey: ["snapshots"],
    queryFn: snapshotApi.getAll,
  });

  // understand what's going on here...
  const createMutation = useMutation({
    mutationFn: snapshotApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snapshots"] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      feedback,
    }: {
      id: string;
      status: SnapshotStatus;
      feedback?: string;
    }) => snapshotApi.updateStatus(id, status, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snapshots"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: snapshotApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snapshots"] });
    },
  });

  return {
    snapshots,
    isLoading,
    createSnapshot: createMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
    deleteSnapshot: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateStatusMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
