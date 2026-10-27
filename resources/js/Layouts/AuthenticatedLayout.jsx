import { useState } from 'react';
import Sidebar from '@/Components/Sidebar';
import Topbar from '@/Components/Topbar';
import Toast from '@/Components/Toast';

export default function AuthenticatedLayout({ header, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Global Flash Toast */}
            <Toast />

            {/* Sidebar Navigation */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col lg:pl-72 transition-all duration-300">
                <Topbar onMenuClick={() => setSidebarOpen(true)} />

                {header && (
                    <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                )}

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
