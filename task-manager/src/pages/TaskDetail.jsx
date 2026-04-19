import { useParams } from "react-router-dom";

export default function TaskDetail() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Task Detail - {id}</h1>
    </div>
  );
}