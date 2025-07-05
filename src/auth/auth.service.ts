import { BASE_URL } from '@/constants';
import { AppUserDocument } from '@/schemas/appuser.schema';
import { UsersService } from '@/users/users.service';
import {
  requestResetPasswordTemplate,
  resetPasswordTemplate,
  sendMail,
} from '@/utils/email.utils';
import { comparePassword } from '@/utils/password.utils';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { ResetPasswordDto, UserPayload } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUser(user: AppUserDocument) {
    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      company: user.company
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      user,
      token,
    };
  }

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || (user && !comparePassword(pass, user.password))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return await this.signUser(user);
  }

  async requestResetPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      company: user.company
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: jwtConstants.secret,
    });

    await user.save();

    const link = `${BASE_URL}/auth/resetPassword/${user._id}?token=${token}`;
    await sendMail(
      user.email,
      'Password Reset Request',
      requestResetPasswordTemplate,
      { name: user.name, link },
    );
  }

  async verifyToken(token: string) {
    try {
      const payload: UserPayload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      return payload;
    } catch (error) {
      throw new Error('Invalid Token');
    }
  }

  async resetPassword(userId: string, { token, password }: ResetPasswordDto) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const payload = await this.verifyToken(token);

    if (payload.id != user.id) {
      throw new Error('Invalid Token');
    }

    user.password = password;

    await user.save();

    await sendMail(user.email, 'Password Reset', resetPasswordTemplate, {
      name: user.name,
    });
  }
}
