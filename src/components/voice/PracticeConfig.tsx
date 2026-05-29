import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PracticeModule } from '@/data/voice-practice';
import { Mic, MessageSquare, Clock, Wind, Timer, Volume2, Briefcase } from 'lucide-react';

interface PracticeConfigProps {
    module: PracticeModule;
    onStart: (config: any) => void;
}

const LANGUAGES = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'hi-IN', label: 'Hindi' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'bn-IN', label: 'Bengali' },
];

const ICONS: any = {
    Mic, MessageSquare, Clock, Wind, Timer, Volume2, Briefcase
};

const PracticeConfig = ({ module, onStart }: PracticeConfigProps) => {
    const [language, setLanguage] = useState('en-US');

    // Dynamic states
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [selectedTopic, setSelectedTopic] = useState<string>('');
    const [selectedSkill, setSelectedSkill] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedMode, setSelectedMode] = useState<string>('');

    // Pre-select first options if available
    React.useEffect(() => {
        if (module.options.levels) setSelectedLevel(module.options.levels[0].id);
        if (module.options.skills) setSelectedSkill(module.options.skills[0].id);
        if (module.options.roles) setSelectedRole(module.options.roles[0].id);
    }, [module]);

    const handleStart = () => {
        const config: any = { language };

        if (module.flow === 'level-topic') {
            config.level = selectedLevel;
            config.topic = selectedTopic || module.options.topics?.[0].id; // Default to first topic if not set
            // Find the topic object to pass type info
            const topicObj = module.options.topics?.find(t => t.id === config.topic);
            config.modeType = topicObj?.type;
        } else if (module.flow === 'skill') {
            config.skill = selectedSkill;
            config.modeType = 'skill'; // Generic skill mode, specific logic in session
        } else if (module.flow === 'role-mode') {
            config.role = selectedRole;
            config.mode = selectedMode || module.options.modes?.[0].id;
            const modeObj = module.options.modes?.find(m => m.id === config.mode);
            config.modeType = modeObj?.type;
        }

        onStart(config);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <Card className="bg-card/50 border-border backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Session Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Language Selection (Common) */}
                    <div className="space-y-2">
                        <Label>Language</Label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="bg-muted border-border text-foreground">
                                <SelectValue placeholder="Select Language" />
                            </SelectTrigger>
                            <SelectContent>
                                {LANGUAGES.map(lang => (
                                    <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Flow: Level -> Topic (Communication) */}
                    {module.flow === 'level-topic' && (
                        <>
                            <div className="space-y-2">
                                <Label>Proficiency Level</Label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {module.options.levels?.map((level) => (
                                        <div
                                            key={level.id}
                                            onClick={() => setSelectedLevel(level.id)}
                                            className={`
                                                cursor-pointer rounded-xl border p-4 transition-all
                                                ${selectedLevel === level.id
                                                    ? 'bg-teal-500/10 border-teal-500 ring-1 ring-teal-500'
                                                    : 'bg-muted border-border hover:bg-muted'
                                                }
                                            `}
                                        >
                                            <h3 className="font-semibold text-foreground">{level.title}</h3>
                                            <p className="text-xs text-muted-foreground">{level.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Focus Topic</Label>
                                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                                    <SelectTrigger className="bg-muted border-border text-foreground">
                                        <SelectValue placeholder="Select Topic" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {module.options.topics?.map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.title} - {t.description}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    {/* Flow: Skill (Verbal) */}
                    {module.flow === 'skill' && (
                        <div className="space-y-2">
                            <Label>Skill Focus</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {module.options.skills?.map((skill) => {
                                    const Icon = skill.icon ? ICONS[skill.icon] : Mic;
                                    return (
                                        <div
                                            key={skill.id}
                                            onClick={() => setSelectedSkill(skill.id)}
                                            className={`
                                                cursor-pointer rounded-xl border p-4 transition-all
                                                ${selectedSkill === skill.id
                                                    ? 'bg-purple-500/10 border-purple-500 ring-1 ring-purple-500'
                                                    : 'bg-muted border-border hover:bg-muted'
                                                }
                                            `}
                                        >
                                            <div className="mb-3 p-2 bg-muted w-fit rounded-lg">
                                                <Icon className="w-5 h-5 text-foreground" />
                                            </div>
                                            <h3 className="font-semibold text-foreground">{skill.title}</h3>
                                            <p className="text-xs text-muted-foreground">{skill.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Flow: Role -> Mode (HR) */}
                    {module.flow === 'role-mode' && (
                        <>
                            <div className="space-y-2">
                                <Label>Experience Level / Role</Label>
                                <Select value={selectedRole} onValueChange={setSelectedRole}>
                                    <SelectTrigger className="bg-muted border-border text-foreground">
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {module.options.roles?.map(r => (
                                            <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Interview Mode</Label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {module.options.modes?.map((mode) => (
                                        <div
                                            key={mode.id}
                                            onClick={() => setSelectedMode(mode.id)}
                                            className={`
                                                cursor-pointer rounded-xl border p-4 transition-all
                                                ${selectedMode === mode.id
                                                    ? 'bg-blue-500/10 border-blue-500 ring-1 ring-blue-500'
                                                    : 'bg-muted border-border hover:bg-muted'
                                                }
                                            `}
                                        >
                                            <h3 className="font-semibold text-foreground">{mode.title}</h3>
                                            <p className="text-xs text-muted-foreground">{mode.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                </CardContent>
                <CardFooter>
                    <Button onClick={handleStart} className="w-full h-12 text-lg bg-teal-600 hover:bg-teal-700">
                        Start {module.title}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default PracticeConfig;
