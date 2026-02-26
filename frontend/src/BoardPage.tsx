import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./auth";
import { TitleBar } from "./TitleBar";
import { CreateBugModal } from "./CreateBugModal";

interface BugRow {
  id: number;
  title: string;
  severity: string;
  owner: string;
}

export function BoardPage() {
  const { user } = useAuth();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [bugs, setBugs] = useState<BugRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBugs = useCallback(async () => {
    try {
      const res = await fetch("/api/bugs");
      if (res.ok) {
        const data = (await res.json()) as Array<{ id: number; title: string; severity: string; owner: string }>;
        setBugs(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBugs();
  }, [fetchBugs]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-100">
      <TitleBar onNewBug={() => setCreateModalOpen(true)} />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <section className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left" aria-label="Bugs">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50/80 text-stone-600 text-sm font-medium uppercase tracking-wide">
                    <th className="px-4 py-3 w-20" scope="col">ID</th>
                    <th className="px-4 py-3 w-24" scope="col">Severity</th>
                    <th className="px-4 py-3" scope="col">Title</th>
                    <th className="px-4 py-3 w-40" scope="col">Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-stone-500">
                        Loading…
                      </td>
                    </tr>
                  ) : (
                    bugs.map((bug) => (
                      <tr
                        key={bug.id}
                        className="border-b border-stone-100 hover:bg-stone-50/80 transition-colors"
                      >
                        <td className="px-4 py-3 text-stone-500 font-mono text-sm">{bug.id}</td>
                        <td className="px-4 py-3 text-stone-800">{bug.severity.toUpperCase()}</td>
                        <td className="px-4 py-3 text-stone-800">{bug.title}</td>
                        <td className="px-4 py-3 text-stone-600">{bug.owner}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <CreateBugModal
        isOpen={createModalOpen}
        defaultOwner={user?.username ?? ""}
        onClose={() => setCreateModalOpen(false)}
        onSaved={fetchBugs}
      />
    </div>
  );
}
