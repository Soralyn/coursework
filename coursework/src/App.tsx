import React, { useState } from "react";
import Students from "./Students";
import Subjects from "./Subjects";
import Groups from "./Groups"
import Grades from "./Grades";
import Result from "./Result";
import { Button } from "@/components/ui/button"

function App() {
    const [activeTab, setActiveTab] = useState("students");

    const renderTab = () => {
        switch (activeTab) {
            case "students":
                return <Students />;
            case "subjects":
                return <Subjects />;
            case "groups":
                return <Groups />;
            case "grades":
                return <Grades />;
            case "result":
                return <Result />;
            default:
                return <Students />;
        }
    };

    return (
        <div>
            <nav>
                <Button onClick={() => setActiveTab("students")} className='my-0.5 mx-2.5'>Студенты</Button>
                <Button onClick={() => setActiveTab("groups")} className='my-0.5 mx-2.5'>Группы</Button>
                <Button onClick={() => setActiveTab("subjects")}className='my-0.5 mx-2.5'>Предметы</Button>
                <Button onClick={() => setActiveTab("grades")}className='my-0.5 mx-2.5'>Оценки</Button>
                <Button onClick={() => setActiveTab("result")} className='my-0.5 mx-2.5'>Результат</Button>
            </nav>
            <div>{renderTab()}</div>
        </div>
    );
}

export default App;
