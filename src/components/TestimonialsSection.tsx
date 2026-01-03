import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "My typing speed improved from 35 to 65 WPM in just 2 weeks. The real-time feedback made all the difference!",
    author: "Priya Sharma",
    role: "Engineering Student",
    rating: 5,
    improvement: "+30 WPM",
  },
  {
    quote: "The voice practice helped me ace my HR interview. I felt so much more confident speaking clearly.",
    author: "Rahul Verma",
    role: "Software Developer",
    rating: 5,
    improvement: "Job Offer",
  },
  {
    quote: "As an ESL learner, this platform has been invaluable. My English pronunciation has improved dramatically.",
    author: "Chen Wei",
    role: "International Student",
    rating: 5,
    improvement: "Fluent",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(280_100%_65%/0.05)_0%,transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-mono text-sm tracking-wider uppercase mb-4 block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Loved by{' '}
            <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            See what our users have to say about their transformation.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-8 card-hover"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-orange-accent fill-orange-accent" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                  {testimonial.improvement}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
