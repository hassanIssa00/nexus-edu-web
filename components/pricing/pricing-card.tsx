'use client'

import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PricingFeature {
    text: string
    included: boolean
}

interface PricingPlan {
    id: string
    name: string
    description: string
    price: string
    period: string
    features: PricingFeature[]
    popular?: boolean
    buttonText: string
    onSelect: (planId: string) => void
}

interface PricingCardProps {
    plan: PricingPlan
}

export function PricingCard({ plan }: PricingCardProps) {
    return (
        <Card className={cn(
            "relative flex flex-col transition-all duration-200 hover:shadow-xl",
            plan.popular ? "border-primary-500 shadow-lg scale-105 z-10" : "border-gray-200 dark:border-gray-800"
        )}>
            {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-1">
                        الأكثر شيوعاً
                    </Badge>
                </div>
            )}

            <CardHeader>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                    {plan.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
                <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 dark:text-gray-400 mr-2">{plan.period}</span>
                </div>

                <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3 text-sm">
                            <div className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                                feature.included ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                            )}>
                                <Check className="w-3 h-3" />
                            </div>
                            <span className={cn(!feature.included && "text-gray-400 line-through")}>
                                {feature.text}
                            </span>
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter>
                <Button
                    className={cn("w-full", plan.popular ? "bg-primary-500 hover:bg-primary-600" : "")}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => plan.onSelect(plan.id)}
                >
                    {plan.buttonText}
                </Button>
            </CardFooter>
        </Card>
    )
}
