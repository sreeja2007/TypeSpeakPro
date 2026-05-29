
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PracticeConfig from '@/components/voice/PracticeConfig';
import PracticeSession from '@/components/voice/PracticeSession';
import PracticeFeedback from '@/components/voice/PracticeFeedback';
import { VOICE_DATA } from '@/data/voice-practice';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// HR Module Imports
import { InterviewProvider } from '@/context/InterviewContext';
import HRLevelSelect from '@/pages/hr/HRLevelSelect';
import HRSession from '@/pages/hr/InterviewSession';
import InterviewSummary from '@/pages/hr/InterviewSummary';

type Step = 'config' | 'session' | 'feedback';

const PracticeHub = () => {
    const { module } = useParams<{ module: string }>();
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('config');
    const [sessionConfig, setSessionConfig] = useState<any>(null);
    const [results, setResults] = useState<any>(null);

    // Validate module
    const currentModule = module ? VOICE_DATA[module] : null;

    useEffect(() => {
        if (currentModule) {
            setStep('config');
        }
    }, [module]);

    const handleStart = (config: any) => {
        setSessionConfig({ ...config, moduleType: currentModule?.id });
        setStep('session');
    };

    const handleComplete = (res: any) => {
        setResults(res);
        setStep('feedback');
    };

    const handleRetry = () => {
        setStep('session');
    };

    const handleHRComplete = () => {
        setStep('feedback');
    };

    if (!currentModule) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center flex-col gap-4">
                <h1 className="text-2xl">Module not found</h1>
                <Button onClick={() => navigate('/voice-practice')}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-teal-500/30 flex flex-col">
            <Navbar forceOpaque={true} />

            <main className="flex-1 container mx-auto px-4 pt-20 pb-4">
                {currentModule.id !== 'hr' && (
                    <div className="mb-8">
                        <Button variant="ghost" className="pl-0 hover:text-teal-400 text-muted-foreground" onClick={() => navigate('/voice-practice')}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Modules
                        </Button>
                        <h1 className="text-3xl font-bold mt-2">{currentModule.title}</h1>
                        <p className="text-muted-foreground">{currentModule.description}</p>
                    </div>
                )}

                {/* HR Module Flow */}
                {currentModule.id === 'hr' ? (
                    <InterviewProvider>
                        {step === 'config' && (
                            <HRLevelSelect
                                onStart={(config) => {
                                    setSessionConfig(config);
                                    setStep('session');
                                }}
                            />
                        )}
                        {step === 'session' && (
                            <HRSession
                                config={sessionConfig}
                                onComplete={handleHRComplete}
                                onCancel={() => setStep('config')}
                            />
                        )}
                        {step === 'feedback' && (
                            <InterviewSummary
                                onRestart={() => setStep('config')}
                            />
                        )}
                    </InterviewProvider>
                ) : (
                    /* Standard Flow */
                    <>
                        {step === 'config' && (
                            <PracticeConfig module={currentModule} onStart={handleStart} />
                        )}

                        {step === 'session' && (
                            <PracticeSession
                                config={sessionConfig}
                                onComplete={handleComplete}
                                onCancel={() => setStep('config')}
                            />
                        )}

                        {step === 'feedback' && (
                            <PracticeFeedback
                                results={results}
                                onRetry={handleRetry}
                            />
                        )}
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default PracticeHub;
