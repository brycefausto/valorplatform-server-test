import { UsersService } from '@/users/users.service';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ResetPasswordDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() signInDto: Record<string, any>) {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('verify')
  async verify(@Req() req: any) {
    const user = await this.usersService.findOne(req.user._id);
    return user;
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  async getProfile(@Req() req: any) {
    const user = await this.usersService.findOne(req.user._id);
    return user;
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  async logout(@Req() req: any, @Res() res: Response) {
    const { messagingToken } = req.body;
    const user = await this.usersService.findOne(req.user._id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (messagingToken) {
      user.messagingTokens = user.messagingTokens?.filter(
        (it) => it != messagingToken,
      );

      await user.save();
    }

    return res.json();
  }

  @Post('requestResetPassword')
  async requestResetPassword(@Body('email') email: string) {
    await this.authService.requestResetPassword(email);
  }

  @Get('resetPassword/:id')
  @Render('resetPassword')
  async resetPassword(@Query('token') token: string) {
    try {
      await this.authService.verifyToken(token);
      return { token };
    } catch (error) {
      return { errorMessage: error.message };
    }
  }

  @Post('resetPassword/:id')
  async resetPasswordDone(
    @Param('id') id: string,
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ) {
    try {
      await this.authService.resetPassword(id, resetPasswordDto);

      return res.render('resetPasswordDone');
    } catch (error) {
      return res.render('resetPassword', { errorMessage: error.message });
    }
  }

  @Get('resetPasswordDone')
  async resetPasswordDone1(@Res() res: Response) {
    return res.render('resetPasswordDone');
  }
}
