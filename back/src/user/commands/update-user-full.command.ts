export class UpdateUserFullCommand {
    constructor(
      public readonly userId: number,
      public readonly payload: {
        user?: Record<string, any>;
        profile?: Record<string, any>;
      }
    ) {}
  }