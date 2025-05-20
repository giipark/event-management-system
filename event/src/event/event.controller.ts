import {Body, Controller, Get, Param, Patch, Post, Query, Req, Request, UseGuards} from '@nestjs/common';
import {EventService} from "./event.service";
import {CreateEventRequestDto} from "./dto/request/create-event.request.dto";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {RoleGuard} from "../auth/guards/role.guard";
import {Role} from "../common/decorate/role.decorator";
import {ApiName} from "../common/decorate/api-name";
import {ApiBearerAuth, ApiQuery, ApiResponse} from "@nestjs/swagger";
import {CreateEventResponseDto} from "./dto/response/create-event.response.dto";
import {UpdateEventResponseDto} from "./dto/response/update-event.response.dto";
import {UpdateEventRequestDto} from "./dto/request/update-event.request.dto";
import {CreateBenefitResponseDto} from "./dto/response/create-benefit.response.dto";
import {CreateBenefitRequestDto} from "./dto/request/create-benefit.request.dto";
import {FindEventResponseDto} from "./dto/response/find-event.response.dto";
import {FindEventRequestDto} from "./dto/request/find-event.request.dto";
import {RoleType} from "./schema/const/role-type.enum";
import {FindEventDetailResponseDto} from "./dto/response/find-event-detail.response.dto";
import {FindEventParticipantsResponseDto} from "./dto/response/find-event-participants.response.dto";
import {FindEventParticipantsRequestDto} from "./dto/request/find-event-participants.request.dto";
import {FindEventWinnersResponseDto} from "./dto/response/find-event-winners.response.dto";
import {FindEventWinnersRequestDto} from "./dto/request/find-event-winners.request.dto";
import {CompleteRewardRequestDto} from "./dto/request/complete-reward.request.dto";
import {CompleteRewardResponseDto} from "./dto/response/complete-reward.response.dto";
import {CancelRewardRequestDto} from "./dto/request/cancel-reward.request.dto";
import {FindEventAnnouncementResponseDto} from "./dto/response/find-event-announcement.response.dto";

@Controller('event')
@ApiBearerAuth()
export class EventController {
    constructor(private readonly eventService: EventService) {
    }

    @Post()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Role(RoleType.ADMIN)
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
    @Role(RoleType.ADMIN)
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

    @Post(':id/benefit')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Role(RoleType.ADMIN)
    @ApiName({summary: '이벤트 보상 추가'})
    @ApiResponse({status: 201, type: [CreateBenefitResponseDto], description: '보상 등록 성공'})
    async createBenefit(
        @Param('id') eventId: string,
        @Body() dtoList: CreateBenefitRequestDto[],
    ): Promise<CreateBenefitResponseDto[]> {
        return this.eventService.addBenefitToEvent(eventId, dtoList);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiName({summary: '이벤트 목록 조회'})
    @ApiResponse({status: 200, description: '이벤트 목록 반환', type: [FindEventResponseDto]})
    async getEventList(
        @Query() query: FindEventRequestDto,
        @Request() req,
    ): Promise<FindEventResponseDto[]> {
        return this.eventService.findEventList(query, req.user.role);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiName({summary: '이벤트 상세 조회'})
    @ApiResponse({status: 200, type: FindEventDetailResponseDto})
    @ApiResponse({status: 404, description: '이벤트를 찾을 수 없음'})
    async getEventDetail(
        @Param('id') id: string,
        @Request() req,
    ): Promise<FindEventDetailResponseDto> {
        return this.eventService.findEventDetail(id, req.user.role);
    }

    @Get(':id/participants')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Role(RoleType.ADMIN)
    @ApiName({summary: '이벤트 응모자 목록 조회'})
    @ApiQuery({type: FindEventParticipantsRequestDto})
    @ApiResponse({status: 200, type: [FindEventParticipantsResponseDto]})
    async getEventParticipants(
        @Query() query: FindEventParticipantsRequestDto,
    ): Promise<FindEventParticipantsResponseDto[]> {
        return this.eventService.findEventParticipants(query);
    }

    @Get('winners')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Role(RoleType.ADMIN)
    @ApiName({summary: '이벤트 당첨자 목록 조회'})
    @ApiResponse({status: 200, type: [FindEventWinnersResponseDto]})
    async getEventWinners(
        @Query() query: FindEventWinnersRequestDto,
    ): Promise<FindEventWinnersResponseDto[]> {
        return this.eventService.findEventWinners(query);
    }

    @Patch('reward/complete')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Role(RoleType.ADMIN)
    @ApiName({summary: '당첨 보상 지급 완료 처리'})
    @ApiResponse({status: 200, type: CompleteRewardResponseDto})
    async completeRewards(
        @Body() dto: CompleteRewardRequestDto,
    ): Promise<CompleteRewardResponseDto> {
        return this.eventService.completeRewards(dto.eventWinnerIds);
    }

    @Patch('reward/cancel')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Role(RoleType.ADMIN)
    @ApiName({summary: '보상 취소 처리'})
    @ApiResponse({status: 200, description: '취소 성공'})
    async cancelReward(
        @Body() dto: CancelRewardRequestDto,
        @Req() req: any,
    ): Promise<{ cancelled: boolean }> {
        // TODO: 현재 단건 취소 -> 복수건으로 취소 가능하게 변경 필요
        return this.eventService.cancelReward(dto.eventWinnerId, dto.reason, req.user._id);
    }

    @Get(':id/announcement')
    @ApiName({ summary: '이벤트 당첨자 발표 조회' })
    @ApiResponse({ status: 200, type: [FindEventAnnouncementResponseDto] })
    async getEventAnnouncement(
        @Param('id') eventId: string,
    ): Promise<FindEventAnnouncementResponseDto[]> {
        return this.eventService.findEventAnnouncement(eventId);
    }

}
