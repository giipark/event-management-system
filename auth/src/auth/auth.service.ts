import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {User, UserDocument} from "./schema/user.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {SignupDto} from "./dto/signup.dto";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {LoginDto} from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService
    ) {
    }

    /**
     * 회원가입 등록
     * - 초기 관리자 1명은 DB 직접 등록
     * - 이후엔 USER 승격 형태로 API 호출
     * @param signupDto
     */
    async signup(signupDto: SignupDto): Promise<User> {
        const {email, password, nickname} = signupDto;

        // 중복 이메일 체크
        const existing = await this.userModel.findOne({email});
        if (existing) throw new ConflictException('이미 가입된 이메일입니다.');

        // 패스워드 암호화
        const hashed = await bcrypt.hash(password, 10);

        // 추천인코드 생성
        const recommendCode = this.generateRecommendCode();

        const user = new this.userModel({
            email,
            password: hashed,
            nickname,
            recommendCode,
            role: 'USER'
        });

        return (await user.save()).toObject();
    }

    /**
     * 추천인코드 생성
     * @private
     */
    private generateRecommendCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return Array.from({length: 6}, () =>
            chars[Math.floor(Math.random() * chars.length)],
        ).join('');
    }

    /**
     * 로그인
     * @param dto
     */
    async login(dto: LoginDto): Promise<{ accessToken: string }> {
        const { email, password } = dto;

        // 이메일 체크
        const user = await this.userModel.findOne({ email });
        if (!user) throw new UnauthorizedException('가입된 이메일이 없습니다.');

        // 비밀번호 체크
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('비밀번호가 틀렸습니다.');

        const payload = { sub: user._id, role: user.role };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
    }
}
