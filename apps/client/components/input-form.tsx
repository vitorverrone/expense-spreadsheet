import classnames from 'classnames';
import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => {
    const classes = classnames(
        'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
        className
    );

    return (
        <input ref={ref} className={classes} {...props} />
    );
});

Input.displayName = 'Input';

export default Input;