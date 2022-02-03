import { UpdatePasswordForm } from "./UpdatePasswordForm";
import { Navbar } from "../Index";



export const UpdatePassword = (): JSX.Element => {
  return (
    <div>
      <Navbar name="Update Password"></Navbar>
      <UpdatePasswordForm></UpdatePasswordForm>
    </div>
  );
};
