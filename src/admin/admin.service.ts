import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [users, events, totalUsers, totalEvents] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          bio: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.event.findMany({
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          category: true,
          images: true,
          amenities: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.user.count(),
      this.prisma.event.count(),
    ]);

    const now = new Date();
    const categorized = {
      past: [] as any[],
      ongoing: [] as any[],
      upcoming: [] as any[],
      undated: [] as any[],
    };

    const eventsWithStatus = events.map((event) => {
      const startDate = event.createdAt;
      const endDate =
        event.duration > 0
          ? new Date(startDate.getTime() + event.duration * 60 * 60 * 1000)
          : null;
      let status: keyof typeof categorized = 'undated';

      if (!startDate) {
        status = 'undated';
      } else if (endDate) {
        if (endDate < now) {
          status = 'past';
        } else if (startDate <= now && now <= endDate) {
          status = 'ongoing';
        } else {
          status = 'upcoming';
        }
      } else {
        status = startDate <= now ? 'ongoing' : 'upcoming';
      }

      const result = {
        ...event,
        status,
      };

      categorized[status].push(result);
      return result;
    });

    return {
      totalUsers,
      totalEvents,
      users,
      events: eventsWithStatus,
      eventsByStatus: categorized,
    };
  }
}
