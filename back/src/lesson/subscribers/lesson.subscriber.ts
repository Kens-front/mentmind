import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    Repository,
    EntityManager,
    UpdateEvent,
  } from 'typeorm';
  import { Injectable, Logger } from '@nestjs/common';
import { Lesson } from '../entities/lesson.entity';
import { InjectRepository } from '@nestjs/typeorm';
  
  @EventSubscriber()        
  @Injectable()
  export class LessonSubscriber implements EntitySubscriberInterface<Lesson> {
    private readonly logger = new Logger(LessonSubscriber.name);
  
    constructor(
      @InjectRepository(Lesson)
      private lessonRepository: Repository<Lesson>,
    ) {}
  
    listenTo() {
      return Lesson;
    }
  
    afterLoad(entity: any) {

    }
    
    async afterInsert(event: InsertEvent<Lesson>): Promise<void> {
      await this.checkAndDelete(event.entity, event.manager);
    }
  
    async afterUpdate(event: UpdateEvent<Lesson>): Promise<void> {
      if (event.entity) {
        await this.checkAndDelete(event.entity as Lesson, event.manager);
      }
    }
  
    private async checkAndDelete(entity: Lesson, manager: EntityManager): Promise<void> {
      if (entity.start_time && entity.end_time && entity.start_time === entity.end_time) {
        this.logger.warn(`Lesson ${entity.id} has equal start_time and end_time. Deleting record.`);
        await manager.remove(Lesson, entity);
      }
    }
  }