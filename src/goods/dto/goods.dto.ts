import { PickType } from '@nestjs/mapped-types';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GoodsDto {
  @IsNumber()
  userId: number;

  @IsString()
  @IsNotEmpty({ message: '필수 입력 항목입니다.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '필수 입력 항목입니다.' })
  content: string;

  @IsNumber()
  @IsNotEmpty({ message: '필수 입력 항목입니다.' })
  price: number;

  @IsString()
  //   @IsString({ each: true }) // 여러개의 이미지를 배열 형태로 받아온다면 유효성 검사를 이렇게 해야하지 않을까?
  @IsNotEmpty({ message: '필수 입력 항목입니다.' })
  imgUrl: string;

  @IsDateString()
  @IsNotEmpty({ message: '공연 일자를 선택해주세요.' })
  showDate: Date;

  @IsNumber()
  @IsNotEmpty({ message: '판매 수량을 입력해주세요.' })
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
