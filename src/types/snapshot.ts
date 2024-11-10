export enum SnapshotStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

export interface Snapshot {
  id: string;
  createdAt: Date;
  frontPhoto: string;
  topPhoto: string;
  status: SnapshotStatus;
  feedback?: string;
}

export interface CreateSnapshotDTO {
  frontPhoto: File;
  topPhoto: File;
}
