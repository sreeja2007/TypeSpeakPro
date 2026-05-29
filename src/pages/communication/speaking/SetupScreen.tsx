import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UserProfile, AVATARS, Language, Level, AvatarId } from '@/data/speakingGameData';
import { Check, User } from 'lucide-react';

interface SetupScreenProps {
    onComplete: (profile: UserProfile) => void;
}

const LANGUAGES: Language[] = ['English', 'Hindi', 'Spanish', 'French'];
const LEVELS: Level[] = ['Beginner', 'Intermediate', 'Advanced'];

const SetupScreen: React.FC<SetupScreenProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [language, setLanguage] = useState<Language>('English');
    const [level, setLevel] = useState<Level>('Beginner');
    const [avatar, setAvatar] = useState<AvatarId>('adventurer');

    const handleNext = () => {
        if (step === 1 && name.trim()) {
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        } else if (step === 3) {
            // Finish
            const newProfile: UserProfile = {
                name,
                language,
                level,
                avatar,
                xp: 0,
                coins: 0,
                streak: 0,
                unlockedZones: [1, 2, 3, 4, 5] // All zones unlocked by default
            };
            onComplete(newProfile);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto animate-in slide-in-from-bottom-5">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-400 mb-2">
                    Start Your Journey
                </h1>
                <p className="text-muted-foreground">Step {step} of 3</p>
            </div>

            <Card className="bg-card/50 border-border backdrop-blur-xl">
                <CardContent className="p-8">
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-center">What should we call you?</h2>
                            <div className="flex justify-center">
                                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                                    <User className="w-10 h-10 text-muted-foreground" />
                                </div>
                            </div>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your explorer name..."
                                className="bg-background border-border text-center text-lg h-14"
                                autoFocus
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-lg font-medium mb-4 text-center">I want to learn...</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {LANGUAGES.map(lang => (
                                        <button
                                            key={lang}
                                            onClick={() => setLanguage(lang)}
                                            className={`p-4 rounded-xl border transition-all ${language === lang
                                                ? 'bg-teal-500/20 border-teal-500 text-teal-400'
                                                : 'bg-muted border-border hover:bg-muted'
                                                }`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-medium mb-4 text-center">My current level is...</h2>
                                <div className="grid grid-cols-3 gap-3">
                                    {LEVELS.map(l => (
                                        <button
                                            key={l}
                                            onClick={() => setLevel(l)}
                                            className={`p-3 rounded-xl border text-sm transition-all ${level === l
                                                ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                                                : 'bg-muted border-border hover:bg-muted'
                                                }`}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-center">Choose your Avatar</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {AVATARS.map(a => (
                                    <button
                                        key={a.id}
                                        onClick={() => setAvatar(a.id as AvatarId)} // Cast strictly even though it matches
                                        className={`p-4 rounded-xl border transition-all text-left flex items-center gap-4 ${avatar === a.id
                                            ? a.style + ' ring-2 ring-offset-2 ring-offset-black ring-white/20'
                                            : 'bg-muted border-border hover:bg-muted opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <div className="text-4xl">{a.emoji}</div>
                                        <div>
                                            <div className="font-bold">{a.name}</div>
                                            <div className="text-[10px] uppercase opacity-50">Select</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <Button
                            size="lg"
                            disabled={step === 1 && !name}
                            onClick={handleNext}
                            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {step === 3 ? 'Enter World 🌍' : 'Next Step'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SetupScreen;
