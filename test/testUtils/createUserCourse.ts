import { UserCourses } from '@/entities/UserCourses';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

type ParamsType = {
  userId: string;
  courseId: string;
};

export type CreateUserCourseRetType = {
  userCourse: UserCourses;
  finalize: () => void;
};

export const createUserCourse = async (
  { userId, courseId }: ParamsType,
  module: TestingModule
): Promise<CreateUserCourseRetType> => {
  // userCoursesRepository
  const userCoursesRepository = module.get<Repository<UserCourses>>(
    getRepositoryToken(UserCourses)
  );
  // delete before create
  await userCoursesRepository.delete({ userId });
  // create user exercise
  const userCourse = await userCoursesRepository.save({
    userId,
    courseId,
  });
  return {
    userCourse,
    finalize: async () => {
      await userCoursesRepository.delete({ userId });
    },
  };
};
