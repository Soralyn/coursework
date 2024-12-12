import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [name, setName] = useState("");
    const [editSubjectId, setEditSubjectId] = useState(null);

    // Получение списка предметов
    useEffect(() => {
        fetch("http://127.0.0.1:5000/subjects")
            .then((response) => response.json())
            .then((data) => setSubjects(data))
            .catch((error) => console.error("Ошибка при загрузке предметов:", error));
    }, []);

    // Добавление нового предмета
    const addSubject = () => {
        fetch("http://127.0.0.1:5000/subjects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
        })
            .then((response) => response.json())
            .then(() => {
                setName("");
                // Обновить список предметов
                fetch("http://127.0.0.1:5000/subjects")
                    .then((response) => response.json())
                    .then((data) => setSubjects(data));
            })
            .catch((error) => console.error("Ошибка при добавлении предмета:", error));
    };

    // Удаление предмета
    const deleteSubject = (id) => {
        fetch(`http://127.0.0.1:5000/subjects/${id}`, {
            method: "DELETE",
        })
            .then(() => {
                setSubjects(subjects.filter((subject) => subject.id !== id));
            })
            .catch((error) => console.error("Ошибка при удалении предмета:", error));
    };

    // Начать редактирование предмета
    const startEditing = (subject) => {
        setEditSubjectId(subject.id);
        setName(subject.name);
    };

    // Сохранить изменения
    const saveChanges = () => {
        fetch(`http://127.0.0.1:5000/subjects/${editSubjectId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
        })
            .then(() => {
                setEditSubjectId(null);
                setName("");
                // Обновить список предметов
                fetch("http://127.0.0.1:5000/subjects")
                    .then((response) => response.json())
                    .then((data) => setSubjects(data));
            })
            .catch((error) => console.error("Ошибка при сохранении изменений:", error));
    };

    function onSubmit(e, submitType) {
        e.preventDefault()

        if (submitType === 'save') {
            return saveChanges()
        }

        return addSubject()
    }


    return (
        <div className="mx-10">
            <h1 className="font-bold text-3xl">Предметы</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Название</TableHead>
                        <TableHead>Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subjects.map((subject) => (
                        <TableRow key={subject.id} className='border'>
                            <TableCell className='border-r'>{subject.name}</TableCell>
                            <TableCell className='border-r'>
                                <Button
                                    onClick={() => startEditing(subject)}
                                    className="mr-2"
                                >
                                    Изменить
                                </Button>
                                <Button
                                    onClick={() => deleteSubject(subject.id)}
                                    variant="destructive"
                                >
                                    Удалить
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <h2 className="font-bold text-3xl mt-10">{editSubjectId ? "Редактировать предмет" : "Добавить новый предмет"}</h2>
            <form onSubmit={e => onSubmit(e, editSubjectId ? 'save' : 'add')}className="mt-5">
                <Input
                    type="text"
                    placeholder="Название предмета"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="my-0.5 mx-1"
                    required
                />
                {editSubjectId ? (
                    <Button type='submit' className="my-3 mx-2.5">
                        Сохранить изменения
                    </Button>
                ) : (
                    <Button type='submit' className="my-3 mx-2.5">
                        Добавить
                    </Button>
                )}
            </form>
        </div>
    );
};

export default Subjects;
