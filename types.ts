export type GameState = 'idle' | 'shaking' | 'revealed';

export interface LeadFormData {
  name: string;
  company: string;
  email: string;
  revealedAnswer: string;
}
