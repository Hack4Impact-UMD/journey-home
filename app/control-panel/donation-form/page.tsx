"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDonationForm } from "@/lib/queries/donationForm";
import { EditIcon } from "@/components/icons/EditIcon";
import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Undo, Redo, X } from "lucide-react";
import { DonorFormProvider } from "@/app/donate/DonorFormContext";
import Step1PersonalInfo from "@/app/donate/steps/Step1PersonalInfo";

function ToolbarButton({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); onClick(); }}
            className={`p-1.5 rounded hover:bg-gray-100 ${active ? "bg-gray-200 text-primary" : "text-gray-600"}`}
        >
            {children}
        </button>
    );
}

function Toolbar({ editor }: { editor: Editor }) {
    return (
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-light-border bg-[#FAFAFB]">
            <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
                <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
                <Italic className="w-4 h-4" />
            </ToolbarButton>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}>
                <Heading1 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
                <Heading2 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
                <Heading3 className="w-4 h-4" />
            </ToolbarButton>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
                <List className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
                <ListOrdered className="w-4 h-4" />
            </ToolbarButton>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
                <Undo className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
                <Redo className="w-4 h-4" />
            </ToolbarButton>
        </div>
    );
}

export default function DonationFormPage() {
    const { formData, uploadBanner, saveContent, isMutating } = useDonationForm();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const originalContentRef = useRef<string>("");
    const [isEditing, setIsEditing] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
    });

    useEffect(() => {
        if (editor && formData?.content) {
            editor.commands.setContent(formData.content);
        }
    }, [editor, formData?.content]);

    useEffect(() => {
        if (!showPreview) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") setShowPreview(false); };
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener("keydown", handleEscape);
        };
    }, [showPreview]);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        await uploadBanner(file);
        e.target.value = "";
    }

    function handleEdit() {
        originalContentRef.current = editor?.getHTML() ?? "";
        setIsEditing(true);
        setTimeout(() => editor?.commands.focus(), 0);
    }

    function handleSave() {
        saveContent(editor?.getHTML() ?? "");
        setIsEditing(false);
    }

    function handleCancel() {
        editor?.commands.setContent(originalContentRef.current);
        setIsEditing(false);
    }

    return (
        <div className="flex-1 min-h-0 overflow-auto border border-light-border flex flex-col">
            <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp,.avif"
                className="hidden"
                onChange={handleFileChange}
            />
            <div className="h-12 w-full shrink-0 border-b border-light-border bg-[#FAFAFB] flex items-center">
                <div className="w-47.5 h-full border-r border-light-border flex items-center px-4">
                    <span className="text-sm font-bold">Items We Accept Page</span>
                </div>
            </div>
            <div className="flex-1 px-8 pt-8 pb-4.5">
                <p className="text-xl font-medium">Items We Accept</p>
                <div className={`relative mt-4 rounded-sm overflow-hidden bg-gray-200 w-full max-w-2xl mx-auto${formData?.file ? "" : " h-45"}`}>
                    {formData?.file && (
                        <img
                            src={formData.file}
                            alt="Donation form banner"
                            className="w-full"
                        />
                    )}
                    <button
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isMutating}
                    >
                        <EditIcon />
                    </button>
                </div>
                <div className="relative mt-4 border border-light-border rounded-sm">
                    {isEditing && editor && <Toolbar editor={editor} />}
                    <div
                        className={`h-80 overflow-y-auto px-4 pb-2 [&_.ProseMirror]:outline-none${isEditing ? " cursor-text" : ""}`}
                        onClick={() => isEditing && editor?.commands.focus()}
                    >
                        <EditorContent editor={editor} className={isEditing ? "pt-4" : "hidden"} />
                        {!isEditing && (
                            <div
                                className="prose max-w-none pt-4"
                                dangerouslySetInnerHTML={{ __html: formData?.content ?? "" }}
                            />
                        )}
                    </div>
                    {!isEditing && (
                        <button
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center cursor-pointer"
                            onClick={handleEdit}
                        >
                            <EditIcon />
                        </button>
                    )}
                </div>
                {!isEditing && (
                    <div className="mt-8 flex items-center justify-end">
                        <button
                            type="button"
                            onClick={() => setShowPreview(true)}
                            className="text-sm h-8 rounded-xs bg-primary text-white w-35"
                        >
                            Preview Form
                        </button>
                    </div>
                )}
                {isEditing && (
                    <div className="mt-8 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="text-sm h-8 rounded-xs bg-white border border-light-border text-text-1 w-22.5"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowPreview(true)}
                            className="text-sm h-8 rounded-xs bg-white border border-light-border text-text-1 w-35"
                        >
                            Preview Form
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="text-sm px-3 h-8 rounded-xs bg-primary text-white"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            {showPreview && createPortal(
                <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center font-family-roboto">
                    <div className="absolute inset-0" onClick={() => setShowPreview(false)} />
                    <div className="relative bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl">
                        <div className="flex items-center justify-between px-8 py-4 border-b border-light-border shrink-0 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                            <span className="font-semibold text-text-1">Form Preview</span>
                            <button onClick={() => setShowPreview(false)}>
                                <X className="w-5 h-5 text-text-1" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8">
                            <DonorFormProvider>
                                <Step1PersonalInfo />
                            </DonorFormProvider>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
