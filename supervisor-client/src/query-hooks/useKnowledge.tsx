import { KnowledgeEntry } from "@/interfaces/knowledge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const SERVER_URL = import.meta.env.SERVER_URL;
const API_URL = SERVER_URL + "/api/knowledge";

export const useGetAllKnowledge = () => {
  return useQuery<KnowledgeEntry[]>({
    queryKey: ["knowledge"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/get`);
        return response.data.data;
      } catch (error) {
        console.error("Error fetching knowledge:", error);
        throw error;
      }
    },
  });
};

export const useUpdateKnowledge = () => {
  const queryClient = useQueryClient();

  return useMutation<KnowledgeEntry, Error, { id: string; answer: string }>({
    mutationFn: async ({ id, answer }) => {
      try {
        const response = await axios.put(`${API_URL}/${id}/answer`, { answer });
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(`Failed to update knowledge entry: ${error.message}`);
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge"] });
    },
  });
};
