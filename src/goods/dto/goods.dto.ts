import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GoodsDto {
  @IsNumber()
  @ApiProperty({
    description: 'userId',
  })
  userId: number;

  @IsString()
  @IsNotEmpty({ message: '필수 입력 항목입니다.' })
  @ApiProperty({
    nullable: false,
    description: '공연 제목',
  })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '필수 입력 항목입니다.' })
  @ApiProperty({
    nullable: false,
    description: '공연 내용',
  })
  content: string;

  @IsNumber()
  @IsNotEmpty({ message: '필수 입력 항목입니다.' })
  @ApiProperty({
    nullable: false,
    description: '공연 가격',
  })
  price: number;

  @IsString()
  //   @IsString({ each: true }) // 여러개의 이미지를 배열 형태로 받아온다면 유효성 검사를 이렇게 해야하지 않을까?
  @IsNotEmpty({ message: '필수 입력 항목입니다.' })
  @ApiProperty({
    nullable: false,
    description: '공연 이미지 주소',
  })
  imgUrl: string;

  @IsDateString()
  @IsNotEmpty({ message: '공연 일자를 선택해주세요.' })
  @ApiProperty({
    nullable: false,
    description: '공연일자',
  })
  showDate: Date;

  @IsNumber()
  @IsNotEmpty({ message: '판매 수량을 입력해주세요.' })
  @ApiProperty({
    nullable: false,
    description: '판매 수량',
  })
  bookingLimit: number;
}

export class updateGoodsDto extends PickType(GoodsDto, [
  'title',
  'content',
  'price',
  'imgUrl',
  'showDate',
  'bookingLimit',
]) {} // userId 를 제외한 모든 검증 기능 상속받음
