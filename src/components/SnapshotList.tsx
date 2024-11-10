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

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {snapshots.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Your Photos</h2>
          <div className="space-y-4">
            {snapshots.map((snapshot) => (
              <SnapshotItem key={snapshot.id} snapshot={snapshot} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
