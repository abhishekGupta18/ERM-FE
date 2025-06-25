import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { CapacityUtilization, Assignment, Project } from '../types';

export const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateTime = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd, yyyy HH:mm');
};

export const formatDateRange = (startDate: string | Date, endDate: string | Date): string => {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    return `${format(start, 'MMM dd')} - ${format(end, 'MMM dd, yyyy')}`;
};

export const calculateCapacityUtilization = (assignments: Assignment[]): CapacityUtilization[] => {
    const engineerMap = new Map<string, CapacityUtilization>();

    assignments.forEach((assignment) => {
        const engineerId = assignment.engineerId._id;
        const engineerName = assignment.engineerId.name;
        const maxCapacity = assignment.engineerId.maxCapacity || 100;

        if (!engineerMap.has(engineerId)) {
            engineerMap.set(engineerId, {
                engineerId,
                engineerName,
                currentAllocation: 0,
                maxCapacity,
                utilizationPercentage: 0,
                assignments: [],
            });
        }

        const engineer = engineerMap.get(engineerId)!;
        engineer.currentAllocation += assignment.allocationPercentage;
        engineer.assignments.push(assignment);
    });

    // Calculate utilization percentage
    engineerMap.forEach((engineer) => {
        engineer.utilizationPercentage = (engineer.currentAllocation / engineer.maxCapacity) * 100;
    });

    return Array.from(engineerMap.values());
};

export const getCapacityColor = (utilizationPercentage: number): string => {
    if (utilizationPercentage > 100) return 'bg-red-500';
    if (utilizationPercentage >= 80) return 'bg-orange-500';
    if (utilizationPercentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
};

export const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
        case 'planning':
            return 'bg-blue-100 text-blue-800';
        case 'active':
            return 'bg-green-100 text-green-800';
        case 'completed':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export const getSeniorityColor = (seniority: string): string => {
    switch (seniority.toLowerCase()) {
        case 'senior':
            return 'bg-purple-100 text-purple-800';
        case 'mid':
            return 'bg-blue-100 text-blue-800';
        case 'junior':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export const calculateProjectProgress = (project: Project, assignments: Assignment[]): number => {
    const projectAssignments = assignments.filter(
        (assignment) => assignment.projectId._id === project._id
    );

    if (project.teamSize === 0) return 0;

    const assignedCount = projectAssignments.length;
    return Math.min((assignedCount / project.teamSize) * 100, 100);
};

export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
    return isWithinInterval(date, { start: startOfDay(startDate), end: endOfDay(endDate) });
};

export const getOverlappingAssignments = (assignments: Assignment[]): Assignment[][] => {
    const overlaps: Assignment[][] = [];

    for (let i = 0; i < assignments.length; i++) {
        for (let j = i + 1; j < assignments.length; j++) {
            const assignment1 = assignments[i];
            const assignment2 = assignments[j];

            if (assignment1.engineerId._id === assignment2.engineerId._id) {
                const start1 = parseISO(assignment1.startDate);
                const end1 = parseISO(assignment1.endDate);
                const start2 = parseISO(assignment2.startDate);
                const end2 = parseISO(assignment2.endDate);

                if (isDateInRange(start1, start2, end2) || isDateInRange(start2, start1, end1)) {
                    overlaps.push([assignment1, assignment2]);
                }
            }
        }
    }

    return overlaps;
};

export const validateCapacity = (engineerId: string, allocationPercentage: number, assignments: Assignment[], excludeAssignmentId?: string): boolean => {
    const currentAssignments = assignments.filter(
        (assignment) =>
            assignment.engineerId._id === engineerId &&
            assignment._id !== excludeAssignmentId
    );

    const currentAllocation = currentAssignments.reduce(
        (sum, assignment) => sum + assignment.allocationPercentage,
        0
    );

    return currentAllocation + allocationPercentage <= 100;
};

export const generateTimelineEvents = (assignments: Assignment[]): any[] => {
    return assignments.map((assignment) => ({
        id: assignment._id,
        title: `${assignment.engineerId.name} - ${assignment.projectId.name}`,
        start: parseISO(assignment.startDate),
        end: parseISO(assignment.endDate),
        engineerName: assignment.engineerId.name,
        projectName: assignment.projectId.name,
        allocationPercentage: assignment.allocationPercentage,
        color: getCapacityColor(assignment.allocationPercentage),
    }));
};

export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}; 