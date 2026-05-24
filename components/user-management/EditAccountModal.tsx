import { UserData, UserRole } from "@/types/user";
import { createPortal } from "react-dom";
import { CloseIcon } from "../icons/CloseIcon";
import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { ConfirmModal } from "../general/ConfirmModal";

type EditAccountModalProps = {
    account: UserData;
    onClose: () => void;
    editAccount: (updated: UserData) => Promise<void>;
};

function formatTimestamp(ts: Timestamp) {
    return ts.toDate().toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit", hour12: true,
    });
}

export function EditAccountModal({
    account,
    onClose,
    editAccount,
}: EditAccountModalProps) {
    const { state } = useAuth();
    const isSelf = state.currentUser?.uid === account.uid;

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [role, setRole] = useState<UserRole>("Volunteer");
    const [disabled, setDisabled] = useState<boolean>(false);
    const [showDisableConfirm, setShowDisableConfirm] = useState(false);

    useEffect(() => {
        setFirstName(account.firstName);
        setLastName(account.lastName);
        setRole(account.role);
        setDisabled(account.disabled);
    }, [account]);

    return createPortal(
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center font-family-roboto">
                <div className="bg-white w-full h-full flex relative justify-center items-center">
                    <div className="absolute top-8 right-8 text-4xl">
                        <button onClick={onClose}>
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="max-w-[30em] w-full">
                        <h1 className="font-family-roboto text-2xl font-bold mb-2">
                            Edit Account
                        </h1>
                        <p className="font-family-roboto text-sm mb-1">
                            {account.email}
                        </p>
                        <p className="text-xs text-gray-400 mb-8">
                            Created {formatTimestamp(account.createdTime)}
                        </p>

                        <div className="flex w-full gap-2 mb-8">
                            <div className="w-full">
                                <p className="text-sm mb-2">First Name</p>
                                <input
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="rounded-xs h-8 text-sm px-3 border border-light-border outline-0 w-full"
                                />
                            </div>
                            <div className="w-full">
                                <p className="text-sm pb-2">Last Name</p>
                                <input
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="rounded-xs h-8 text-sm px-3 border border-light-border outline-0 w-full"
                                />
                            </div>
                        </div>

                        <p className="text-sm mb-2">Role</p>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as UserRole)}
                            disabled={isSelf}
                            className="rounded-xs h-8 text-sm border border-light-border outline-0 w-full px-3 mb-8 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Case Manager">Case Manager</option>
                            <option value="Volunteer">Volunteer</option>
                        </select>

                        {role === "Volunteer" && (
                            <div className="mb-8">
                                <p className={`text-sm ${account.signedWaiver ? "" : "text-red-400"}`}>
                                    {account.signedWaiver ? `Waiver Signed ${formatTimestamp(account.signedWaiver)}` : "Waiver Not Signed"}
                                </p>
                            </div>
                        )}

                        <div className="w-full flex items-center justify-between">
                            {!isSelf ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-700">Disabled</span>
                                    <Switch
                                        checked={disabled}
                                        onCheckedChange={setDisabled}
                                        className="data-[state=unchecked]:bg-[#BFBFBF]"
                                    />
                                </div>
                            ) : <div />}
                            <div className="flex gap-2">
                                <button
                                    className="rounded-xs h-8 border border-light-border w-24"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="rounded-xs h-8 bg-primary text-white w-24 flex items-center justify-center"
                                    onClick={() => {
                                        if (disabled !== account.disabled) {
                                            setShowDisableConfirm(true);
                                        } else {
                                            editAccount({ ...account, firstName, lastName, role, disabled }).then(onClose);
                                        }
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showDisableConfirm && (
                <ConfirmModal
                    title={disabled ? "Disable User" : "Enable User"}
                    message={
                        disabled
                            ? "Are you sure you want to disable this user? They will no longer be able to log into the platform."
                            : "Are you sure you want to enable this user? They will be able to log into the platform again."
                    }
                    onConfirm={() => editAccount({ ...account, firstName, lastName, role, disabled }).then(onClose)}
                    onCancel={() => { setShowDisableConfirm(false); setDisabled(account.disabled); }}
                />
            )}
        </>,
        document.body,
    );
}
