import React from "react";
import { Snapshot, SnapshotStatus } from "../types/snapshot";
import { useSnapshots } from "../hooks/useSnapshot";

interface SnapshotItemProps {
  snapshot: Snapshot;
}

export const SnapshotItem: React.FC<SnapshotItemProps> = ({ snapshot }) => {
  const { updateStatus, deleteSnapshot, isUpdating, isDeleting } =
    useSnapshots();

  const handleStatusUpdate = async (status: SnapshotStatus) => {
    try {
      await updateStatus({
        id: snapshot.id,
        status,
        feedback:
          status === SnapshotStatus.Rejected
            ? "Photos do not meet requirements"
            : undefined,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this snapshot?")) {
      try {
        await deleteSnapshot(snapshot.id);
      } catch (error) {
        console.error("Failed to delete snapshot:", error);
        alert("Failed to delete snapshot");
      }
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">
            Created: {snapshot.createdAt.toLocaleDateString()}
          </p>
          <p
            className={`text-sm ${
              snapshot.status === SnapshotStatus.Approved
                ? "text-green-600"
                : snapshot.status === SnapshotStatus.Rejected
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            Status: {snapshot.status}
          </p>
          {snapshot.feedback && (
            <p className="text-sm text-gray-600">
              Feedback: {snapshot.feedback}
            </p>
          )}
        </div>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-800 disabled:text-gray-400"
        >
          Delete
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium mb-1">Front View</p>
          <img
            src={`http://localhost:3000/${snapshot.frontPhoto}`}
            alt="Front view"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Top View</p>
          <img
            src={`http://localhost:3000/${snapshot.topPhoto}`}
            alt="Top view"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      </div>

      {/* {snapshot.status === SnapshotStatus.Pending && (
        <div className="flex space-x-2">
          <button
            onClick={() => handleStatusUpdate(SnapshotStatus.Approved)}
            disabled={isUpdating}
            className="bg-green-500 text-white px-4 py-2 rounded-lg
                     hover:bg-green-600 disabled:bg-gray-300"
          >
            Approve
          </button>
          <button
            onClick={() => handleStatusUpdate(SnapshotStatus.Rejected)}
            disabled={isUpdating}
            className="bg-red-500 text-white px-4 py-2 rounded-lg
                     hover:bg-red-600 disabled:bg-gray-300"
          >
            Reject
          </button>
        </div>
      )} */}
    </div>
  );
};
