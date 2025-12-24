import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    login: (provider: string) => Promise<void>; // ทำให้เป็น Promise เพื่อรอโหลดได้
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // เช็คว่ามี User ค้างอยู่ใน localStorage ไหม (จำลอง Persistent Login)
    useEffect(() => {
        const storedUser = localStorage.getItem('app_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (provider: string) => {
        return new Promise<void>((resolve) => {
            // --- Mock Login Logic ---
            setTimeout(() => {
                const mockUser = {
                    id: 'u_' + Math.floor(Math.random() * 10000),
                    name: 'Guest User',
                    email: 'user@example.com',
                    avatar: `https://ui-avatars.com/api/?name=Guest+User&background=random&color=fff`
                };
                setUser(mockUser);
                localStorage.setItem('app_user', JSON.stringify(mockUser));
                resolve();
            }, 800); // จำลอง Delay 0.8 วิ
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('app_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};