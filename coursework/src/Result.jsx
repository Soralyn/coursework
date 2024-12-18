import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";

const Result = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [results, setResults] = useState([]);
    const [average, setAverage] = useState(null);
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");

    useEffect(() => {
        fetch("http://127.0.0.1:5000/students")
            .then((response) => response.json())
            .then((data) => setStudents(data));

        fetch("http://127.0.0.1:5000/subjects")
            .then((response) => response.json())
            .then((data) => setSubjects(data));
    }, []);

    const calculateResult = () => {
        fetch("http://127.0.0.1:5000/grades/period", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                start_date: startDate,
                end_date: endDate,
                student_id: selectedStudent || null,
                subject_id: selectedSubject || null,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setResults(data);
                const totalGrades = data.reduce((sum, item) => sum + item.grade, 0);
                const averageGrade = data.length > 0 ? (totalGrades / data.length).toFixed(2) : null;
                setAverage(averageGrade);
            })
            .catch((error) => console.error("Ошибка при расчете:", error));
    };

    return (
        <div className="mx-20">
            <h1 className="font-bold text-3xl">Результат</h1>
            <div className="mb-5">
                <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Начальная дата"
                />
                <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="Конечная дата"
                />
                <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                >
                    <option value="">Все студенты</option>
                    {students.map((student) => (
                        <option key={student.id} value={student.id}>
                            {student.name}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                >
                    <option value="">Все предметы</option>
                    {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name}
                        </option>
                    ))}
                </select>
                <Button onClick={calculateResult} className="my-1 mx-2">
                    Рассчитать
                </Button>
            </div>

            {average !== null && (
                <div className="mb-5">
                    <h2 className="text-2xl font-bold">Среднее значение оценки: {average}</h2>
                </div>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Студент</TableHead>
                        <TableHead>Предмет</TableHead>
                        <TableHead>Оценка</TableHead>
                        <TableHead>Дата</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {results.map((result, index) => (
                        <TableRow key={index}>
                            <TableCell>{result.student_name}</TableCell>
                            <TableCell>{result.subject_name}</TableCell>
                            <TableCell>{result.grade}</TableCell>
                            <TableCell>{result.date}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default Result;
