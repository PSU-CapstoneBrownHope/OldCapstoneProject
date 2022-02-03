import {ApplyForAidServicesForm} from "./ApplyForAidServicesForm";
import { Navbar } from "../Index";

export const ApplyForAidServices = (): JSX.Element => {
    return (
      <div className="ApplyForAidServices">
          <Navbar name = "Apply for Services"></Navbar>
          <ApplyForAidServicesForm></ApplyForAidServicesForm>
      </div>
    );
  };