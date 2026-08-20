export interface ResolvedInteractiveLayer {
  id: string;
  rawValue: number;
  normalizedValue: number;
  color: string;
  hoverable: boolean;
  tooltip?: {
    enabled?: boolean;
    label?: string;
    mode?: 'self' | 'all' | 'none';
    color?: string;
  };
}
