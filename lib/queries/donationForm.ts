import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDonationForm, uploadDonationForm, removeDonationForm, saveDonationFormContent } from "../services/donationForm";
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

    const removeMutation = useMutation({
        mutationFn: removeDonationForm,
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

    const deleteBanner = async () => {
        const promise = removeMutation.mutateAsync();
        toast.promise(promise, {
            loading: "Removing banner...",
            success: "Banner removed.",
            error: "Failed to remove banner.",
        });
        await promise;
    };

    return {
        formData: query.data ?? null,
        uploadBanner,
        deleteBanner,
        saveContent,
        isMutating: uploadMutation.isPending || removeMutation.isPending || contentMutation.isPending,
    };
}
