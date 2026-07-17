import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.headerLeft}>
                    <button
                        className={styles.menuToggle}
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" strokeLinecap="round" />
                            <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" strokeLinecap="round" />
                            <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                    <h1 className={styles.logo}>SaraS Ai Bot</h1>
                </div>

                <div className={styles.headerRight}>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>Welcome, User</span>
                        <button
                            className={styles.logoutBtn}
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;