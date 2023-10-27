import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Accounts } from './entities/accounts.entity';
import { FindOneOptions } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { useResponse } from 'src/utils/hook/useCreateResponse';
import { IAccountService } from '../../interfaces/IAccountService';
import * as nodemailer from 'nodemailer'
import { useGenerateOTP } from 'src/utils/hook/useGenerateOTP';
import { Verification } from 'src/models/verification.entity';
import { VerificationDto } from 'src/utils/schemas/verification.dto';
@Injectable()
export class AccountsService implements IAccountService {
    private transporter;

    constructor(
        @InjectRepository(Accounts) private readonly accountsRepository: Repository<Accounts>,
        @InjectRepository(Verification) private readonly verificationRepository: Repository<Verification>
    ) {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'devopsbyte60@gmail.com',
                pass: process.env.SECRET_KEY
            }
        })
    }
    async createVerification(verificationDto: VerificationDto) {
        const {
            email
        } = verificationDto;
        const verification = new Verification()
        verification.code = parseInt(useGenerateOTP().generateOTP())
        verification.email = email;
        verification.isValid = 1;
        verification.resendCount = 1;
        verification.type = "email";
        await this.verificationRepository.save(verification);
        return useResponse().createResponse({
            message: 'success'
        }, 200)
    }
    async _check_email(email: string) {
        const result = await this.accountsRepository.findOne({ where: { email }})
        if (result) {
            return useResponse().createResponse({ message: 'Email already in use' }, 400);
        } else {
            const verificationRows = await this.verificationRepository.exist()
            if(verificationRows) {
                const checkVerification = await this.verificationRepository.findOne({
                    where: { email : email, isValid: 1 }
                })
                if(checkVerification.resendCount != 3) {
                    checkVerification.resendCount = checkVerification.resendCount + 1;
                    await this.verificationRepository.save(checkVerification)
                    await this.sendEmail(email, "OTP Code", `Kindly use OTP Code to activate account : ${useGenerateOTP().generateOTP()}`)
                } else {
                    return useResponse().createResponse({ message: 'Maximum sent email' }, 402);
                }
            } else {
                return useResponse()
                .createResponse({
                    message: 'post_new_verification'
                }, 201)
            }
        }
    }
    async sendEmail(to: string, subject: string, text: string) {
        await this.transporter.sendMail({
            from : 'devopsbyte60@gmail.com',
            to,
            subject,
            text
        })
        return useResponse().createResponse({
            message: "success"
        }, 200)
    }
    async _checkAccountExistency(): Promise<boolean> {
        const result = this.accountsRepository.exist();
        return result;
    }

    async findByUsername(username: string): Promise<Accounts> {
        return this.accountsRepository.findOne({ where: { username }})
    }

    async findOne(id: number): Promise<Accounts> {
        const findOptions: FindOneOptions<Accounts> = {
            where: { id }
        }
        return this.accountsRepository.findOne(findOptions)
    }

    async __create__accountsetup(createAccountDto: CreateAccountDto) {
        const {
            password,
            firstname,
            middlename,
            lastname,
            username,
            email,
            imgurl
        } = createAccountDto;

        const existingAccountByEmail = await this.accountsRepository.findOne({ where: { email } });
        const existingAccountByUsername = await this.accountsRepository.findOne({ where: { username } });

        if (existingAccountByEmail) {
            return useResponse().createResponse({ message: 'Email already in use' }, 400);
        }
    
        if (existingAccountByUsername) {
        return useResponse().createResponse({ message: 'Username already in use' }, 400); 
        }
        

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const account = new Accounts()
        account.firstname = firstname;
        account.middlename = !middlename || middlename == null ? "N/A" : middlename;
        account.lastname = lastname;
        account.username = username;
        account.email = email;
        account.password = hashedPassword;
        account.access_level = 'admin'
        account.verified = 1;
        account.status = 1;
        account.imgurl = imgurl;
        this.accountsRepository.save(account);
        return useResponse().createResponse({
            message: "success"
        }, 200)
    }
}
