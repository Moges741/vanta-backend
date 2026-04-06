import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

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
    return this.excludePassword(user);
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

  async updateUserRole(userId: string, newRole: 'USER' | 'OWNER'): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
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
    return users.map(user => this.excludePassword(user));
  }
}
