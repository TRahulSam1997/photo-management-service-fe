import React from "react";
import { Snapshot, SnapshotStatus } from "../types/snapshot";
import { useSnapshots } from "../hooks/useSnapshot";
import { API_BASE_URL, STATUS_COLORS } from "../utils/constants";
import { snapshotApi } from "../services/api";

interface SnapshotItemProps {
  snapshot: Snapshot;
}

export const SnapshotItem: React.FC<SnapshotItemProps> = ({ snapshot }) => {
  const { deleteSnapshot, isDeleting } = useSnapshots();

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
      {/* Status and Delete section */}
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">
            Created: {snapshot.createdAt.toLocaleDateString()}
          </p>
          <p
            className={`text-sm ${
              snapshot.status === SnapshotStatus.Approved
                ? STATUS_COLORS.approved
                : snapshot.status === SnapshotStatus.Rejected
                ? STATUS_COLORS.rejected
                : STATUS_COLORS.pending
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

      {/* Photos section */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium mb-1">Front View</p>
          <img
            src={snapshotApi.getImageUrl(snapshot.frontPhoto)}
            alt="Front view"
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              console.error("Failed to load image:", snapshot.frontPhoto);
              e.currentTarget.src = "/placeholder-image.png"; // Optional: show placeholder on error
            }}
          />
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Top View</p>
          <img
            src={snapshotApi.getImageUrl(snapshot.topPhoto)}
            alt="Top view"
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              console.error("Failed to load image:", snapshot.topPhoto);
              e.currentTarget.src = "/placeholder-image.png"; // Optional: show placeholder on error
            }}
          />
        </div>
      </div>
    </div>
  );
};
