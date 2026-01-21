/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(5);
const app_controller_1 = __webpack_require__(6);
const app_service_1 = __webpack_require__(7);
const mongoose_1 = __webpack_require__(8);
const auth_module_1 = __webpack_require__(9);
const booking_module_1 = __webpack_require__(23);
const telegram_module_1 = __webpack_require__(30);
const users_module_1 = __webpack_require__(19);
const treatments_module_1 = __webpack_require__(34);
const queue_module_1 = __webpack_require__(38);
const gemini_module_1 = __webpack_require__(44);
const chat_module_1 = __webpack_require__(50);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: () => ({
                    uri: process.env.MONGODB_URI_ONLINE,
                    connectTimeoutMS: 10000,
                    socketTimeoutMS: 45000,
                    family: 4,
                }),
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `${process.cwd()}/.env`,
            }),
            auth_module_1.AuthModule,
            booking_module_1.BookingModule,
            telegram_module_1.TelegramModule,
            users_module_1.UsersModule,
            treatments_module_1.TreatmentsModule,
            queue_module_1.QueueModule,
            gemini_module_1.GeminiModule,
            chat_module_1.ChatModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const app_service_1 = __webpack_require__(7);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getData() {
        return 'Hello World!';
    }
};
exports.AppController = AppController;
tslib_1.__decorate([
    (0, common_1.Get)(''),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getData", null);
exports.AppController = AppController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let AppService = class AppService {
    getData() {
        return { message: 'Hello API' };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const auth_service_1 = __webpack_require__(10);
const auth_controller_1 = __webpack_require__(15);
const users_module_1 = __webpack_require__(19);
const passport_1 = __webpack_require__(20);
const jwt_1 = __webpack_require__(11);
const jwt_strategy_1 = __webpack_require__(21);
const config_1 = __webpack_require__(5);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const secret = configService.get('JWT_SECRET');
                    if (!secret) {
                        throw new Error('JWT_SECRET is not defined');
                    }
                    return {
                        secret: secret,
                        signOptions: { expiresIn: '60m' },
                    };
                },
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const jwt_1 = __webpack_require__(11);
const mongoose_1 = __webpack_require__(8);
const mongoose_2 = __webpack_require__(12);
const user_schema_1 = __webpack_require__(13);
const bcrypt = tslib_1.__importStar(__webpack_require__(14));
let AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async validateUser(email, pass) {
        const user = await this.userModel.findOne({ email }).lean();
        if (user && (await bcrypt.compare(pass, user.passwordHash))) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user._id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async register(email, pass) {
        const passwordHash = await bcrypt.hash(pass, 10);
        const createdUser = new this.userModel({ email, passwordHash });
        return createdUser.save();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);


/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = exports.UserRole = void 0;
const tslib_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(8);
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["USER"] = "USER";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User {
};
exports.User = User;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "email", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: UserRole, default: UserRole.USER }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "role", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "telegramId", void 0);
exports.User = User = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);


/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const auth_service_1 = __webpack_require__(10);
const login_dto_1 = __webpack_require__(16);
const register_dto_1 = __webpack_require__(18);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(body) {
        // In a real app, use LocalAuthGuard to validate first
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            return { message: 'Invalid credentials' };
        }
        return this.authService.login(user);
    }
    async register(body) {
        return this.authService.register(body.email, body.password);
    }
};
exports.AuthController = AuthController;
tslib_1.__decorate([
    (0, common_1.Post)('login'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
tslib_1.__decorate([
    (0, common_1.Post)('register'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = typeof register_dto_1.RegisterDto !== "undefined" && register_dto_1.RegisterDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
exports.AuthController = AuthController = tslib_1.__decorate([
    (0, common_1.Controller)('auth'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(17);
class LoginDto {
}
exports.LoginDto = LoginDto;
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email format' }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(17);
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email format' }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters long' }),
    tslib_1.__metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const user_schema_1 = __webpack_require__(13);
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
        ],
        controllers: [],
        providers: [],
        exports: [mongoose_1.MongooseModule],
    })
], UsersModule);


/***/ }),
/* 20 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__(4);
const passport_jwt_1 = __webpack_require__(22);
const passport_1 = __webpack_require__(20);
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(5);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService) {
        const secret = configService.get('JWT_SECRET');
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }
    async validate(payload) {
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),
/* 22 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const venue_schema_1 = __webpack_require__(24);
const appointment_schema_1 = __webpack_require__(25);
const booking_service_1 = __webpack_require__(26);
const booking_controller_1 = __webpack_require__(27);
let BookingModule = class BookingModule {
};
exports.BookingModule = BookingModule;
exports.BookingModule = BookingModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: venue_schema_1.Venue.name, schema: venue_schema_1.VenueSchema },
                { name: appointment_schema_1.Appointment.name, schema: appointment_schema_1.AppointmentSchema },
            ]),
        ],
        controllers: [booking_controller_1.BookingController],
        providers: [booking_service_1.BookingService],
    })
], BookingModule);


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VenueSchema = exports.Venue = void 0;
const tslib_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(8);
let Venue = class Venue {
};
exports.Venue = Venue;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], Venue.prototype, "name", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Venue.prototype, "address", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    tslib_1.__metadata("design:type", Array)
], Venue.prototype, "images", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", Number)
], Venue.prototype, "capacity", void 0);
exports.Venue = Venue = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Venue);
exports.VenueSchema = mongoose_1.SchemaFactory.createForClass(Venue);


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppointmentSchema = exports.Appointment = exports.AppointmentStatus = void 0;
const tslib_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(8);
const mongoose_2 = __webpack_require__(12);
const user_schema_1 = __webpack_require__(13);
const venue_schema_1 = __webpack_require__(24);
var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus["PENDING"] = "PENDING";
    AppointmentStatus["CONFIRMED"] = "CONFIRMED";
    AppointmentStatus["CANCELLED"] = "CANCELLED";
})(AppointmentStatus || (exports.AppointmentStatus = AppointmentStatus = {}));
let Appointment = class Appointment {
};
exports.Appointment = Appointment;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    tslib_1.__metadata("design:type", typeof (_a = typeof user_schema_1.User !== "undefined" && user_schema_1.User) === "function" ? _a : Object)
], Appointment.prototype, "user", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Venue', required: true }),
    tslib_1.__metadata("design:type", typeof (_b = typeof venue_schema_1.Venue !== "undefined" && venue_schema_1.Venue) === "function" ? _b : Object)
], Appointment.prototype, "venue", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Appointment.prototype, "startTime", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Appointment.prototype, "endTime", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: AppointmentStatus, default: AppointmentStatus.PENDING }),
    tslib_1.__metadata("design:type", String)
], Appointment.prototype, "status", void 0);
exports.Appointment = Appointment = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Appointment);
exports.AppointmentSchema = mongoose_1.SchemaFactory.createForClass(Appointment);


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const mongoose_2 = __webpack_require__(12);
const venue_schema_1 = __webpack_require__(24);
const appointment_schema_1 = __webpack_require__(25);
let BookingService = class BookingService {
    constructor(venueModel, appointmentModel) {
        this.venueModel = venueModel;
        this.appointmentModel = appointmentModel;
    }
    async createVenue(createVenueDto) {
        const createdVenue = new this.venueModel(createVenueDto);
        return createdVenue.save();
    }
    async findAllVenues(page = 1, limit = 10) {
        const MAX_LIMIT = 100;
        if (limit > MAX_LIMIT) {
            limit = MAX_LIMIT;
        }
        const skip = (page - 1) * limit;
        return this.venueModel.find().skip(skip).limit(limit).exec();
    }
    async createAppointment(createAppointmentDto) {
        const createdAppointment = new this.appointmentModel(createAppointmentDto);
        return createdAppointment.save();
    }
    async findAllAppointments(page = 1, limit = 10) {
        const MAX_LIMIT = 100;
        if (limit > MAX_LIMIT) {
            limit = MAX_LIMIT;
        }
        const skip = (page - 1) * limit;
        return this.appointmentModel.find().populate('user', 'email role').populate('venue', 'name address').skip(skip).limit(limit).exec();
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(venue_schema_1.Venue.name)),
    tslib_1.__param(1, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], BookingService);


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const booking_service_1 = __webpack_require__(26);
const create_venue_dto_1 = __webpack_require__(28);
const create_appointment_dto_1 = __webpack_require__(29);
let BookingController = class BookingController {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    // @UseGuards(AuthGuard('jwt')) // Uncomment to protect
    createVenue(createVenueDto) {
        return this.bookingService.createVenue(createVenueDto);
    }
    findAllVenues(page, limit) {
        return this.bookingService.findAllVenues(page, limit);
    }
    // @UseGuards(AuthGuard('jwt'))
    createAppointment(createAppointmentDto) {
        return this.bookingService.createAppointment(createAppointmentDto);
    }
    findAllAppointments(page, limit) {
        return this.bookingService.findAllAppointments(page, limit);
    }
};
exports.BookingController = BookingController;
tslib_1.__decorate([
    (0, common_1.Post)('venues')
    // @UseGuards(AuthGuard('jwt')) // Uncomment to protect
    ,
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof create_venue_dto_1.CreateVenueDto !== "undefined" && create_venue_dto_1.CreateVenueDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], BookingController.prototype, "createVenue", null);
tslib_1.__decorate([
    (0, common_1.Get)('venues'),
    tslib_1.__param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", void 0)
], BookingController.prototype, "findAllVenues", null);
tslib_1.__decorate([
    (0, common_1.Post)('appointments')
    // @UseGuards(AuthGuard('jwt'))
    ,
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = typeof create_appointment_dto_1.CreateAppointmentDto !== "undefined" && create_appointment_dto_1.CreateAppointmentDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], BookingController.prototype, "createAppointment", null);
tslib_1.__decorate([
    (0, common_1.Get)('appointments'),
    tslib_1.__param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", void 0)
], BookingController.prototype, "findAllAppointments", null);
exports.BookingController = BookingController = tslib_1.__decorate([
    (0, common_1.Controller)('booking'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof booking_service_1.BookingService !== "undefined" && booking_service_1.BookingService) === "function" ? _a : Object])
], BookingController);


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateVenueDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(17);
class CreateVenueDto {
}
exports.CreateVenueDto = CreateVenueDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateVenueDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], CreateVenueDto.prototype, "address", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Array)
], CreateVenueDto.prototype, "images", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Number)
], CreateVenueDto.prototype, "capacity", void 0);


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateAppointmentDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(17);
const appointment_schema_1 = __webpack_require__(25);
class CreateAppointmentDto {
}
exports.CreateAppointmentDto = CreateAppointmentDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateAppointmentDto.prototype, "user", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateAppointmentDto.prototype, "venue", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateAppointmentDto.prototype, "startTime", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateAppointmentDto.prototype, "endTime", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsEnum)(appointment_schema_1.AppointmentStatus),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", typeof (_a = typeof appointment_schema_1.AppointmentStatus !== "undefined" && appointment_schema_1.AppointmentStatus) === "function" ? _a : Object)
], CreateAppointmentDto.prototype, "status", void 0);


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TelegramModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const nestjs_telegraf_1 = __webpack_require__(31);
const telegram_service_1 = __webpack_require__(32);
const config_1 = __webpack_require__(5);
let TelegramModule = class TelegramModule {
};
exports.TelegramModule = TelegramModule;
exports.TelegramModule = TelegramModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_telegraf_1.TelegrafModule.forRootAsync({
                // 1. Указываем, какие сервисы нужно внедрить (инжектировать)
                inject: [config_1.ConfigService],
                // 2. Используем фабрику для создания конфигурации
                useFactory: (config) => ({
                    token: config.get('TELEGRAM_TOKEN') || '',
                }),
            }),
        ],
        controllers: [],
        providers: [telegram_service_1.TelegramService],
    })
], TelegramModule);


/***/ }),
/* 31 */
/***/ ((module) => {

module.exports = require("nestjs-telegraf");

/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TelegramService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const telegraf_1 = __webpack_require__(33);
const nestjs_telegraf_1 = __webpack_require__(31);
let TelegramService = class TelegramService {
    constructor(bot) {
        this.bot = bot;
    }
    async start(ctx) {
        await ctx.reply('Welcome');
    }
};
exports.TelegramService = TelegramService;
tslib_1.__decorate([
    (0, nestjs_telegraf_1.Start)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof telegraf_1.Context !== "undefined" && telegraf_1.Context) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TelegramService.prototype, "start", null);
exports.TelegramService = TelegramService = tslib_1.__decorate([
    (0, nestjs_telegraf_1.Update)(),
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, nestjs_telegraf_1.InjectBot)()),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof telegraf_1.Telegraf !== "undefined" && telegraf_1.Telegraf) === "function" ? _a : Object])
], TelegramService);


/***/ }),
/* 33 */
/***/ ((module) => {

module.exports = require("telegraf");

/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreatmentsModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const treatments_controller_1 = __webpack_require__(35);
const treatments_service_1 = __webpack_require__(36);
const treatment_schema_1 = __webpack_require__(37);
let TreatmentsModule = class TreatmentsModule {
};
exports.TreatmentsModule = TreatmentsModule;
exports.TreatmentsModule = TreatmentsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: treatment_schema_1.Treatment.name, schema: treatment_schema_1.TreatmentSchema }]),
        ],
        controllers: [treatments_controller_1.TreatmentsController],
        providers: [treatments_service_1.TreatmentsService],
    })
], TreatmentsModule);


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreatmentsController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const treatments_service_1 = __webpack_require__(36);
let TreatmentsController = class TreatmentsController {
    constructor(treatmentsService) {
        this.treatmentsService = treatmentsService;
    }
    async findAll(page, limit) {
        return this.treatmentsService.findAll(page, limit);
    }
    getFaq() {
        return this.treatmentsService.getFaq();
    }
    async seed() {
        await this.treatmentsService.seed();
        return { message: 'Seeded successfully' };
    }
};
exports.TreatmentsController = TreatmentsController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], TreatmentsController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)('faq'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], TreatmentsController.prototype, "getFaq", null);
tslib_1.__decorate([
    (0, common_1.Post)('seed'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TreatmentsController.prototype, "seed", null);
exports.TreatmentsController = TreatmentsController = tslib_1.__decorate([
    (0, common_1.Controller)('treatments'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof treatments_service_1.TreatmentsService !== "undefined" && treatments_service_1.TreatmentsService) === "function" ? _a : Object])
], TreatmentsController);


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreatmentsService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const mongoose_2 = __webpack_require__(12);
const treatment_schema_1 = __webpack_require__(37);
let TreatmentsService = class TreatmentsService {
    constructor(treatmentModel) {
        this.treatmentModel = treatmentModel;
    }
    async findAll(page = 1, limit = 10) {
        const MAX_LIMIT = 100;
        if (limit > MAX_LIMIT) {
            limit = MAX_LIMIT;
        }
        // Ensure page is at least 1
        const validPage = page < 1 ? 1 : page;
        const skip = (validPage - 1) * limit;
        return this.treatmentModel.find().skip(skip).limit(limit).exec();
    }
    async create(createTreatmentDto) {
        const createdTreatment = new this.treatmentModel(createTreatmentDto);
        return createdTreatment.save();
    }
    getFaq() {
        return [
            {
                question: 'Does diode laser hurt?',
                answer: 'Most patients describe the sensation as a light snap of a rubber band. It is generally well-tolerated.',
            },
            {
                question: 'How should I prep for my appointment?',
                answer: 'Shave the area 24 hours before. Avoid sun exposure for 2 weeks prior.',
            },
        ];
    }
    async seed() {
        const count = await this.treatmentModel.countDocuments();
        if (count === 0) {
            const treatments = [
                { name: 'Full Face Laser', category: 'Laser', price: 250, description: 'Complete face hair removal' },
                { name: 'Underarms Laser', category: 'Laser', price: 100, description: 'Underarm hair removal' },
                { name: 'Botox Forehead', category: 'Botox', price: 1200, description: 'Smooth out forehead lines' },
                { name: 'HydraFacial', category: 'Facials', price: 400, description: 'Deep cleansing and hydration' },
            ];
            await this.treatmentModel.insertMany(treatments);
        }
    }
};
exports.TreatmentsService = TreatmentsService;
exports.TreatmentsService = TreatmentsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(treatment_schema_1.Treatment.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], TreatmentsService);


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreatmentSchema = exports.Treatment = void 0;
const tslib_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(8);
let Treatment = class Treatment {
};
exports.Treatment = Treatment;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], Treatment.prototype, "name", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], Treatment.prototype, "category", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", Number)
], Treatment.prototype, "price", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Treatment.prototype, "description", void 0);
exports.Treatment = Treatment = tslib_1.__decorate([
    (0, mongoose_1.Schema)()
], Treatment);
exports.TreatmentSchema = mongoose_1.SchemaFactory.createForClass(Treatment);


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueueModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const queue_controller_1 = __webpack_require__(39);
const queue_service_1 = __webpack_require__(40);
const queue_schema_1 = __webpack_require__(41);
const config_1 = __webpack_require__(5);
let QueueModule = class QueueModule {
};
exports.QueueModule = QueueModule;
exports.QueueModule = QueueModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: queue_schema_1.Queue.name, schema: queue_schema_1.QueueSchema }]),
            config_1.ConfigModule
        ],
        controllers: [queue_controller_1.QueueController],
        providers: [queue_service_1.QueueService],
    })
], QueueModule);


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueueController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const queue_service_1 = __webpack_require__(40);
const telegram_auth_guard_1 = __webpack_require__(42);
let QueueController = class QueueController {
    constructor(queueService) {
        this.queueService = queueService;
    }
    async joinQueue(req, body) {
        const user = req.user;
        return this.queueService.addToQueue(user.id, user.first_name, user.username, body.serviceCategory);
    }
    async getQueue() {
        return this.queueService.getQueue();
    }
    async updateStatus(req, id, body) {
        if (req.user.role !== 'admin') {
            throw new common_1.UnauthorizedException('Only admins can update status');
        }
        return this.queueService.updateStatus(id, body.status);
    }
};
exports.QueueController = QueueController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(telegram_auth_guard_1.TelegramAuthGuard),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], QueueController.prototype, "joinQueue", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], QueueController.prototype, "getQueue", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(telegram_auth_guard_1.TelegramAuthGuard),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], QueueController.prototype, "updateStatus", null);
exports.QueueController = QueueController = tslib_1.__decorate([
    (0, common_1.Controller)('queue'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof queue_service_1.QueueService !== "undefined" && queue_service_1.QueueService) === "function" ? _a : Object])
], QueueController);


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueueService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const mongoose_2 = __webpack_require__(12);
const queue_schema_1 = __webpack_require__(41);
let QueueService = class QueueService {
    constructor(queueModel) {
        this.queueModel = queueModel;
    }
    async addToQueue(userId, firstName, username, serviceCategory) {
        // Find today's max sequence number
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const lastEntry = await this.queueModel
            .findOne({ createdAt: { $gte: startOfDay } })
            .sort({ sequenceNumber: -1 })
            .exec();
        const sequenceNumber = lastEntry ? lastEntry.sequenceNumber + 1 : 1;
        const newEntry = new this.queueModel({
            userId,
            firstName,
            username,
            serviceCategory,
            sequenceNumber,
            status: 'waiting',
        });
        return newEntry.save();
    }
    async getQueue() {
        return this.queueModel.find({ status: { $in: ['waiting', 'in-progress'] } }).sort({ sequenceNumber: 1 }).exec();
    }
    async updateStatus(id, status) {
        return this.queueModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(queue_schema_1.Queue.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], QueueService);


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueueSchema = exports.Queue = void 0;
const tslib_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(8);
let Queue = class Queue {
};
exports.Queue = Queue;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", Number)
], Queue.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], Queue.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Queue.prototype, "username", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], Queue.prototype, "serviceCategory", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", Number)
], Queue.prototype, "sequenceNumber", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ default: 'waiting' }),
    tslib_1.__metadata("design:type", String)
], Queue.prototype, "status", void 0);
exports.Queue = Queue = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Queue);
exports.QueueSchema = mongoose_1.SchemaFactory.createForClass(Queue);


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TelegramAuthGuard = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(5);
const crypto = tslib_1.__importStar(__webpack_require__(43));
let TelegramAuthGuard = class TelegramAuthGuard {
    constructor(configService) {
        this.configService = configService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const initData = request.headers['x-telegram-init-data'];
        if (!initData) {
            throw new common_1.UnauthorizedException('Missing Telegram initData');
        }
        if (this.validateInitData(initData)) {
            // Parse user data from initData
            const urlParams = new URLSearchParams(initData);
            const userString = urlParams.get('user');
            if (userString) {
                request.user = JSON.parse(userString);
                // Add role logic here
                const adminId = this.configService.get('TELEGRAM_ADMIN_ID');
                request.user.role = String(request.user.id) === adminId ? 'admin' : 'client';
            }
            return true;
        }
        throw new common_1.UnauthorizedException('Invalid Telegram initData');
    }
    validateInitData(initData) {
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get('hash');
        urlParams.delete('hash');
        const dataCheckString = Array.from(urlParams.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        let secretKey = this.secretKey;
        if (!secretKey) {
            const token = this.configService.get('TELEGRAM_TOKEN');
            if (!token) {
                throw new common_1.UnauthorizedException('Telegram token not configured');
            }
            secretKey = crypto
                .createHmac('sha256', 'WebAppData')
                .update(token)
                .digest();
            this.secretKey = secretKey;
        }
        const calculatedHash = crypto
            .createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');
        return calculatedHash === hash;
    }
};
exports.TelegramAuthGuard = TelegramAuthGuard;
exports.TelegramAuthGuard = TelegramAuthGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], TelegramAuthGuard);


/***/ }),
/* 43 */
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GeminiModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const gemini_controller_1 = __webpack_require__(45);
const gemini_service_1 = __webpack_require__(46);
const config_1 = __webpack_require__(5);
let GeminiModule = class GeminiModule {
};
exports.GeminiModule = GeminiModule;
exports.GeminiModule = GeminiModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [gemini_controller_1.GeminiController],
        providers: [gemini_service_1.GeminiService],
        exports: [gemini_service_1.GeminiService],
    })
], GeminiModule);


/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GeminiController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const gemini_service_1 = __webpack_require__(46);
let GeminiController = class GeminiController {
    constructor(geminiService) {
        this.geminiService = geminiService;
    }
    // @UseGuards(TelegramAuthGuard) // Optional: Enable if you want to restrict to TWA users
    async chat(body) {
        const response = await this.geminiService.chat(body.message);
        return { response };
    }
};
exports.GeminiController = GeminiController;
tslib_1.__decorate([
    (0, common_1.Post)()
    // @UseGuards(TelegramAuthGuard) // Optional: Enable if you want to restrict to TWA users
    ,
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], GeminiController.prototype, "chat", null);
exports.GeminiController = GeminiController = tslib_1.__decorate([
    (0, common_1.Controller)('chat'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof gemini_service_1.GeminiService !== "undefined" && gemini_service_1.GeminiService) === "function" ? _a : Object])
], GeminiController);


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GeminiService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(5);
const generative_ai_1 = __webpack_require__(47);
const mammoth = tslib_1.__importStar(__webpack_require__(48));
const path = tslib_1.__importStar(__webpack_require__(49));
let GeminiService = class GeminiService {
    constructor(configService) {
        this.configService = configService;
        this.context = '';
        const apiKey = this.configService.get('GEMINI_API_KEY') || 'YOUR_API_KEY_HERE';
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    async onModuleInit() {
        await this.loadContext();
        console.log('✅ База знаний успешно загружена из OneDrive');
        this.model = await this.genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: this.buildSystemPrompt()
        });
    }
    buildSystemPrompt() {
        return `
        You are a professional consultant for the AAA Cosmetics Clinic in Dushanbe.
        
        KNOWLEDGE BASE:
        ${this.context}
        
        INSTRUCTIONS:
        1. Answer in the user's language (Russian, Tajik, or English).
        2. ALWAYS provide prices in TJS (Somoni).
        3. Be polite, professional, and concise.
        4. If you don't know the answer based on the knowledge base, ask the user to contact the clinic directly.
        5. Answer the questions depends on User Personal Information.
        6. FORMATTING RULES:
            - Use HTML for all responses.
            - Set style for every tag with inline styles (do not use CSS classes, do not use external CSS files). 
            - Approved inline styles: margin(min: 5px, max: 20px), background-color, color, font-weight, font-family.
            - Use <strong>bold text</strong> for prices and service names.
            - Use <table> for tables of services or preparation steps.
            - Use <img> for images of services or preparation steps. max width/height 200px
            - Use <ul><li>bullet points</li></ul> for lists of services or preparation steps. set margin between bullet points 10px
            - Use <h3>Headings</h3> to separate different topics.
            - Keep <p>paragraphs short (maximum 2-3 sentences)</p>
            - Use <hr> horizontal rules to separate sections if the answer is long.
        
        `;
    }
    async loadContext() {
        try {
            const docPath = path.join(__dirname, 'assets', 'chat-bot.docx');
            const result = await mammoth.extractRawText({ path: docPath });
            this.context = result.value;
            console.log('✅ База знаний успешно загружена из OneDrive');
        }
        catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            console.error('❌ Ошибка загрузки контекста из OneDrive:', errorMsg);
            this.context = 'AAA Cosmetics Clinic services and information.';
        }
    }
    async chat(message) {
        return await this.chatWithHistory([{ role: 'user', parts: [{ text: message }] }]);
    }
    async chatWithHistory(history) {
        try {
            const lastMsg = history[history.length - 1];
            const chat = this.model.startChat({
                history: history.slice(0, -1),
            });
            const text = lastMsg.parts[0].text || '';
            const result = await chat.sendMessage(text);
            const response = await result.response;
            return response.text();
        }
        catch (error) {
            console.error('Gemini API Error:', JSON.stringify(error, null, 2));
            if (error instanceof Error) {
                console.error('Error message:', error.message);
            }
            return 'Извините, в данный момент я не могу ответить. Пожалуйста, попробуйте позже.';
        }
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], GeminiService);


/***/ }),
/* 47 */
/***/ ((module) => {

module.exports = require("@google/generative-ai");

/***/ }),
/* 48 */
/***/ ((module) => {

module.exports = require("mammoth");

/***/ }),
/* 49 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const chat_controller_1 = __webpack_require__(51);
const chat_service_1 = __webpack_require__(52);
const chat_schema_1 = __webpack_require__(53);
const gemini_module_1 = __webpack_require__(44);
const config_1 = __webpack_require__(5);
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: chat_schema_1.Chat.name, schema: chat_schema_1.ChatSchema }]),
            gemini_module_1.GeminiModule,
            config_1.ConfigModule
        ],
        controllers: [chat_controller_1.ChatController],
        providers: [chat_service_1.ChatService],
        exports: [chat_service_1.ChatService],
    })
], ChatModule);


/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const chat_service_1 = __webpack_require__(52);
const send_message_dto_1 = __webpack_require__(54);
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    // @UseGuards(TelegramAuthGuard)
    async sendMessage(body) {
        console.log('Hello!', body);
        return {
            response: await this.chatService.handleMessage(body.chatId, body.message)
        };
    }
};
exports.ChatController = ChatController;
tslib_1.__decorate([
    (0, common_1.Post)('message')
    // @UseGuards(TelegramAuthGuard)
    ,
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof send_message_dto_1.SendMessageDto !== "undefined" && send_message_dto_1.SendMessageDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
exports.ChatController = ChatController = tslib_1.__decorate([
    (0, common_1.Controller)('chat'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof chat_service_1.ChatService !== "undefined" && chat_service_1.ChatService) === "function" ? _a : Object])
], ChatController);


/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var ChatService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const mongoose_2 = __webpack_require__(12);
const chat_schema_1 = __webpack_require__(53);
const gemini_service_1 = __webpack_require__(46);
let ChatService = ChatService_1 = class ChatService {
    constructor(chatModel, geminiService) {
        this.chatModel = chatModel;
        this.geminiService = geminiService;
        this.logger = new common_1.Logger(ChatService_1.name);
    }
    async handleMessage(chatId, message) {
        // Limit history to last 50 messages to save context and tokens
        const MAX_HISTORY = 50;
        // Optimized: Only fetch the last 50 messages using projection and lean()
        const chat = await this.chatModel.findOne({ chatId }, { history: { $slice: -MAX_HISTORY } }).lean();
        // If chat exists, use its history, otherwise empty array
        const history = chat ? chat.history : [];
        // Prepare the new message
        const userMessage = { role: 'user', text: message, timestamp: new Date() };
        // Construct context: existing history + new message
        const historyContext = [...history, userMessage];
        // Ensure we only send the last MAX_HISTORY messages to AI
        const recentHistory = historyContext.slice(-MAX_HISTORY);
        const historyForAi = recentHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));
        const responseText = await this.geminiService.chatWithHistory(historyForAi);
        const modelMessage = { role: 'model', text: responseText, timestamp: new Date() };
        // Update database: Push both messages. Create document if it doesn't exist.
        await this.chatModel.updateOne({ chatId }, {
            $setOnInsert: { chatId },
            $push: {
                history: {
                    $each: [userMessage, modelMessage]
                }
            }
        }, { upsert: true });
        return responseText;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = ChatService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(chat_schema_1.Chat.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof gemini_service_1.GeminiService !== "undefined" && gemini_service_1.GeminiService) === "function" ? _b : Object])
], ChatService);


/***/ }),
/* 53 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatSchema = exports.Chat = exports.MessageSchema = exports.Message = void 0;
const tslib_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(8);
let Message = class Message {
};
exports.Message = Message;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['user', 'model'] }),
    tslib_1.__metadata("design:type", String)
], Message.prototype, "role", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], Message.prototype, "text", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Message.prototype, "timestamp", void 0);
exports.Message = Message = tslib_1.__decorate([
    (0, mongoose_1.Schema)()
], Message);
exports.MessageSchema = mongoose_1.SchemaFactory.createForClass(Message);
let Chat = class Chat {
};
exports.Chat = Chat;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    tslib_1.__metadata("design:type", String)
], Chat.prototype, "chatId", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: [exports.MessageSchema], default: [] }),
    tslib_1.__metadata("design:type", Array)
], Chat.prototype, "history", void 0);
exports.Chat = Chat = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Chat);
exports.ChatSchema = mongoose_1.SchemaFactory.createForClass(Chat);


/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SendMessageDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(17);
class SendMessageDto {
}
exports.SendMessageDto = SendMessageDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], SendMessageDto.prototype, "message", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], SendMessageDto.prototype, "chatId", void 0);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    const port = process.env.PORT || 3000;
    // app.setGlobalPrefix('api');
    // app.enableCors({
    //   // Разрешаем запросы только с твоего фронтенда на GitHub Pages
    //   origin: [
    //     'https://beginwebdev2002.github.io/',
    //     /\.github\.io$/,
    //     'http://localhost:4200' // Твой купленный домен
    //   ],
    //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    //   allowedHeaders: 'Content-Type, Accept, Authorization, x-telegram-init-data',
    //   credentials: true,
    // });
    app.enableCors({
        origin: true, // Разрешает запросы с любого источника (GitHub, Localhost)
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: '*', // Принимает любые заголовки, включая Telegram Init Data
        maxAge: 3600,
    });
    await app.listen(port);
    common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map