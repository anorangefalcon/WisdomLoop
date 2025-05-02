export interface KnowledgeEntry {
  _id: string;
  question: string;
  answer: string;
  tags: string[];
  status: "answered" | "unanswered";
  createdAt: string;
  updatedAt: string;
}
