"use client";

import { User } from "@/types/user";

interface SidebarProps {
  user: User;
  sidebarExpanded: boolean;
  activeView: string;
  dashboardOptions: any[];
  toggleSidebar: () => void;
  handleNavigation: (view: string) => void;
  handleLogout: () => void;
}

export default function Sidebar({
  user,
  sidebarExpanded,
  activeView,
  dashboardOptions,
  toggleSidebar,
  handleNavigation,
  handleLogout,
}: SidebarProps) {
  // console.log("Rendering Sidebar with user:", user);
  return (
    <div
      className={`relative z-10 transition-all duration-300 ease-in-out ${
        sidebarExpanded ? "w-72" : "w-20"
      }`}
    >
      <div className="h-full bg-gradient-to-b flex flex-col from-blue-50/95 via-blue-100/95 to-blue-50/95 backdrop-blur-xl border-r border-blue-200/30 shadow-2xl">
        {/* Logo Section */}
        <div className="p-6 border-b border-blue-200/30">
          <div className="flex items-center justify-between">
            {sidebarExpanded && (
              <div className="flex items-center space-x-3">
                <div>
                  <h1 className="text-blue-900 font-bold text-lg">Rialma</h1>
                  <p className="text-blue-700 text-xs">
                    Administração e Participações S.A.
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 cursor-pointer rounded-lg bg-blue-200/50 hover:bg-blue-300/50 text-blue-800 transition-colors"
            >
              <svg
                className={`w-5 h-5 transition-transform ${
                  sidebarExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {dashboardOptions.map((option, index) => (
              <div key={index}>
                <button
                  onClick={() => handleNavigation(option.view)}
                  className={`w-full cursor-pointer group flex items-center p-3 rounded-xl text-left transition-all duration-200 ${
                    activeView === option.view
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                      : "text-blue-700 hover:bg-blue-200/50 hover:text-blue-900"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 ${
                      activeView === option.view
                        ? "text-white"
                        : "text-blue-600 group-hover:text-blue-800"
                    }`}
                  >
                    {option.icon}
                  </div>
                  {sidebarExpanded && (
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="font-medium text-sm">{option.title}</div>
                      <div
                        className={`text-xs opacity-75 truncate ${
                          activeView === option.view
                            ? "text-blue-100"
                            : "text-blue-600"
                        }`}
                      >
                        {/* {option.description} */}
                      </div>
                    </div>
                  )}
                  {sidebarExpanded && activeView === option.view && (
                    <div className="flex-shrink-0">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-blue-200/30 my-auto">
          <div
            className={`flex items-center ${
              sidebarExpanded ? "justify-between" : "justify-center"
            }`}
          >
            {sidebarExpanded ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-blue-900 font-medium text-sm">
                      {user.name}
                    </div>
                    <div className="text-blue-700 text-xs">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 cursor-pointer rounded-lg bg-red-200/50 hover:bg-red-300/50 text-red-700 hover:text-red-800 transition-colors"
                  title="Sair"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <div className="relative group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg cursor-pointer">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute left-full ml-2 top-0 bg-blue-800 text-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-blue-200">
                    {user.role === "admin" ? "Administrador" : "Usuário"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
