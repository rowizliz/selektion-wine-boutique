import { cn } from "@/lib/utils";

interface StepLifestyleProps {
  data: {
    music_genres: string[];
    hobbies: string[];
  };
  onChange: (field: string, value: string[]) => void;
}

const musicOptions = [
  { id: "pop", icon: "🎤", label: "Pop" },
  { id: "classical", icon: "🎻", label: "Cổ điển" },
  { id: "jazz", icon: "🎷", label: "Jazz" },
  { id: "rock", icon: "🎸", label: "Rock" },
  { id: "edm", icon: "🎧", label: "EDM" },
  { id: "rnb", icon: "🎹", label: "R&B" },
  { id: "hiphop", icon: "🎤", label: "Hip-hop" },
  { id: "indie", icon: "🎶", label: "Indie" },
];

const hobbyOptions = [
  { id: "travel", icon: "✈️", label: "Du lịch" },
  { id: "reading", icon: "📚", label: "Đọc sách" },
  { id: "cooking", icon: "👨‍🍳", label: "Nấu ăn" },
  { id: "sports", icon: "⚽", label: "Thể thao" },
  { id: "art", icon: "🎨", label: "Nghệ thuật" },
  { id: "gaming", icon: "🎮", label: "Game" },
  { id: "photography", icon: "📷", label: "Nhiếp ảnh" },
  { id: "yoga", icon: "🧘", label: "Yoga" },
  { id: "movies", icon: "🎬", label: "Phim ảnh" },
  { id: "music", icon: "🎵", label: "Âm nhạc" },
  { id: "gardening", icon: "🌱", label: "Làm vườn" },
  { id: "wine", icon: "🍷", label: "Thưởng rượu" },
];

const ChipButton = ({
  selected,
  onClick,
  icon,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-sans transition-all duration-300",
      "hover:border-foreground/50 hover:scale-105",
      selected
        ? "border-foreground bg-foreground text-background"
        : "border-border bg-background"
    )}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

const StepLifestyle = ({ data, onChange }: StepLifestyleProps) => {
  const toggleMusic = (musicId: string) => {
    const newValues = data.music_genres.includes(musicId)
      ? data.music_genres.filter((m) => m !== musicId)
      : [...data.music_genres, musicId];
    onChange("music_genres", newValues);
  };

  const toggleHobby = (hobbyId: string) => {
    const newValues = data.hobbies.includes(hobbyId)
      ? data.hobbies.filter((h) => h !== hobbyId)
      : [...data.hobbies, hobbyId];
    onChange("hobbies", newValues);
  };

  return (
    <div className="space-y-10">
      {/* Music Genres */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-serif">
            Bạn thích nghe nhạc gì?
          </h2>
          <p className="text-muted-foreground mt-2">
            Âm nhạc nói lên nhiều về phong cách của bạn
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {musicOptions.map((music) => (
            <ChipButton
              key={music.id}
              icon={music.icon}
              label={music.label}
              selected={data.music_genres.includes(music.id)}
              onClick={() => toggleMusic(music.id)}
            />
          ))}
        </div>
      </div>

      {/* Hobbies */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-serif">
            Sở thích của bạn?
          </h2>
          <p className="text-muted-foreground mt-2">
            Chọn những hoạt động bạn yêu thích
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {hobbyOptions.map((hobby) => (
            <ChipButton
              key={hobby.id}
              icon={hobby.icon}
              label={hobby.label}
              selected={data.hobbies.includes(hobby.id)}
              onClick={() => toggleHobby(hobby.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepLifestyle;
