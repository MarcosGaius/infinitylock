export interface SessionPayload {
  sub: number;
  firstName: string;
  lastName: string;
  email: string;
  iat?: number;
  exp?: number;
}
