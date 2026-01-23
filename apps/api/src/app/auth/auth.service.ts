import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '@app/users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<(Omit<User, 'passwordHash'> & { _id: Types.ObjectId }) | null> {
        const user = await this.userModel.findOne({ email }).lean();
        if (user && (await bcrypt.compare(pass, user.passwordHash))) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { passwordHash, ...result } = user;
            return result as Omit<User, 'passwordHash'> & { _id: Types.ObjectId };
        }
        return null;
    }

    async login(user: Omit<User, 'passwordHash'> & { _id: Types.ObjectId | string }) {
        const payload = { email: user.email, sub: user._id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(email: string, pass: string) {
        const passwordHash = await bcrypt.hash(pass, 10);
        const createdUser = new this.userModel({ email, passwordHash });
        return createdUser.save();
    }
}
