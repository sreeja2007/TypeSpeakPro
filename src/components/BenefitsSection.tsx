import { GraduationCap, Briefcase, Building2, Globe } from 'lucide-react';

const audiences = [
  {
    icon: GraduationCap,
    title: 'Students',
    description: 'Ace your placement exams with improved typing speed and confident communication skills.',
    features: ['Placement readiness', 'Exam preparation', 'Speed & accuracy'],
    color: 'primary',
  },
  {
    icon: Briefcase,
    title: 'Job Seekers',
    description: 'Stand out in HR rounds with clear communication and professional typing abilities.',
    features: ['HR round confidence', 'Interview practice', 'Clear communication'],
    color: 'accent',
  },
  {
    icon: Building2,
    title: 'Professionals',
    description: 'Boost your productivity with faster typing and enhanced workplace communication.',
    features: ['Productivity boost', 'Fluency improvement', 'Professional growth'],
    color: 'orange',
  },
  {
    icon: Globe,
    title: 'ESL Learners',
    description: 'Master English pronunciation and typing while building confidence in communication.',
    features: ['Pronunciation help', 'Confidence building', 'English fluency'],
    color: 'success',
  },
];

const BenefitsSection = () => {
  const getColorClasses = (color: string) => {
    const colors = {
      primary: 'border-primary/30 hover:border-primary/60 hover:shadow-[0_0_30px_hsl(186_100%_50%/0.2)]',
      accent: 'border-accent/30 hover:border-accent/60 hover:shadow-[0_0_30px_hsl(280_100%_65%/0.2)]',
      orange: 'border-orange-accent/30 hover:border-orange-accent/60 hover:shadow-[0_0_30px_hsl(25_95%_55%/0.2)]',
      success: 'border-success/30 hover:border-success/60 hover:shadow-[0_0_30px_hsl(142_76%_45%/0.2)]',
    };
    return colors[color as keyof typeof colors] || colors.primary;
  };

  const getIconColor = (color: string) => {
    const colors = {
      primary: 'text-primary',
      accent: 'text-accent',
      orange: 'text-orange-accent',
      success: 'text-success',
    };
    return colors[color as keyof typeof colors] || colors.primary;
  };

  return (
    <section id="benefits" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(186_100%_50%/0.05)_0%,transparent_70%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-mono text-sm tracking-wider uppercase mb-4 block">
            Who It's For
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Built for{' '}
            <span className="gradient-text">Everyone</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Whether you're preparing for placements or improving workplace skills, we've got you covered.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {audiences.map((audience) => (
            <div
              key={audience.title}
              className={`glass rounded-2xl p-8 border-2 transition-all duration-300 cursor-pointer group ${getColorClasses(audience.color)}`}
            >
              <div className="flex items-start gap-5">
                <div className={`w-14 h-14 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 ${getIconColor(audience.color)}`}>
                  <audience.icon className="w-7 h-7" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {audience.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {audience.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {audience.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
