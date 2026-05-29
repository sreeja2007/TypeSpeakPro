import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, RotateCcw, Home, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PracticeFeedbackProps {
    results: {
        transcript: string;
        wpm: number;
        duration: number;
        wordCount: number;
    };
    onRetry: () => void;
}

const PracticeFeedback = ({ results, onRetry }: PracticeFeedbackProps) => {
    const navigate = useNavigate();

    // Mock analysis (Since actual grammar API integration was "Next Steps")
    // We will show stats and simulated "Good" feedback for MVP.
    const feedbackItems = [
        { type: 'good', text: 'Good speaking pace (approximated)' },
        { type: 'info', text: 'Clear articulation detected' },
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95">
            <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto ring-4 ring-teal-500/30">
                    <CheckCircle2 className="w-10 h-10 text-teal-400" />
                </div>
                <h2 className="text-4xl font-bold text-foreground">Session Complete!</h2>
                <p className="text-muted-foreground">Here's how you performed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card/50 border-border">
                    <CardContent className="p-6 text-center">
                        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Words Spoken</p>
                        <p className="text-3xl font-bold text-foreground">{results.wordCount}</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border">
                    <CardContent className="p-6 text-center">
                        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Fluency (WPM)</p>
                        <p className="text-3xl font-bold text-teal-400">{results.wpm}</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border">
                    <CardContent className="p-6 text-center">
                        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Duration</p>
                        <p className="text-3xl font-bold text-foreground">{results.duration}s</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-card/50 border-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-purple-400" />
                        Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted border border-border text-foreground italic">
                        "{results.transcript || "No speech detected."}"
                    </div>

                    <div className="space-y-2">
                        {feedbackItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                                <span className={`w-2 h-2 rounded-full ${item.type === 'good' ? 'bg-green-500' : 'bg-blue-500'}`} />
                                <span className="text-sm text-foreground">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-4 justify-center pt-4">
                <Button variant="outline" size="lg" onClick={onRetry} className="min-w-[150px]">
                    <RotateCcw className="w-4 h-4 mr-2" /> Try Again
                </Button>
                <Button size="lg" onClick={() => navigate('/voice-practice')} className="min-w-[150px] bg-muted hover:bg-muted/80">
                    <Home className="w-4 h-4 mr-2" /> All Modules
                </Button>
            </div>
        </div>
    );
};

export default PracticeFeedback;
