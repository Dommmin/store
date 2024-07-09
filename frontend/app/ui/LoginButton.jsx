import Link from 'next/link';
import { LogInIcon } from 'lucide-react';

export default function LoginButton() {
    return (
        <button
            className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
            <Link
                href={'/login'}
                className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
            >
                <LogInIcon className="h-5 w-5" />
            </Link>
        </button>
    );
}
