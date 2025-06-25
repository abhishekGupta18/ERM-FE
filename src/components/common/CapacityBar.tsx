import React from 'react';
import { getCapacityColor } from '../../utils/helpers';

interface CapacityBarProps {
    current: number;
    max: number;
    showPercentage?: boolean;
    showValues?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const CapacityBar: React.FC<CapacityBarProps> = ({
    current,
    max,
    showPercentage = true,
    showValues = true,
    size = 'md',
    className = '',
}) => {
    const percentage = max > 0 ? (current / max) * 100 : 0;
    const colorClass = getCapacityColor(percentage);

    const sizeClasses = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4',
    };

    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-between mb-1">
                {showValues && (
                    <span className="text-xs font-medium text-gray-700">
                        {current} / {max}
                    </span>
                )}
                {showPercentage && (
                    <span className="text-xs font-medium text-gray-700">
                        {percentage.toFixed(1)}%
                    </span>
                )}
            </div>

            <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
                <div
                    className={`${colorClass} ${sizeClasses[size]} rounded-full transition-all duration-300 ease-in-out`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>

            {percentage > 100 && (
                <div className="mt-1 text-xs text-red-600 font-medium">
                    Overallocated by {(percentage - 100).toFixed(1)}%
                </div>
            )}
        </div>
    );
};

export default CapacityBar; 