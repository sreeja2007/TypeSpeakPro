
import React from 'react';
import { InterviewLevel } from '@/types/hr-interview';
import { levelInfo } from '@/data/hr-questions';
import { cn } from '@/lib/utils';
import { Check, Sparkles, Briefcase, GraduationCap } from 'lucide-react';

interface LevelCardProps {
  level: InterviewLevel;
  isSelected: boolean;
  onSelect: (level: InterviewLevel) => void;
}

const LevelCard: React.FC<LevelCardProps> = ({ level, isSelected, onSelect }) => {
  const info = levelInfo[level];

  // Map icons based on level for better visuals than emojis
  const getIcon = () => {
    switch (level) {
      case 'fresher': return <GraduationCap className="w-8 h-8 text-green-500" />;
      case 'professional': return <Briefcase className="w-8 h-8 text-blue-500" />;
      case 'managerial': return <Sparkles className="w-8 h-8 text-purple-500" />;
    }
  };

  return (
    <div
      onClick={() => onSelect(level)}
      className={cn(
        'group relative overflow-hidden rounded-xl p-6 transition-all duration-300 cursor-pointer',
        'border backdrop-blur-sm',
        isSelected
          ? 'border-2 border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20 active-scale'
          : 'border-border bg-muted hover:border-green-500/50 hover:bg-muted hover:shadow-md hover:-translate-y-1'
      )}
    >
      {/* Dynamic Background Gradient */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
        "bg-gradient-to-br from-white/5 via-transparent to-transparent"
      )} />

      {/* Selection Check Circle */}
      <div
        className={cn(
          'absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 z-10',
          isSelected
            ? 'bg-green-500 scale-100'
            : 'bg-muted scale-90 opacity-0 group-hover:opacity-100'
        )}
      >
        <Check className="w-4 h-4 text-white" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Icon Container */}
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
          "bg-muted border border-border"
        )}>
          {getIcon()}
        </div>

        {/* Text Content */}
        <h3 className={cn(
          "font-heading text-xl font-bold mb-2 transition-colors",
          isSelected ? "text-green-400" : "text-foreground group-hover:text-green-400"
        )}>
          {info.title}
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {info.description}
        </p>

        {/* Bottom decorative line */}
        <div className={cn(
          "absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-300",
          isSelected ? "w-full" : "w-0 group-hover:w-1/3"
        )} />
      </div>
    </div>
  );
};

export default LevelCard;
