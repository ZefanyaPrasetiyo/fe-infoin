"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import DialogCreateReport from "@/components/dialogReport/dialogCreateReport";
import {
  LayoutGrid,
  Users,
  Database,
  ChevronDown,
  ArrowLeftRight,
  Package,
  Archive,
   Inbox,
  Ellipsis,
  ArrowDownUp,
  Layers,
  Megaphone,
  MessageCircle,
  SendHorizontal,
  History,
  MapPinned,
   House,
  Search,
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  isDialog?: boolean;
};

const navItems: NavItem[] = [
  {
    icon: <LayoutGrid />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    name: "Master Data",
    icon: <Database />,
    subItems: [
      { name: "Lokasi", path: "/location", pro: false },
      { name: "Kategori", path: "/category", pro: false },
      { name: "Petugas", path: "/employees", pro: false },
    ],
  },
  {
    icon: < Inbox />,
    name: "Laporan masuk",
    path: "/reports",
  },
  {
    icon: <Users />,
    name: "Pengguna",
    path: "/users",
  },
      {
        icon: <House />,
        name: "Beranda",
        path: "/home",
      },
  {
    icon: <Megaphone />,
    name: "Lapor",
    path: "/report",
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
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

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
                className={`menu-item group group transition-colors duration-200 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 ${
                 isActive(nav.path) ? "menu-item-active bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                    ? "menu-item-icon-active text-emerald-600 dark:text-emerald-400"
                      : "menu-item-icon-inactive group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
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

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
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
              <>
                <div className="flex gap-2 text-2xl dark:hidden ">
                  <Layers size={30} className="text-blue-600" />
                  <span className="font-outfit font-extrabold">INFOIN</span>
                </div>
                <div className="hidden gap-2 text-2xl dark:flex">
                  <Layers size={30} className="text-blue-600" />
                  <span className="font-outfit font-bold text-white">
                    INFOIN
                  </span>
                </div>
              </>
            ) : (
              <Image
                src="/images/logo/logo-icon.svg"
                alt="Logo"
                width={32}
                height={32}
              />
            )}
          </Link>
        </div>
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mb-6">
            <div className="flex flex-col gap-4">
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
                {renderMenuItems(navItems, "main")}
              </div>

              <div className="">
                <h2
                  className={`mb-4 flex text-xs uppercase leading-5 text-gray-400 ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                ></h2>
              </div>
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
