"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface AnimatedLogoIconProps {
    size?: number;
    strokeColor?: string;
    fillColor?: string;
    duration?: number;
    delay?: number;
    loop?: boolean;
    showFill?: boolean;
    className?: string;
}

export function AnimatedLogoIcon({
    size = 24,
    strokeColor = "currentColor",
    fillColor = "currentColor",
    duration = 2,
    delay = 0,
    loop = false,
    showFill = false,
    className,
}: AnimatedLogoIconProps) {
    const pathVariants = {
        hidden: {
            pathLength: 0,
            opacity: 0,
        },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: {
                    duration,
                    ease: [0.42, 0, 0.58, 1] as const,
                    delay,
                    repeat: loop ? Infinity : 0,
                    repeatType: loop ? ("loop" as const) : undefined,
                    repeatDelay: loop ? 1 : 0,
                },
                opacity: {
                    duration: 0.3,
                    delay,
                    repeat: loop ? Infinity : 0,
                    repeatType: loop ? ("loop" as const) : undefined,
                    repeatDelay: loop ? 1 : 0,
                },
            },
        },
    };

    const fillVariants = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                delay: delay + duration,
                repeat: loop ? Infinity : 0,
                repeatType: loop ? ("loop" as const) : undefined,
                repeatDelay: loop ? 1 : 0,
            },
        },
    };

    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("inline-block", className)}
            initial="hidden"
            animate="visible"
        >
            {/* Background fill (appears after stroke animation) */}
            {showFill && (
                <motion.path
                    d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
                    fill={fillColor}
                    variants={fillVariants}
                />
            )}

            {/* Animated stroke */}
            <motion.path
                d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
                stroke={strokeColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                variants={pathVariants}
            />
        </motion.svg>
    );
}
