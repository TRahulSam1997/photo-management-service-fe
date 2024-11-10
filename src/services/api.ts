import axios from "axios";
import { Snapshot, CreateSnapshotDTO, SnapshotStatus } from "../types/snapshot";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
});

export const snapshotApi = {
  getAll: async (): Promise<Snapshot[]> => {
    const { data } = await api.get<Snapshot[]>("/snapshots");
    return data.map((snapshot) => ({
      ...snapshot,
      createdAt: new Date(snapshot.createdAt),
    }));
  },

  create: async (dto: CreateSnapshotDTO): Promise<Snapshot> => {
    const formData = new FormData();
    formData.append("frontPhoto", dto.frontPhoto);
    formData.append("topPhoto", dto.topPhoto);

    const { data } = await api.post<Snapshot>("/snapshots", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      ...data,
      createdAt: new Date(data.createdAt),
    };
  },

  updateStatus: async (
    id: string,
    status: SnapshotStatus,
    feedback?: string
  ): Promise<Snapshot> => {
    const { data } = await api.patch<Snapshot>(`/snapshots/${id}/status`, {
      status,
      feedback,
    });

    return {
      ...data,
      createdAt: new Date(data.createdAt),
    };
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/snapshots/${id}`);
  },
};
