import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quest } from '../entities/quest.entity';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';

@Injectable()
export class QuestsService {
  constructor(
    @InjectRepository(Quest)
    private readonly questRepository: Repository<Quest>,
  ) {}

  async create(createQuestDto: CreateQuestDto): Promise<Quest> {
    const quest = this.questRepository.create(createQuestDto);
    return this.questRepository.save(quest);
  }

  async findAll(): Promise<Quest[]> {
    return this.questRepository.find();
  }

  async findOne(id: string): Promise<Quest> {
    const quest = await this.questRepository.findOne({ where: { id } });
    if (!quest) {
      throw new NotFoundException(`Quest with ID "${id}" not found`);
    }
    return quest;
  }

  async update(id: string, updateQuestDto: UpdateQuestDto): Promise<Quest> {
    const quest = await this.findOne(id);
    Object.assign(quest, updateQuestDto);
    return this.questRepository.save(quest);
  }

  async remove(id: string): Promise<void> {
    const result = await this.questRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Quest with ID "${id}" not found`);
    }
  }
}
