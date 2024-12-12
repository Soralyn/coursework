import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

    // Получение списка оценок, учеников и предметов
    useEffect(() => {
        fetch("http://127.0.0.1:5000/grades")
            .then((response) => response.json())
            .then((data) => setGrades(data))
            .catch((error) => console.error("Ошибка при загрузке оценок:", error));

        fetch("http://127.0.0.1:5000/students")
            .then((response) => response.json())
            .then((data) => setStudents(data))
            .catch((error) => console.error("Ошибка при загрузке учеников:", error));

        fetch("http://127.0.0.1:5000/subjects")
            .then((response) => response.json())
            .then((data) => setSubjects(data))
            .catch((error) => console.error("Ошибка при загрузке предметов:", error));
    }, []);

    // Добавление новой оценки
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
                // Обновить список оценок
                fetch("http://127.0.0.1:5000/grades")
                    .then((response) => response.json())
                    .then((data) => setGrades(data));
            })
            .catch((error) => console.error("Ошибка при добавлении оценки:", error));
    };

    // Удаление оценки
    const deleteGrade = (id) => {
        fetch(`http://127.0.0.1:5000/grades/${id}`, {
            method: "DELETE",
        })
            .then(() => {
                setGrades(grades.filter((grade) => grade.id !== id));
            })
            .catch((error) => console.error("Ошибка при удалении оценки:", error));
    };

    // Начать редактирование оценки
    const startEditing = (grade) => {
        setEditGradeId(grade.id);
        setStudentId(grade.student_id);
        setSubjectId(grade.subject_id);
        setGrade(grade.grade);
        setDate(grade.date);
    };

    // Сохранить изменения оценки
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
                setEditGradeId(null);
                setStudentId("");
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
        <div>
            <h1>Оценки</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Ученик</TableHead>
                        <TableHead>Предмет</TableHead>
                        <TableHead>Оценка</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead>Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {grades.map((grade) => (
                        <TableRow key={grade.id}>
                            <TableCell>{grade.student_name}</TableCell>
                            <TableCell>{grade.subject_name}</TableCell>
                            <TableCell>{grade.grade}</TableCell>
                            <TableCell>{grade.date}</TableCell>
                            <TableCell>
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

            <h2>{editGradeId ? "Редактировать оценку" : "Добавить новую оценку"}</h2>
            <div>
                <label>Ученик:</label>
                <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                    <option value="">Выберите ученика</option>
                    {students.map((student) => (
                        <option key={student.id} value={student.id}>
                            {student.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Предмет:</label>
                <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                    <option value="">Выберите предмет</option>
                    {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
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
            <Button onClick={exportGrades} className="my-1 mx-1">
                Экспорт в Excel
            </Button>
        </div>
    );
};

export default Grades;
