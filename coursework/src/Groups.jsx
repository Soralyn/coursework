import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        // получение список групп
        fetch("http://127.0.0.1:5000/groups")
            .then((response) => response.json())
            .then((data) => setGroups(data))
            .catch((error) => console.error("Ошибка при загрузке групп:", error));
    }, []);

const loadStudents = (groupId) => {
    if (!groupId) {
        console.error("Group ID is undefined");
        return;
    }
    fetch(`http://127.0.0.1:5000/groups/${groupId}/students`)
        .then((response) => response.json())
        .then((data) => {
            setSelectedGroup(groupId);
            setStudents(data);
        })
        .catch((error) => console.error("Ошибка при загрузке студентов:", error));
};


    return (
        <div className="mx-20">
            <h1 className="font-bold text-3xl">Группы</h1>
            <div className="my-5">
                <h2 className="text-xl font-bold">Выберите группу:</h2>
                {groups.map((group) => (
                    <Button
                        key={group.id} // Здесь id группы
                        onClick={() => loadStudents(group.id)} // Передаём id группы
                        className={`mx-2 my-1 ${selectedGroup === group.id ? "bg-blue-500" : ""}`}
                    >
                        {group.name}
                    </Button>
                ))}
            </div>
            <h2 className="text-2xl font-bold mt-5">Студенты группы:</h2>
            {students.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Имя</TableHead>
                            <TableHead>Телефон</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.phone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-lg">Выберите группу, чтобы увидеть список студентов.</p>
            )}
        </div>
    );
};

export default Groups;
