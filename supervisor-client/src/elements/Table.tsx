import { KnowledgeEntry } from "@/interfaces/knowledge";

type EditableConfig = {
  [key in keyof KnowledgeEntry]?: {
    label: string;
    onClick: (entry: KnowledgeEntry) => void;
  };
};

export function Table({
  data,
  editable,
}: {
  data: KnowledgeEntry[];
  editable?: EditableConfig | null;
}) {
  return (
    <div className="overflow-hidden">
      <table className="w-full">
        <thead>
          <tr>
            <th>Question</th>
            <th>Answer</th>
            <th>Tags</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry._id}>
              <td>
                {entry.question}
                {editable?.question && (
                  <button
                    className="ml-2 text-blue-500 hover:text-blue-700 cursor-pointer"
                    onClick={() => editable.question?.onClick(entry)}
                  >
                    {editable.question.label}
                  </button>
                )}
              </td>
              <td>
                {entry.answer}
                {editable?.answer && (
                  <button
                    className="ml-2 text-blue-500 hover:text-blue-700 cursor-pointer"
                    onClick={() => editable.answer?.onClick(entry)}
                  >
                    {editable.answer.label}
                  </button>
                )}
              </td>
              <td>
                {entry.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
                {editable?.tags && (
                  <button
                    className="ml-2 text-blue-500 hover:text-blue-700 cursor-pointer"
                    onClick={() => editable.tags?.onClick(entry)}
                  >
                    {editable.tags.label}
                  </button>
                )}
              </td>
              <td className="text-gray-400 text-sm">
                {new Date(entry.updatedAt).toLocaleString()}
                {editable?.updatedAt && (
                  <button
                    className="ml-2 text-blue-500 hover:text-blue-700 cursor-pointer"
                    onClick={() => editable.updatedAt?.onClick(entry)}
                  >
                    {editable.updatedAt.label}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
