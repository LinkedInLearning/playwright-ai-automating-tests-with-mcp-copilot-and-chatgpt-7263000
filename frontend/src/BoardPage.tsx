import { useAuth } from "./auth";

export function BoardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-stone-800">BuggyBoard</h1>
        <p className="mt-2 text-stone-600">
          Welcome{user?.username ? `, ${user.username}` : ""}!
        </p>
      </div>
    </div>
  );
}
