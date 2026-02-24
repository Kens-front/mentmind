import { SetMetadata } from '@nestjs/common';
 

export const Roles = (...roles: string[]) => {
    const result = SetMetadata('role', roles)
    console.log(result)
    return SetMetadata('roles', roles)
};