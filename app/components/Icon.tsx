/**
 * Icon Component
 *
 * Wrapper component for RemixIcon icons to ensure consistent sizing and styling across the app.
 * Uses the RemixIcon library loaded via CDN in the root layout.
 *
 * @example
 * <Icon name="video-line" size="lg" />
 * <Icon name="check-line" className="text-green-500" />
 */

interface IconProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

export default function Icon({ name, size = 'md', className = '' }: IconProps) {
  const sizeClass = sizeClasses[size];

  return <i className={`ri-${name} ${sizeClass} ${className}`} />;
}

// Commonly used icon presets for consistency
export const VideoIcon = ({ className = '', size = 'md' }: Omit<IconProps, 'name'>) => (
  <Icon name="video-line" size={size} className={className} />
);

export const PlayIcon = ({ className = '', size = 'md' }: Omit<IconProps, 'name'>) => (
  <Icon name="play-line" size={size} className={className} />
);

export const DownloadIcon = ({ className = '', size = 'md' }: Omit<IconProps, 'name'>) => (
  <Icon name="download-line" size={size} className={className} />
);

export const ShareIcon = ({ className = '', size = 'md' }: Omit<IconProps, 'name'>) => (
  <Icon name="share-line" size={size} className={className} />
);

export const CheckIcon = ({ className = '', size = 'md' }: Omit<IconProps, 'name'>) => (
  <Icon name="check-line" size={size} className={className} />
);

export const ErrorIcon = ({ className = '', size = 'md' }: Omit<IconProps, 'name'>) => (
  <Icon name="error-warning-line" size={size} className={className} />
);

export const LoadingIcon = ({ className = '', size = 'md' }: Omit<IconProps, 'name'>) => (
  <Icon name="loader-4-line" size={size} className={`${className} animate-spin`} />
);

export const UploadIcon = ({ className = '', size = 'md' }: Omit<IconProps, 'name'>) => (
  <Icon name="upload-cloud-2-line" size={size} className={className} />
);

export const DeleteIcon = ({ className = '', size = 'md' }: Omit<IconProps, 'name'>) => (
  <Icon name="delete-bin-line" size={size} className={className} />
);

export const LinkIcon = ({ className = '', size = 'md' }: Omit<IconProps, 'name'>) => (
  <Icon name="link" size={size} className={className} />
);

export const ArrowLeftIcon = ({ className = '', size = 'md' }: Omit<IconProps, 'name'>) => (
  <Icon name="arrow-left-line" size={size} className={className} />
);

export const ArrowRightIcon = ({ className = '', size = 'md' }: Omit<IconProps, 'name'>) => (
  <Icon name="arrow-right-line" size={size} className={className} />
);

export const AddIcon = ({ className = '', size = 'md' }: Omit<IconProps, 'name'>) => (
  <Icon name="add-line" size={size} className={className} />
);

export const CloseIcon = ({ className = '', size = 'md' }: Omit<IconProps, 'name'>) => (
  <Icon name="close-line" size={size} className={className} />
);
