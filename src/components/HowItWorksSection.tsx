import { MousePointer, Play, Zap, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: MousePointer,
    step: '01',
    title: 'Choose Practice Mode',
    description: 'Select between typing tests or voice practice based on your learning goals.',
  },
  {
    icon: Play,
    step: '02',
    title: 'Practice in Real Time',
    description: 'Complete timed tests or respond to voice prompts with instant tracking.',
  },
  {
    icon: Zap,
    step: '03',
    title: 'Get Instant Feedback',
    description: 'Receive immediate metrics on speed, accuracy, and pronunciation quality.',
  },
  {
    icon: TrendingUp,
    step: '04',
    title: 'Track Improvement',
    description: 'Monitor your progress with detailed analytics and achievement streaks.',
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-mono text-sm tracking-wider uppercase mb-4 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Simple Steps to{' '}
            <span className="gradient-text-accent">Mastery</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Get started in minutes and see improvement from day one.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-0" />
                )}
                
                <div className="relative z-10 text-center">
                  {/* Step Number */}
                  <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 rounded-2xl bg-secondary flex items-center justify-center mx-auto relative overflow-hidden group cursor-pointer transition-all hover:bg-primary/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <step.icon className="w-10 h-10 text-primary relative z-10" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-foreground">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
