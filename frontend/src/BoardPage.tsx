import { useState } from "react";
import { useAuth } from "./auth";
import { TitleBar } from "./TitleBar";
import { CreateBugModal } from "./CreateBugModal";

export function BoardPage() {
  const { user } = useAuth();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-stone-100">
      <TitleBar onNewBug={() => setCreateModalOpen(true)} />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto" />
      </main>
      <CreateBugModal
        isOpen={createModalOpen}
        defaultOwner={user?.username ?? ""}
        onClose={() => setCreateModalOpen(false)}
        onSaved={() => {}}
      />
    </div>
  );
}
