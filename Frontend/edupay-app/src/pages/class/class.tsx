import { useSearchParams } from "react-router-dom";
import ClassListView from "./classListView";
import CreateClassView from "./createClassView";
import ImportClassView from "./importClassView";

export default function ClassPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const view = searchParams.get("view") || "list";

  return (
    <>
      {view === "list" && (
        <ClassListView
          onCreate={() => setSearchParams({ view: "create" })}
          onImport={() => setSearchParams({ view: "import" })}
        />
      )}

      {view === "create" && (
        <CreateClassView
          onBack={() => setSearchParams({})}
        />
      )}

      {view === "import" && (
        <ImportClassView onBack={() => setSearchParams({})} />
      )}
    </>
  );
}