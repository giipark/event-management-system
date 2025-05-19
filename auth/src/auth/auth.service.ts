import {ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {User, UserDocument} from "../user/schema/user.schema";
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {Connection, Model} from "mongoose";
import {SignupDto} from "./dto/signup.dto";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {LoginDto} from "./dto/login.dto";
import {ProfileResponseDto} from "./dto/profile.response.dto";
import {ValidateTokenResponseDto} from "./dto/validate-token.response.dto";
import {Inventory, InventoryDocument} from "../user/schema/inventory.schema";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Inventory.name) private inventoryModel: Model<InventoryDocument>,
        @InjectConnection() private readonly connection: Connection,
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
        const recommendCode = this.generateRecommendCode();

        const session = await this.connection.startSession();
        session.startTransaction();

        try {
            // 유저 생성
            const user = await this.userModel.create([{
                email,
                password: hashed,
                nickname,
                recommendCode,
                role: 'USER',
            }], {session});

            // 인벤토리 생성
            await this.inventoryModel.create([{
                userId: user[0]._id,
                point: 0,
                coupons: [],
                items: [],
            }], {session});

            await session.commitTransaction();
            return user[0].toObject();
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            await session.endSession();
        }
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
        const {email, password} = dto;

        // 이메일 체크
        const user = await this.userModel.findOne({email});
        if (!user) throw new UnauthorizedException('가입된 이메일이 없습니다.');

        // 비밀번호 체크
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('비밀번호가 틀렸습니다.');

        const payload = {_id: user._id, email: user.email, role: user.role};
        const accessToken = this.jwtService.sign(payload);

        return {accessToken};
    }

    /**
     * 나의 정보 조회
     * @param id
     */
    async getProfile(_id: string) {
        const user = await this.userModel.findById(_id).lean();
        if (!user) throw new Error('유저가 존재하지 않습니다.');

        return ProfileResponseDto.from(user);
    }

    /**
     * 토큰 유효상태 검사
     * @param headerToken
     */
    async validateToken(headerToken: string) {
        try {
            const [bearer, token] = headerToken.split(' ');
            if (bearer !== 'Bearer' || !token) {
                throw new Error('유효한 토큰이 아닙니다. Bearer 토큰이 필요합니다.');
            }

            const payload = this.jwtService.verify(token);
            return ValidateTokenResponseDto.from(payload);
        } catch (err) {
            throw new UnauthorizedException('유효하지 않은 토큰입니다.');
        }
    }

    /**
     * 유저를 관리자로 승격
     * @param _id
     */
    async promoteToAdmin(_id: string) {
        const user = await this.userModel.findById(_id);
        if (!user) throw new NotFoundException('유저가 존재하지 않습니다.');

        user.role = 'ADMIN';
        await user.save();

        return {success: true};
    }
}
