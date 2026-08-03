'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { enrollmentService, Enrollment } from '@/lib/services/enrollment.service';
import { classService, ClassEntity } from '@/lib/services/class.service';
import { userService, User } from '@/lib/services/user.service';

export default function EnrollmentsPage() {
    const t = useTranslations('admin');
    const [classes, setClasses] = useState<ClassEntity[]>([]);
    const [students, setStudents] = useState<User[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

    useEffect(() => {
        fetchClasses();
        fetchStudents();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchEnrollments();
        }
    }, [selectedClass]);

    const fetchClasses = async () => {
        try {
            const data = await classService.getAll();
            setClasses(data);
        } catch (error) {
            console.error('Failed to fetch classes', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await userService.getAll({ role: 'STUDENT' });
            setStudents(response.data || response);
        } catch (error) {
            console.error('Failed to fetch students', error);
        }
    };

    const fetchEnrollments = async () => {
        if (!selectedClass) return;
        setLoading(true);
        try {
            const data = await enrollmentService.getByClass(selectedClass);
            setEnrollments(data);
        } catch (error) {
            console.error('Failed to fetch enrollments', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBulkEnroll = async () => {
        if (selectedStudents.length === 0 || !selectedClass) return;

        try {
            await enrollmentService.bulkEnroll(selectedStudents, selectedClass);
            setIsModalOpen(false);
            setSelectedStudents([]);
            fetchEnrollments();
        } catch (error: any) {
            alert(error.message || 'Failed to enroll students');
        }
    };

    const handleUnenroll = async (id: string) => {
        if (confirm(t('confirmDelete'))) {
            try {
                await enrollmentService.delete(id);
                fetchEnrollments();
            } catch (error) {
                console.error('Failed to unenroll', error);
            }
        }
    };

    const enrolledStudentIds = new Set(enrollments.map(e => e.studentId));
    const availableStudents = students.filter(s => !enrolledStudentIds.has(s.id));

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('enrollments')}</h1>
            </div>

            {/* Class Selector */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('selectClass')}
                </label>
                <select
                    className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                >
                    <option value="">{t('selectClass')}</option>
                    {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                            {cls.name} {cls.academicYear && `(${cls.academicYear})`}
                        </option>
                    ))}
                </select>
            </div>

            {selectedClass && (
                <>
                    <div className="mb-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            disabled={availableStudents.length === 0}
                        >
                            {t('enrollStudents')}
                        </button>
                    </div>

                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('studentName')}
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('email')}
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('enrolledAt')}
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {enrollments.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                {t('noEnrollments')}
                                            </td>
                                        </tr>
                                    ) : (
                                        enrollments.map((enrollment) => (
                                            <tr key={enrollment.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {enrollment.student
                                                        ? `${enrollment.student.firstName || ''} ${enrollment.student.lastName || ''}`.trim() || enrollment.student.name || enrollment.student.email
                                                        : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {enrollment.student?.email || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleUnenroll(enrollment.id)}
                                                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                                    >
                                                        {t('unenroll')}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* Enroll Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t('enrollStudents')}
                        </h2>
                        <div className="space-y-2 mb-4">
                            {availableStudents.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400">{t('allStudentsEnrolled')}</p>
                            ) : (
                                availableStudents.map((student) => (
                                    <label
                                        key={student.id}
                                        className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            className="mr-3"
                                            checked={selectedStudents.includes(student.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedStudents([...selectedStudents, student.id]);
                                                } else {
                                                    setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                                                }
                                            }}
                                        />
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {student.firstName && student.lastName
                                                    ? `${student.firstName} ${student.lastName}`
                                                    : student.name || student.email}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {student.email}
                                            </div>
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedStudents([]);
                                }}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleBulkEnroll}
                                disabled={selectedStudents.length === 0}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t('enroll')} ({selectedStudents.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
