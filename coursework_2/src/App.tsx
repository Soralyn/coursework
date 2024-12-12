import React, { useState } from "react";
import Students from "./Students";
import Subjects from "./Subjects";
import Grades from "./Grades";
import { Button } from "@/components/ui/button"

function App() {
    const [activeTab, setActiveTab] = useState("students");

    const renderTab = () => {
        switch (activeTab) {
            case "students":
                return <Students />;
            case "subjects":
                return <Subjects />;
            case "grades":
                return <Grades />;
            default:
                return <Students />;
        }
    };

    return (
        <div>
            <nav>
                <Button onClick={() => setActiveTab("students")} className='my-0.5 mx-2.5'>Учащиеся</Button>
                <Button onClick={() => setActiveTab("subjects")}className='my-0.5 mx-2.5'>Предметы</Button>
                <Button onClick={() => setActiveTab("grades")}className='my-0.5 mx-2.5'>Оценки</Button>
            </nav>
            <div>{renderTab()}</div>
        </div>
    );
}

export default App;
