"use client";

import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Routes } from "@/constants/routes";
import { AnimatedLogoIcon } from "./animated-logo-icon";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface AnimatedLogoProps {
    className?: string;
    iconSize?: number;
    duration?: number;
    delay?: number;
    loop?: boolean;
    showText?: boolean;
    href?: string;
}

export function AnimatedLogo({
    className,
    iconSize = 24,
    duration = 2,
    delay = 0,
    loop = false,
    showText = true,
    href = Routes.home,
}: AnimatedLogoProps) {
    const content = (
        <>
            <AnimatedLogoIcon
                size={iconSize}
                duration={duration}
                delay={delay}
                loop={loop}
                className="shrink-0"
            />
            {showText && <span className="text-2xl">Flexify</span>}
        </>
    );

    if (href) {
        return (
            <Link
                className={cn(
                    "flex items-center justify-center gap-2 font-bold",
                    poppins.className,
                    className
                )}
                href={href}
            >
                {content}
            </Link>
        );
    }

    return (
        <div
            className={cn(
                "flex items-center justify-center gap-2 font-bold",
                poppins.className,
                className
            )}
        >
            {content}
        </div>
    );
}
