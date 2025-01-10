import { Chat } from './chat.entity';

export const ChatProviders = [
  {
    provide: 'CHAT_REPOSITORY',
    useValue: Chat,
  },
];
