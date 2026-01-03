import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';

const VoicePreviewSection = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecording(true);
    } else {
      setIsRecording(true);
      setHasRecording(false);
    }
  };

  return (
    <section id="voice" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,hsl(280_100%_65%/0.08)_0%,transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Interactive Preview */}
          <div className="order-2 lg:order-1">
            <div className="glass rounded-2xl p-6 md:p-8">
              {/* Question Card */}
              <div className="bg-secondary/50 rounded-xl p-6 mb-6">
                <span className="text-accent font-mono text-xs tracking-wider uppercase mb-3 block">
                  HR Interview Question
                </span>
                <p className="text-xl md:text-2xl font-medium text-foreground">
                  "Tell me about yourself"
                </p>
              </div>

              {/* Waveform Animation */}
              <div className="h-20 flex items-center justify-center gap-1 mb-6">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isRecording ? 'bg-accent' : hasRecording ? 'bg-primary/50' : 'bg-muted'
                    }`}
                    style={{
                      height: isRecording 
                        ? `${20 + Math.sin(i * 0.5 + Date.now() * 0.005) * 30}px`
                        : hasRecording 
                        ? `${10 + Math.sin(i * 0.3) * 20}px`
                        : '8px',
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                ))}
              </div>

              {/* Record Button */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleRecord}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isRecording 
                      ? 'bg-destructive shadow-[0_0_40px_hsl(0_84%_60%/0.5)] scale-110' 
                      : 'bg-accent shadow-[0_0_30px_hsl(280_100%_65%/0.4)] hover:scale-105'
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="w-8 h-8 text-foreground" />
                  ) : (
                    <Mic className="w-8 h-8 text-foreground" />
                  )}
                </button>
              </div>

              <p className="text-center text-muted-foreground text-sm mb-6">
                {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
              </p>

              {/* Feedback Metrics */}
              {hasRecording && (
                <div className="grid grid-cols-3 gap-4 animate-fade-in">
                  <div className="bg-secondary/50 rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Pronunciation</p>
                    <p className="text-2xl font-bold text-primary">82%</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Fluency</p>
                    <p className="text-2xl font-bold text-success">88%</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                    <p className="text-2xl font-bold text-accent">Medium</p>
                  </div>
                </div>
              )}

              {hasRecording && (
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" size="sm">
                    <Volume2 className="w-4 h-4" />
                    Play Recording
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="text-accent font-mono text-sm tracking-wider uppercase mb-4 block">
              Voice Practice
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Perfect Your{' '}
              <span className="gradient-text-accent">Speech</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Practice your pronunciation and communication skills with real interview questions. Get instant feedback on fluency, confidence, and clarity.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent text-sm">✓</span>
                </div>
                <span className="text-foreground">Real HR interview questions</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent text-sm">✓</span>
                </div>
                <span className="text-foreground">AI-powered pronunciation analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent text-sm">✓</span>
                </div>
                <span className="text-foreground">Confidence score tracking</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="accent" size="lg">
                Try Voice Practice
              </Button>
              <Button variant="outline" size="lg">
                Browse Questions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoicePreviewSection;
