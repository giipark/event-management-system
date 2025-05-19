import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {EventService} from "./event.service";
import {CreateEventDto} from "./dto/create-event.dto";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {RoleGuard} from "../auth/guards/role.guard";
import {Role} from "../common/decorate/role.decorator";
import {ApiName} from "../common/decorate/api-name";
import {ApiBearerAuth, ApiResponse} from "@nestjs/swagger";
import {CreateEventResponseDto} from "./dto/create-event.response.dto";

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
    async createEvent(@Body() dto: CreateEventDto, @Req() req: any): Promise<CreateEventResponseDto> {
        const id = req.user._id
        return this.eventService.createEvent(dto, id);
    }
}
