import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";

type ProtectedRouteProps = {
    children: React.ReactNode;
    allow: UserRole[];
}

export function ProtectedRoute({children, allow}: ProtectedRouteProps) {

    const { state: authState } = useAuth();
    const router = useRouter();

    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        if (authState.loading) {
            setShow(false);
            return;
        }
        if (!authState.currentUser) {
            setShow(false);
            router.push("/login");
            return;
        }

        if (!authState.userData) {
            setShow(false);
            router.push("/status/missing-user-data");
            return
        }

        if (authState.userData.pending) {
            setShow(false);
            router.push("/status/account-pending");
            return;
        }

        if (!allow.includes(authState.userData.role)) {
            setShow(false);
            router.push("/status/invalid-perms");
            return
        }

        setShow(true);

    }, [authState, allow, router])

    if(!show) {
        return <>
            <div className="w-full h-full flex justify-center items-center pb-24">
                <Spinner className="size-12 text-primary"/>
            </div>
        </>
    }

    return <>
        {children}
    </>

}