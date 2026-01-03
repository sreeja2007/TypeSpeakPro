import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, Calendar, Bell } from 'lucide-react';

interface ComingSoonModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ComingSoonModal = ({ isOpen, onClose }: ComingSoonModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md border-primary/20 bg-background/95 backdrop-blur-xl">
                <DialogHeader>
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-slow">
                            <Mic className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Voice Practice
                    </DialogTitle>
                    <DialogDescription className="text-center text-lg mt-2 font-medium text-foreground">
                        Coming Soon
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3 border border-border/50">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Launch Date</span>
                            <span className="font-semibold">January 15th, 2026</span>
                        </div>
                    </div>

                    <p className="text-center text-muted-foreground text-sm px-4">
                        We're putting the final touches on our advanced voice recognition engine. Get ready to practice speaking like a pro!
                    </p>
                </div>

                <div className="flex justify-center">
                    <Button onClick={onClose} className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                        Got it, can't wait!
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ComingSoonModal;
