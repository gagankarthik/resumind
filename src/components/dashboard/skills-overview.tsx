import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";

const categoryColors: Record<string, string> = {
  Languages: "bg-chart-1/10 text-chart-1 hover:bg-chart-1/20",
  Frameworks: "bg-chart-2/10 text-chart-2 hover:bg-chart-2/20",
  Databases: "bg-chart-3/10 text-chart-3 hover:bg-chart-3/20",
  "Cloud & DevOps": "bg-chart-4/10 text-chart-4 hover:bg-chart-4/20",
  Tools: "bg-chart-5/10 text-chart-5 hover:bg-chart-5/20",
  "Soft Skills": "bg-primary/10 text-primary hover:bg-primary/20",
  Other: "bg-muted-foreground/10 text-muted-foreground hover:bg-muted-foreground/20",
};

const categoryOrder = [
  "Languages",
  "Frameworks",
  "Databases",
  "Cloud & DevOps",
  "Tools",
  "Soft Skills",
  "Other",
];

export function SkillsOverview({
  skillsByCategory,
}: {
  skillsByCategory: Record<string, string[]>;
}) {
  const hasSkills = Object.keys(skillsByCategory).length > 0;

  const sortedCategories = Object.keys(skillsByCategory).sort(
    (a, b) =>
      (categoryOrder.indexOf(a) === -1 ? 99 : categoryOrder.indexOf(a)) -
      (categoryOrder.indexOf(b) === -1 ? 99 : categoryOrder.indexOf(b))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Your Skills</CardTitle>
        <CardDescription>
          Skills extracted from your uploaded resumes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasSkills ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Brain className="mb-2 size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Upload a resume to see your skills here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedCategories.map((category) => {
              const color =
                categoryColors[category] || categoryColors["Other"];
              return (
                <div key={category}>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsByCategory[category].map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className={`border-0 ${color}`}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
