import { Fragment, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { Trash2 } from 'lucide-react';

type FormValues = {
  stations: { name: string }[];
};

export default function SearchForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { control, register, handleSubmit } = useForm<FormValues>({
    defaultValues: { stations: [{ name: "" }, { name: "" }] },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "stations",
  });

  const onSubmit = (data: FormValues) => {
    console.log("入力された駅:", data.stations);
    setIsLoading(true)
  };

  return (
    <div className="w-full max-w-lg my-4">
      <div className="w-full">
        <form className="space-y-2 w-full" onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <Fragment key={field.id}>
              <div className="flex items-end w-space-x-2 w-full">
                <div className="flex flex-col w-1/2">
                  <p className="text-xs
mb-1">出発駅{index + 1}</p>
                  <Input
                    {...register(`stations.${index}.name`, { required: true })}
                    placeholder={`駅 ${index + 1}`}
                    className=" rounded"
                    size="sm"
                  />
                </div>

                {fields.length > 2 && (
                  <Button
                    size="sm"
                    className="bg-white hover:bg-gray-200 py-2"
                    onPress={() => remove(index)}
                  >
                    <Trash2
                      className="back hover:text-red-500"
                      color="red"
                    />
                  </Button>
                )}
              </div>
            </Fragment>
          ))}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Button color="default"
              variant="bordered"
              onPress={() => { append({ name: "" }) }}
            >
              出発駅を追加
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={isLoading}
              className=" text-white">
              検索
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
