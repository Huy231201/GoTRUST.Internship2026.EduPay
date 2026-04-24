import { useSearchParams } from "react-router-dom";
import StudentListView from "@/pages/student/studentListView";
import ImportStudentView from "@/pages/student/importStudentView";


export default function StudentPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const view = searchParams.get("view") || "list";


    return (
        <>
            {view === "list" && (
                <StudentListView
                    onImport={() => setSearchParams({ view: "import" })}
                />
            )}

            {view === "import" && (
                <ImportStudentView onBack={() => setSearchParams({})} />
            )}
        </>
    );
}