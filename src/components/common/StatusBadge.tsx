import React from 'react';
import { getStatusColor, getSeniorityColor } from '../../utils/helpers';

interface StatusBadgeProps {
    status: string;
    type?: 'status' | 'seniority';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    type = 'status',
    size = 'md',
    className = '',
}) => {
    const getColorClass = () => {
        if (type === 'seniority') {
            return getSeniorityColor(status);
        }
        return getStatusColor(status);
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    };

    return (
        <span
            className={`inline-flex items-center font-medium rounded-full ${getColorClass()} ${sizeClasses[size]} ${className}`}
        >
            {status}
        </span>
    );
};

export default StatusBadge; 