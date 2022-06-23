import { TesterSeed } from '../testHelper';
import { samples } from '../samples';
const { mobile, code } = samples;

export type DataType = { code: string };

export const seed: TesterSeed<DataType> = {
  up: async (tester) => {
    // create code
    await tester.codesRepository.save({ mobile: mobile, code: code });
    return { code };
  },
  down: async (tester) => {
    await tester.codesRepository.delete({ mobile });
    await tester.usersRepository.delete({ mobile });
    await tester.loginsRepository.delete({ mobile });
  },
};
