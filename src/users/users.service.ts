import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    private async getStatusesByUserIds(ids: string[]): Promise<Map<string, 'ACTIVE' | 'SUSPENDED' | 'BANNED'>> {
      if (ids.length === 0) return new Map();
      const rows = await this.prisma.$queryRaw<Array<{ id: string; status: 'ACTIVE' | 'SUSPENDED' | 'BANNED' }>>`
        SELECT "id", "status"::text AS status
        FROM "users"
        WHERE "id" IN (${Prisma.join(ids)})
      `;
      return new Map(rows.map((row) => [row.id, row.status]));
    }

    async getStatusByEmail(email: string): Promise<'ACTIVE' | 'SUSPENDED' | 'BANNED' | null> {
      const rows = await this.prisma.$queryRaw<Array<{ status: 'ACTIVE' | 'SUSPENDED' | 'BANNED' }>>`
        SELECT "status"::text AS status
        FROM "users"
        WHERE "email" = ${email}
        LIMIT 1
      `;
      return rows[0]?.status ?? null;
    }

    async getStatusById(id: string): Promise<'ACTIVE' | 'SUSPENDED' | 'BANNED' | null> {
      const rows = await this.prisma.$queryRaw<Array<{ status: 'ACTIVE' | 'SUSPENDED' | 'BANNED' }>>`
        SELECT "status"::text AS status
        FROM "users"
        WHERE "id" = ${id}
        LIMIT 1
      `;
      return rows[0]?.status ?? null;
    }

    async findByEmail(email: string) : Promise<User | null>{
        return this.prisma.user.findUnique({ where: { email } });
    }
    async findById(id: string): Promise< Omit<User, 'password'> | null> {
        const user = await this.prisma.user.findUnique({
            where : {id},
        });
            if (!user) return null;
    const status = await this.getStatusById(id);
    return {
      ...this.excludePassword(user),
      status,
    } as any;
    }
    async createUser(data: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.create({
      data,
    });
    
    return this.excludePassword(user);
  }




  private excludePassword(user: User): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUserRole(userId: string, newRole: 'USER' | 'OWNER' | 'ADMIN'): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return this.excludePassword(user);
  }

  async updateUser(userId: string, data: Partial<Pick<User, 'name' | 'email' | 'avatarUrl'>>): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    return this.excludePassword(user);
  }

  async updateUserStatus(userId: string, newStatus: 'ACTIVE' | 'SUSPENDED' | 'BANNED'): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { status: newStatus } as any,
    });

    return this.excludePassword(user);
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany();
    const statusMap = await this.getStatusesByUserIds(users.map((user) => user.id));
    return users.map((user) => ({
      ...this.excludePassword(user),
      status: statusMap.get(user.id) ?? null,
    })) as any;
  }

  async countUsers(): Promise<number> {
    return this.prisma.user.count();
  }
}
