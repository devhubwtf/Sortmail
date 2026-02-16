import React from "react";
import type { Priority } from "@/types/dashboard";

const PRIORITY_CLASSES: Record<Priority, string> = {
    urgent: "priority-urgent",
    high: "priority-high",
    medium: "priority-medium",
    low: "priority-low",
};

const PRIORITY_LABELS: Record<Priority, string> = {
    urgent: "Urgent",
    high: "High",
    medium: "Medium",
    low: "Low",
};

interface PriorityBadgeProps {
    priority: Priority;
    className?: string;
}

export default function PriorityBadge({ priority, className = "" }: PriorityBadgeProps) {
    return (
        <span className={`priority-badge ${PRIORITY_CLASSES[priority]} ${className}`}>
            {PRIORITY_LABELS[priority]}
        </span>
    );
}
