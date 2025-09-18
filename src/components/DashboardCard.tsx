"use client";

import { useRouter } from "next/navigation";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: string;
  route: string;
}

export default function DashboardCard({
  title,
  description,
  icon,
  route,
}: DashboardCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white border-2 border-green-200 rounded-lg cursor-pointer hover:border-green-400 hover:shadow-md transition-all duration-200"
    >
      <div className="bg-green-100 border-b-2 border-green-200 p-4 rounded-t-lg text-center">
        <div className="text-3xl mb-2">{icon}</div>
        <h3 className="text-lg font-bold text-green-800">{title}</h3>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-700 mb-3">{description}</p>

        <div className="flex justify-end">
          <span className="text-green-700 text-sm font-semibold">
            Acessar →
          </span>
        </div>
      </div>
    </div>
  );
}
