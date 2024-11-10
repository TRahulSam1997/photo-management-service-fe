import React from "react";
import { useSnapshots } from "../hooks/useSnapshot";
import { SnapshotItem } from "./SnapshotItem";
import { SnapshotStatus } from "../types/snapshot";

export const SnapshotList = () => {
  const { snapshots, isLoading } = useSnapshots();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading snapshots...</p>
      </div>
    );
  }

  if (!snapshots?.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No snapshots yet</p>
      </div>
    );
  }

  const pendingSnapshots = snapshots.filter(
    (s) => s.status === SnapshotStatus.Pending
  );
  const otherSnapshots = snapshots.filter(
    (s) => s.status !== SnapshotStatus.Pending
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {pendingSnapshots.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Pending Review</h2>
          <div className="space-y-4">
            {pendingSnapshots.map((snapshot) => (
              <SnapshotItem key={snapshot.id} snapshot={snapshot} />
            ))}
          </div>
        </section>
      )}

      {otherSnapshots.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Previous Snapshots</h2>
          <div className="space-y-4">
            {otherSnapshots.map((snapshot) => (
              <SnapshotItem key={snapshot.id} snapshot={snapshot} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
