import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

const Sidebar = ({ isOpen, closeSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [expandedMenu, setExpandedMenu] = useState(null);

    const navigationItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            path: '/dashboard',
            icon: '📊',
            submenu: null,
        },
        {
            id: 'chat',
            label: 'Chat',
            path: '/chat',
            icon: '💬',
            submenu: null,
        },
        {
            id: 'analytics',
            label: 'Analytics',
            path: '/analytics',
            icon: '📈',
            submenu: null,
        },
        {
            id: 'settings',
            label: 'Settings',
            path: null,
            icon: '⚙️',
            submenu: [
                { label: 'Profile', path: '/settings/profile' },
                { label: 'Preferences', path: '/settings/preferences' },
                { label: 'Security', path: '/settings/security' },
            ],
        },
        {
            id: 'help',
            label: 'Help & Support',
            path: '/help',
            icon: '❓',
            submenu: null,
        },
    ];

    const handleNavigation = (path) => {
        if (path) {
            navigate(path);
            closeSidebar();
        }
    };

    const toggleSubmenu = (itemId) => {
        setExpandedMenu(expandedMenu === itemId ? null : itemId);
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

            <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>Navigation</h2>
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
                        {navigationItems.map((item) => (
                            <li key={item.id} className={styles.navItem}>
                                <div className={styles.navItemContainer}>
                                    <button
                                        className={`${styles.navLink} ${isActive(item.path) ? styles.active : ''
                                            }`}
                                        onClick={() => {
                                            if (item.submenu) {
                                                toggleSubmenu(item.id);
                                            } else {
                                                handleNavigation(item.path);
                                            }
                                        }}
                                    >
                                        <span className={styles.navIcon}>{item.icon}</span>
                                        <span className={styles.navLabel}>{item.label}</span>
                                        {item.submenu && (
                                            <span className={`${styles.submenuArrow} ${expandedMenu === item.id ? styles.expanded : ''
                                                }`}>
                                                ▼
                                            </span>
                                        )}
                                    </button>
                                </div>

                                {item.submenu && (
                                    <ul className={`${styles.submenu} ${expandedMenu === item.id ? styles.submenuOpen : ''
                                        }`}>
                                        {item.submenu.map((subitem, index) => (
                                            <li key={index} className={styles.submenuItem}>
                                                <button
                                                    className={`${styles.submenuLink} ${isActive(subitem.path) ? styles.active : ''
                                                        }`}
                                                    onClick={() => handleNavigation(subitem.path)}
                                                >
                                                    {subitem.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className={styles.sidebarFooter}>
                    <p className={styles.versionText}>v1.0.0</p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;