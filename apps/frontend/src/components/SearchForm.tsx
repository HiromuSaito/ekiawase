import { Fragment, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@heroui/button";
import { Trash2 } from "lucide-react";
import { Combobox } from "./Combobox";

type FormValues = {
  stations: { name: string }[];
};
type Props = {
  search: () => void;
};
export default function SearchForm({ search }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { stations: [{ name: "" }, { name: "" }] },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "stations",
  });

  const onSubmit = (_data: FormValues) => {
    setIsLoading(true);
    setTimeout(() => {
      search();
    }, 1000);
  };

  return (
    <div className="w-full max-w-lg my-4">
      <div className="w-full">
        <form className="space-y-2 w-full" onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <Fragment key={field.id}>
              <div className="flex items-end w-space-x-2 w-full">
                <div className="flex flex-col w-full">
                  <p className="text-xs mb-1">
                    出発駅{index + 1}
                  </p>
                  {/* <Input
                    {...register(`stations.${index}.name`, { required: true })}
                    className=" rounded"
                    placeholder={`駅 ${index + 1}`}
                    size="sm"
                  /> */}
                  <Combobox />
                </div>

                {fields.length > 2 && (
                  <Button
                    className="bg-white hover:bg-gray-200 py-2"
                    size="sm"
                    onPress={() => remove(index)}
                  >
                    <Trash2 className="back hover:text-red-500" color="red" />
                  </Button>
                )}
              </div>
            </Fragment>
          ))}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Button
              color="default"
              size="sm"
              variant="bordered"
              onPress={() => {
                append({ name: "" });
              }}
            >
              出発駅を追加
            </Button>
            <Button
              className="text-white"
              color="primary"
              isLoading={isLoading}
              size="sm"
              type="submit"
            >
              {isLoading ? "検索中..." : "検索"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
