import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_DEC } from '../constants/decorators';

export const Public = () => SetMetadata(IS_PUBLIC_DEC, true);
