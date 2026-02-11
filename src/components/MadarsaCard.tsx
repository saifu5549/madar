import { Link } from "react-router-dom";
import { MapPin, Users, GraduationCap, BookOpen, BadgeCheck } from "lucide-react";
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
      className="bg-card rounded-2xl border border-border overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-up group"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Card Header */}
      <div className="p-5 pb-4 border-b border-border/50">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20 overflow-hidden">
            {madarsa.media?.logo ? (
              <img src={madarsa.media.logo} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">🕌</span>
            )}
          </div>

          {/* Name & Location */}
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-lg font-bold text-foreground leading-tight truncate uppercase">
                {madarsa.basicInfo?.nameEnglish || madarsa.name}
              </h3>
              <span className="text-lg flex-shrink-0">{getFlagEmoji()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1 font-semibold">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
              <span className="truncate">{madarsa.location?.city || madarsa.city}, {madarsa.location?.state || madarsa.state}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-0 border-b border-border/50 bg-accent/5">
        {/* Students */}
        <div className="text-center py-5 border-r border-border/50 group-hover:bg-background transition-colors">
          <div className="flex justify-center mb-1.5">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <p className="font-black text-xl text-foreground leading-none">
            {madarsa.academic?.totalStudents || madarsa.totalStudents || 0}
          </p>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Students</p>
        </div>

        {/* Teachers */}
        <div className="text-center py-5 border-r border-border/50 group-hover:bg-background transition-colors">
          <div className="flex justify-center mb-1.5">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <p className="font-black text-xl text-foreground leading-none">
            {madarsa.academic?.teachers || madarsa.totalTeachers || 0}
          </p>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Teachers</p>
        </div>

        {/* Classes/Books */}
        <div className="text-center py-5 group-hover:bg-background transition-colors">
          <div className="flex justify-center mb-1.5">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <p className="font-black text-xl text-foreground leading-none">
            {madarsa.academic?.classes?.length || madarsa.classes?.length || 0}
          </p>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Programs</p>
        </div>
      </div>

      {/* Footer - Facilities/Classes Tags */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <BadgeCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-wider">
            {(madarsa.academic?.classes || madarsa.classes || []).slice(0, 2).join(", ")}
            {(madarsa.academic?.classes || madarsa.classes || []).length > 2 && "..."}
          </span>
        </div>

        {/* View Details Button */}
        <Link to={`/madarsa/${madarsa.id}`}>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-black px-6 py-2.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-primary/20 active:scale-95 uppercase tracking-widest">
            Profile →
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MadarsaCard;
