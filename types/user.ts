
type UserRoles = {
    admin: boolean,
    caseManager: boolean,
    volunteer: boolean,
    donor: boolean
}

type User = {
    firstName: string,
    lastName: string,
    email: string,
    roles: UserRoles,

}