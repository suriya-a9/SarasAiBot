import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';
import {
    LayoutDashboard,
    MessageSquare,
    BarChart3,
    Settings,
    CircleHelp,
} from "lucide-react";

const Sidebar = ({ isOpen, isMobile, closeSidebar }) => {
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
        {
            id: "dashboard",
            label: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
            submenu: null,
        },
        {
            id: "chat",
            label: "Chat",
            path: "/chat",
            icon: MessageSquare,
            submenu: null,
        },
        {
            id: "analytics",
            label: "Analytics",
            path: "/analytics",
            icon: BarChart3,
            submenu: null,
        },
        {
            id: "settings",
            label: "Settings",
            path: "/settings",
            icon: Settings,
            submenu: null,
        },
        {
            id: "help",
            label: "Help & Support",
            path: "/help",
            icon: CircleHelp,
            submenu: null,
        },
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



    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            {isOpen && (
                <div
                    className={styles.sidebarOverlay}
                    onClick={closeSidebar}
                />
            )}

            <aside className={`${styles.sidebar} ${isMobile && isOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <button
                        className={styles.closeBtn}
                        onClick={closeSidebar}
                        aria-label="Close sidebar"
                    >
                        ✕
                    </button>
                </div>

                <nav className={styles.sidebarNav}>
                    <ul className={styles.navList}>
                        {navigationItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <li key={item.id} className={styles.navItem}>
                                    <div className={styles.navItemContainer}>
                                        <button
                                            className={`${styles.navLink} ${isActive(item.path) ? styles.active : ""}`}
                                            onClick={() => handleNavigation(item.path)}
                                            aria-label={item.label}
                                        >
                                            <span className={styles.navIcon}>
                                                <Icon size={20} />
                                            </span>
                                            {item.hasNotification && <span className={styles.navBadge} />}
                                            <span className={styles.navLabel}>{item.label}</span>
                                            <span className={styles.tooltip}>{item.label.toUpperCase()}</span>
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.accountWrap} ref={accountRef}>
                        <button
                            className={styles.accountBtn}
                            onClick={() => setAccountOpen((prev) => !prev)}
                            aria-haspopup="true"
                            aria-expanded={accountOpen}
                        >
                            <div className={styles.accountAvatar}>
                                {name ? name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </button>

                        <div className={`${styles.accountMenu} ${accountOpen ? styles.accountMenuOpen : ''}`}>
                            <button
                                className={styles.accountMenuItem}
                                onClick={() => { navigate('/profile'); setAccountOpen(false); closeSidebar(); }}
                            >
                                Profile
                            </button>
                            <button className={styles.accountMenuItem} onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>

                    <p className={styles.versionText}>v1.0.0</p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;