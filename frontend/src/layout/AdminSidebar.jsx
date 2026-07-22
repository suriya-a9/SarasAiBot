import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AdminAuthContext';
import {
    LayoutDashboard,
    BarChart3,
    Settings,
    CircleHelp,
    Bot,
    User,
    UsersRound
} from "lucide-react";

const AdminSidebar = ({ isOpen, isMobile, closeSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { logout, name } = useAuth();
    const [accountOpen, setAccountOpen] = useState(false);
    const accountRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (accountRef.current && !accountRef.current.contains(e.target)) {
                setAccountOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navigationItems = [
        { id: "admin-dashboard", label: "Dashboard", path: "/admin-dashboard", icon: LayoutDashboard, submenu: null },
        { id: "client", label: "Clients", path: "/admin-client", icon: UsersRound, submenu: null },
        // { id: "analytics", label: "Analytics", path: "/analytics", icon: BarChart3, submenu: null },
        // { id: "settings", label: "Settings", path: "/settings", icon: Settings, submenu: null },
        // { id: "help", label: "Help & Support", path: "/help", icon: CircleHelp, submenu: null },
    ];

    const handleNavigation = (path) => {
        if (path) {
            navigate(path);
            closeSidebar();
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-85 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 h-screen w-62.5 bg-white flex flex-col p-0 items-stretch
                    z-90 shadow-[2px_0_8px_rgba(0,0,0,0.15)] transition-transform duration-300
                    md:static md:h-auto md:w-19 md:items-center md:py-4
                    md:shadow-[1px_0_3px_rgba(0,0,0,0.06)] md:translate-x-0
                    ${isMobile && isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                <div className="flex justify-end p-4 md:hidden">
                    <button
                        className="bg-transparent border-none text-2xl text-[#666] cursor-pointer p-0 transition-colors duration-200 hover:text-[#2d1b4e]"
                        onClick={closeSidebar}
                        aria-label="Close sidebar"
                    >
                        ✕
                    </button>
                </div>

                <nav className="flex-1 overflow-visible py-2 w-full">
                    <ul className="list-none m-0 p-0 w-full flex flex-col items-stretch gap-0 md:items-center md:gap-2.5">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <li key={item.id} className="w-full flex justify-center">
                                    <div className="flex items-center justify-center w-full">
                                        <button
                                            className={`
                                                group relative w-full h-auto flex items-center justify-start
                                                bg-transparent border-none text-[#4a5568] cursor-pointer rounded-none
                                                gap-3 px-5 py-3.5 text-[0.95rem] font-medium
                                                transition-colors duration-200
                                                md:w-11 md:h-10 md:justify-center md:rounded-xl md:gap-0
                                                md:px-0 md:py-0 md:text-base md:font-normal
                                                ${active
                                                    ? 'bg-linear-to-br from-[#6b46c1] to-[#4c2a7a] text-white'
                                                    : 'hover:bg-[#f0f2f5] hover:text-[#2d1b4e]'}
                                            `}
                                            onClick={() => handleNavigation(item.path)}
                                            aria-label={item.label}
                                        >
                                            <span className="text-xl flex items-center justify-center">
                                                <Icon size={20} />
                                            </span>
                                            {item.hasNotification && (
                                                <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-[#e53e3e] border-[1.5px] border-white" />
                                            )}
                                            <span className="block md:hidden">{item.label}</span>
                                            <span className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#1f1a44] text-white px-[0.9rem] py-[0.35rem] rounded-full text-xs font-semibold tracking-wide opacity-0 pointer-events-none transition-all duration-200 ml-[0.6rem] z-150 group-hover:opacity-100 group-hover:translate-x-1">
                                                {item.label.toUpperCase()}
                                            </span>
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="py-4 text-center w-full">
                    <div
                        className="relative flex flex-row items-center justify-between gap-2 px-6 w-full md:flex-col md:justify-center md:px-0"
                        ref={accountRef}
                    >
                        <button
                            className="group relative flex items-center justify-center gap-0 p-0 w-auto bg-transparent border-none cursor-pointer"
                            onClick={() => setAccountOpen((prev) => !prev)}
                            aria-haspopup="true"
                            aria-expanded={accountOpen}
                        >
                            <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#6b46c1] to-[#4c2a7a] text-white flex items-center justify-center font-bold">
                                <User size={18} strokeWidth={2.2} />
                            </div>

                            <span className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#1f1a44] text-white px-[0.9rem] py-[0.35rem] rounded-full text-xs font-semibold tracking-wide opacity-0 pointer-events-none transition-all duration-200 ml-[0.6rem] z-150 group-hover:opacity-100 group-hover:translate-x-1">
                                PROFILE
                            </span>
                        </button>

                        <div
                            className={`
                                absolute left-0 right-0 bottom-14 ml-0 w-[calc(100%-3rem)]
                                bg-white border border-[#e6e6ef] shadow-[0_6px_18px_rgba(33,33,66,0.12)]
                                rounded-lg py-2 flex-col z-200
                                md:left-full md:right-auto md:bottom-0 md:ml-3 md:w-auto md:min-w-40
                                ${accountOpen ? 'flex' : 'hidden'}
                            `}
                        >
                            <button
                                className="bg-transparent border-none px-4 py-2.5 text-left cursor-pointer text-[#333] hover:bg-[#f5f7fa]"
                                onClick={() => { navigate('/admin-profile'); setAccountOpen(false); closeSidebar(); }}
                            >
                                Profile
                            </button>
                            <button
                                className="bg-transparent border-none px-4 py-2.5 text-left cursor-pointer text-[#333] hover:bg-[#f5f7fa]"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;