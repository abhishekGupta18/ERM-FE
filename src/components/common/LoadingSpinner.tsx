import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'white' | 'gray';
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    color = 'primary',
    className = '',
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    const colorClasses = {
        primary: 'text-indigo-600',
        white: 'text-white',
        gray: 'text-gray-400',
    };

    return (
        <div className={`inline-flex items-center justify-center ${className}`}>
            <div
                className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]} ${colorClasses[color]}`}
            />
        </div>
    );
};

export default LoadingSpinner; 