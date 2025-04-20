import {
  Button,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/react";

type Props = {};
export default function SearchResults({ }: Props) {
  return (
    <div className="w-full max-w-lg my-4">
      <p className="font-bold">検索結果</p>

      <div className="flex  items-center mb-4">
        <p className="text-sm">出発駅：</p>
        <div className="flex items-center">
          {["渋谷", "新宿", "板橋"].map((e) => {
            return (
              <span key={e} className="text-sm text-gray-500">
                {e},
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
        <Button size="sm">入力画面に戻る</Button>
      </div>
    </div>
  );
}
