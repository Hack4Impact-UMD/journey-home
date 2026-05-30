import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDonationForm, uploadDonationForm, saveDonationFormContent } from "../services/donationForm";
import { toast } from "sonner";

export function useDonationForm() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["donationForm"],
        queryFn: fetchDonationForm,
    });

    const uploadMutation = useMutation({
        mutationFn: uploadDonationForm,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["donationForm"] });
        },
    });

    const uploadBanner = async (file: File) => {
        const promise = uploadMutation.mutateAsync(file);
        toast.promise(promise, {
            loading: "Updating banner...",
            success: "Banner updated successfully.",
            error: "Failed to update banner.",
        });
        await promise;
    };

    const contentMutation = useMutation({
        mutationFn: saveDonationFormContent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["donationForm"] });
        },
    });

    const saveContent = async (content: string) => {
        const promise = contentMutation.mutateAsync(content);
        toast.promise(promise, {
            loading: "Saving...",
            success: "Saved.",
            error: "Failed to save.",
        });
        await promise;
    };

    const saveContentSilent = (content: string) => contentMutation.mutateAsync(content);

    return {
        formData: query.data ?? null,
        uploadBanner,
        saveContent,
        saveContentSilent,
        isMutating: uploadMutation.isPending || contentMutation.isPending,
    };
}
