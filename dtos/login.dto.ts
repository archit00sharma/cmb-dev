
import {
    IsEmail,
    IsString,
    IsNotEmpty,
    IsObject,
    IsOptional,
    Contains,
    IsNumber,
    IsArray,
    IsMongoId,
} from "class-validator";

export class loginDto {
    @IsNotEmpty()
    public firstName: string;

    @IsNotEmpty()
    public lastName: string;

    @IsNotEmpty()
    @IsString()
    public role: string;

    @IsNotEmpty()
    @IsEmail()
    public email: string



    @IsOptional()
    @IsNotEmpty()
    public mobile: string;

    @IsNotEmpty()
    public password: string;

    @IsOptional()
    @IsString()
    public gender: string;

    @IsOptional()
    @IsNumber()
    public dob: string;

    @IsOptional()
    @IsString()
    public profileImage: string;


    @IsOptional()
    @IsString()
    public address: [string];


    @IsOptional()
    @IsObject()
    public device: {
        id: string;
        token: string;
    };

    @IsOptional()
    @IsObject()
    public social: {
        type: string;
        token: string;
    };

    @IsOptional()
    public resetToken: string;
}
