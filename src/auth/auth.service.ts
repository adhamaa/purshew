import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { eq } from 'drizzle-orm';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { accounts, users } from 'src/drizzle/schemas';
import { User } from 'src/user/models/user.model';
import { AuthInput } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private drizzle: DrizzleService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup({ email, password }: AuthInput) {
    const hash = await argon.hash(password);

    const user = await this.drizzle.db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (user) throw new ConflictException('credentials taken');

    let newUser: User;

    await this.drizzle.db.transaction(async (tx) => {
      const u = (await tx.insert(users).values({ email, hash }).returning())[0];

      const accountTypes = accounts.type.enumValues;
      for (const [index, type] of Object.entries(accountTypes)) {
        await tx
          .insert(accounts)
          .values({
            type: accountTypes[index],
            ownerId: u.id,
            name: type,
          })
          .returning();
      }

      newUser = u;
    });

    return this.signToken(newUser.id, newUser.email);
  }

  async login({ email, password }: AuthInput) {
    const user = await this.drizzle.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const pwMatches = await argon.verify(user.hash, password);
    if (!pwMatches) {
      throw new ForbiddenException('credentials incorrect');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '12h',
      secret: this.config.get('JWT_SECRET'),
    });

    return { access_token };
  }
}
