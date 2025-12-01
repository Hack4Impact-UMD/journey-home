import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";

type ProtectedRouteProps = {
    children: React.ReactNode;
    allow: UserRole[];
}

export function ProtectedRoute({children, allow}: ProtectedRouteProps) {

    const auth = useAuth();
    const router = useRouter();

    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        console.log(auth)
        if (auth.state.loading) {
            setShow(false);
            return;
        }
        if (!auth.state.currentUser) {
            setShow(false);
            router.push("/login");
            return;
        }

        if (!auth.state.userData) {
            setShow(false);
            router.push("/status/missing-user-data");
            return
        }

        if (!allow.includes(auth.state.userData.role)) {
            setShow(false);
            router.push("/status/invalid-perms");
            return
        }

        setShow(true);

    }, [auth.state, allow])

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