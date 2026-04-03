import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

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
}