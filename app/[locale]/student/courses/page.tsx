'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Video, Calendar, Clock, MapPin, Users } from 'lucide-react'
import { apiClient } from '@/lib/api/client'
import { Link } from '@/i18n/routing'

interface ClassSession {
    id: string
    name: string
    teacher: string
    schedule: string
    room: string
    nextClass: string
    isLive: boolean
    joinLink: string
}

export default function ClassesPage() {
    const [classes, setClasses] = useState<ClassSession[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchClasses()
    }, [])

    const fetchClasses = async () => {
        try {
            const response = await apiClient.get('/classes/student/list')
            setClasses(response.data)
        } catch (error) {
            console.error('Failed to fetch classes:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="p-8 text-center">Loading classes...</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Classes</h1>
                <p className="text-gray-600 dark:text-gray-400">Upcoming sessions and live classrooms</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                    <Card key={cls.id} className="overflow-hidden hover:shadow-lg transition-all">
                        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative p-6">
                            <div className="absolute top-4 right-4">
                                {cls.isLive ? (
                                    <Badge className="bg-red-500 hover:bg-red-600 animate-pulse">
                                        LIVE NOW
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-none">
                                        Upcoming
                                    </Badge>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{cls.name}</h3>
                            <p className="text-blue-100 text-sm flex items-center">
                                <Users className="w-3 h-3 mr-1" /> {cls.teacher}
                            </p>
                        </div>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                                    {cls.schedule}
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                                    {cls.room}
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <Clock className="w-4 h-4 mr-3 text-gray-400" />
                                    Next: {new Date(cls.nextClass).toLocaleString()}
                                </div>
                            </div>

                            <div className="pt-2">
                                {cls.isLive ? (
                                    <Link href={cls.joinLink}>
                                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                                            <Video className="w-4 h-4 mr-2" />
                                            Join Live Class
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button variant="outline" className="w-full" disabled>
                                        Not Started Yet
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
