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

export function StatsCards({ stats }: { stats: Stats }) {
  const cards = [
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: ClipboardList,
    },
    {
      title: "Interviews",
      value: stats.interviews,
      icon: Users,
    },
    {
      title: "Offers",
      value: stats.offers,
      icon: Trophy,
    },
    {
      title: "Pending Reminders",
      value: stats.pendingReminders,
      icon: Bell,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
