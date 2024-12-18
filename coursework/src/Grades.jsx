import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Grades = () => {
    const [grades, setGrades] = useState([]);
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [studentId, setStudentId] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [grade, setGrade] = useState("");
    const [date, setDate] = useState("");
    const [editGradeId, setEditGradeId] = useState(null);

    // получение списка оценок, студентов и предметов
    useEffect(() => {
        fetch("http://127.0.0.1:5000/grades")
            .then((response) => response.json())
            .then((data) => setGrades(data))
            .catch((error) => console.error("Ошибка при загрузке оценок:", error));

        fetch("http://127.0.0.1:5000/students")
            .then((response) => response.json())
            .then((data) => setStudents(data))
            .catch((error) => console.error("Ошибка при загрузке студентов:", error));

        fetch("http://127.0.0.1:5000/subjects")
            .then((response) => response.json())
            .then((data) => setSubjects(data))
            .catch((error) => console.error("Ошибка при загрузке предметов:", error));
    }, []);

    // добавление оценки
    const addGrade = () => {
        fetch("http://127.0.0.1:5000/grades", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                student_id: studentId,
                subject_id: subjectId,
                grade,
                date,
            }),
        })
            .then((response) => response.json())
            .then(() => {
                setStudentId("");
                setSubjectId("");
                setGrade("");
                setDate("");
                // обновить оценоки
                fetch("http://127.0.0.1:5000/grades")
                    .then((response) => response.json())
                    .then((data) => setGrades(data));
            })
            .catch((error) => console.error("Ошибка при добавлении оценки:", error));
    };

    // удаление оценки
    const deleteGrade = (id) => {
        fetch(`http://127.0.0.1:5000/grades/${id}`, {
            method: "DELETE",
        })
            .then(() => {
                setGrades(grades.filter((grade) => grade.id !== id));
            })
            .catch((error) => console.error("Ошибка при удалении оценки:", error));
    };

    // редактирование оценки
    const startEditing = (grade) => {
        setEditGradeId(grade.id);
        setStudentId(grade.student_id);
        setSubjectId(grade.subject_id);
        setGrade(grade.grade);
        setDate(grade.date);
    };

    // сохранить изменения оценки
    const saveChanges = () => {
        fetch(`http://127.0.0.1:5000/grades/${editGradeId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                student_id: studentId,
                subject_id: subjectId,
                grade,
                date,
            }),
        })
            .then(() => {
                setEditGradeId(null)    ;
                // setStudentId("");
                setSubjectId("");
                setGrade("");
                setDate("");
                fetch("http://127.0.0.1:5000/grades")
                    .then((response) => response.json())
                    .then((data) => setGrades(data));
            })
            .catch((error) => console.error("Ошибка при сохранении изменений:", error));
    };

    // Функция для экспорта данных в Excel
    const exportGrades = () => {
        window.location.href = "http://127.0.0.1:5000/export/grades";
    };

    return (
        <div className="mx-20">
            <h1 className='font-bold text-3xl'>Оценки</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Студент</TableHead>
                        <TableHead>Предмет</TableHead>
                        <TableHead>Оценка</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead>Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {grades.map((grade) => (
                        <TableRow key={grade.id} className='border'>
                            <TableCell className='border-r'>{grade.student_name}</TableCell>
                            <TableCell className='border-r'>{grade.subject_name}</TableCell>
                            <TableCell className='border-r'>{grade.grade}</TableCell>
                            <TableCell className='border-r'>{grade.date}</TableCell>
                            <TableCell className='border-r'>
                                <Button onClick={() => startEditing(grade)} className="mr-2">
                                    Изменить
                                </Button>
                                <Button onClick={() => deleteGrade(grade.id)} variant="destructive">
                                    Удалить
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <h2 className='font-bold text-3xl mt-10 my-5'>{editGradeId ? "Редактировать оценку" : "Добавить новую оценку"}</h2>
            <div className='mb-5'>
                <label>Студент:</label>
                <Select value={studentId} onValueChange={setStudentId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите студента"/>
                    </SelectTrigger>

                    <SelectContent>
                        {
                            students.map((student) => (
                                <SelectItem key={student.id} value={student.id}>
                                    {student.name}
                                </SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
            </div>

            <div className='mb-5'>
                <label>Предмет:</label>

                <Select value={subjectId} onValueChange={setSubjectId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите предмет"/>
                    </SelectTrigger>

                    <SelectContent>
                        {
                            subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id}>
                                    {subject.name}
                                </SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
            </div>

            <div className='mb-5'>
                <label>Оценка:</label>
                <Input
                    type="number"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    min="1"
                    max="5"
                    placeholder="Введите оценку"
                />
            </div>

            <div>
                <label>Дата:</label>
                <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            {editGradeId ? (
                <Button onClick={saveChanges} className="my-1 mx-3">
                    Сохранить изменения
                </Button>
            ) : (
                <Button onClick={addGrade} className="my-1 mx-3">
                    Добавить
                </Button>
            )}
            <Button onClick={exportGrades} variant='positive' className="my-1 mx-1">
                Экспорт в Excel
            </Button>
        </div>
    );
};

export default Grades;
