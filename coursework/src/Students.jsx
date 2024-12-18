import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const Students = () => {
    const [students, setStudents] = useState([]);
    const [name, setName] = useState("");
    const [classId, setClassId] = useState("");
    const [phone, setPhone] = useState("");
    const [editStudentId, setEditStudentId] = useState(null);

    // Получение списка студентов
    useEffect(() => {
        fetch("http://127.0.0.1:5000/students")
            .then((response) => response.json())
            .then((data) => setStudents(data))
            .catch((error) => console.error("Ошибка при загрузке студентов:", error));
    }, []);

    // Добавление нового студента
    const addStudent = () => {
        fetch("http://127.0.0.1:5000/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                class_id: classId,
                phone,
            }),
        })
            .then((response) => response.json())
            .then(() => {
                setName("");
                setClassId("");
                setPhone("");
                fetch("http://127.0.0.1:5000/students")
                    .then((response) => response.json())
                    .then((data) => setStudents(data));
            })
            .catch((error) => console.error("Ошибка при добавлении студента:", error));
    };

    // Удаление студента
    const deleteStudent = (id) => {
        fetch(`http://127.0.0.1:5000/students/${id}`, {
            method: "DELETE",
        })
            .then(() => {
                setStudents(students.filter((student) => student.id !== id));
            })
            .catch((error) => console.error("Ошибка при удалении студента:", error));
    };

    // Начать редактирование студента
    const startEditing = (student) => {
        setEditStudentId(student.id);
        setName(student.name);
        setClassId(student.class_id);
        setPhone(student.phone);
    };

    // Сохранить изменения
    const saveChanges = () => {
        fetch(`http://127.0.0.1:5000/students/${editStudentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                class_id: classId,
                phone,
            }),
        })
            .then(() => {
                setEditStudentId(null);
                setName("");
                setClassId("");
                setPhone("");
                fetch("http://127.0.0.1:5000/students")
                    .then((response) => response.json())
                    .then((data) => setStudents(data));
            })
            .catch((error) => console.error("Ошибка при сохранении изменений:", error));
    };

    function onSubmit(e, submitType) {
        e.preventDefault()

        if (submitType === 'save') {
            return saveChanges()
        }

        return addStudent()
    }

    return (
        <div
            className='mx-20'
        >
            <h2 className='my-4 text-3xl'>
                <b>
                    Студенты
                </b>
            </h2>
            <Table className='mb-4'>
                <TableHeader>
                    <TableRow>
                        <TableHead>Имя</TableHead>
                        <TableHead></TableHead>
                        <TableHead></TableHead>
                        <TableHead>Группа</TableHead>
                        <TableHead>Телефон</TableHead>
                        <TableHead>Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.map((student) => (
                        <TableRow key={student.id} className='border'>
                            <TableCell className='border-r' colSpan={3}>{student.name}</TableCell>
                            <TableCell className='border-r'>{student.class_id}</TableCell>
                            <TableCell className='border-r'>{student.phone}</TableCell>
                            <TableCell className='border-r'>
                                <Button onClick={() => startEditing(student)} className="my-1 mx-1">
                                    Изменить
                                </Button>
                                <Button onClick={() => deleteStudent(student.id)} className="my-1 mx-1" variant="destructive" >
                                    Удалить
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div>
                <h2 className='text-2xl'>
                    <b>
                        {editStudentId ? "Редактировать студента" : "Добавить студента"}
                    </b>
                </h2>

                <form
                    className='my-5'
                    onSubmit={(e) => onSubmit(e, editStudentId ? 'save' : 'add')}
                >
                    <Input
                        type="text"
                        placeholder="Имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="my-1 mx-1"
                        required
                    />
                    <Input
                        type="text"
                        placeholder="Группа"
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                        className="my-1 mx-1"
                        required
                    />
                    <Input
                        type="text"
                        placeholder="Телефон"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="my-1 mx-1"
                        required
                    />

                    <div
                        className='mt-4'
                    >
                        {editStudentId ? (
                            <Button type='submit'>Сохранить изменения</Button>
                        ) : (
                            <Button type='submit'>Добавить</Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Students;
