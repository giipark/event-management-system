import {Controller, Get, Param, Req, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiResponse} from '@nestjs/swagger';
import {FindMyEventsResponseDto} from './dto/response/find-my-events.response.dto';
import {UserService} from './user.service';
import {ApiName} from "../common/decorate/api-name";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {FindMyRewardResponseDto} from "./dto/response/find-my-reward.response.dto";

@Controller('')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get('my/event')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiName({summary: '참여한 나의 이벤트 목록 조회'})
    @ApiResponse({status: 200, type: [FindMyEventsResponseDto]})
    async getMyEvents(@Req() req: any): Promise<FindMyEventsResponseDto[]> {
        return this.userService.findMyEvents(req.user._id);
    }

    @Get('my/event/:id/reward')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiName({summary: '나의 이벤트 당첨보상 상세조회'})
    @ApiResponse({status: 200, type: FindMyRewardResponseDto})
    async getMyReward(
        @Param('id') eventId: string,
        @Req() req: any,
    ): Promise<FindMyRewardResponseDto> {
        return this.userService.findMyReward(req.user._id, eventId);
    }

}
