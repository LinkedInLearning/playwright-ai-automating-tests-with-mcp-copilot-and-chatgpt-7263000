import { useAuth } from "./auth";
import { TitleBar } from "./TitleBar";

export function BoardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-stone-100">
      <TitleBar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl text-stone-600">
            Welcome{user?.username ? `, ${user.username}` : ""}!
          </p>
        </div>
      </main>
    </div>
  );
}
