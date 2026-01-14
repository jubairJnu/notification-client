import { NavLink } from "react-router";
const navClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition
   ${isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`;

const Navbar = () => {
  return (
    <div>
      <header className="h-14 border-b bg-gray-50  ">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
          <div className="text-lg font-bold text-gray-900">My App</div>

          <nav className="flex items-center gap-2">
            <NavLink to="/notifications" className={navClass}>
              Notifications
            </NavLink>
            <NavLink to="/settings/notifications" className={navClass}>
              Notification Settings
            </NavLink>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
