
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { analyzeAnswer, AnalysisResult } from '@/services/aiAnalysis';
import { Loader2, CheckCircle, AlertCircle, TrendingUp, RefreshCw, ArrowRight } from 'lucide-react';

interface HRFeedbackProps {
    results: any;
    onRetry: () => void;
}

const HRFeedback = ({ results, onRetry }: HRFeedbackProps) => {
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            const data = await analyzeAnswer(
                results.question,
                results.transcript || "(No answer provided)",
                results.config.level
            );
            setAnalysis(data);
            setLoading(false);
        };
        fetchAnalysis();
    }, [results]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 animate-in fade-in">
                <Loader2 className="w-12 h-12 text-teal-400 animate-spin" />
                <h3 className="text-xl font-medium text-foreground">AI is analyzing your response...</h3>
                <p className="text-muted-foreground">Checking grammar, tone, and relevance.</p>
            </div>
        );
    }

    if (!analysis) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Interview Feedback</h2>
                    <p className="text-muted-foreground">Here's how you performed on the last question.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={onRetry} className="border-border hover:bg-muted">
                        <RefreshCw className="w-4 h-4 mr-2" /> practice Again
                    </Button>
                    <Button className="bg-teal-600 hover:bg-teal-700" onClick={onRetry}>
                        Next Question <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Scores */}
                <Card className="md:col-span-1 bg-card/50 border-border">
                    <CardHeader>
                        <CardTitle>Performance Score</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center p-6 bg-teal-500/10 rounded-2xl border border-teal-500/20">
                            <div className="text-5xl font-bold text-teal-400 mb-2">{analysis.overall_score}<span className="text-xl text-teal-400/50">/10</span></div>
                            <div className="text-sm font-medium text-teal-300 uppercase tracking-widest">Overall Rating</div>
                        </div>

                        <div className="space-y-4">
                            <ScoreRow label="Grammar" score={analysis.grammar_score} />
                            <ScoreRow label="Fluency" score={analysis.fluency_score} />
                            <ScoreRow label="Relevance" score={analysis.relevance_score} />
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Analysis */}
                <Card className="md:col-span-2 bg-card/50 border-border">
                    <CardHeader>
                        <CardTitle>AI Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <h4 className="flex items-center gap-2 text-foreground font-medium">
                                <TrendingUp className="w-4 h-4 text-purple-400" /> Improvement Tips
                            </h4>
                            <ul className="space-y-2">
                                {analysis.improvements.map((tip, i) => (
                                    <li key={i} className="flex gap-2 text-sm text-foreground bg-muted p-3 rounded-lg">
                                        <span className="text-purple-400">•</span> {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <h4 className="flex items-center gap-2 text-foreground font-medium">
                                <CheckCircle className="w-4 h-4 text-green-400" /> Corrected Version
                            </h4>
                            <div className="text-sm leading-relaxed text-foreground bg-green-500/5 border border-green-500/10 p-4 rounded-lg">
                                {analysis.corrected_text}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="flex items-center gap-2 text-foreground font-medium">
                                <AlertCircle className="w-4 h-4 text-muted-foreground" /> Your Transcript
                            </h4>
                            <div className="text-sm leading-relaxed text-muted-foreground italic">
                                "{results.transcript}"
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const ScoreRow = ({ label, score }: { label: string, score: number }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2 h-2 flex-1 mx-4 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-teal-500" style={{ width: `${score * 10}%` }} />
        </div>
        <span className="text-sm font-bold text-foreground">{score}</span>
    </div>
);

export default HRFeedback;
