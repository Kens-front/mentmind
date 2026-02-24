import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: keyof any | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return null;

    // Если указано поле → возвращаем user[field]
    if (data) return user[data];

    // Иначе весь объект пользователя
    return user;
  },
);
