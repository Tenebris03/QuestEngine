import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { QuestsService } from './quests.service';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { Quest } from '../entities/quest.entity';

@ApiTags('quests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quests')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new quest' })
  @ApiResponse({ status: 201, description: 'Quest created successfully', type: Quest })
  async create(@Body() createQuestDto: CreateQuestDto): Promise<Quest> {
    return this.questsService.create(createQuestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all quests' })
  @ApiResponse({ status: 200, description: 'List of all quests', type: [Quest] })
  async findAll(): Promise<Quest[]> {
    return this.questsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a quest by ID' })
  @ApiResponse({ status: 200, description: 'Quest found', type: Quest })
  @ApiResponse({ status: 404, description: 'Quest not found' })
  async findOne(@Param('id') id: string): Promise<Quest> {
    return this.questsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a quest' })
  @ApiResponse({ status: 200, description: 'Quest updated successfully', type: Quest })
  @ApiResponse({ status: 404, description: 'Quest not found' })
  async update(
    @Param('id') id: string,
    @Body() updateQuestDto: UpdateQuestDto,
  ): Promise<Quest> {
    return this.questsService.update(id, updateQuestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a quest' })
  @ApiResponse({ status: 204, description: 'Quest deleted successfully' })
  @ApiResponse({ status: 404, description: 'Quest not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.questsService.remove(id);
  }
}
