import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, Rocket, Calendar, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FutureInnovationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FutureInnovationModal = ({ isOpen, onClose }: FutureInnovationModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-[#0f172a]/95 backdrop-blur-3xl border-white/10 p-0 overflow-hidden shadow-2xl">
                {/* Dynamic Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent pointer-events-none" />

                {/* Hero Section */}
                <div className="relative p-8 flex flex-col items-center justify-center text-center space-y-4 pt-12 overflow-hidden">
                    {/* Floating Ethereal Orbs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-[60px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

                    <div className="relative z-10 p-4 bg-gradient-to-b from-white/10 to-white/5 rounded-full border border-white/20 shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)] animate-float">
                        <Crown className="w-10 h-10 text-purple-300" />
                    </div>

                    <div className="space-y-2 relative z-10">
                        <DialogTitle className="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-200">
                            Prime Version
                        </DialogTitle>
                        <p className="text-purple-300/80 font-medium tracking-widest uppercase text-xs">The Future of Communication</p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-8 pb-8 space-y-6 relative z-10">
                    <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <Rocket className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white">Advanced AI Analysis</h4>
                                <p className="text-xs text-muted-foreground mt-1">Real-time voice modulation breakdown and sentiment scoring.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-pink-500/20 rounded-lg">
                                <Lock className="w-5 h-5 text-pink-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white">Exclusive Scenarios</h4>
                                <p className="text-xs text-muted-foreground mt-1">Access to C-Suite interview simulations and high-stakes negotiation.</p>
                            </div>
                        </div>
                    </div>

                    {/* Launch Date */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-purple-300" />
                            <span className="text-sm font-semibold text-purple-100">Official Launch</span>
                        </div>
                        <span className="text-lg font-bold text-white tracking-wide">Feb 14, 2026</span>
                    </div>

                    <Button
                        onClick={onClose}
                        className="w-full bg-white text-black hover:bg-neutral-200 font-bold transition-all h-12 rounded-xl shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:scale-[1.02]"
                    >
                        <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                        Notify Me
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FutureInnovationModal;
