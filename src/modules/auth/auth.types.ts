import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User_Status_Enum } from '@/common/enums/common.enum';

// signIn 返回的聚合数据
export class signInResInfo {
  @ApiProperty({ description: '用户id' })
  id: string;

  @ApiProperty({ description: '用户手机号' })
  mobile: string;

  @ApiProperty({ description: '用户状态', enum: User_Status_Enum })
  status: User_Status_Enum;


  @ApiProperty({ description: 'token' })
  token: string;

  @ApiPropertyOptional({ description: '用户昵称' })
  name?: string;

  @ApiPropertyOptional({ description: '课程id' })
  courseId?: string;


  @ApiPropertyOptional({ description: '导练Id' })
  exerciseId?: string;
}
export class signUpResInfo {
  @ApiProperty({ description: '用户id' })
  id: string;

  @ApiProperty({ description: '用户手机号' })
  mobile: string;

  @ApiProperty({ description: '用户状态', enum: User_Status_Enum })
  status: User_Status_Enum;

  @ApiProperty({ description: 'token' })
  token: string;

  @ApiPropertyOptional({ description: '用户昵称' })
  name?: string | null;

  @ApiPropertyOptional({ description: '课程id' })
  courseId?: string | null;

  @ApiPropertyOptional({ description: '导练Id' })
  exerciseId?: string | null;
}
export class JwtUser {
  id: string;
  mobile: string;
  name?: string | null;
  status: string;
  userCourses?: [{ course_id?: string }] | [];
  userPaperTypes?: [{ paper_type?: string }] | [];
  userExercises?:
    | [
        {
          id?: string;
          ended_at: null;
          paper_type?: string;
        }
      ]
    | [];
}
