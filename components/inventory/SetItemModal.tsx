import { InventoryPhoto, InventoryRecord, ItemSize } from "@/types/inventory";
import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "../icons/CloseIcon";
import { createPortal } from "react-dom";
import { uploadImage, useCategories } from "@/lib/services/inventory";
import { InboxIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

type SetItemModalProps = {
    item: InventoryRecord;
    isCreate: boolean;
    onClose: () => void;
    editItem: (updated: InventoryRecord) => void;
};

type EditImageInput = InventoryPhoto | File;

export function SetItemModal(props: SetItemModalProps) {
    const [name, setName] = useState<string>("");
    const [photos, setPhotos] = useState<EditImageInput[]>([]);
    const [category, setCategory] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("1");
    const [size, setSize] = useState<ItemSize>("Small");

    const allCategories = useCategories();

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setName(props.item.name);
        setPhotos(props.item.photos);
        setCategory(props.item.category);
        setNotes(props.item.notes);
        setQuantity(props.item.quantity.toString());
        setSize(props.item.size);
    }, [props.item]);

    return createPortal(
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center font-family-roboto">
                <div className="bg-white w-full h-full flex relative justify-center items-center">
                    <div className="absolute top-8 right-8 text-4xl">
                        <button onClick={props.onClose}>
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="max-w-[40em] w-full">
                        <h1 className="font-family-roboto text-2xl font-bold mb-4">
                            {props.isCreate ? "Create" : "Edit"} Item
                        </h1>

                        <p className="text-sm mb-2">
                            <span className="text-red-400">*</span>{" "}
                            {"Item Name (Short description 1-3 words)"}
                        </p>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="rounded-xs h-8 text-sm px-3 border border-light-border outline-0 w-full mb-4"
                        />

                        <div className="mb-4 flex w-full gap-2">
                            <div className="w-full">
                                <p className="text-sm mb-2">
                                    <span className="text-red-400">*</span>{" "}
                                    Category
                                </p>
                                <select
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                    className="rounded-xs h-8 text-sm border border-light-border outline-0 w-full px-3"
                                >
                                    {allCategories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full">
                                <p className="text-sm mb-2">
                                    <span className="text-red-400">*</span> Size
                                </p>
                                <select
                                    value={size}
                                    onChange={(e) =>
                                        setSize(e.target.value as ItemSize)
                                    }
                                    className="rounded-xs h-8 text-sm border border-light-border outline-0 w-full px-3"
                                >
                                    {["Small", "Medium", "Large"].map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full">
                                <p className="text-sm mb-2">
                                    <span className="text-red-400">*</span>{" "}
                                    Quantity
                                </p>
                                <input
                                    type="number"
                                    className="rounded-xs h-8 text-sm px-3 border border-light-border outline-0 w-full"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(e.target.value)
                                    }
                                    onBlur={(e) => {
                                        const num = parseInt(e.target.value);
                                        if (!isNaN(num) && num >= 1) {
                                            setQuantity(num.toString());
                                        } else {
                                            setQuantity("1");
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <p className="text-sm mb-2">Notes</p>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="rounded-xs h-16 text-sm px-3 py-3 border border-light-border outline-0 w-full mb-4 resize-none"
                        />

                        <p className="text-sm mb-4">Photos {"(4 max)"}</p>
                        <div className="w-full flex items-center justify-center mb-10 gap-6">
                            {photos.map((photo, index) => (
                                <div
                                    className="relative"
                                    key={
                                        photo instanceof File
                                            ? index + " " + photo.name
                                            : index + " " + photo.url
                                    }
                                >
                                    <img
                                        src={
                                            photo instanceof File
                                                ? URL.createObjectURL(photo)
                                                : photo.url
                                        }
                                        className="max-h-32 max-w-32 rounded-sm"
                                    />
                                    <button
                                        onClick={() => {
                                            setPhotos((old) =>
                                                old.filter(
                                                    (old) => old !== photo
                                                )
                                            );
                                        }}
                                        className="absolute top-[-.5em] right-[-.5em] bg-white rounded-full text-white text-lg"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>
                            ))}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) =>
                                    setPhotos((old) => {
                                        const newPhotos = [
                                            ...old,
                                            ...Array.from(e.target.files || []),
                                        ];

                                        if (newPhotos.length > 4) {
                                            toast.error(
                                                "You can only upload up to 4 photos."
                                            );
                                        }

                                        return newPhotos.slice(0, 4);
                                    })
                                }
                                className="hidden"
                            />
                            <div onClick={() => fileInputRef.current?.click()}>
                                {photos.length > 0 && photos.length < 4 && (
                                    <div className="bg-[#E7E7E7] rounded-sm h-32 w-32 flex flex-col items-center justify-center cursor-pointer">
                                        <span className="text-sm">
                                            Add Photo
                                        </span>
                                        <PlusIcon className="h-8" />
                                    </div>
                                )}
                                {photos.length == 0 && (
                                    <div className="w-[25em] h-[9em] flex flex-col items-center justify-center border border-light-border bg-[#FAFAFA] rounded-sm cursor-pointer">
                                        <InboxIcon className="h-10 w-10 text-primary mb-4" />
                                        <p className="mb-1">
                                            Click here to upload photos
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Support for single or bulk upload.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full flex gap-2">
                            <button
                                className="rounded-xs h-8 border border-light-border w-full"
                                onClick={props.onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="rounded-xs h-8 bg-primary text-white w-full flex items-center justify-center"
                                onClick={async () => {
                                    const uploadedPhotos = await toast
                                        .promise(
                                            Promise.all(
                                                photos.map(async (photo) =>
                                                    photo instanceof File
                                                        ? ({
                                                              url: await uploadImage(
                                                                  photo
                                                              ),
                                                              altText:
                                                                  photo.name,
                                                          } as InventoryPhoto)
                                                        : photo
                                                )
                                            ),
                                            {
                                                loading: "Uploading photos...",
                                                success:
                                                    "Photos uploaded successfully!",
                                                error: "Failed to upload photos.",
                                            }
                                        )
                                        .unwrap();

                                    props.editItem({
                                        id: props.item.id,
                                        name,
                                        photos: uploadedPhotos,
                                        category,
                                        notes,
                                        quantity: parseInt(quantity),
                                        size,
                                        dateAdded: props.item.dateAdded,
                                        donorEmail: props.item.donorEmail,
                                    } as InventoryRecord);
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}
