"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSidebar } from "../context/SidebarContext";
import DialogCreateReport from "@/components/dialogReport/dialogCreateReport";

import {
  LayoutGrid,
  Users,
  Database,
  ChevronDown,
  Inbox,
  Ellipsis,
  Layers,
  Megaphone,
  SendHorizontal,
  History,
  House,
  Search,
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  isDialog?: boolean;
  roles?: string[];
};

// Menu Utama (Atas)
const mainNavItems: NavItem[] = [
  {
    icon: <LayoutGrid />,
    name: "Dashboard",
    path: "/dashboard",
    roles: ["admin", "petugas"],
  },
  {
    name: "Master Data",
    icon: <Database />,
    roles: ["admin"],
    subItems: [
      { name: "Lokasi", path: "/location", pro: false },
      { name: "Kategori", path: "/category", pro: false },
      { name: "Petugas", path: "/employees", pro: false },
    ],
  },
  {
    icon: <Inbox />,
    name: "Laporan masuk",
    path: "/reports",
    roles: ["admin", "petugas"],
  },
  {
    icon: <Users />,
    name: "Pengguna",
    path: "/users",
    roles: ["admin"],
  },
  {
    icon: <House />,
    name: "Beranda",
    path: "/home",
    roles: ["user"],
  },
  {
    icon: <Megaphone />,
    name: "Lapor",
    path: "/report",
    roles: ["user"],
  },
  {
    icon: <Search />,
    name: "Explore",
    path: "/explore",
  },
  {
    icon: <SendHorizontal />,
    name: "Notifikasi",
    path: "/notification",
  },
  {
    icon: <History />,
    name: "Riwayat",
    path: "/history",
    roles: ["user"],
  },
];

const AppSidebar: React.FC = () => {
  const { data: session } = useSession();
  const userRole = session?.user?.role || "user";
  
  const userName = (session?.user as any)?.nama_panjang || session?.user?.name || "User";
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "U";

  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const filteredMainNavItems = mainNavItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  const profileNavItem: NavItem = {
    icon: (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-md font-bold text-emerald-600 ring-2 ring-transparent transition-all duration-200 dark:bg-emerald-500/20 dark:text-emerald-400">
        {userInitials}
      </div>
    ),
    name: "Profile",
    path: "/profile",
  };

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others",
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group transition-colors duration-200 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "menu-item-icon-inactive group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDown
                  className={`ml-auto h-5 w-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-emerald-500"
                      : "group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                  }`}
                />
              )}
            </button>
          ) : nav.isDialog ? (
            <button
              onClick={() => setIsReportDialogOpen(true)}
              className={`menu-item menu-item-inactive group w-full cursor-pointer transition-colors duration-200 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span className="menu-item-icon-inactive group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group transition-colors duration-200 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 ${
                  isActive(nav.path)
                    ? "menu-item-active bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active text-emerald-600 dark:text-emerald-400 [&_div]:ring-emerald-500 dark:[&_div]:ring-emerald-400"
                      : "menu-item-icon-inactive group-hover:text-emerald-600 dark:group-hover:text-emerald-400 [&_div]:group-hover:ring-emerald-500 dark:[&_div]:group-hover:ring-emerald-400"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text `}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="ml-9 mt-2 space-y-1">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="ml-auto flex items-center gap-1">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    let submenuMatched = false;

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0 dark:border-gray-800 dark:bg-gray-900 
        ${
          isExpanded || isMobileOpen
            ? "w-72.5"
            : isHovered
              ? "w-72.5"
              : "w-22.5"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`flex py-8  ${
            !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
        >
      <Link href="/">
            {isExpanded || isHovered || isMobileOpen ? (
              // 🚨 Hapus class 'hidden dark:flex' biar logonya muncul terus di semua tema
              <div className="flex gap-2 text-2xl">
                <Image 
                  src="/images/logo/logo-infoin.png" 
                  alt="Logo Infoin" 
                  width={150} // 🚨 Gua kecilin dikit width-nya biar gak kegedean ngerusak sidebar
                  height={50}
                  priority // Biar loading logonya cepet
                />
              </div>
            ) : (
              // Ini logo icon kecil pas sidebar lagi di-minimize
              <Image
                src="/images/logo/logo-icon.svg"
                alt="Logo"
                width={32}
                height={32}
              />
            )}
          </Link>
        </div>

        <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto pb-6 duration-300 ease-linear">
          <nav className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 flex text-xs uppercase leading-5 text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <Ellipsis />
                )}
              </h2>
              {renderMenuItems(filteredMainNavItems, "main")}
            </div>

            {/* Bagian Bawah - Sekarang nempel langsung di bawah menu utama pakai separator border kecil */}
            <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
              {renderMenuItems([profileNavItem], "others")}
            </div>
          </nav>
        </div>
      </aside>
      
      <DialogCreateReport
        isOpen={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
      />
    </>
  );
};

export default AppSidebar;