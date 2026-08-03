"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface Student {
    id: string;
    name: string;
    status?: "present" | "absent" | "late";
}

interface AttendanceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    students: Student[];
    date: string;
    onSubmit: (attendance: Record<string, "present" | "absent" | "late">) => void;
}

export function AttendanceModal({
    open,
    onOpenChange,
    students,
    date,
    onSubmit
}: AttendanceModalProps) {
    const [attendance, setAttendance] = useState<Record<string, "present" | "absent" | "late">>(
        students.reduce((acc, student) => ({ ...acc, [student.id]: student.status || "present" }), {})
    );

    const handleSubmit = () => {
        onSubmit(attendance);
        onOpenChange(false);
    };

    const toggleStatus = (studentId: string) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: prev[studentId] === "present" ? "absent" : prev[studentId] === "absent" ? "late" : "present"
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>تسجيل الحضور - {date}</DialogTitle>
                </DialogHeader>

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {students.map((student) => (
                        <div
                            key={student.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                            <span className="font-medium">{student.name}</span>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={attendance[student.id] === "present" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setAttendance(prev => ({ ...prev, [student.id]: "present" }))}
                                    className="gap-1"
                                >
                                    <Check className="h-3 w-3" />
                                    حاضر
                                </Button>
                                <Button
                                    type="button"
                                    variant={attendance[student.id] === "late" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setAttendance(prev => ({ ...prev, [student.id]: "late" }))}
                                >
                                    متأخر
                                </Button>
                                <Button
                                    type="button"
                                    variant={attendance[student.id] === "absent" ? "destructive" : "outline"}
                                    size="sm"
                                    onClick={() => setAttendance(prev => ({ ...prev, [student.id]: "absent" }))}
                                    className="gap-1"
                                >
                                    <X className="h-3 w-3" />
                                    غائب
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        إلغاء
                    </Button>
                    <Button onClick={handleSubmit}>حفظ الحضور</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
