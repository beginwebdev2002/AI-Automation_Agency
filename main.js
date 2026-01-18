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
const booking_module_1 = __webpack_require__(20);
const telegram_module_1 = __webpack_require__(25);
const users_module_1 = __webpack_require__(16);
const treatments_module_1 = __webpack_require__(29);
const queue_module_1 = __webpack_require__(33);
const gemini_module_1 = __webpack_require__(39);
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
const users_module_1 = __webpack_require__(16);
const passport_1 = __webpack_require__(17);
const jwt_1 = __webpack_require__(11);
const jwt_strategy_1 = __webpack_require__(18);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: 'SECRET_KEY', // Use env var
                signOptions: { expiresIn: '60m' },
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const auth_service_1 = __webpack_require__(10);
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
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
tslib_1.__decorate([
    (0, common_1.Post)('register'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
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
/* 17 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__(4);
const passport_jwt_1 = __webpack_require__(19);
const passport_1 = __webpack_require__(17);
const common_1 = __webpack_require__(1);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'SECRET_KEY', // Use env var in production
        });
    }
    async validate(payload) {
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], JwtStrategy);


/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const venue_schema_1 = __webpack_require__(21);
const appointment_schema_1 = __webpack_require__(22);
const booking_service_1 = __webpack_require__(23);
const booking_controller_1 = __webpack_require__(24);
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
/* 21 */
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
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppointmentSchema = exports.Appointment = exports.AppointmentStatus = void 0;
const tslib_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(8);
const mongoose_2 = __webpack_require__(12);
const user_schema_1 = __webpack_require__(13);
const venue_schema_1 = __webpack_require__(21);
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
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const mongoose_2 = __webpack_require__(12);
const venue_schema_1 = __webpack_require__(21);
const appointment_schema_1 = __webpack_require__(22);
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
    async findAllAppointments() {
        return this.appointmentModel.find().populate('user', 'email role').populate('venue', 'name address').exec();
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
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const booking_service_1 = __webpack_require__(23);
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
    findAllAppointments() {
        return this.bookingService.findAllAppointments();
    }
};
exports.BookingController = BookingController;
tslib_1.__decorate([
    (0, common_1.Post)('venues')
    // @UseGuards(AuthGuard('jwt')) // Uncomment to protect
    ,
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
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
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], BookingController.prototype, "createAppointment", null);
tslib_1.__decorate([
    (0, common_1.Get)('appointments'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], BookingController.prototype, "findAllAppointments", null);
exports.BookingController = BookingController = tslib_1.__decorate([
    (0, common_1.Controller)('booking'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof booking_service_1.BookingService !== "undefined" && booking_service_1.BookingService) === "function" ? _a : Object])
], BookingController);


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TelegramModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const nestjs_telegraf_1 = __webpack_require__(26);
const telegram_service_1 = __webpack_require__(27);
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
                    token: config.get('TELEGRAM_TOKEN'),
                }),
            }),
        ],
        controllers: [],
        providers: [telegram_service_1.TelegramService],
    })
], TelegramModule);


/***/ }),
/* 26 */
/***/ ((module) => {

module.exports = require("nestjs-telegraf");

/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TelegramService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const telegraf_1 = __webpack_require__(28);
const nestjs_telegraf_1 = __webpack_require__(26);
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
/* 28 */
/***/ ((module) => {

module.exports = require("telegraf");

/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreatmentsModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const treatments_controller_1 = __webpack_require__(30);
const treatments_service_1 = __webpack_require__(31);
const treatment_schema_1 = __webpack_require__(32);
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
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreatmentsController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const treatments_service_1 = __webpack_require__(31);
let TreatmentsController = class TreatmentsController {
    constructor(treatmentsService) {
        this.treatmentsService = treatmentsService;
    }
    async findAll() {
        return this.treatmentsService.findAll();
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
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
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
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreatmentsService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const mongoose_2 = __webpack_require__(12);
const treatment_schema_1 = __webpack_require__(32);
let TreatmentsService = class TreatmentsService {
    constructor(treatmentModel) {
        this.treatmentModel = treatmentModel;
    }
    async findAll() {
        return this.treatmentModel.find().exec();
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
/* 32 */
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
/* 33 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueueModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const queue_controller_1 = __webpack_require__(34);
const queue_service_1 = __webpack_require__(35);
const queue_schema_1 = __webpack_require__(36);
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
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueueController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const queue_service_1 = __webpack_require__(35);
const telegram_auth_guard_1 = __webpack_require__(37);
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
        // In a real app, check if req.user.role === 'admin'
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
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueueService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const mongoose_2 = __webpack_require__(12);
const queue_schema_1 = __webpack_require__(36);
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
/* 36 */
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
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TelegramAuthGuard = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(5);
const crypto = tslib_1.__importStar(__webpack_require__(38));
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
                // Add role logic here (simple check for now)
                request.user.role = request.user.id === 6016120046 ? 'admin' : 'client'; // Example ID
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
        const secretKey = crypto
            .createHmac('sha256', 'WebAppData')
            .update(this.configService.get('TELEGRAM_TOKEN'))
            .digest();
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
/* 38 */
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GeminiModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const gemini_controller_1 = __webpack_require__(40);
const gemini_service_1 = __webpack_require__(41);
const config_1 = __webpack_require__(5);
let GeminiModule = class GeminiModule {
};
exports.GeminiModule = GeminiModule;
exports.GeminiModule = GeminiModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [gemini_controller_1.GeminiController],
        providers: [gemini_service_1.GeminiService],
    })
], GeminiModule);


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GeminiController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const gemini_service_1 = __webpack_require__(41);
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
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GeminiService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(5);
const generative_ai_1 = __webpack_require__(42);
const mammoth = tslib_1.__importStar(__webpack_require__(43));
const path = tslib_1.__importStar(__webpack_require__(44));
const fs = tslib_1.__importStar(__webpack_require__(45));
let GeminiService = class GeminiService {
    constructor(configService) {
        this.configService = configService;
        this.context = '';
        const apiKey = this.configService.get('GEMINI_API_KEY') || 'YOUR_API_KEY_HERE';
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
    async onModuleInit() {
        await this.loadContext();
    }
    async loadContext() {
        try {
            // Look for chatbot.docx in the root or project specific paths
            const docPath = path.join(process.cwd(), 'chatbot.docx');
            if (fs.existsSync(docPath)) {
                const result = await mammoth.extractRawText({ path: docPath });
                this.context = result.value;
                console.log('Loaded chatbot context from docx');
            }
            else {
                console.warn('chatbot.docx not found at', docPath);
                this.context = 'You are a helpful assistant for AAA Cosmetics clinic.';
            }
        }
        catch (error) {
            console.error('Error loading chatbot context:', error);
        }
    }
    async chat(message) {
        const prompt = `
      Context: ${this.context}
      
      User Question: ${message}
      
      Answer as a helpful assistant for the clinic. Keep answers concise and professional.
    `;
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }
        catch (error) {
            console.error('Gemini API Error:', error);
            return 'Sorry, I am having trouble answering that right now.';
        }
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], GeminiService);


/***/ }),
/* 42 */
/***/ ((module) => {

module.exports = require("@google/generative-ai");

/***/ }),
/* 43 */
/***/ ((module) => {

module.exports = require("mammoth");

/***/ }),
/* 44 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 45 */
/***/ ((module) => {

module.exports = require("fs");

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
    const port = process.env.PORT || 3000;
    app.setGlobalPrefix('api');
    app.enableCors({
        // Разрешаем запросы только с твоего фронтенда на GitHub Pages
        origin: [
            'https://beginwebdev2002.github.io/',
            'http://localhost:4200' // Твой купленный домен
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    await app.listen(port);
    common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map