export interface Toast {
  id: number;
  message: string;
  type?: 'error' | 'success';
  retryAction?: () => void;
}

export type FreeToast = Omit<Toast, 'id'>;
