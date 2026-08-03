import LoginCard from '@/components/auth/LoginCard';
import HeroStudent from '@/components/auth/HeroStudent';

export default function TestLoginPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left side - Login Card */}
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900">
                <LoginCard />
            </div>

            {/* Right side - Hero */}
            <HeroStudent />
        </div>
    );
}
