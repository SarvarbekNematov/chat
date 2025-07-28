import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/api";

export const useMessageMutation = () => {
  const queryClient = useQueryClient();

  const sendMutation = useMutation({
    mutationFn: (newItem: any) =>
      request.post(`send-message`, newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const editMutation = useMutation({
    mutationFn: (newItem: any) =>
      request.post(`edit-message`, newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editMessage"] });
    },
  });

  return { sendMutation, editMutation };
};
