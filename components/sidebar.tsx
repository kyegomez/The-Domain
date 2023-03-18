//@ts-ignore

import React from 'react';
import { useRouter } from 'next/router';
import data from "public/data.svg";
import * as Avatar from "@radix-ui/react-avatar";


interface SidebarItemProps {
  icon: React.ReactNode;
  url: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, url }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(url);
  };

  return (
    <button
      onClick={handleClick}
      className="cursor-pointer p-4 bg-white rounded-md border-none appearance-none focus:outline-none"
    >
      {icon}
    </button>
  );
};

const avatar = () => {
    <div style={{ display: 'flex', gap: 20}}>
        <Avatar.Root className="AvatarRoot">
            <Avatar.Fallback className="AvatarFallback">Hu</Avatar.Fallback>
        </Avatar.Root>
    </div>
}

const Sidebar: React.FC = () => {
  return (
    <nav className="flex flex-col gap-2 w-16 p-4">
      <SidebarItem icon={<div className="w-6 h-6 bg-gray-500" />} url="/page1" />
      <SidebarItem icon={<div className="w-6 h-6 bg-gray-500" />} url="/page2" />
      <SidebarItem icon={data} url="/page3" />
    </nav>
  );
};

export default Sidebar;