import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Keyboard, Menu } from 'lucide-react';
import TypingTest from '@/components/typing/TypingTest';

const Practice = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col animate-fade-in relative overflow-hidden">
            {/* Subtle Background Gradients */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50 animate-pulse-slow delay-1000"></div>
            </div>

            {/* Minimal Focus Header - Hamburger Menu */}
            <header className="absolute top-0 right-0 p-6 z-50">
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="opacity-50 hover:opacity-100 transition-opacity"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <div className="absolute right-0 top-12 w-48 bg-card border border-border rounded-lg shadow-xl p-2 animate-in fade-in slide-in-from-top-2 flex flex-col gap-1 z-50">
                            <Button variant="ghost" className="justify-start" onClick={() => navigate('/')}>
                                Home
                            </Button>
                            <Button variant="ghost" className="justify-start" onClick={() => navigate('/dashboard')}>
                                Dashboard
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-5xl space-y-8">
                    <TypingTest />
                </div>
            </main>

            {/* Minimal Footer */}
            <footer className="p-6 text-center text-xs text-muted-foreground/30 fixed bottom-0 w-full">
                Press <span className="font-mono bg-white/10 px-1 rounded">Tab</span> to restart • <span className="font-mono bg-white/10 px-1 rounded">Esc</span> to exit
            </footer>
        </div>
    );
};

export default Practice;
