'use client';

import { Sparkles, Trophy, Zap, Users } from 'lucide-react';

export default function HeroStudent() {
    const features = [
        {
            icon: Trophy,
            title: 'برنامج المليون',
            description: 'تنافس مع زملائك واربح جوائز قيمة',
            color: 'from-yellow-400 to-orange-500',
        },
        {
            icon: Zap,
            title: 'تعلم بذكاء',
            description: 'محتوى تفاعلي وتقييمات فورية',
            color: 'from-blue-400 to-cyan-500',
        },
        {
            icon: Users,
            title: 'مجتمع طلابي',
            description: 'تواصل وتعاون مع طلاب من جميع أنحاء المملكة',
            color: 'from-purple-400 to-pink-500',
        },
    ];

    return (
        <div className="hidden lg:flex lg:flex-1 relative overflow-hidden gradient-dark">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-purple-600/20 to-pink-600/20" />

            {/* Floating shapes with CSS animation */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 py-12">
                {/* Logo/Brand */}
                <div className="mb-8 animate-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">منصة الطلاب</span>
                    </div>
                </div>

                {/* Main Headline */}
                <div className="mb-12 animate-slide-up">
                    <h1 className="text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
                        رحلتك التعليمية
                        <br />
                        <span className="bg-gradient-to-r from-primary-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            تبدأ هنا
                        </span>
                    </h1>
                    <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                        انضم إلى أكثر من 10,000 طالب يتعلمون، ينافسون، ويحققون أحلامهم
                    </p>
                </div>

                {/* Features List */}
                <div className="space-y-6 mb-12">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className="flex items-start gap-4 group animate-slide-up"
                            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                        >
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
                    <button className="group relative px-8 py-4 rounded-xl overflow-hidden">
                        {/* Glass effect background */}
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20" />

                        {/* Gradient on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Button content */}
                        <span className="relative z-10 flex items-center gap-2 text-white font-semibold">
                            <Sparkles className="w-5 h-5" />
                            شاهد العرض التوضيحي
                            <span className="transition-transform group-hover:translate-x-[-4px]">←</span>
                        </span>
                    </button>
                </div>

                {/* Stats */}
                <div className="mt-12 grid grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                    {[
                        { value: '10K+', label: 'طالب' },
                        { value: '500+', label: 'مادة' },
                        { value: '98%', label: 'رضا' },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-slate-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Decorative dots pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                }} />
            </div>
        </div>
    );
}
