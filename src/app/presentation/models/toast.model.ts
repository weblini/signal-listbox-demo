export interface Toast {
  id: number;
  message: string;
  type?: 'error' | 'success';
}

export type FreeToast = Omit<Toast, 'id'>;
