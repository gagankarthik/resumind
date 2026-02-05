import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClipboardList, Users, Trophy, Bell } from "lucide-react";

interface Stats {
  totalApplications: number;
  interviews: number;
  offers: number;
  pendingReminders: number;
}

const cards = [
  {
    key: "totalApplications" as const,
    title: "Total Applications",
    icon: ClipboardList,
    color: "border-l-chart-1",
    iconBg: "bg-chart-1/10",
    iconColor: "text-chart-1",
    sub: "All tracked applications",
  },
  {
    key: "interviews" as const,
    title: "Interviews",
    icon: Users,
    color: "border-l-chart-2",
    iconBg: "bg-chart-2/10",
    iconColor: "text-chart-2",
    sub: "Scheduled interviews",
  },
  {
    key: "offers" as const,
    title: "Offers",
    icon: Trophy,
    color: "border-l-chart-4",
    iconBg: "bg-chart-4/10",
    iconColor: "text-chart-4",
    sub: "Offers received",
  },
  {
    key: "pendingReminders" as const,
    title: "Pending Reminders",
    icon: Bell,
    color: "border-l-chart-3",
    iconBg: "bg-chart-3/10",
    iconColor: "text-chart-3",
    sub: "Action items remaining",
  },
];

export function StatsCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className={`border-l-4 ${card.color}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`rounded-md ${card.iconBg} p-1.5`}>
              <card.icon className={`size-4 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats[card.key]}</div>
            <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
