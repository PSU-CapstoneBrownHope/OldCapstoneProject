import {ApplyForAidGoodsForm} from "./ApplyForAidGoodsForm";
import { Navbar } from "../Index";

export const ApplyForAidGoods = (): JSX.Element => {
    return (
      <div className="ApplyForAidGoods">
          <Navbar name="Apply for Goods"></Navbar>
          <ApplyForAidGoodsForm></ApplyForAidGoodsForm>
      </div>
    );
  };