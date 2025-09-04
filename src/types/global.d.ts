import { DefaultSession } from 'next-auth';

declare global {
  var mongoose: {
    conn: unknown;
    promise: unknown;
  };
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}

export {};
