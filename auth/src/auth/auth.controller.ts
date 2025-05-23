import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthService} from "./auth.service";
import {SignupDto} from "./dto/signup.dto";
import {ApiName} from "../common/decorate/api-name";
import {UserResponseDto} from "./dto/user.response.dto";
import {plainToInstance} from "class-transformer";
import {LoginDto} from "./dto/login.dto";
import {LoginResponseDto} from "./dto/login.response.dto";
import {JwtAuthGuard} from "./guards/jwt.guard";
import {ProfileResponseDto} from "./dto/profile.response.dto";
import {ValidateTokenRequestDto} from "./dto/validate-token.request.dto";
import {ValidateTokenResponseDto} from "./dto/validate-token.response.dto";
import {PromoteUserRequestDto} from "./dto/promote-user.request.dto";
import {RoleGuard} from "./guards/role.guard";
import {Role} from "../common/decorate/role.decorator";
import {Request} from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('signup')
    @ApiName({summary: '회원가입'})
    @ApiBody({type: SignupDto, description: '회원 정보 등록'})
    @ApiResponse({status: 201, type: UserResponseDto, description: '회원가입 성공'})
    @ApiResponse({status: 409, description: '이메일 중복 오류'})
    async signup(@Body() signupDto: SignupDto): Promise<UserResponseDto> {
        const user = await this.authService.signup(signupDto);
        // TODO: 회원가입 끝나자마자 바로 자동로그인하기
        return plainToInstance(UserResponseDto, user, {excludeExtraneousValues: true})
    }

    @Post('login')
    @ApiName({summary: '로그인'})
    @ApiBody({type: LoginDto})
    @ApiResponse({status: 200, type: LoginResponseDto, description: '로그인 성공'})
    @ApiResponse({status: 401, description: '로그인 실패'})
    async login(@Req() req: Request, @Body() loginDto: LoginDto): Promise<LoginResponseDto> {
        return this.authService.login(loginDto, req);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiResponse({status: 200, description: '로그인된 유저 정보 조회 성공', type: ProfileResponseDto})
    @ApiResponse({status: 401, description: '유저 정보 조회 실패'})
    @ApiBearerAuth()
    async getProfile(@Req() req: Request): Promise<ProfileResponseDto> {
        const _id = req.user._id.toString()
        return this.authService.getProfile(_id);
    }

    @Post('validate-token')
    @ApiName({summary: 'JWT 토큰 유효성 검증'})
    @ApiBody({type: ValidateTokenRequestDto})
    @ApiResponse({status: 200, description: '유효한 토큰', type: ValidateTokenResponseDto})
    @ApiResponse({status: 401, description: '유효하지 않은 토큰'})
    async validateToken(@Body() dto: ValidateTokenRequestDto): Promise<ValidateTokenResponseDto> {
        return this.authService.validateToken(dto.headerToken);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Role('ADMIN')
    @Post('admin/promote')
    @ApiName({summary: '유저를 관리자로 승격'})
    @ApiResponse({status: 200, description: '성공적으로 관리자 승격 성공'})
    @ApiResponse({status: 401, description: '관리자 승격 실패'})
    @ApiBearerAuth()
    async promoteUser(@Body() dto: PromoteUserRequestDto) {
        return this.authService.promoteToAdmin(dto._id);
    }
}
