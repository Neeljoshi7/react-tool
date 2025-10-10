
import TodoList from "../components/Tools/TodoList"
import { useState } from "react"
import ExpenceTracker from "../components/Tools/ExpenceTracker"
function Tools () {
    const [tab, setTab] = useState("todo-list")
    return (
        <>
            <div className="flex">
                <div className="flex bg-gray-200 w-max p-4">
                    <ul className="flex flex-col gap-5">
                        <li onClick={() => setTab("todo-list")} className={"hover:bg-gray-400 hover:text-white cursor-pointer" + (tab === "todo-list" ? " !bg-gray-400 !text-white" : " ")}>
                            <button className="p-2 rounded">Todo List</button>
                        </li>
                        <li onClick={() => setTab("expence-tracker")} className={"hover:bg-gray-400 hover:text-white cursor-pointer" + (tab === "expence-tracker" ? " !bg-gray-400 !text-white" : " ")}>
                            <button className="p-2 rounded">Expence Tracker</button>
                        </li>
                    </ul>
                </div>
                <div className="flex-1 p-4">
                    {tab === "expence-tracker" ? <ExpenceTracker /> : <TodoList />}
                </div>
            </div>
        </>
    )
}

export default Tools
