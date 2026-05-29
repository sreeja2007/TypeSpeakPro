import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PracticeConfig from '@/components/voice/PracticeConfig';
import PracticeSession from '@/components/voice/PracticeSession';
import PracticeFeedback from '@/components/voice/PracticeFeedback';

type Step = 'config' | 'session' | 'feedback';

const CommunicationPractice = () => {
    const [step, setStep] = useState<Step>('config');
    const [sessionConfig, setSessionConfig] = useState({ language: 'en-US', mode: 'speak' });
    const [sessionResults, setSessionResults] = useState<any>(null);

    const handleStart = (config: { language: string; mode: string }) => {
        setSessionConfig(config);
        setStep('session');
    };

    const handleComplete = (results: any) => {
        setSessionResults(results);
        setStep('feedback');
    };

    const handleRetry = () => {
        setStep('session');
    };

    const handleCancel = () => {
        setStep('config');
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-teal-500/30 flex flex-col">
            <Navbar forceOpaque={true} />

            <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
                {/* Simple Progress Indicator */}
                <div className="flex items-center justify-center gap-2 mb-12">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-1 flex-1 max-w-[50px] rounded-full transition-colors duration-300 
                        ${(step === 'config' && s === 1) || (step === 'session' && s <= 2) || (step === 'feedback' && s <= 3)
                                    ? 'bg-teal-500'
                                    : 'bg-muted'
                                }`}
                        />
                    ))}
                </div>

                {/* Steps */}
                {step === 'config' && <PracticeConfig onStart={handleStart} />}
                {step === 'session' && (
                    <PracticeSession
                        config={sessionConfig}
                        onComplete={handleComplete}
                        onCancel={handleCancel}
                    />
                )}
                {step === 'feedback' && (
                    <PracticeFeedback
                        results={sessionResults}
                        onRetry={handleRetry}
                    />
                )}

            </main>

            <Footer />
        </div>
    );
};

export default CommunicationPractice;
