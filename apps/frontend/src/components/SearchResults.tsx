import {
  Button,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/react";
import { useLocation, useNavigate } from "react-router-dom";

import orginalStations from "../constants/stations.json";
import { Station } from "../types";

type Props = {};
export default function SearchResults({}: Props) {
  const navigate = useNavigate();
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const query = useQuery();
  const codes = query.getAll("codes");

  const stations = orginalStations.filter((s) =>
    codes.includes(s.code),
  ) as Station[];

  return (
    <div className="w-full max-w-lg my-4">
      <p className="font-bold">検索結果</p>

      <div className="flex  items-center mb-4">
        <p className="text-sm">出発駅：</p>
        <div className="flex items-center">
          {stations.map((s) => {
            return (
              <span key={s.code} className="text-sm text-gray-500">
                {s.name},
              </span>
            );
          })}
        </div>
      </div>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>駅名</TableColumn>
          <TableColumn>路線名</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell>登戸駅</TableCell>
            <TableCell>小田急線</TableCell>
          </TableRow>
          <TableRow key="2">
            <TableCell>向ケ丘遊園駅</TableCell>
            <TableCell>小田急線</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="mt-4">
        <Button
          color="default"
          size="sm"
          variant="bordered"
          onPress={() => navigate("/")}
        >
          入力画面に戻る
        </Button>
      </div>
    </div>
  );
}
