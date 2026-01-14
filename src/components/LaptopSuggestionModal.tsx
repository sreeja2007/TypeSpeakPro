import React from 'react';
import { Laptop, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LaptopSuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LaptopSuggestionModal: React.FC<LaptopSuggestionModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-sm bg-neutral-900 border border-white/10 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 overflow-hidden">

                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-purple-500 to-teal-500"></div>
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col items-center text-center space-y-6 relative z-10">

                    {/* Icon */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full"></div>
                        <div className="relative w-20 h-20 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl border border-white/10 flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Laptop className="w-10 h-10 text-teal-400" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white tracking-tight">Better on Laptop</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            For the ultimate typing experience and to track your true speed, we recommend switching to a desktop or laptop device.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="w-full pt-2">
                        <Button
                            onClick={onClose}
                            className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-white/10 transition-all active:scale-95"
                        >
                            Continue on Mobile
                        </Button>
                    </div>
                </div>

                {/* Close X (optional, button is main action) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 text-neutral-500 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default LaptopSuggestionModal;
