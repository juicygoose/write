import { FileText } from "lucide-react";

interface WritingStats {
  words: number;
  characters: number;
  paragraphs: number;
  readingTime: number;
}

interface WritingStatsProps {
  stats: WritingStats;
  showTitle?: boolean;
}

export function WritingStats({ stats, showTitle = true }: WritingStatsProps) {
  return (
    <div>
      {showTitle && (
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Writing Statistics
        </h3>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-background rounded-lg border">
            <div className="text-2xl font-bold text-primary">
              {stats.words}
            </div>
            <div className="text-sm text-muted-foreground">Words</div>
          </div>

          <div className="text-center p-3 bg-background rounded-lg border">
            <div className="text-2xl font-bold text-primary">
              {stats.characters}
            </div>
            <div className="text-sm text-muted-foreground">Characters</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-background rounded-lg border">
            <div className="text-2xl font-bold text-primary">
              {stats.paragraphs}
            </div>
            <div className="text-sm text-muted-foreground">Paragraphs</div>
          </div>

          <div className="text-center p-3 bg-background rounded-lg border">
            <div className="text-2xl font-bold text-primary">
              {stats.readingTime}
            </div>
            <div className="text-sm text-muted-foreground">Min Read</div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Session Goals</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Daily Target:</span>
              <span className="text-muted-foreground">500 words</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((stats.words / 500) * 100, 100)}%`,
                }}
              />
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {Math.round((stats.words / 500) * 100)}% complete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}