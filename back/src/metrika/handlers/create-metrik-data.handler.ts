import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateMetrikData } from "../commands/create-metrik-data.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Metrika } from "../entities/metrika.entity";
import { Repository } from "typeorm";

@CommandHandler(CreateMetrikData)
export class CreateMetrikDataHandler
  implements ICommandHandler<CreateMetrikData>
{
  constructor(
    @InjectRepository(Metrika)
    private readonly repo: Repository<Metrika>,
  ) {}

  async execute(command: CreateMetrikData): Promise<Metrika> {
    const { sessionId, event, id } = command.dto;

    let session = null;
    // ───── создание новой сессии ─────
    if (!id) {
      session = this.repo.create({
        event,
        pageView: 0,
        formView: 0,
      });
    } else {
        session = await this.repo.findOne({
            where: { id },
        }); 
    }


    if (!session) {
      throw new Error('Session not found');
    }

    if (event === 'pageView') {
        session.pageView += 1;
      }

      if (event === 'formView') {
        session.formView += 1;
      }

      return this.repo.save(session);
  }
}
