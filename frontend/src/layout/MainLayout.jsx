import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const updateResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) {
                setIsSidebarOpen(false);
            }
        };

        updateResize();
        window.addEventListener('resize', updateResize);
        return () => window.removeEventListener('resize', updateResize);
    }, []);

    const toggleSidebar = () => {
        if (isMobile) setIsSidebarOpen((prev) => !prev);
    };

    const closeSidebar = () => {
        if (isMobile) setIsSidebarOpen(false);
    };

    return (
        <div className={styles.layoutContainer}>

            <div className={styles.mainContent}>
                {isMobile && (
                    <button
                        className={styles.mobileSidebarToggle}
                        onClick={toggleSidebar}
                        aria-label="Open navigation"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                )}

                <Sidebar
                    isOpen={isSidebarOpen}
                    isMobile={isMobile}
                    closeSidebar={closeSidebar}
                />

                <main className={styles.pageContent}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;