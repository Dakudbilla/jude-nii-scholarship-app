"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useCycle } from "@/providers/CycleProvider";
import { useToast } from "@/components/ui/toast";
import { useWings } from "@/hooks/useWings";
import { wingService } from "@/lib/services/client/wingService";
import { QUERY_KEYS } from "@/lib/api/queryKeys";
import { WingCard } from "@/components/admin/wings/WingCard";
import { WingFormModal } from "@/components/admin/wings/WingFormModal";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { Wing } from "@/lib/interfaces/core";
import { Users, Plus } from "lucide-react";

export default function AdminWingsPage() {
  const { selectedCycle } = useCycle();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { wings, isLoading, isError } = useWings(selectedCycle?.id);

  const [editingWing, setEditingWing] = useState<Wing | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Wing> & { id: string }) => {
      const { id, ...updates } = data;
      return wingService.update(id, { ...updates, yearId: selectedCycle!.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WINGS(selectedCycle!.id) });
      setEditingWing(null);
      toast.success("Wing updated successfully.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const addMutation = useMutation({
    mutationFn: (data: { name: string; headName: string; headPhone: string; headEmail: string }) =>
      wingService.create({ ...data, yearId: selectedCycle!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WINGS(selectedCycle!.id) });
      setShowAddModal(false);
      toast.success("Wing added successfully.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!selectedCycle) {
    return <div className="p-10 text-center text-slate-500 font-medium">No active cycle selected.</div>;
  }
  if (isLoading) {
    return (
      <div className="p-10 flex items-center justify-center">
        <div className="text-slate-400 text-sm font-medium animate-pulse tracking-widest uppercase">Loading Wings...</div>
      </div>
    );
  }
  if (isError) {
    return <div className="p-10 text-center text-red-500 font-medium">Failed to load wings. Please try again.</div>;
  }

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-8">
      <PageHeader
        title="Wings"
        subtitle={`Manage wing heads and endorsement contacts for ${selectedCycle.label}.`}
      >
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Wing
        </Button>
      </PageHeader>

      {wings.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Wings Configured"
          description="Wings are set up during academic year creation. You can also add them manually here."
          action={
            <Button onClick={() => setShowAddModal(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Add First Wing
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {wings.map((wing) => (
            <WingCard
              key={wing.id}
              wing={wing}
              onEdit={() => setEditingWing(wing)}
              onToggleActive={() =>
                updateMutation.mutate({ id: wing.id, isActive: !wing.isActive, yearId: selectedCycle.id })
              }
              isUpdating={updateMutation.isPending}
            />
          ))}
        </div>
      )}

      {editingWing && (
        <WingFormModal
          wing={editingWing}
          onSave={(updates) => updateMutation.mutate({ id: editingWing.id, ...updates })}
          onClose={() => setEditingWing(null)}
          isSaving={updateMutation.isPending}
        />
      )}

      {showAddModal && (
        <WingFormModal
          onSave={(data) => addMutation.mutate(data)}
          onClose={() => setShowAddModal(false)}
          isSaving={addMutation.isPending}
        />
      )}
    </div>
  );
}
