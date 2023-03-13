import {
  Controller, Get, Post,
  Request, UseGuards,
} from '@nestjs/common';
import type express from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { PublicEndpoint } from '@common/decorators/public.decorator';

@Controller('/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicEndpoint()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/test')
  getProfile(@Request() req: express.Request) {
    return req.user;
  }

}
