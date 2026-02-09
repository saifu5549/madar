import { Link } from "react-router-dom";
import { MapPin, Users, GraduationCap, BookOpen } from "lucide-react";
import { Madarsa } from "@/types/madarsa";

interface MadarsaCardProps {
  madarsa: Madarsa;
  index?: number;
}

const MadarsaCard = ({ madarsa, index = 0 }: MadarsaCardProps) => {
  // Get country flag emoji (simplified - using India flag for all)
  const getFlagEmoji = () => "🇮🇳";

  return (
    <div
      className="bg-card rounded-2xl border border-border overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Card Header */}
      <div className="p-5 pb-4 border-b border-border/50">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
            <span className="text-2xl">🕌</span>
          </div>

          {/* Name & Location */}
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-base font-semibold text-foreground leading-snug">
                {madarsa.name}
              </h3>
              <span className="text-lg flex-shrink-0">{getFlagEmoji()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{madarsa.city}, {madarsa.state}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-0 border-b border-border/50">
        {/* Students */}
        <div className="text-center py-4 border-r border-border/50">
          <div className="flex justify-center mb-1.5">
            <GraduationCap className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="font-bold text-lg text-foreground">
            {madarsa.totalStudents.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Students</p>
        </div>

        {/* Teachers */}
        <div className="text-center py-4 border-r border-border/50">
          <div className="flex justify-center mb-1.5">
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="font-bold text-lg text-foreground">
            {madarsa.totalTeachers}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Teachers</p>
        </div>

        {/* Classes/Books */}
        <div className="text-center py-4">
          <div className="flex justify-center mb-1.5">
            <BookOpen className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="font-bold text-lg text-foreground">
            {madarsa.classes.length}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Teachers</p>
        </div>
      </div>

      {/* Footer - Facilities/Classes Tags */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <BookOpen className="w-4 h-4" />
          <span className="text-xs">
            {madarsa.classes.slice(0, 2).join(", ")}
            {madarsa.classes.length > 2 && "..."}
          </span>
        </div>

        {/* View Details Button */}
        <Link to={`/madarsa/${madarsa.id}`}>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-5 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap">
            View Details →
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MadarsaCard;
