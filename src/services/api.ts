import axios from "axios";
import { Snapshot, CreateSnapshotDTO, SnapshotStatus } from "../types/snapshot";
import { API_BASE_URL, API_ENDPOINTS } from "../utils/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const snapshotApi = {
  getAll: async (): Promise<Snapshot[]> => {
    const { data } = await api.get<Snapshot[]>(API_ENDPOINTS.SNAPSHOTS);
    return data.map((snapshot) => ({
      ...snapshot,
      createdAt: new Date(snapshot.createdAt),
    }));
  },

  create: async (dto: CreateSnapshotDTO): Promise<Snapshot> => {
    const formData = new FormData();
    formData.append("frontPhoto", dto.frontPhoto);
    formData.append("topPhoto", dto.topPhoto);

    const { data } = await api.post<Snapshot>(
      API_ENDPOINTS.SNAPSHOTS,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

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
    const { data } = await api.patch<Snapshot>(
      `${API_ENDPOINTS.SNAPSHOTS}/${id}/status`,
      {
        status,
        feedback,
      }
    );

    return {
      ...data,
      createdAt: new Date(data.createdAt),
    };
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.SNAPSHOTS}/${id}`);
  },

  // Utility method to get full URL for images
  getImageUrl: (imageName: string): string => {
    return `${API_BASE_URL}/${imageName}`;
  },
};
