import {ConflictException, Injectable} from '@nestjs/common';
import {User, UserDocument} from "./schema/user.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {SignupDto} from "./dto/signup.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
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
}
