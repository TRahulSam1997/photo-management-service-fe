import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CameraCapture } from "./components/CameraCapture";
import { SnapshotList } from "./components/SnapshotList";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Photo Management
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4">
          <CameraCapture />
          <div className="my-8">
            <SnapshotList />
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
