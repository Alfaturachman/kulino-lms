'use client';

import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, type, icon, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPasswordType = type === 'password';
        const resolvedType = isPasswordType
            ? showPassword
                ? 'text'
                : 'password'
            : type;

        return (
            <div className="flex flex-col gap-1">
                <div className="relative w-full flex items-center">
                    {icon && (
                        <div className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center">
                            {icon}
                        </div>
                    )}
                    <input
                        type={resolvedType}
                        className={cn(
                            'h-10 w-full rounded-sm border text-[13px] text-ink placeholder:text-hint transition-colors',
                            icon ? 'pl-10' : 'px-3.5',
                            isPasswordType ? 'pr-10' : 'pr-3.5',
                            'focus:border-iris-500 focus:ring-3 focus:ring-[rgba(26,86,219,0.1)] focus:outline-none',
                            error
                                ? 'border-danger focus:border-danger focus:ring-[rgba(220,38,38,0.1)]'
                                : 'border-border',
                            className,
                        )}
                        ref={ref}
                        {...props}
                    />
                    {isPasswordType && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors cursor-pointer select-none focus:outline-none"
                        >
                            {showPassword ? (
                                <EyeOff size={16} />
                            ) : (
                                <Eye size={16} />
                            )}
                        </button>
                    )}
                </div>
                {error && (
                    <span className="text-[11px] font-medium text-danger">
                        {error}
                    </span>
                )}
            </div>
        );
    },
);
Input.displayName = 'Input';

export { Input };
