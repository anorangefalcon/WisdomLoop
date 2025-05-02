import { Table } from "@/elements/Table";
import { Popup } from "@/elements/Popup";
import { KnowledgeEntry } from "@/interfaces/knowledge";
import {
  useGetAllKnowledge,
  useUpdateKnowledge,
} from "@/query-hooks/useKnowledge";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const POLL_INTERVAL = 5000;

export function HomeView() {
  const { data, isLoading } = useGetAllKnowledge();
  const { mutateAsync: mutateKnowledge } = useUpdateKnowledge();

  const [tab, setTab] = useState<"unanswered" | "answered">("unanswered");
  const currentData = useMemo(() => {
    if (!data) return { answered: [], unanswered: [] };
    const answeredIndex = data.findIndex(
      (entry) => entry.status === "answered"
    );
    const answered = data.slice(answeredIndex);
    const unanswered = data.slice(0, answeredIndex);
    return { answered, unanswered };
  }, [data]);
  const [popupData, setPopupData] = useState<{
    visible: boolean;
    data: KnowledgeEntry;
  }>({ visible: false, data: {} as KnowledgeEntry });
  const [answerText, setAnswerText] = useState("");
  const [savingAnswer, setSavingAnswer] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const refetchData = () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge"] });
    };
    const interval = setInterval(() => {
      refetchData();
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const handleOnEditAnswer = (entry: KnowledgeEntry) => {
    setAnswerText(entry.answer || "");
    setPopupData({ visible: true, data: entry });
  };

  const handleSaveAnswer = async () => {
    const entryId = popupData.data._id;
    if (!entryId || savingAnswer || answerText.length > 0) return;
    setSavingAnswer(true);
    try {
      await mutateKnowledge({ id: entryId, answer: answerText });
      setPopupData({ visible: false, data: {} as KnowledgeEntry });
    } catch (error) {
      console.error("Error saving answer:", error);
    }
    setSavingAnswer(false);
  };

  if (isLoading || !data)
    return (
      <div className="flex justify-center items-center h-40 text-gray-400">
        Loading...
      </div>
    );

  return (
    <>
      <div className="glass-container">
        <div className="flex justify-center mb-6">
          <div className="tab-switcher">
            <button
              onClick={() => setTab("unanswered")}
              className={`tab-btn ${
                tab === "unanswered" ? "active" : ""
              } cursor-pointer`}
            >
              Unanswered
            </button>
            <button
              onClick={() => setTab("answered")}
              className={`tab-btn ${
                tab === "answered" ? "active" : ""
              } cursor-pointer`}
            >
              Answered
            </button>
          </div>
        </div>
        <Table
          data={currentData[tab]}
          editable={
            tab === "unanswered"
              ? {
                  answer: {
                    label: "Add",
                    onClick: handleOnEditAnswer,
                  },
                }
              : null
          }
        />
      </div>

      {popupData.visible && (
        <Popup
          title="Edit Answer"
          onClose={() =>
            setPopupData({ visible: false, data: {} as KnowledgeEntry })
          }
        >
          <div className="flex flex-col">
            <h4 className="mb-2 text-[var(--text-muted)]">Question:</h4>
            <p className="mb-4">{popupData.data.question}</p>

            <h4 className="mb-2 text-[var(--text-muted)]">Answer:</h4>
            <textarea
              className="w-full p-3 bg-[var(--bg-dark-tertiary)] border border-[var(--border-color-dark)] rounded resize-y min-h-[120px]"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Enter your answer..."
            />

            <div className="flex justify-end mt-5">
              <button
                className="px-4 py-2 bg-[var(--accent-orange)] text-white rounded hover:opacity-90 transition-opacity cursor-pointer"
                onClick={handleSaveAnswer}
              >
                {savingAnswer ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
}
