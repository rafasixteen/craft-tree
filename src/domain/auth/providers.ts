import { Provider } from '@/domain/auth';
import { google } from './google';
import { discord } from './discord';

export const providers: Provider[] = [discord, google];
