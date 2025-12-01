import { UserData, UserRole } from "@/types/user";
import { createPortal } from "react-dom";
import { CloseIcon } from "../icons/CloseIcon";
import { useEffect, useState } from "react";
import InputBox from "../auth/InputBox";
import { Spinner } from "../ui/spinner";

type EditAccountModalProps = {
    account: UserData;
    onClose: () => void;
    editAccount: (updated: UserData) => void;
};

export function EditAccountModal({
    account,
    onClose,
    editAccount,
}: EditAccountModalProps) {

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [role, setRole] = useState<UserRole>("Volunteer");

    useEffect(() => {
        setFirstName(account.firstName);
        setLastName(account.lastName);
        setRole(account.role);
    }, [account])

    return createPortal(
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center font-family-roboto">
                <div className="bg-white w-full h-full flex relative justify-center items-center">
                    <div className="absolute top-8 right-8 text-4xl">
                        <button onClick={onClose}><CloseIcon/></button>
                    </div>
                    <div className="max-w-[30em] w-full">
                        <h1 className="font-family-roboto text-2xl font-bold mb-4">Edit Account</h1>
                        <p className="font-family-roboto text-sm mb-8">{account.email}</p>

                        <div className="flex w-full gap-2 mb-8">
                            <div className="w-full">
                                <p className="text-sm mb-2">First Name</p>
                                <input 
                                    value={firstName} 
                                    onChange={e => setFirstName(e.target.value)}
                                    className="rounded-xs h-8 text-sm px-3 border border-light-border outline-0 w-full"
                                />
                            </div>
                            <div className="w-full">
                                <p className="text-sm pb-2">Last Name</p>
                                <input 
                                    value={lastName} 
                                    onChange={e => setLastName(e.target.value)}
                                    className="rounded-xs h-8 text-sm px-3 border border-light-border outline-0 w-full"
                                />
                            </div>
                        </div>
                        
                        <p className="text-sm mb-2">Role</p>
                        <select
                            value={role}
                            onChange={e => setRole(e.target.value as UserRole)}
                            className="rounded-xs h-8 text-sm border border-light-border outline-0 w-full px-3 mb-24"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Case Manager">Case Manager</option>
                            <option value="Volunteer">Volunteer</option>
                        </select>
                        <div className="w-full flex gap-2">
                            <button 
                                className="rounded-xs h-8 border border-light-border w-full"
                                onClick={onClose}
                            >Cancel</button>
                            <button 
                                className="rounded-xs h-8 bg-primary text-white w-full flex items-center justify-center"
                                onClick={() => editAccount({
                                    ...account,
                                    firstName, lastName, role
                                })}
                            >Save</button>
                        </div>
                    </div>
                    
                    
                </div>
            </div>
        </>,
        document.body
    );
}
