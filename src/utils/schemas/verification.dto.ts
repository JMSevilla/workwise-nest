import {
    IsAlphanumeric,
    IsDate,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';

export class VerificationDto {
    @IsNotEmpty()
    @IsEmail(null, { message: 'Please provide valid email.'})
    email: string;
}