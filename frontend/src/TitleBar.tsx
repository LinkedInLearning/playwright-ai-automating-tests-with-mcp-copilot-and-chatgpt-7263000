import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";

interface TitleBarProps {
  /** When provided, a "New Bug" button is shown in the title bar that calls this when clicked. */
  onNewBug?: () => void;
}

export function TitleBar({ onNewBug }: TitleBarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="flex items-center justify-between gap-4 bg-white border-b border-stone-200 px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex-shrink-0 rounded-lg overflow-hidden bg-stone-200 ring-1 ring-stone-300">
          <img
            src="/logo_50x50.png"
            alt="BuggyBoard"
            width={50}
            height={50}
            className="block"
          />
        </div>
        <h1 className="text-3xl font-bold text-stone-800 truncate">BuggyBoard</h1>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {onNewBug != null && (
          <button
            type="button"
            onClick={onNewBug}
            className="rounded px-4 py-2 text-base font-medium text-stone-700 bg-primary/20 hover:bg-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            New Bug
          </button>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="rounded px-4 py-2 text-base font-medium text-stone-700 bg-primary/20 hover:bg-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
