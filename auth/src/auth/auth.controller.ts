import {Body, Controller, Post} from '@nestjs/common';
import {ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthService} from "./auth.service";
import {SignupDto} from "./dto/signup.dto";
import {ApiName} from "../common/decorate/api-name";
import {UserResponseDto} from "./dto/user.response.dto";
import {plainToInstance} from "class-transformer";
import {LoginDto} from "./dto/login.dto";
import {LoginResponseDto} from "./dto/login.response.dto";

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
    async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
        return this.authService.login(loginDto);
    }
}
