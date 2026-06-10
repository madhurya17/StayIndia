interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export default function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} border-3 border-primary-100 border-t-primary-500 rounded-full animate-spin`}
        style={{ borderWidth: size === 'sm' ? '2px' : '3px' }}
      />
      {message && <p className="text-gray-500 text-sm">{message}</p>}
    </div>
  );
}
