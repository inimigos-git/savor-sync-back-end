import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { userRole } from './enums/role.num';
import { ROLES_KEY } from './roles.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<userRole[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'];

      if (!authHeader) {
        throw new UnauthorizedException('Token is required');
      }

      const [type, token] = authHeader.split(' ');
      if (type !== 'Bearer' || !token) {
        throw new UnauthorizedException('Token is required');
      }

      const { role } = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET,
      });

      if (!role) {
        throw new UnauthorizedException('Invalid token');
      }

      return requiredRoles.some((requiredRole) => requiredRole === role);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('authorization error');
    }
  }
}
