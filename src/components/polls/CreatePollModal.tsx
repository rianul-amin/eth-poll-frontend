import { useWallet } from "@/contexts/WalletContext";
import { PollsServiceInstance } from "@/resources/polls/service/PollsService";
import CloseIcon from "@/svg/CloseIcon";
import { PollInputs } from "@/types/PollInputs";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export default function CreatePollModal({
  setShow,
}: {
  setShow: (state: boolean) => void;
}) {
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { walletAddress } = useWallet();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PollInputs>({
    defaultValues: {
      options: ["", ""],
    },
  });

  const addOption = () => {
    setOptions([...options, ""]);
    setValue("options", [...options, ""]);
  };

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
    setValue("options", updatedOptions);
  };

  const removeOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    setValue("options", updatedOptions);
  };

  const handleFormSubmit: SubmitHandler<PollInputs> = (data) => {
    const endTimeInSeconds = Math.floor(
      new Date(data.endTime).getTime() / 1000,
    );

    const pollData = { ...data, endTime: endTimeInSeconds };

    createPollMutation.mutate(pollData);
  };

  const createPollMutation = useMutation({
    mutationFn: async (data: PollInputs) => {
      if (!walletAddress) {
        throw new Error("Wallet address is required.");
      }
      return await PollsServiceInstance.createPoll(data, walletAddress);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onError: (error: unknown) => {
      setIsLoading(false);
      console.error("Error creating poll:", error);
    },
    onSuccess: () => {
      setIsLoading(false);
      setIsSuccess(true);
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        onClick={() => setShow(false)}
      />
      <div className="relative w-[500px] h-auto p-[4px] bg-gradient-to-b from-blue-500 via-green-500 to-purple-500 bg-[length:200%_200%] animate-verticalGradientShift rounded-[20px] shadow-lg">
        <form onSubmit={handleSubmit(handleFormSubmit)} method="POST">
          <div className="bg-white rounded-[18px] p-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Create Poll
              </h2>
              <div onClick={() => setShow(false)}>
                <CloseIcon />
              </div>
            </div>

            <div>
              <div className="mt-4">
                <label
                  htmlFor="pollTitle"
                  className="block text-medium font-medium text-gray-600"
                >
                  Poll Title
                </label>
                <input
                  {...register("title", { required: "Poll title is required" })}
                  id="pollTitle"
                  type="text"
                  className="w-full mt-2 mb-2 p-2 border rounded-lg text-sm"
                  placeholder="Enter poll title"
                />
                {errors.title && (
                  <span className="block mt-1 text-red-400 text-sm font-medium">
                    {errors.title.message}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <label
                  htmlFor="pollDescription"
                  className="block text-medium font-medium text-gray-600"
                >
                  Description
                </label>
                <textarea
                  {...register("description", {
                    required: "Poll description is required",
                  })}
                  id="pollDescription"
                  className="w-full mt-2 p-2 border rounded-lg text-sm"
                  placeholder="Add a description"
                  rows={6}
                />
                {errors.description && (
                  <span className="block mt-1 text-red-400 text-sm font-medium">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <label
                  htmlFor="pollOptions"
                  className="block text-medium font-medium text-gray-600"
                >
                  Options
                </label>
                <div className="space-y-4 mt-2 max-h-40 overflow-y-auto pr-2 scrollbar-width-none">
                  {options.map((option, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center">
                        <input
                          {...register(`options.${index}`, {
                            required: `Option ${index + 1} is required`,
                          })}
                          className="w-full p-2 border rounded-lg text-sm pr-10"
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          disabled={options.length <= 2}
                          className={`absolute right-4 text-sm font-semibold ${
                            options.length <= 2
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-500 cursor-pointer"
                          }`}
                        >
                          Close
                        </button>
                      </div>
                      {errors.options?.[index] && (
                        <span className="block mt-2 text-red-400 text-sm font-medium">
                          {errors.options[index]?.message}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addOption}
                  className="mt-4 text-blue-800 text-sm font-semibold"
                >
                  Add Option
                </button>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="pollEndTime"
                  className="block text-medium font-medium text-gray-600"
                >
                  End Time
                </label>
                <input
                  {...register("endTime", {
                    required: "End time is required",
                    validate: (value) => {
                      const selectedTime = new Date(value).getTime();
                      const currentTime = new Date().getTime();
                      return (
                        selectedTime > currentTime ||
                        "End time must be in the future"
                      );
                    },
                  })}
                  id="pollEndTime"
                  type="datetime-local"
                  className="w-full mt-2 p-2 border rounded-lg text-sm"
                  placeholder="Select end time"
                />
                {errors.endTime && (
                  <span className="block mt-1 text-red-400 text-sm font-medium">
                    {errors.endTime.message}
                  </span>
                )}
              </div>

              <div className="w-full h-[60px] rounded-[8px] mt-16 p-[2px] bg-gradient-to-r from-[#2377FC] to-[#6962FE]">
                <button
                  type="submit"
                  className="w-full h-full rounded-[6px] flex items-center justify-center gap-[10px] px-[12px] bg-white"
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2377FC] to-[#6962FE] text-lg font-semibold">
                    {isLoading ? "Creating Poll" : "Create Poll"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
