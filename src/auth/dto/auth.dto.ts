import {
  IsNotEmpty,
  IsString,
  IsEmail,
  NotContains,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { PickType } from '@nestjs/mapped-types';

export class SignUpDto {
  @IsEmail(
    {},
    {
      message: '이메일의 형식을 입력해주세요',
    },
  )
  @IsNotEmpty({
    message: '이메일은 필수 입력 항목입니다',
  })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: '비밀번호는 필수 입력 항목입니다',
  })
  @IsStrongPassword(
    {
      //패스워드의 최소 길이는 8자 이어야 함
      minLength: 8,
      // 패스워드에 최소한 하나의 소문자가 포함되어야 함을 의미
      minLowercase: 1,
      // 패스워드에 최소한 하나의 숫자가 포함되어야 함
      minNumbers: 1,
      // 패스워드에 최소한 하나의 특수 문자가 포함되어야 함
      minSymbols: 1,
      // 패스워드에 대문자가 최소한 1개 포함되어야 함
      minUppercase: 1,
    },
    {
      message:
        '비밀번호는 최소 8자리의 문자열이며, 대문자, 소문자, 숫자, 특수문자가 최소 1개씩은 포함 되어야 합니다',
    },
  )
  password: string;

  @IsString()
  @IsNotEmpty({
    message: '확인 비밀번호는 필수 입력 항목입니다',
  })
  @IsStrongPassword(
    {
      //패스워드의 최소 길이는 8자 이어야 함
      minLength: 8,
      // 패스워드에 최소한 하나의 소문자가 포함되어야 함을 의미
      minLowercase: 1,
      // 패스워드에 최소한 하나의 숫자가 포함되어야 함
      minNumbers: 1,
      // 패스워드에 최소한 하나의 특수 문자가 포함되어야 함
      minSymbols: 1,
      // 패스워드에 대문자가 최소한 1개 포함되어야 함
      minUppercase: 1,
    },
    {
      message:
        '확인 비밀번호는 최소 8자리의 문자열이며, 대문자, 소문자, 숫자, 특수문자가 최소 1개씩은 포함 되어야 합니다',
    },
  )
  confirm: string;

  @IsString({
    message: '닉네임은 문자열 입니다',
  })
  @IsNotEmpty({
    message: '닉네임은 필수 입력 항목입니다',
  })
  @NotContains(' ', {
    message: '공백은 포함할 수 없습니다',
  })
  @MaxLength(10, {
    message: '닉네임은 10글자 이내여야합니다.',
  })
  nickname: string;
}

export class LoginDto extends PickType(SignUpDto, ['email', 'password']) {} // email, password 검증 기능만 상속받음
