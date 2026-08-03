"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

interface GradeEntryFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    studentName: string;
    assignmentTitle: string;
    maxPoints: number;
    onSubmit: (grade: number, feedback: string) => void;
}

export function GradeEntryForm({
    open,
    onOpenChange,
    studentName,
    assignmentTitle,
    maxPoints,
    onSubmit
}: GradeEntryFormProps) {
    const [grade, setGrade] = useState<number>(0);
    const [feedback, setFeedback] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(grade, feedback);
        setGrade(0);
        setFeedback("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>تقييم الواجب</DialogTitle>
                    <DialogDescription>
                        {studentName} - {assignmentTitle}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">الدرجة (من {maxPoints})</label>
                        <Input
                            type="number"
                            required
                            min="0"
                            max={maxPoints}
                            value={grade}
                            onChange={(e) => setGrade(parseInt(e.target.value) || 0)}
                            placeholder={`0 - ${maxPoints}`}
                        />
                        <div className="text-xs text-muted-foreground">
                            النسبة المئوية: {maxPoints > 0 ? ((grade / maxPoints) * 100).toFixed(1) : 0}%
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">ملاحظات (اختياري)</label>
                        <Input
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="ملاحظات للطالب..."
                        />
                    </div>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            إلغاء
                        </Button>
                        <Button type="submit">حفظ الدرجة</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
