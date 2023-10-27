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


const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class CreateAccountDto {
    @IsString()
    @MinLength(2, { message: 'Firstname must be atleast 2 characters length. '})
    @IsNotEmpty()
    firstname: string;

    @IsString()
    @IsOptional()
    middlename: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2, { message: 'Lastname must be atleast 2 characters length. '})
    lastname: string;

    @IsNotEmpty()
    @MinLength(3, { message: 'Username must have atleast 3 characters.' })
    @IsAlphanumeric(null, {
        message: 'Username does not allow other than alpha numeric chars.',
    })
    username: string;

    @IsNotEmpty()
    @IsEmail(null, { message: 'Please provide valid email.'})
    email: string;

    @IsNotEmpty()
    @Matches(passwordRegEx, {
        message: `Password must contain Minimum 8 and maximum 20 characters, 
        at least one uppercase letter, 
        one lowercase letter, 
        one number and 
        one special character`,
    })
    password: string;

    @IsString()
    imgurl: string;
}
