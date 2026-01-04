import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Logo from "@/components/logo";

// Define the BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
    prompt: () => Promise<void>;
}

interface PWAContextType {
    isInstallable: boolean;
    install: () => Promise<void>;
    showModal: boolean;
    setShowModal: (show: boolean) => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const PWAProvider = ({ children }: { children: ReactNode }) => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const install = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
        setShowModal(false);
    };

    return (
        <PWAContext.Provider value={{
            isInstallable: !!deferredPrompt,
            install,
            showModal,
            setShowModal
        }}>
            {children}
            {showModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 99999,
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}
                >
                    <div
                        className="pwa-modal"
                        style={{
                            backgroundColor: '#191919',
                            padding: '2.5rem',
                            borderRadius: '16px',
                            maxWidth: '400px',
                            width: '90%',
                            textAlign: 'center',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        <div className="mb-4 d-flex justify-content-center">
                            <Logo />
                        </div>
                        <h3 className="text-white mb-3" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Install App</h3>
                        <p className="text-gray-400 mb-4" style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.5' }}>
                            Install our application for the best streaming experience, offline access, and faster performance.
                        </p>

                        <button
                            onClick={install}
                            className="btn btn-primary w-100 py-3 rounded-3"
                            style={{
                                fontWeight: 600,
                                letterSpacing: '0.5px',
                                boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)'
                            }}
                        >
                            INSTALL NOW
                        </button>
                    </div>
                </div>
            )}
        </PWAContext.Provider>
    );
};

export const usePWA = () => {
    const context = useContext(PWAContext);
    if (!context) {
        throw new Error("usePWA must be used within a PWAProvider");
    }
    return context;
};
