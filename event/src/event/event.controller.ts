import {Body, Controller, Param, Patch, Post, Req, UseGuards} from '@nestjs/common';
import {EventService} from "./event.service";
import {CreateEventRequestDto} from "./dto/create-event.request.dto";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {RoleGuard} from "../auth/guards/role.guard";
import {Role} from "../common/decorate/role.decorator";
import {ApiName} from "../common/decorate/api-name";
import {ApiBearerAuth, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {CreateEventResponseDto} from "./dto/create-event.response.dto";
import {UpdateEventResponseDto} from "./dto/update-event.response.dto";
import {UpdateEventRequestDto} from "./dto/update-event.request.dto";

@Controller('event')
@ApiBearerAuth()
export class EventController {
    constructor(private readonly eventService: EventService) {
    }

    @Post()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Role('ADMIN')
    @ApiName({summary: '이벤트 생성'})
    @ApiResponse({status: 200, type: CreateEventResponseDto, description: '이벤트가 성공적으로 생성되었습니다.'})
    @ApiResponse({status: 401, description: '인증되지 않은 사용자입니다.'})
    @ApiResponse({status: 403, description: '관리자 권한이 없습니다.'})
    @ApiResponse({status: 400, description: '잘못된 요청입니다.'})
    async createEvent(@Body() dto: CreateEventRequestDto, @Req() req: any): Promise<CreateEventResponseDto> {
        const id = req.user._id
        return this.eventService.createEvent(dto, id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Role('ADMIN')
    @ApiName({summary: '이벤트 수정'})
    @ApiResponse({status: 200, type: UpdateEventResponseDto, description: '이벤트 수정 성공'})
    @ApiResponse({status: 404, description: '이벤트를 찾을 수 없음'})
    async updateEvent(
        @Param('id') id: string,
        @Body() dto: UpdateEventRequestDto,
        @Req() req: any,
    ): Promise<UpdateEventResponseDto> {
        const adminId = req.user.userId;
        return this.eventService.updateEvent(id, dto, adminId);
    }
}
