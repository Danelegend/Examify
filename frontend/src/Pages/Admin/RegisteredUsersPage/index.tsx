import { useQuery } from "@tanstack/react-query";
import { AdminFetchRegisteredUsers } from "../../../api/api";
import { readAccessToken } from "../../../util/utility";

const RegisteredUsersPage = () => {
    const { data, isPending } = useQuery({
        queryKey: ["Users"],
        queryFn: () => AdminFetchRegisteredUsers({ token: readAccessToken()! }),
    })

    return (
        <div>
            <div className="flex justify-center">
                <h1>Registered Users</h1>
            </div>
            <div className="flex justify-center mt-8">
            {
                isPending ? <p>Loading...</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>School</th>
                                <th>School Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data!.users.map((user: any) => (
                                <tr key={user.email}>
                                    <td>{user.first_name + " " + user.last_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.school}</td>
                                    <td>{user.school_year}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            }
            </div>
        </div>
    );
}

export default RegisteredUsersPage;